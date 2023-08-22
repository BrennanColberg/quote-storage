import { NextRequest, NextResponse } from "next/server"
import textSchema from "../../edit/text/[id]/textSchema"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { title, authorIds, notes, subtitle, year } = textSchema.parse(body)
  const prisma = new PrismaClient()
  const text = await prisma.text.create({
    data: {
      title,
      subtitle: subtitle || null,
      year: year || null,
      notes: notes || null,
      authors: { connect: authorIds.map((id) => ({ id })) },
    },
  })
  return NextResponse.json(text)
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { title, authorIds, id, subtitle, year, notes } = textSchema
    .and(z.object({ id: z.string() }))
    .parse(body)
  const prisma = new PrismaClient()
  const text = await prisma.text.update({
    where: { id },
    data: {
      title,
      subtitle: subtitle || null,
      year: year || null,
      notes: notes || null,
      authors: { connect: authorIds.map((id) => ({ id })) },
    },
  })
  return NextResponse.json(text)
}
