"use client"
// used to hide a section of content that may not be a priority to view

import { ReactNode, useState } from "react"

export default function Expandable({
  children,
  description,
  className = "",
  initiallyExpanded = false,
  hidden = false,
}: {
  children: ReactNode
  description: string
  className?: string
  initiallyExpanded?: boolean
  hidden?: boolean
}) {
  const [expanded, setExpanded] = useState(initiallyExpanded)

  if (hidden && !expanded) return null

  if (!expanded)
    return (
      <p
        className={
          "hover:underline text-blue-500 cursor-pointer m-1" + className
        }
        onClick={() => setExpanded(true)}
      >
        show {description}
      </p>
    )
  else return <>{children}</>
}
