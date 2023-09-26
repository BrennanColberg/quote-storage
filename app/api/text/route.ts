import { NextRequest, NextResponse } from "next/server"
import textSchema from "../../edit/text/[id]/textSchema"
import prisma from "@/prisma/prisma"

export async function GET() {
  const texts = await prisma.text.findMany({ include: { authors: true } })
  return NextResponse.json(texts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    title,
    authorIds,
    characterIds,
    notes,
    subtitle,
    year,
    type,
    id,
    subtexts,
  } = textSchema.parse(body)
  const text = await prisma.text.create({
    data: {
      id,
      title,
      subtitle: subtitle || null,
      year: year || null,
      notes: notes || null,
      authors: { connect: authorIds.map((id) => ({ id })) },
      characters: { connect: characterIds.map((id) => ({ id })) },
      type: type ?? null,
      subtexts: {
        create: subtexts.map((subtext) => ({
          id: subtext.id,
          title: subtext.title,
          ordinal: subtext.ordinal || null,
          notes: subtext.notes || null,
          citations: {
            create: subtext.citations.map(
              ({ thingId, start, end, startLine }) => ({
                thingId,
                start: start || null,
                end: end || null,
                startLine: startLine || (startLine === 0 ? 0 : null),
              }),
            ),
          },
        })),
      },
    },
  })
  return NextResponse.json(text)
}

export async function PUT(request: NextRequest) {
  const url = new URL(request.url)
  const oldId = url.searchParams.get("id")

  const body = await request.json()
  const {
    title,
    authorIds,
    characterIds,
    id,
    subtitle,
    year,
    notes,
    type,
    subtexts,
  } = textSchema.parse(body)

  // manually tally which authors/characters to delete
  const old = await prisma.text.findUniqueOrThrow({
    where: { id: oldId },
    include: {
      authors: true,
      characters: true,
      subtexts: { include: { citations: true } },
    },
  })
  const deletedAuthors = old.authors.filter((oa) => !authorIds.includes(oa.id))
  const deletedCharacters = old.characters.filter(
    (oc) => !characterIds.includes(oc.id),
  )
  const deletedSubtextIds = []
  const deletedCitationIds = []
  for (const os of old.subtexts) {
    // is subtext still included?
    const newSubtext = subtexts.find((s) => s.id === os.id)
    if (newSubtext) {
      // if so, is each of its citations still included?
      for (const oc of os.citations) {
        const newCitation = newSubtext.citations.find((c) => c.id === oc.id)
        // if any citation for an existing subtext is no longer included, goodbye
        if (!newCitation) deletedCitationIds.push(oc.id)
      }
      // if the source is no longer included, goodbye
    } else deletedSubtextIds.push(os.id)
  }

  const text = await prisma.text.update({
    where: { id: oldId },
    data: {
      id,
      title,
      subtitle: subtitle || null,
      year: year || null,
      notes: notes || null,
      authors: {
        connect: authorIds.map((id) => ({ id })),
        disconnect: deletedAuthors,
      },
      characters: {
        connect: characterIds.map((id) => ({ id })),
        disconnect: deletedCharacters,
      },
      type: type ?? null,
      subtexts: {
        deleteMany: { id: { in: deletedSubtextIds } },
        upsert: subtexts.map(({ id, citations, notes, title, ordinal }) => ({
          where: { id },
          update: {
            notes,
            title,
            ordinal,
            citations: {
              deleteMany: { id: { in: deletedCitationIds } },
              upsert: citations.map(
                ({ thingId, start, end, startLine, id }) => ({
                  where: { id },
                  update: {
                    thingId,
                    start: start || null,
                    end: end || null,
                    startLine: startLine || (startLine === 0 ? 0 : null),
                  },
                  create: {
                    thingId,
                    start: start || null,
                    end: end || null,
                    startLine: startLine || (startLine === 0 ? 0 : null),
                    id,
                  },
                }),
              ),
            },
          },
          create: {
            id,
            title,
            ordinal,
            notes,
            citations: {
              create: citations.map(
                ({ thingId, start, end, startLine, id }) => ({
                  id,
                  thingId,
                  start: start || null,
                  end: end || null,
                  startLine: startLine || (startLine === 0 ? 0 : null),
                }),
              ),
            },
          },
        })),
      },
    },
  })
  return NextResponse.json(text)
}
