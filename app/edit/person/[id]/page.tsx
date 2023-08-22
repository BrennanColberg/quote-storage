import { PrismaClient } from "@prisma/client"
import EditPersonForm from "./EditPersonForm"

export default async function EditPersonPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const prisma = new PrismaClient()
  const person = await prisma.person.findUniqueOrThrow({
    where: { id },
  })
  return <EditPersonForm person={person} />
}
