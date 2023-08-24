// for parsing and comparing timestamps (e.g. 01:23:45)
// note: when a number[], first is the smallest unit, last is the largest

export function parseTimestamp(place: string): number[] {
  const result = place.split(":").map((x) => parseInt(x))
  while (result[0] === 0) result.shift() // remove leading zeros
  return result.reverse() // smallest unit first
}

export function compareTimestamps(a: number[], b: number[]) {
  // if one is longer, it's definitely bigger
  if (a.length !== b.length) return a.length - b.length
  // compare each part, starting with the largest
  for (let i = a.length - 1; i >= 0; i--) {
    if (a[i] !== b[i]) return a[i] - b[i]
  }
  // if all are equal, they are equal
  return 0
}
