import AddButton from "@/components/AddButton"
import EditButton from "@/components/EditButton"
import { Button } from "@/components/ui/button"
import prisma from "@/prisma/prisma"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function Page() {
  cookies() // calling this forces dynamic rerendering

  const texts = await prisma.text.findMany({ include: { authors: true } })
  return (
    <main>
      <div className="flex flex-row gap-2">
        <AddButton type="text" />
        <AddButton type="quote" />
        <AddButton type="person" />
      </div>
      <h3>Texts</h3>
      <ul>
        {texts.map((text) => (
          <li key={text.id}>
            <EditButton type="text" id={text.id} />
            <Link href={`/view/text/${text.id}`}>
              {text.title} (
              {text.authors.map((author) => author.name).join(", ")})
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
