import quoteSchema from "@/app/edit/quote/[id]/quoteSchema"
import prisma from "@/prisma/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

export async function POST(request: Request) {
  const body = await request.json()
  const { content, authorIds, subjectIds, notes, sources } =
    quoteSchema.parse(body)

  const quote = await prisma.quote.create({
    data: {
      content,
      notes: notes || null,
      authors: { connect: authorIds.map((id) => ({ id })) },
      subjects: { connect: subjectIds.map((id) => ({ id })) },
      sources: {
        create: sources.map(({ textId, citations, primary }) => ({
          textId,
          primary,
          citations: {
            create: citations.map(({ thingId, start, end, startLine }) => ({
              thingId,
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

export async function PUT(request: Request) {
  const body = await request.json()
  const { content, authorIds, subjectIds, notes, sources, id } = quoteSchema
    .and(z.object({ id: z.string() }))
    .parse(body)

  // we have to manually specify sources/citations/authors that are not
  // included in the quote in order to delete them
  const old = await prisma.quote.findUniqueOrThrow({
    where: { id },
    include: {
      sources: { include: { citations: true } },
      authors: true,
      subjects: true,
    },
  })
  const deletedSourceIds = []
  const deletedCitationIds = []
  for (const os of old.sources) {
    // is source still included?
    const newSource = sources.find((s) => s.id === os.id)
    if (newSource) {
      // if so, is each of its citations still included?
      for (const oc of os.citations) {
        const newCitation = newSource.citations.find((c) => c.id === oc.id)
        // if any citation for an existing source is no longer included, goodbye
        if (!newCitation) deletedCitationIds.push(oc.id)
      }
      // if the source is no longer included, goodbye
    } else deletedSourceIds.push(os.id)
  }
  const deletedAuthorIds = []
  for (const oa of old.authors) {
    if (!authorIds.includes(oa.id)) deletedAuthorIds.push(oa.id)
  }
  const deletedSubjectIds = []
  for (const os of old.subjects) {
    if (!subjectIds.includes(os.id)) deletedSubjectIds.push(os.id)
  }

  const quote = await prisma.quote.update({
    where: { id },
    data: {
      content,
      notes: notes || null,
      authors: {
        connect: authorIds.map((id) => ({ id })),
        disconnect: deletedAuthorIds.map((id) => ({ id })),
      },
      subjects: {
        connect: subjectIds.map((id) => ({ id })),
        disconnect: deletedSubjectIds.map((id) => ({ id })),
      },
      sources: {
        deleteMany: { id: { in: deletedSourceIds } },
        upsert: sources.map(({ textId, citations, primary, id }) => ({
          where: { id },
          update: {
            textId,
            primary,
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
            textId,
            primary,
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

  return NextResponse.json(quote)
}
