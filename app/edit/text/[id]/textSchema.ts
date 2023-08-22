import { TextType } from "@prisma/client"
import { z } from "zod"

const textSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  year: z.string().optional(),
  authorIds: z.array(z.string().uuid()),
  notes: z.string().optional(),
  type: z.nativeEnum(TextType).optional(),
})

export default textSchema
