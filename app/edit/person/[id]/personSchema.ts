import { z } from "zod"

const personSchema = z.object({
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
})

export default personSchema
