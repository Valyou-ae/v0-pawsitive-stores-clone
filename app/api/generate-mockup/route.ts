import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

async function fileToBase64(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return buffer.toString("base64")
}

function isDarkColor(colorName: string): boolean {
  const darkColors = ["Black", "Navy", "Gray", "Red", "Blue"]
  return darkColors.includes(colorName)
}

function getContrastInstructions(colorName: string): string {
  if (isDarkColor(colorName)) {
    return `
⚠️ CRITICAL VISIBILITY REQUIREMENT ⚠️
The product is ${colorName} (DARK COLOR). You MUST make these changes to ensure perfect visibility:

MANDATORY ADJUSTMENTS:
1. INVERT DARK ELEMENTS: Any black, dark gray, or dark brown elements in the design MUST be converted to white or light colors
2. BRIGHTEN THE DESIGN: The entire design should appear significantly lighter than the original
3. ADD WHITE OUTLINES: Add bright white or light-colored outlines around all design elements, especially text
4. INCREASE CONTRAST: The design must have extreme contrast against the ${colorName} surface
5. USE LIGHT COLORS: Prefer white, cream, light gray, or bright colors for the design on this dark product

RESULT: The design should be instantly readable and eye-catching, appearing to glow or pop off the dark ${colorName} surface. Think "light design on dark background" - maximum contrast is essential.

DO NOT preserve the original dark colors if they would be invisible on this ${colorName} product. Visibility is more important than color accuracy.`
  }

  return `The product is ${colorName}. Maintain the design's original colors with clear visibility on the ${colorName} surface.`
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const designFile = formData.get("design") as File
    const product = formData.get("product") as string
    const style = formData.get("style") as string
    const color = formData.get("color") as string
    const gender = formData.get("gender") as string | null
    const ethnicity = formData.get("ethnicity") as string | null
    const age = formData.get("age") as string | null
    const scene = formData.get("scene") as string | null

    if (!designFile || !product || !style || !color) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (designFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 })
    }

    if (!designFile.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    const sanitizedProduct = product.trim().slice(0, 100)
    const sanitizedStyle = style.trim().slice(0, 100)
    const sanitizedColor = color.trim().slice(0, 50)

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
      systemInstruction: `You are an expert at creating photorealistic product mockups with perfect color contrast and visibility. 

CRITICAL RULES FOR DESIGN VISIBILITY:
- When the product is dark (black, navy, gray, dark red, dark blue), you MUST ensure the design is highly visible
- Automatically adjust design elements to have optimal contrast with the product surface
- Light designs on dark products should remain bright and clear
- Dark designs on dark products must be lightened, outlined, or highlighted for visibility
- Never let a design disappear or become hard to see on the product
- The final mockup should look professional with the design clearly standing out

Generate high-quality, professional mockup photos that seamlessly integrate the provided design onto the specified product in realistic settings. Maintain accurate proportions, lighting, and textures.`,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    })

    let prompt = `Generate a realistic product mockup photo showing this design on a ${sanitizedColor.toLowerCase()} ${sanitizedProduct.toLowerCase()} in a ${sanitizedStyle.toLowerCase()} setting.`

    prompt += `\n\n${getContrastInstructions(sanitizedColor)}`

    if (scene) {
      const sanitizedScene = scene.trim().slice(0, 200)
      prompt += `\n\nScene: ${sanitizedScene}.`
    }

    if (gender && gender !== "Any") {
      prompt += ` Model gender: ${gender}.`
    }

    if (ethnicity && ethnicity !== "Any") {
      prompt += ` Model ethnicity: ${ethnicity}.`
    }

    if (age && age !== "Any") {
      prompt += ` Model age: ${age}.`
    }

    prompt += "\n\nMake it look professional and realistic with perfect visibility of the design."

    console.log("[v0] Mockup generation prompt:", prompt)
    console.log("[v0] Product color:", sanitizedColor, "- Dark color:", isDarkColor(sanitizedColor))

    const imageData = await fileToBase64(designFile)

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData,
          mimeType: designFile.type,
        },
      },
    ])

    const response = await result.response
    const imagePart = response.candidates?.[0]?.content?.parts?.find((part: any) => part.inlineData)

    if (imagePart?.inlineData) {
      const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`
      console.log("[v0] Mockup generated successfully with contrast adjustment")
      return NextResponse.json({ imageUrl })
    }

    throw new Error("No image returned from Gemini")
  } catch (error) {
    console.error("[v0] Error generating mockup:", error)
    return NextResponse.json(
      {
        error: "Failed to generate mockup",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
