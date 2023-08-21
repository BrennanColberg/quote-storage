import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  name: z.string(),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name } = schema.parse(body)
  const prisma = new PrismaClient()
  const person = await prisma.person.create({
    data: { name },
  })
  return NextResponse.json(person)
}
