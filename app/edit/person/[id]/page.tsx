import EditPersonForm from "./EditPersonForm"
import prisma from "@/prisma/prisma"

export default async function EditPersonPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const person = await prisma.person.findUniqueOrThrow({
    where: { id },
  })
  return <EditPersonForm person={person} />
}
