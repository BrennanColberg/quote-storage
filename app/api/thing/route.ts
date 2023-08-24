import { NextRequest, NextResponse } from "next/server"
import thingSchema from "../../edit/thing/[id]/thingSchema"
import { z } from "zod"
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
  } = thingSchema.parse(body)
  const thing = await prisma.thing.create({
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
  return NextResponse.json(thing)
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
  } = thingSchema.and(z.object({ id: z.string() })).parse(body)
  const thing = await prisma.thing.update({
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
  return NextResponse.json(thing)
}
