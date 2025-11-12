// Client-side service that calls server API routes
export async function extractTextFromImage(imageFile: File): Promise<{
  texts: Array<{ text: string; isPetName: boolean }>
  pets: Array<{ description: string }>
}> {
  const formData = new FormData()
  formData.append("image", imageFile)

  const response = await fetch("/api/analyze-design", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to analyze image")
  }

  return response.json()
}

export async function editDesignImage(
  imageFile: File,
  editType: "text" | "color" | "pet" | "custom",
  params: {
    oldText?: string
    newText?: string
    targetText?: string
    newColor?: string
    petDescription?: string
    petImage?: File
    customPrompt?: string
  },
): Promise<string> {
  const formData = new FormData()
  formData.append("image", imageFile)
  formData.append("editType", editType)
  formData.append("params", JSON.stringify(params))

  if (params.petImage) {
    formData.append("petImage", params.petImage)
  }

  const response = await fetch("/api/edit-design", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to edit image")
  }

  const data = await response.json()
  return data.imageUrl
}

export async function* generateMockupImages(
  designFile: File,
  options: {
    product: string
    style: string
    colors: string[]
    gender?: string
    ethnicity?: string
    age?: string
    scene?: string
  },
): AsyncGenerator<{ imageUrl: string; color: string; colorHex: string }, void, unknown> {
  const colorMap: Record<string, string> = {
    Red: "#BF0D3E",
    Blue: "#2668A4",
    Black: "#000000",
    White: "#FFFFFF",
    Navy: "#1E3A8A",
    Gray: "#6B7280",
    Green: "#22C55E",
  }

  for (const color of options.colors) {
    const formData = new FormData()
    formData.append("design", designFile)
    formData.append("product", options.product)
    formData.append("style", options.style)
    formData.append("color", color)
    if (options.gender) formData.append("gender", options.gender)
    if (options.ethnicity) formData.append("ethnicity", options.ethnicity)
    if (options.age) formData.append("age", options.age)
    if (options.scene) formData.append("scene", options.scene)

    const response = await fetch("/api/generate-mockup", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to generate mockup")
    }

    const data = await response.json()
    yield {
      imageUrl: data.imageUrl,
      color,
      colorHex: colorMap[color] || "#000000",
    }
  }
}
