import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: Request) {
  try {
    const { designUrl, platform, systemPrompt } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `${systemPrompt}

Design context: This is a t-shirt design for ${platform}.

Generate a JSON response with:
- title: catchy product title (max 140 chars for Etsy, 200 for others)
- description: compelling product description (500-1000 words)
- tags: array of 13 relevant tags
- suggestedPrice: recommended price in USD

Return ONLY valid JSON, no markdown.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Clean markdown formatting if present
    const cleanText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim()
    const parsed = JSON.parse(cleanText)

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("Listing generation error:", error)
    return NextResponse.json({ error: "Failed to generate listing" }, { status: 500 })
  }
}
