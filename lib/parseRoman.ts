const ROMAN_VALUES = { i: 1, v: 5, x: 10 }
/**
 * Converts string-stored roman numeral to number.
 * @param roman Roman numeral (only through x)
 * @returns value of roman numeral
 */
export default function parseRoman(roman: string): number {
  roman = roman.toLowerCase()
  let result = 0
  let reserve = 0
  let last = 0
  for (const char of roman) {
    const value = ROMAN_VALUES[char]
    if (value === undefined) throw new Error(`Invalid roman numeral: ${roman}`)
    // when we come up in value (like IV), subtract "reserve"
    if (value > last) {
      result -= reserve
      reserve = 0
    }
    // when we come down in value (like XIX), "bank" the reserve
    if (value < last) {
      result += reserve
      reserve = 0
    }
    // put each successive digit in the reserve
    reserve += value
    last = value
  }
  result += reserve
  return result
}
