import { z } from "zod"

const sourceSchema = z.object({
  textId: z
    .string({
      required_error: "Source must contain a text.",
    })
    .uuid(),
  notes: z.string().optional(),
  // citations: z.array(
  //   z.object({
  //     editionId: z.string().uuid(),
  //   }),
  // ),
})

export default sourceSchema
