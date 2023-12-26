import parseRoman from "./parseRoman"

describe("parseRoman", () => {
  test("all the same", () => {
    expect(parseRoman("i")).toBe(1)
    expect(parseRoman("ii")).toBe(2)
    expect(parseRoman("iii")).toBe(3)
    expect(parseRoman("v")).toBe(5)
    expect(parseRoman("x")).toBe(10)
    expect(parseRoman("xx")).toBe(20)
  })
  test("two different", () => {
    expect(parseRoman("iv")).toBe(4)
    expect(parseRoman("vi")).toBe(6)
    expect(parseRoman("ix")).toBe(9)
    expect(parseRoman("xi")).toBe(11)
    expect(parseRoman("xv")).toBe(15)
    expect(parseRoman("xix")).toBe(19)
    expect(parseRoman("xxv")).toBe(25)
  })
  test("three different", () => {
    expect(parseRoman("xiv")).toBe(14)
    expect(parseRoman("xvi")).toBe(16)
    expect(parseRoman("xviii")).toBe(18)
    expect(parseRoman("xxiv")).toBe(24)
    expect(parseRoman("xxvi")).toBe(26)
  })
})
