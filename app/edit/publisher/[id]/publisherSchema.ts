import { generateID } from "@/lib/id"
import { z } from "zod"

const publisherSchema = z.object({
  id: z.string().default(generateID),
  name: z.string(),
  location: z.string().optional(),
  url: z.string().optional(),
  notes: z.string().optional(),
})

export default publisherSchema
