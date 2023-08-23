import { z } from "zod"
import citationSchema from "./citationSchema"

const sourceSchema = z.object({
  textId: z.string({
    required_error: "Source must refer to a text.",
  }),
  notes: z.string().optional(),
  citations: z
    .array(citationSchema)
    .min(1, "Source must contain at least one citation."),
  primary: z.boolean().default(false),
})

export default sourceSchema
