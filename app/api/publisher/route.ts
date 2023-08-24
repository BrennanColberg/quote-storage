import publisherSchema from "@/app/edit/publisher/[id]/publisherSchema"
import prisma from "@/prisma/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const publishers = await prisma.publisher.findMany()
  return NextResponse.json(publishers)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const props = publisherSchema.parse(body)
  const person = await prisma.publisher.create({
    data: {
      id: props.id,
      name: props.name,
      location: props.location || null,
      url: props.url || null,
      notes: props.notes || null,
    },
  })
  return NextResponse.json(person)
}

export async function PUT(request: NextRequest) {
  const oldId = new URL(request.url).searchParams.get("id")
  const body = await request.json()
  const props = publisherSchema.parse(body)
  const person = await prisma.publisher.update({
    where: { id: oldId },
    data: {
      id: props.id,
      name: props.name,
      location: props.location || null,
      url: props.url || null,
      notes: props.notes || null,
    },
  })
  return NextResponse.json(person)
}
