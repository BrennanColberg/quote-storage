import quoteSchema from "@/app/edit/quote/quoteSchema"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { content, authorId, notes } = quoteSchema.parse(body)
  const authorIds = [authorId]

  const prisma = new PrismaClient()
  const quote = await prisma.quote.create({
    data: {
      content,
      notes: notes || null,
      authors: { connect: authorIds.map((id) => ({ id })) },
    },
  })
  return NextResponse.json(quote)
}
