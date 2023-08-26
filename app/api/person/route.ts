import personSchema from "@/app/edit/person/[id]/personSchema"
import prisma from "@/prisma/prisma"
import { link } from "fs"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const persons = await prisma.person.findMany()
  return NextResponse.json(persons)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    name,
    shortName,
    yearBorn,
    yearDied,
    bio,
    notes,
    fictional,
    textIdsAuthored,
    textIdsCharactered,
    id,
    linkTwitter,
    linkWikipedia,
  } = personSchema.parse(body)
  const person = await prisma.person.create({
    data: {
      id,
      name: name,
      shortName: shortName || null,
      yearBorn: yearBorn || null,
      yearDied: yearDied || null,
      bio: bio || null,
      notes: notes || null,
      fictional: fictional,
      textsAuthored: { connect: textIdsAuthored.map((id) => ({ id })) },
      textsCharactered: { connect: textIdsCharactered.map((id) => ({ id })) },
      linkTwitter: linkTwitter || null,
      linkWikipedia: linkWikipedia || null,
    },
  })
  return NextResponse.json(person)
}

export async function PUT(request: NextRequest) {
  const url = new URL(request.url)
  const oldId = url.searchParams.get("id")
  const body = await request.json()
  const {
    name,
    shortName,
    yearBorn,
    yearDied,
    bio,
    notes,
    fictional,
    id,
    textIdsAuthored,
    textIdsCharactered,
    linkTwitter,
    linkWikipedia,
  } = personSchema.parse(body)

  // manually find which texts to disconnect in each category
  const old = await prisma.person.findUniqueOrThrow({
    where: { id: oldId },
    include: { textsAuthored: true, textsCharactered: true },
  })
  const disconnectedTextsAuthored = old.textsAuthored.filter(
    (oa) => !textIdsAuthored.includes(oa.id),
  )
  const disconnectedTextsCharactered = old.textsCharactered.filter(
    (oc) => !textIdsCharactered.includes(oc.id),
  )

  const person = await prisma.person.update({
    where: { id: oldId },
    data: {
      id,
      name: name,
      shortName: shortName || null,
      yearBorn: yearBorn || null,
      yearDied: yearDied || null,
      bio: bio || null,
      notes: notes || null,
      fictional: fictional,
      textsAuthored: {
        connect: textIdsAuthored.map((id) => ({ id })),
        disconnect: disconnectedTextsAuthored,
      },
      textsCharactered: {
        connect: textIdsCharactered.map((id) => ({ id })),
        disconnect: disconnectedTextsCharactered,
      },
      linkTwitter: linkTwitter || null,
      linkWikipedia: linkWikipedia || null,
    },
  })
  return NextResponse.json(person)
}
