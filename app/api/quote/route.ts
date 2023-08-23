import quoteSchema from "@/app/edit/quote/quoteSchema"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { content, authorIds, notes, sources } = quoteSchema.parse(body)

  const prisma = new PrismaClient()
  const quote = await prisma.quote.create({
    data: {
      content,
      notes: notes || null,
      authors: { connect: authorIds.map((id) => ({ id })) },
      sources: {
        create: sources.map(({ textId, citations, primary }) => ({
          textId,
          primary,
          citations: {
            create: citations.map(({ editionId, start, end, startLine }) => ({
              editionId,
              start: start || null,
              end: end || null,
              startLine: startLine || (startLine === 0 ? 0 : null),
            })),
          },
        })),
      },
    },
  })
  return NextResponse.json(quote)
}
