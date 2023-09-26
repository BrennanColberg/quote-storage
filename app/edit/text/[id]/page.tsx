import EditTextForm from "./EditTextForm"
import prisma from "@/prisma/prisma"

export default async function EditTextPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const text = await prisma.text.findUniqueOrThrow({
    where: { id },
    include: {
      authors: true,
      characters: true,
      subtexts: { include: { citations: true } },
    },
  })
  return <EditTextForm text={text} />
}
