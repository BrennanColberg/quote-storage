import publisherSchema from "@/app/edit/publisher/[id]/publisherSchema"
import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const props = publisherSchema.parse(body)
  const prisma = new PrismaClient()
  const person = await prisma.publisher.create({
    data: {
      name: props.name,
      location: props.location || null,
      url: props.url || null,
      notes: props.notes || null,
    },
  })
  return NextResponse.json(person)
}
