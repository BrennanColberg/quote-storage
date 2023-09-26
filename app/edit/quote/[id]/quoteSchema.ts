import { z } from "zod"
import sourceSchema from "./sourceSchema"

const quoteSchema = z.object({
  content: z.string().min(1, "Content must not be empty."),
  authorIds: z
    .array(z.string())
    .min(1, "Quotes must have at least one author."),
  subjectIds: z.array(z.string()).default([]),
  notes: z.string().optional(),
  sources: z.array(sourceSchema).default([]),
})

export default quoteSchema
