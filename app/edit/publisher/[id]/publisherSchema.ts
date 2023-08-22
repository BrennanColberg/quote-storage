import { z } from "zod"

const publisherSchema = z.object({
  name: z.string(),
  location: z.string().optional(),
  url: z.string().optional(),
  notes: z.string().optional(),
})

export default publisherSchema
