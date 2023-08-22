import { PrismaClient } from "@prisma/client"
import EditPublisherForm from "./EditPublisherForm"

export default async function EditPersonPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const prisma = new PrismaClient()
  const publisher = await prisma.publisher.findUniqueOrThrow({
    where: { id },
  })
  return <EditPublisherForm publisher={publisher} />
}
