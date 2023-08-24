import { compareTimestamps, parseTimestamp } from "./timestamp"

describe(parseTimestamp, () => {
  test("simple", () => {
    expect(parseTimestamp("1")).toEqual([1])
    expect(parseTimestamp("1:2")).toEqual([2, 1])
    expect(parseTimestamp("1:2:3")).toEqual([3, 2, 1])
  })
  test("leading zeros are removed", () => {
    expect(parseTimestamp("00")).toEqual([])
    expect(parseTimestamp("00:02")).toEqual([2])
    expect(parseTimestamp("00:00:02")).toEqual([2])
    expect(parseTimestamp("00:00:02:00")).toEqual([0, 2])
  })
})

describe(compareTimestamps, () => {
  test("different lengths", () => {
    expect(compareTimestamps([1], [1, 2])).toBeLessThan(0)
    expect(compareTimestamps([1, 2], [1])).toBeGreaterThan(0)
  })
  test("same lengths, different values", () => {
    expect(compareTimestamps([1], [2])).toBeLessThan(0)
    expect(compareTimestamps([2], [1])).toBeGreaterThan(0)
    expect(compareTimestamps([1, 2], [1, 3])).toBeLessThan(0)
    expect(compareTimestamps([1, 3], [1, 2])).toBeGreaterThan(0)
    expect(compareTimestamps([2, 1], [3, 1])).toBeLessThan(0)
    expect(compareTimestamps([3, 1], [2, 1])).toBeGreaterThan(0)
  })
  test("same lengths, same values", () => {
    expect(compareTimestamps([1], [1])).toBe(0)
    expect(compareTimestamps([1, 2], [1, 2])).toBe(0)
    expect(compareTimestamps([1, 2, 3], [1, 2, 3])).toBe(0)
  })
})
