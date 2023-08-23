import { PrismaClient } from "@prisma/client"
import Link from "next/link"

// basic placeholder page
export default async function Page() {
  const prisma = new PrismaClient()
  const texts = await prisma.text.findMany({ include: { authors: true } })
  return (
    <main>
      <h3>Texts</h3>
      <ul>
        {texts.map((text) => (
          <li key={text.id}>
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
