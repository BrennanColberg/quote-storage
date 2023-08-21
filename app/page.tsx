import Link from "next/link"

// basic placeholder page
export default function Page() {
  return (
    <div>
      <Link href="/edit/quote" className="text-blue-500 underline">
        Add quote
      </Link>
    </div>
  )
}
