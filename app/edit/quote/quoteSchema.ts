import { z } from "zod"

const quoteSchema = z.object({
  content: z.string({
    required_error: "Content must not be empty.",
  }),
  authorIds: z.array(z.string()).min(1, {
    message: "Quotes must have at least one author.",
  }),
  notes: z.string().optional(),
})

export default quoteSchema
