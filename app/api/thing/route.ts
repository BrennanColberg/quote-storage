import { NextRequest, NextResponse } from "next/server"
import thingSchema from "../../edit/thing/[id]/thingSchema"
import prisma from "@/prisma/prisma"

export async function GET() {
  const things = await prisma.thing.findMany({
    include: {
      texts: true,
      publisher: true,
    },
  })
  return NextResponse.json(things)
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
    id,
  } = thingSchema.parse(body)
  const thing = await prisma.thing.create({
    data: {
      id,
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
  return NextResponse.json(thing)
}

export async function PUT(request: NextRequest) {
  const oldId = new URL(request.url).searchParams.get("id")

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
  } = thingSchema.parse(body)

  // manually tally which authors/editors/translators/texts to disconnect
  const old = await prisma.thing.findUniqueOrThrow({
    where: { id: oldId },
    include: {
      authors: true,
      editors: true,
      translators: true,
      texts: true,
    },
  })
  const deletedAuthors = old.authors.filter((oa) => !authorIds.includes(oa.id))
  const deletedEditors = old.editors.filter((oe) => !editorIds.includes(oe.id))
  const deletedTranslators = old.translators.filter(
    (ot) => !translatorIds.includes(ot.id),
  )
  const deletedTexts = old.texts.filter((ot) => !textIds.includes(ot.id))

  const thing = await prisma.thing.update({
    where: { id: oldId },
    data: {
      id,
      title,
      authors: {
        connect: authorIds.map((id) => ({ id })),
        disconnect: deletedAuthors,
      },
      editors: {
        connect: editorIds.map((id) => ({ id })),
        disconnect: deletedEditors,
      },
      translators: {
        connect: translatorIds.map((id) => ({ id })),
        disconnect: deletedTranslators,
      },
      texts: {
        connect: textIds.map((id) => ({ id })),
        disconnect: deletedTexts,
      },
      publisherId: publisherId || null,
      subtitle: subtitle || null,
      notes: notes || null,
      url: url || null,
      type: type ?? null,
      year: year || null,
    },
  })
  return NextResponse.json(thing)
}
