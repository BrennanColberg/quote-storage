import { generateID } from "@/lib/id"
import { z } from "zod"

const personSchema = z.object({
  id: z.string().default(generateID),
  name: z.string().min(1, {
    message: "All authors must have a name.",
  }),
  shortName: z.string().optional(),
  bio: z.string().optional(),
  notes: z.string().optional(),
  yearBorn: z.string().optional(),
  yearDied: z.string().optional(),
  fictional: z.boolean().default(false),
  textIdsAuthored: z.array(z.string()).default([]),
  textIdsCharactered: z.array(z.string()).default([]),
  linkWikipedia: z.string().optional(),
  linkTwitter: z.string().optional(),
})

export default personSchema
