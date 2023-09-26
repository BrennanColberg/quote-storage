import Link from "next/link"
import { ReactElement } from "react-markdown/lib/react-markdown"

export default function listOfLinks(
  links: { href: string; text: string }[],
): ReactElement[] {
  const list = []
  for (const { href, text } of links) {
    list.push(<Link href={href}>{text}</Link>)
    list.push(", ")
  }
  list.pop() // remove last comma
  return list
}
