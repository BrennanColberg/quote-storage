import personSchema from "@/app/edit/person/[id]/personSchema"
import prisma from "@/prisma/prisma"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

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
  } = personSchema.parse(body)
  const person = await prisma.person.create({
    data: {
      name: name,
      shortName: shortName || null,
      yearBorn: yearBorn || null,
      yearDied: yearDied || null,
      bio: bio || null,
      notes: notes || null,
      fictional: fictional,
      textsAuthored: { connect: textIdsAuthored.map((id) => ({ id })) },
      textsCharactered: { connect: textIdsCharactered.map((id) => ({ id })) },
    },
  })
  return NextResponse.json(person)
}

export async function PUT(request: NextRequest) {
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
  } = personSchema.and(z.object({ id: z.string() })).parse(body)

  // manually find which texts to disconnect in each category
  const old = await prisma.person.findUniqueOrThrow({
    where: { id },
    include: { textsAuthored: true, textsCharactered: true },
  })
  const disconnectedTextsAuthored = old.textsAuthored.filter(
    (oa) => !textIdsAuthored.includes(oa.id),
  )
  const disconnectedTextsCharactered = old.textsCharactered.filter(
    (oc) => !textIdsCharactered.includes(oc.id),
  )

  const person = await prisma.person.update({
    where: { id: id },
    data: {
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
    },
  })
  return NextResponse.json(person)
}
