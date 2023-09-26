import { generateID } from "@/lib/id"
import { TextType } from "@prisma/client"
import { z } from "zod"
import subtextSchema from "./subtextSchema"

const textSchema = z.object({
  id: z.string().default(generateID),
  title: z.string(),
  subtitle: z.string().optional(),
  year: z.string().optional(),
  authorIds: z.array(z.string()).default([]),
  characterIds: z.array(z.string()).default([]),
  notes: z.string().optional(),
  type: z.nativeEnum(TextType).optional(),
  subtexts: z.array(subtextSchema).default([]),
})

export default textSchema
