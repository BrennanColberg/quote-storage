import { z } from "zod"

const textSchema = z.object({
  title: z.string(),
  authorIds: z.array(z.string().uuid()),
  textId: z.string().uuid(),
})

export default textSchema
