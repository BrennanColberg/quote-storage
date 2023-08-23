import { z } from "zod"

const citationSchema = z.object({
  editionId: z
    .string({ required_error: "Citation must contain an edition." })
    .uuid(),
  notes: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  startLine: z.number().int().optional(),
})

export default citationSchema
