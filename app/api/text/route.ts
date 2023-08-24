import { NextRequest, NextResponse } from "next/server"
import textSchema from "../../edit/text/[id]/textSchema"
import prisma from "@/prisma/prisma"

export async function GET() {
  const texts = await prisma.text.findMany({ include: { authors: true } })
  return NextResponse.json(texts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { title, authorIds, characterIds, notes, subtitle, year, type, id } =
    textSchema.parse(body)
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
    },
  })
  return NextResponse.json(text)
}

export async function PUT(request: NextRequest) {
  const url = new URL(request.url)
  const oldId = url.searchParams.get("id")

  const body = await request.json()
  const { title, authorIds, characterIds, id, subtitle, year, notes, type } =
    textSchema.parse(body)

  // manually tally which authors/characters to delete
  const old = await prisma.text.findUniqueOrThrow({
    where: { id: oldId },
    include: { authors: true, characters: true },
  })
  const deletedAuthors = old.authors.filter((oa) => !authorIds.includes(oa.id))
  const deletedCharacters = old.characters.filter(
    (oc) => !characterIds.includes(oc.id),
  )

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
    },
  })
  return NextResponse.json(text)
}
