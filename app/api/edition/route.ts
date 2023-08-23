import { NextRequest, NextResponse } from "next/server"
import editionSchema from "../../edit/edition/[id]/editionSchema"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

export async function GET() {
  const prisma = new PrismaClient()
  const editions = await prisma.edition.findMany({
    include: {
      texts: true,
      publisher: true,
    },
  })
  return NextResponse.json(editions)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    title,
    authorIds,
    editorIds,
    translatorIds,
    publisherId,
    textIds,
    subtitle,
    notes,
    url,
    type,
    year,
  } = editionSchema.parse(body)
  const prisma = new PrismaClient()
  const edition = await prisma.edition.create({
    data: {
      title,
      authors: { connect: authorIds.map((id) => ({ id })) },
      editors: { connect: editorIds.map((id) => ({ id })) },
      translators: { connect: translatorIds.map((id) => ({ id })) },
      publisherId: publisherId || null,
      texts: { connect: textIds.map((id) => ({ id })) },
      subtitle: subtitle || null,
      notes: notes || null,
      url: url || null,
      type: type ?? null,
      year: year || null,
    },
  })
  return NextResponse.json(edition)
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const {
    title,
    authorIds,
    editorIds,
    publisherId,
    translatorIds,
    textIds,
    id,
    subtitle,
    notes,
    url,
    type,
    year,
  } = editionSchema.and(z.object({ id: z.string() })).parse(body)
  const prisma = new PrismaClient()
  const edition = await prisma.edition.update({
    where: { id },
    data: {
      title,
      authors: { connect: authorIds.map((id) => ({ id })) },
      editors: { connect: editorIds.map((id) => ({ id })) },
      translators: { connect: translatorIds.map((id) => ({ id })) },
      texts: { connect: textIds.map((id) => ({ id })) },
      publisherId: publisherId || null,
      subtitle: subtitle || null,
      notes: notes || null,
      url: url || null,
      type: type ?? null,
      year: year || null,
    },
  })
  return NextResponse.json(edition)
}
