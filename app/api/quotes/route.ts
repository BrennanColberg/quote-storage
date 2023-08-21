import quoteSchema from "@/app/edit/quote/quoteSchema"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { content, authorId } = quoteSchema.parse(await request.json())
  const authorIds = [authorId]

  const prisma = new PrismaClient()
  const quote = await prisma.quote.create({
    data: { content, authors: { connect: authorIds.map((id) => ({ id })) } },
  })
  return NextResponse.json(quote)
}
