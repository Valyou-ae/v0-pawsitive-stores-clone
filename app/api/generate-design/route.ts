import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { generateDesignSchema } from "@/lib/validation"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const fontInstructions: Record<string, string> = {
  playfair: "Use elegant, high-contrast serif fonts similar to Playfair Display with graceful letterforms",
  bebas: "Use bold, uppercase sans-serif fonts similar to Bebas Neue with strong, condensed characters",
  pacifico: "Use casual, flowing script fonts similar to Pacifico with smooth, brush-like strokes",
  oswald: "Use modern, clean sans-serif fonts similar to Oswald with slightly condensed proportions",
  lobster: "Use retro, bold script fonts similar to Lobster with vintage flair and personality",
  montserrat: "Use clean, geometric sans-serif fonts similar to Montserrat with excellent readability",
  raleway: "Use elegant, thin sans-serif fonts similar to Raleway with refined sophistication",
  righteous: "Use bold, display fonts similar to Righteous with strong presence and impact",
  handwritten: "Use authentic hand-lettered style with organic, personal character and imperfect charm",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = generateDesignSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validation.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
        },
        { status: 400 },
      )
    }

    const { prompt, style, font, variation } = validation.data

    console.log("[v0] Generate design request:", { prompt, style, font, variation })

    const sanitizedPrompt = prompt.trim().replace(/[<>]/g, "")

    if (!sanitizedPrompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
      systemInstruction: `You are a master graphic designer creating stunning, professional designs for print-on-demand products (t-shirts, mugs, posters, etc.).

CRITICAL TYPOGRAPHY RULES - Apply to ALL styles:
- Hand-lettered, artistic text with personality and flow
- Use varying text sizes for visual hierarchy and emphasis
- Incorporate curved/flowing baselines - text should dance and move dynamically
- Mix font styles within the same design for visual interest
- Add decorative flourishes, swashes, and ornamental elements around text
- Create depth with shadowing, outlines, or dimensional effects
- Balance text with illustrations in a cohesive composition

STYLE-SPECIFIC GUIDELINES:

Vintage Style:
- Warm, nostalgic color palette (sepia, cream, rust, deep reds)
- Distressed textures and weathered effects
- Classic typography with ornate frames and badges
- Retro illustrations with a timeless feel

Modern Style:
- Clean, minimalist aesthetic with bold geometry
- Contemporary color schemes (monochrome or vibrant contrasts)
- Sans-serif typography with creative layouts
- Abstract shapes and modern graphic elements

Watercolor Style:
- Soft, flowing watercolor textures and gradients
- Organic shapes with natural color blending
- Hand-painted feel with artistic brushstrokes
- Dreamy, artistic typography that blends with watercolor elements

Minimalist Style:
- Simple, refined composition with plenty of negative space
- Limited color palette (1-3 colors max)
- Clean lines and geometric precision
- Typography as the hero element with elegant spacing

Ink Engraving Style:
- Intricate cross-hatching and fine line work
- Black and white with exceptional detail and depth
- Traditional engraving techniques (parallel lines, stippling, contour hatching)
- Dramatic shading and dimensional forms
- Gothic or vintage architectural elements
- Hand-lettered text with flowing, dynamic baselines
- Ornamental borders and decorative elements
- Victorian-era aesthetic with rich detail

OUTPUT REQUIREMENTS:
- Create ONLY the flat graphic design/artwork
- NO products, NO mockups, NO scenes
- Transparent or solid color background
- High resolution, print-ready quality
- Professional composition suitable for product printing
- Text must be beautiful, artistic, and integral to the design`,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    })

    let fontInstruction = ""
    if (font && font !== "none" && fontInstructions[font]) {
      fontInstruction = `\n\nFONT REQUIREMENT: ${fontInstructions[font]}`
    }

    const fullPrompt = `Create a stunning ${style} style graphic design: ${sanitizedPrompt}

Apply beautiful, artistic typography with:
- Hand-lettered text with varying sizes and flowing baselines
- Dynamic text placement with curves and movement
- Perfect integration of text and imagery
- Professional, print-ready quality${fontInstruction}

Remember: Create ONLY the isolated artwork/design - no products, no mockups. Just the beautiful graphic itself.`

    console.log("[v0] Generating image with prompt:", fullPrompt)

    const result = await model.generateContent([fullPrompt])
    const response = result.response

    console.log("[v0] Gemini response received")

    if (response.candidates && response.candidates[0]?.content?.parts) {
      const parts = response.candidates[0].content.parts

      for (const part of parts) {
        if (part.inlineData) {
          // Convert the base64 image data to a data URL
          const imageData = part.inlineData.data
          const mimeType = part.inlineData.mimeType || "image/png"
          const imageUrl = `data:${mimeType};base64,${imageData}`

          console.log("[v0] Image generated successfully")

          return NextResponse.json({
            imageUrl,
            prompt,
            style,
          })
        }
      }
    }

    // If no image data found in response
    console.error("[v0] No image data in Gemini response:", JSON.stringify(response))
    throw new Error("No image data returned from Gemini")
  } catch (error) {
    console.error("[v0] Design generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate design",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
