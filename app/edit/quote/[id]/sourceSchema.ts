import { z } from "zod"
import citationSchema from "./citationSchema"

const sourceSchema = z.object({
  id: z.string().optional(),
  textId: z.string({
    required_error: "Source must refer to a text.",
  }),
  // notes: z.string().optional(),
  citations: z.array(citationSchema).default([]),
  primary: z.boolean().default(false),
})

export default sourceSchema
