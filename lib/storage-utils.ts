/**
 * Utility functions to prevent base64 storage issues
 */

export async function compressImage(file: File, maxSizeMB = 1): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        // Calculate new dimensions to keep under maxSizeMB
        const maxDimension = 2000
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width
          width = maxDimension
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height
          height = maxDimension
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              reject(new Error("Compression failed"))
            }
          },
          "image/jpeg",
          0.8,
        )
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}

export function isStorageAvailable(): boolean {
  try {
    const test = "__storage_test__"
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

export function getStorageSize(): number {
  let total = 0
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length
    }
  }
  return total
}

export function safeStringify(obj: any): string {
  return JSON.stringify(obj, (key, value) => {
    // Convert Date objects to ISO strings with a marker
    if (value instanceof Date) {
      return { __type: "Date", value: value.toISOString() }
    }
    return value
  })
}

export function safeParse(json: string): any {
  return JSON.parse(json, (key, value) => {
    // Restore Date objects from our marker
    if (value && typeof value === "object" && value.__type === "Date") {
      return new Date(value.value)
    }
    return value
  })
}

export function cleanupOldData(maxStorageBytes = 5000000) {
  // 5MB limit
  const currentSize = getStorageSize()
  if (currentSize > maxStorageBytes) {
    console.warn("[v0] Storage limit exceeded, cleaning up old data")
    // Remove oldest project data
    const projects = safeParse(localStorage.getItem("genmock_projects") || "[]")
    if (projects.length > 3) {
      // Keep only 3 most recent projects
      const sorted = projects.sort(
        (a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      localStorage.setItem("genmock_projects", safeStringify(sorted.slice(0, 3)))
    }
  }
}
