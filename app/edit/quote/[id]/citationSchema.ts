import { z } from "zod"

const citationSchema = z.object({
  id: z.string().optional(),
  editionId: z.string({ required_error: "Citation must contain an edition." }),
  // notes: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  startLine: z.number().int().optional(),
})

export default citationSchema
