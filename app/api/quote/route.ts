import quoteSchema from "@/app/edit/quote/[id]/quoteSchema"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { z } from "zod"

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

export async function PUT(request: Request) {
  const body = await request.json()
  const { content, authorIds, notes, sources, id } = quoteSchema
    .and(z.object({ id: z.string() }))
    .parse(body)

  const prisma = new PrismaClient()

  // we have to manually delete sources/citations that are no longer
  // included in the quote. we do this with as few operations as are
  // possible, by deleting (1) sources that are no longer included
  // (which cascade to their citations), then (2) citations that are
  // no longer included _for sources that are still included_
  const old = await prisma.quote.findUniqueOrThrow({
    where: { id },
    include: { sources: { include: { citations: true } } },
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

  // now update, etc
  const quote = await Promise.all([
    // delete old sources
    prisma.source.deleteMany({ where: { id: { in: deletedSourceIds } } }),
    // delete old citations (for still-existing sources)
    prisma.citation.deleteMany({ where: { id: { in: deletedCitationIds } } }),
    // update the rest
    prisma.quote.update({
      where: { id },
      data: {
        content,
        notes: notes || null,
        authors: { connect: authorIds.map((id) => ({ id })) },
        sources: {
          upsert: sources.map(({ textId, citations, primary, id }) => ({
            where: { id },
            update: {
              textId,
              primary,
              citations: {
                upsert: citations.map(
                  ({ editionId, start, end, startLine, id }) => ({
                    where: { id },
                    update: {
                      editionId,
                      start: start || null,
                      end: end || null,
                      startLine: startLine || (startLine === 0 ? 0 : null),
                    },
                    create: {
                      editionId,
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
                  ({ editionId, start, end, startLine, id }) => ({
                    id,
                    editionId,
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
    }),
  ])

  return NextResponse.json(quote)
}
