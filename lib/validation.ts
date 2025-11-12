import { z } from "zod"

export const generateDesignSchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters").max(500, "Prompt too long"),
  style: z.enum(["Modern", "Vintage", "Minimalist", "Abstract", "Watercolor", "Typography"]),
  font: z.string().optional(),
  variation: z.number().int().min(1).max(4),
})

export const generateMockupSchema = z.object({
  designFile: z.instanceof(File).refine((file) => file.size <= 10 * 1024 * 1024, "File must be under 10MB"),
  productType: z.string().min(1, "Product type required"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
})

export const editDesignSchema = z.object({
  instruction: z.string().min(3, "Instruction must be at least 3 characters").max(500, "Instruction too long"),
  designFile: z.instanceof(File).refine((file) => file.size <= 10 * 1024 * 1024, "File must be under 10MB"),
})

export type GenerateDesignInput = z.infer<typeof generateDesignSchema>
export type GenerateMockupInput = z.infer<typeof generateMockupSchema>
export type EditDesignInput = z.infer<typeof editDesignSchema>
