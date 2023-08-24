import { v4 as uuid } from "uuid"

// we put this in its own function so we can change it later
export function generateID() {
  return uuid()
}
