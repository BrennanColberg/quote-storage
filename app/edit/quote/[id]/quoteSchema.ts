import { z } from "zod"
import sourceSchema from "./sourceSchema"

const quoteSchema = z.object({
  content: z.string().min(1, "Content must not be empty."),
  authorIds: z
    .array(z.string())
    .min(1, "Quotes must have at least one author."),
  notes: z.string().optional(),
  sources: z
    .array(sourceSchema)
    .min(1, "Quotes must have at least one source."),
})

export default quoteSchema
