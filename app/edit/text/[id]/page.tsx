import { PrismaClient } from "@prisma/client"
import EditTextForm from "./EditTextForm"

export default async function EditTextPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const prisma = new PrismaClient()
  const persons = await prisma.person.findMany()
  const text = await prisma.text.findUniqueOrThrow({
    where: { id },
    include: { authors: true },
  })
  return <EditTextForm persons={persons} text={text} />
}
