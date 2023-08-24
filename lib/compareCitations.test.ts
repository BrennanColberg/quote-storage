import { comparePlaces, typeOfPlace } from "./compareCitations"

// reminder for comparators: 1 = b comes first, 0 = equal, -1 = a comes first

describe(typeOfPlace, () => {
  test("undefined", () => {
    expect(typeOfPlace(undefined)).toBe(undefined)
    expect(typeOfPlace("")).toBe(undefined)
    expect(typeOfPlace("asdf")).toBe(undefined)
    expect(typeOfPlace("1 2")).toBe(undefined)
  })
  test("roman", () => {
    expect(typeOfPlace("i")).toBe("roman")
    expect(typeOfPlace("iv")).toBe("roman")
    expect(typeOfPlace("v")).toBe("roman")
    expect(typeOfPlace("ix")).toBe("roman")
    expect(typeOfPlace("x")).toBe("roman")
    expect(typeOfPlace("xiv")).toBe("roman")
    expect(typeOfPlace("xv")).toBe("roman")
    expect(typeOfPlace("xix")).toBe("roman")
  })
  test("arabic", () => {
    expect(typeOfPlace("1")).toBe("arabic")
    expect(typeOfPlace("23")).toBe("arabic")
    expect(typeOfPlace("456")).toBe("arabic")
    expect(typeOfPlace("7890")).toBe("arabic")
  })
  test("timestamp", () => {
    expect(typeOfPlace("0:1")).toBe("timestamp")
    expect(typeOfPlace("1:2")).toBe("timestamp")
    expect(typeOfPlace("1:23")).toBe("timestamp")
    expect(typeOfPlace("12:34")).toBe("timestamp")
    expect(typeOfPlace("1:23:45")).toBe("timestamp")
    expect(typeOfPlace("12:34:56")).toBe("timestamp")
  })
})

describe(comparePlaces, () => {
  test("undefined", () => {
    // undefined always comes last
    expect(comparePlaces(undefined, undefined)).toBe(0)
    expect(comparePlaces(undefined, "1")).toBeGreaterThan(0)
    expect(comparePlaces("1", undefined)).toBeLessThan(0)
  })
  test("just roman", () => {
    expect(comparePlaces("i", "i")).toBe(0)
    expect(comparePlaces("i", "ii")).toBeLessThan(0)
    expect(comparePlaces("i", "iv")).toBeLessThan(0)
    expect(comparePlaces("i", "vi")).toBeLessThan(0)
    expect(comparePlaces("vi", "i")).toBeGreaterThan(0)
    expect(comparePlaces("vii", "i")).toBeGreaterThan(0)
  })
  test("just arabic", () => {
    expect(comparePlaces("1", "1")).toBe(0)
    expect(comparePlaces("1", "2")).toBeLessThan(0)
    expect(comparePlaces("1", "4")).toBeLessThan(0)
    expect(comparePlaces("1", "6")).toBeLessThan(0)
    expect(comparePlaces("6", "1")).toBeGreaterThan(0)
    expect(comparePlaces("7", "1")).toBeGreaterThan(0)
    expect(comparePlaces("10", "2")).toBeGreaterThan(0)
  })
  test("mixed roman/arabic", () => {
    expect(comparePlaces("i", "1")).toBeLessThan(0)
    expect(comparePlaces("1", "i")).toBeGreaterThan(0)
    expect(comparePlaces("i", "2")).toBeLessThan(0)
    expect(comparePlaces("2", "i")).toBeGreaterThan(0)
    expect(comparePlaces("i", "3")).toBeLessThan(0)
    expect(comparePlaces("ii", "1")).toBeLessThan(0)
    expect(comparePlaces("1", "ii")).toBeGreaterThan(0)
  })
  test("just timestamp", () => {
    expect(comparePlaces("1:2", "1:2")).toBe(0)
    expect(comparePlaces("1:2", "1:3")).toBeLessThan(0)
    expect(comparePlaces("1:2", "1:4")).toBeLessThan(0)
    expect(comparePlaces("2:1", "6:1")).toBeLessThan(0)
  })
  test("mixed timestamp + number", () => {
    expect(comparePlaces("1:2", "1")).toBe(0)
    expect(comparePlaces("1", "1:2")).toBe(0)
    expect(comparePlaces("1:2", "vii")).toBe(0)
  })
})
