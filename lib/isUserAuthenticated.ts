import { cookies } from "next/headers"

export default function isUserAuthenticated(): boolean {
  return cookies().get("API_KEY")?.value === process.env.API_KEY
}
