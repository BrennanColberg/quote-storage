import { z } from "zod"

const quoteSchema = z.object({
  content: z.string({
    required_error: "Content must not be empty.",
  }),
  authorId: z.string({
    required_error: "Quotes must have at least one author.",
  }),
})

export default quoteSchema
