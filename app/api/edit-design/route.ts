import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const DESIGN_EDITOR_SYSTEM_PROMPT = `You are a precision image editing tool. Your ONLY job is to make the EXACT requested changes to this image. You are NOT a designer. You are NOT creative. You are a technical editor.

HIGHEST PRIORITY - Identical Framing (ZERO TOLERANCE):
The output image MUST have the exact same dimensions, aspect ratio, and overall composition as the input image. The objects, layout, and framing must be pixel-identical except for the specific element being edited. Resizing or reframing the image is a CRITICAL FAILURE.

Text Accuracy (ZERO TOLERANCE):
When replacing text, you must use EXACTLY the characters specified. Every letter, every space, every punctuation mark must be perfect. Spelling mistakes are COMPLETELY UNACCEPTABLE. 
Example: If asked to change "Django" to "Dgango", you must output "Dgango" exactly, even though it's wrong.

Surgical Precision (ZERO TOLERANCE):
Only the element being edited should change. Everything else - backgrounds, other text, colors, textures, styles, lighting - must remain completely unchanged. Think of yourself as a surgeon making one precise cut, not a painter remaking the scene.

Style Preservation:
When you change an element, it must match the visual style of the original. If the original text is hand-lettered, keep it hand-lettered. If it has a shadow, keep the shadow. Mimic the original's font, texture, lighting, and integration into the scene perfectly.

Reference Image Usage:
If a reference image is provided, use it as a visual guide for WHAT the new element should look like, but you must adapt it to match the STYLE and CONTEXT of the original image.

Your success is measured by how invisible your edit is. An ideal edit looks like the original was always that way.`

async function fileToBase64(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return buffer.toString("base64")
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File
    const editType = formData.get("editType") as string
    const paramsStr = formData.get("params") as string
    const petImage = formData.get("petImage") as File | null

    if (!imageFile || !editType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image file must be under 10MB" }, { status: 400 })
    }

    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    const validEditTypes = ["text", "color", "pet", "custom"]
    if (!validEditTypes.includes(editType)) {
      return NextResponse.json({ error: "Invalid edit type" }, { status: 400 })
    }

    const params = JSON.parse(paramsStr)

    console.log("[v0] Edit design request:", editType, params)

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
    })

    let prompt = ""
    const parts: any[] = []

    const imageData = await fileToBase64(imageFile)
    parts.push({
      inlineData: {
        data: imageData,
        mimeType: imageFile.type,
      },
    })

    switch (editType) {
      case "text":
        const oldText = String(params.oldText || "").slice(0, 500)
        const newText = String(params.newText || "").slice(0, 500)

        prompt = `In this image, locate the text that reads "${oldText}" and change it to read "${newText}".

CRITICAL REQUIREMENTS:
1. Find the EXACT text "${oldText}" in the image
2. Replace it with exactly "${newText}" - character-for-character perfect
3. Keep the SAME font style, size, weight, and spacing as the original
4. Keep the SAME color, effects, shadows, and textures as the original  
5. Keep the SAME position and rotation as the original
6. Do NOT change ANY other text in the image
7. Do NOT change the background, layout, or any other elements
8. The image dimensions and framing must remain IDENTICAL

This is a surgical text replacement: "${oldText}" → "${newText}". Nothing else changes.`
        break
      case "color":
        const targetText = String(params.targetText || "").slice(0, 500)
        const newColor = String(params.newColor || "").slice(0, 50)

        prompt = `Precisely isolate the text "${targetText}" and change its color to be uniformly ${newColor}. Keep everything else identical.`
        break
      case "pet":
        if (petImage) {
          if (petImage.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "Pet image must be under 10MB" }, { status: 400 })
          }

          const petData = await fileToBase64(petImage)
          parts.push({
            inlineData: {
              data: petData,
              mimeType: petImage.type,
            },
          })

          const petDescription = String(params.petDescription || "").slice(0, 500)
          prompt = `Replace the pet described as "${petDescription}" in the first image with the pet from the second reference image. Maintain the exact same composition, style, and framing.`
        }
        break
      case "custom":
        prompt = String(params.customPrompt || "").slice(0, 1000)
        break
    }

    parts.push({ text: prompt })

    console.log("[v0] Sending prompt to Gemini:", prompt)

    const result = await model.generateContent({
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseModalities: ["image"],
      },
      systemInstruction: DESIGN_EDITOR_SYSTEM_PROMPT,
    })

    const response = await result.response

    console.log("[v0] Response received from Gemini")
    console.log("[v0] Response candidates:", response.candidates?.length)
    console.log("[v0] Response parts:", response.candidates?.[0]?.content?.parts?.length)

    // Log what types of parts we got back
    response.candidates?.[0]?.content?.parts?.forEach((part: any, index: number) => {
      if (part.text) {
        console.log(`[v0] Part ${index}: Text -`, part.text.substring(0, 100))
      }
      if (part.inlineData) {
        console.log(
          `[v0] Part ${index}: Image - ${part.inlineData.mimeType}, size: ${part.inlineData.data.length} bytes`,
        )
      }
    })

    const imagePart = response.candidates?.[0]?.content?.parts?.find((part: any) => part.inlineData)
    if (imagePart?.inlineData) {
      const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`
      console.log("[v0] Image edit successful, returning edited image")
      return NextResponse.json({ imageUrl })
    }

    console.log("[v0] ERROR: No image part found in response")
    console.log("[v0] Full response:", JSON.stringify(response, null, 2))
    throw new Error("No image returned from Gemini")
  } catch (error) {
    console.error("[v0] Error editing design:", error)
    return NextResponse.json(
      {
        error: "Failed to edit design",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
