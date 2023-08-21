import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  text: z.string(),
  authorIds: z.array(z.string()),
})

export async function POST(request: Request) {
  // extract the data from the request
  const { text, authorIds } = schema.parse(await request.json())

  const prisma = new PrismaClient()
  const quote = await prisma.quote.create({
    data: { text, authors: { connect: authorIds.map((id) => ({ id })) } },
  })
  return NextResponse.json(quote)
}
