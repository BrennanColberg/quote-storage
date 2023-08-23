import { EditionType } from "@prisma/client"
import { z } from "zod"

const editionSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  year: z.string().optional(),
  publisherId: z.string().optional(),
  authorIds: z.array(z.string()),
  translatorIds: z.array(z.string()),
  editorIds: z.array(z.string()),
  textIds: z.array(z.string()).min(1, "Must have at least one text."),
  notes: z.string().optional(),
  type: z.nativeEnum(EditionType).optional(),
  url: z.string().optional(),
})

export default editionSchema
