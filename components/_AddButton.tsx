"use client"

import { Button } from "./ui/button"

export function _AddButton({
  type,
  urlSuffix,
}: {
  type: string
  urlSuffix?: string
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="mb-3"
      onClick={(e) => {
        e.preventDefault()
        location.href = `/add/${type}${urlSuffix}`
      }}
    >
      Add {type}
    </Button>
  )
}
