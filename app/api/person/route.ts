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
  const props = personSchema.parse(body)
  const person = await prisma.person.create({
    data: {
      name: props.name,
      shortName: props.shortName || null,
      yearBorn: props.yearBorn || null,
      yearDied: props.yearDied || null,
      bio: props.bio || null,
      notes: props.notes || null,
      fictional: props.fictional,
    },
  })
  return NextResponse.json(person)
}

const editPersonSchema = personSchema.and(z.object({ id: z.string() }))
export async function PUT(request: NextRequest) {
  const body = await request.json()
  const props = editPersonSchema.parse(body)
  const person = await prisma.person.update({
    where: { id: props.id },
    data: {
      name: props.name,
      shortName: props.shortName || null,
      yearBorn: props.yearBorn || null,
      yearDied: props.yearDied || null,
      bio: props.bio || null,
      notes: props.notes || null,
      fictional: props.fictional,
    },
  })
  return NextResponse.json(person)
}
