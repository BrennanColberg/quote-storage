import { z } from "zod"
import citationSchema from "../../quote/[id]/citationSchema"

const subtextSchema = z.object({
  id: z.string(),
  title: z.string(),
  ordinal: z.string().optional(),
  citations: z.array(citationSchema).default([]),
  notes: z.string().optional(),
})

export default subtextSchema
