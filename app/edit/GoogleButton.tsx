import { Button } from "@/components/ui/button"

export default function GoogleButton({ query }: { query: string }) {
  const url = `https://www.google.com/search?q=${query.replaceAll(" ", "+")}`
  return (
    <Button
      variant="secondary"
      className="ml-1"
      onClick={(e) => {
        e.preventDefault()
        window.open(url, "_blank")
      }}
    >
      ?
    </Button>
  )
}
