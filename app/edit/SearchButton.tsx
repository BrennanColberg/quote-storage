import { Button } from "@/components/ui/button"

type SearchWebsite = "google" | "wikipedia"

function getSearchURL(website: SearchWebsite, query: string) {
  switch (website) {
    case "google":
      return `https://www.google.com/search?q=${encodeURIComponent(query)}`
    case "wikipedia":
      return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(
        query,
      )}`
  }
}

export default function SearchButton({
  website = "google",
  query,
}: {
  website?: SearchWebsite
  query: string | (() => string)
}) {
  return (
    <Button
      variant="secondary"
      className="mr-1"
      onClick={(e) => {
        e.preventDefault()
        if (typeof query !== "string") query = query()
        const url = getSearchURL(website, query)
        window.open(url, "_blank")
      }}
    >
      ?
    </Button>
  )
}
