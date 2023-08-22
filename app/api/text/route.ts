import { NextRequest, NextResponse } from "next/server"
import textSchema from "../../edit/text/textSchema"
import { PrismaClient } from "@prisma/client"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { title, authorIds } = textSchema.parse(body)
  const prisma = new PrismaClient()
  const text = await prisma.text.create({
    data: {
      title,
      authors: { connect: authorIds.map((id) => ({ id })) },
    },
  })
  return NextResponse.json(text)
}
