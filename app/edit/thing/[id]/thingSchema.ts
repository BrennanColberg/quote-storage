import { generateID } from "@/lib/id"
import { ThingType } from "@prisma/client"
import { z } from "zod"

const thingSchema = z.object({
  id: z.string().default(generateID),
  title: z.string(),
  subtitle: z.string().optional(),
  year: z.string().optional(),
  publisherId: z.string().optional(),
  authorIds: z.array(z.string()),
  translatorIds: z.array(z.string()),
  editorIds: z.array(z.string()),
  textIds: z.array(z.string()),
  notes: z.string().optional(),
  type: z.nativeEnum(ThingType).optional(),
  url: z.string().optional(),
})

export default thingSchema
