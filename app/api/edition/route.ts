import { NextRequest, NextResponse } from "next/server"
import editionSchema from "../../edit/edition/editionSchema"
import { PrismaClient } from "@prisma/client"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { title, authorIds, textId } = editionSchema.parse(body)
  const prisma = new PrismaClient()
  const edition = await prisma.edition.create({
    data: {
      title,
      authors: { connect: authorIds.map((id) => ({ id })) },
      texts: { connect: [{ id: textId }] },
    },
  })
  return NextResponse.json(edition)
}
