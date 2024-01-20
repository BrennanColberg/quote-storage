import { Publisher, Thing, ThingType } from "@prisma/client"
import Link from "next/link"

export function readableThingType(type: ThingType): string {
  return {
    [ThingType.AUDIO_RECORDING]: "Audio recording",
    [ThingType.VIDEO_RECORDING]: "Video recording",
    [ThingType.PAPERBACK]: "Paperback",
    [ThingType.LEATHERBOUND]: "Leatherbound",
    [ThingType.HARDCOVER]: "Hardcover",
    [ThingType.PDF]: "PDF",
    [ThingType.WEBSITE]: "Website",
  }[type]
}

export type ThingProp = Thing & { publisher?: Publisher }

export function ThingLink({
  thing,
  excludeTitle,
}: {
  thing: ThingProp
  excludeTitle?: string
}) {
  const items: string[] = []
  if (excludeTitle !== thing.title) items.push(`"${thing.title}"`)
  items.push(readableThingType(thing.type))
  if (thing.publisher) items.push(thing.publisher.name)
  if (thing.year) items.push(thing.year)

  let text = items.shift()
  if (items.length) text += ` (${items.join(", ")})`
  if (thing.volume) text += ` vol. ${thing.volume}`
  return <Link href={`/view/thing/${thing.id}`}>{text}</Link>
}
