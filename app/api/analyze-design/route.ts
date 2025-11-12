import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

async function fileToBase64(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return buffer.toString("base64")
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            texts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  isPetName: { type: "boolean" },
                },
              },
            },
            pets: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  description: { type: "string" },
                },
              },
            },
          },
        },
      },
    })

    const imageData = await fileToBase64(imageFile)

    const prompt = `Analyze this design image and extract:
1. All visible text (mark if text appears to be pet names)
2. All pets visible in the image with descriptions

Return the data in the specified JSON format.`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData,
          mimeType: imageFile.type,
        },
      },
    ])

    const response = await result.response
    const text = response.text()
    const analysisResult = JSON.parse(text)

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("[v0] Error analyzing design:", error)
    return NextResponse.json({ error: "Failed to analyze design" }, { status: 500 })
  }
}
