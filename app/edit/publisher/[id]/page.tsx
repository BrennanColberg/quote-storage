import EditPublisherForm from "./EditPublisherForm"
import prisma from "@/prisma/prisma"

export default async function EditPersonPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const publisher = await prisma.publisher.findUniqueOrThrow({
    where: { id },
  })
  return <EditPublisherForm publisher={publisher} />
}
