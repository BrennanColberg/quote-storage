import {
  bucketQuotesBySubtext,
  bucketsOfAndBetweenSubtexts,
  isQuoteInsideBucket,
  justAfterCitation,
  justBeforeCitation,
} from "./sortQuotesIntoSubtexts"

describe(bucketQuotesBySubtext, () => {
  test("one quote before one subtext", () => {
    const subtext = { citation: { start: "2" } }
    const quote = { citation: { start: "1" } }
    const buckets = bucketQuotesBySubtext([subtext], [quote])
    // should NOT sort into bucket, get dropped
    expect(buckets).toMatchObject([
      { quotes: [quote] },
      { subtext: subtext, quotes: [] },
    ])
  })
  test("one quote after one subtext", () => {
    const subtext = { citation: { start: "2" } }
    const quote = { citation: { start: "3" } }
    const buckets = bucketQuotesBySubtext([subtext], [quote])
    // should sort into bucket
    expect(buckets).toEqual([{ subtext: subtext, quotes: [quote] }])
  })
  test("one quote, two buckets (before all, gets dropped)", () => {
    const subtext1 = { citation: { start: "1" } }
    const subtext2 = { citation: { start: "3" } }
    const quote = { citation: { start: "0" } }
    const buckets = bucketQuotesBySubtext([subtext1, subtext2], [quote])
    // should be in first bucket
    expect(buckets).toEqual([
      { quotes: [quote] },
      { subtext: subtext1, quotes: [] },
      { subtext: subtext2, quotes: [] },
    ])
  })
  test("one quote, two buckets (sorts into first)", () => {
    const subtext1 = { citation: { start: "1" } }
    const subtext2 = { citation: { start: "3" } }
    const quote = { citation: { start: "2" } }
    const buckets = bucketQuotesBySubtext([subtext1, subtext2], [quote])
    // should be in first bucket
    expect(buckets).toEqual([
      { subtext: subtext1, quotes: [quote] },
      { subtext: subtext2, quotes: [] },
    ])
  })
  test("one quote, two buckets (sorts into second)", () => {
    const subtext1 = { citation: { start: "1" } }
    const subtext2 = { citation: { start: "3" } }
    const quote = { citation: { start: "4" } }
    const buckets = bucketQuotesBySubtext([subtext1, subtext2], [quote])
    // should be in first bucket
    expect(buckets).toEqual([
      { subtext: subtext1, quotes: [] },
      { subtext: subtext2, quotes: [quote] },
    ])
  })
  test("three quotes, two buckets (one dropped + one in each)", () => {
    const subtext1 = { citation: { start: "1" } }
    const subtext2 = { citation: { start: "3" } }
    const quote1 = { citation: { start: "0" } }
    const quote2 = { citation: { start: "2" } }
    const quote3 = { citation: { start: "4" } }
    const buckets = bucketQuotesBySubtext(
      [subtext1, subtext2],
      [quote1, quote2, quote3],
    )
    expect(buckets).toEqual([
      { quotes: [quote1] },
      { subtext: subtext1, quotes: [quote2] },
      { subtext: subtext2, quotes: [quote3] },
    ])
  })

  test("one quote after the end of one bucket", () => {
    const subtext = { citation: { start: "2", end: "3" } }
    const quote = { citation: { start: "4" } }
    const buckets = bucketQuotesBySubtext([subtext], [quote])
    // should sort into bucket
    expect(buckets).toEqual([
      { subtext: subtext, quotes: [] },
      { quotes: [quote] },
    ])
  })

  test("one quote in between two subtexts", () => {
    const subtext1 = { citation: { start: "2", end: "3" } }
    const subtext2 = { citation: { start: "5", end: "6" } }
    const quote = { citation: { start: "4" } }
    const buckets = bucketQuotesBySubtext([subtext1, subtext2], [quote])
    expect(buckets).toEqual([
      { subtext: subtext1, quotes: [] },
      { quotes: [quote] },
      { subtext: subtext2, quotes: [] },
    ])
  })

  test("bucket quotes by subtext", () => {
    const subtext1 = { citation: { start: "22", end: "43" }, quotes: [] }
    const subtext2 = { citation: { start: "187", end: "205" }, quotes: [] }
    const quote = { citation: { start: "176", startLine: 19 } }
    const buckets = bucketQuotesBySubtext([subtext1, subtext2], [quote])
    expect(buckets).toEqual([
      { subtext: subtext1, quotes: [] },
      { quotes: [quote] },
      { subtext: subtext2, quotes: [] },
    ])
  })
})

describe(justBeforeCitation, () => {
  test("simple arabic number, no line", () => {
    expect(justBeforeCitation({ start: "2" })).toEqual({ end: "1" })
  })
  test("simple arabic number, mid-page line", () => {
    expect(justBeforeCitation({ start: "2", startLine: 20 })).toEqual({
      end: "2",
    })
  })
  test("simple arabic number, start-page line", () => {
    expect(justBeforeCitation({ start: "2", startLine: 1 })).toEqual({
      end: "1",
    })
  })
  test("simple roman numeral, no line", () => {
    expect(justBeforeCitation({ start: "ii" })).toEqual({ end: "i" })
  })
  test("simple roman numeral, mid-page line", () => {
    expect(justBeforeCitation({ start: "ii", startLine: 20 })).toEqual({
      end: "ii",
    })
  })
})

describe(justAfterCitation, () => {
  test("simple arabic number", () => {
    expect(justAfterCitation({ end: "2" })).toEqual({ start: "3" })
  })
  test("simple roman number", () => {
    expect(justAfterCitation({ end: "ii" })).toEqual({ start: "iii" })
  })
})

describe(bucketsOfAndBetweenSubtexts, () => {
  test("one with start/end", () => {
    const subtext = { citation: { start: "2", end: "3" } }
    const buckets = bucketsOfAndBetweenSubtexts([subtext])
    expect(buckets).toMatchObject([
      { citation: { end: "1" } },
      { citation: { start: "2", end: "3" } },
      { citation: { start: "4" } },
    ])
  })
  test("one with start only", () => {
    const subtext = { citation: { start: "2" } }
    const buckets = bucketsOfAndBetweenSubtexts([subtext])
    expect(buckets).toMatchObject([
      { citation: { end: "1" } },
      { citation: { start: "2" } },
    ])
  })
  test("two with a gap in between", () => {
    const subtext1 = { citation: { start: "2", end: "3" } }
    const subtext2 = { citation: { start: "5", end: "6" } }
    const buckets = bucketsOfAndBetweenSubtexts([subtext1, subtext2])
    expect(buckets).toMatchObject([
      { citation: { end: "1" } },
      { citation: { start: "2", end: "3" } },
      { citation: { start: "4", end: "4" } },
      { citation: { start: "5", end: "6" } },
      { citation: { start: "7" } },
    ])
  })
  test("two with start/end overlapping", () => {
    const subtext1 = { citation: { start: "2", end: "3" } }
    const subtext2 = { citation: { start: "3", end: "4" } }
    const buckets = bucketsOfAndBetweenSubtexts([subtext1, subtext2])
    expect(buckets).toMatchObject([
      { citation: { end: "1" } },
      { citation: { start: "2", end: "3" } },
      { citation: { start: "3", end: "4" } },
      { citation: { start: "5" } },
    ])
  })
  test("two with start/end adjacent", () => {
    const subtext1 = { citation: { start: "2", end: "3" } }
    const subtext2 = { citation: { start: "4", end: "5" } }
    const buckets = bucketsOfAndBetweenSubtexts([subtext1, subtext2])
    expect(buckets).toMatchObject([
      { citation: { end: "1" } },
      { citation: { start: "2", end: "3" } },
      { citation: { start: "4", end: "5" } },
      { citation: { start: "6" } },
    ])
  })

  test("replication of observed bug", () => {
    const subtexts = [
      { citation: { start: "vii", end: "viii" } },
      { citation: { start: "3", end: "21" } },
      { citation: { start: "22", end: "43" } },
      { citation: { start: "187", end: "205" } },
    ]
    const buckets = bucketsOfAndBetweenSubtexts(subtexts)
    expect(buckets).toMatchObject([
      { citation: { end: "vi" } },
      { citation: { start: "vii", end: "viii" } },
      { citation: { start: "ix", end: "2" } },
      { citation: { start: "3", end: "21" } },
      { citation: { start: "22", end: "43" } },
      { citation: { start: "44", end: "186" } },
      { citation: { start: "187", end: "205" } },
      { citation: { start: "206" } },
    ])
  })
})

describe(isQuoteInsideBucket, () => {
  test("clearly inside defined bucket", () => {
    const quote = { citation: { start: "3" } }
    const bucket = { citation: { start: "2", end: "4" }, quotes: [] }
    expect(isQuoteInsideBucket(quote, bucket)).toBe(true)
  })
  test("clearly before defined bucket", () => {
    const quote = { citation: { start: "1" } }
    const bucket = { citation: { start: "2", end: "4" }, quotes: [] }
    expect(isQuoteInsideBucket(quote, bucket)).toBe(false)
  })
  test("clearly after defined bucket", () => {
    const quote = { citation: { start: "5" } }
    const bucket = { citation: { start: "2", end: "4" }, quotes: [] }
    expect(isQuoteInsideBucket(quote, bucket)).toBe(false)
  })
  test("at start of page-level bucket", () => {
    const quote = { citation: { start: "2" } }
    const bucket = { citation: { start: "2", end: "4" }, quotes: [] }
    expect(isQuoteInsideBucket(quote, bucket)).toBe(true)
  })
  test("at end of page-level bucket", () => {
    const quote = { citation: { start: "4" } }
    const bucket = { citation: { start: "2", end: "4" }, quotes: [] }
    expect(isQuoteInsideBucket(quote, bucket)).toBe(true)
  })

  test("observed bug", () => {
    const bucket1 = { citation: { start: "22", end: "43" }, quotes: [] }
    const bucket2 = { citation: { start: "44", end: "186" }, quotes: [] }
    const bucket3 = { citation: { start: "187", end: "205" }, quotes: [] }
    const bucket4 = { citation: { start: "206" }, quotes: [] }
    const quote = { citation: { start: "176", startLine: 19 } }
    expect(isQuoteInsideBucket(quote, bucket1)).toBe(false)
    expect(isQuoteInsideBucket(quote, bucket2)).toBe(true)
    expect(isQuoteInsideBucket(quote, bucket3)).toBe(false)
    expect(isQuoteInsideBucket(quote, bucket4)).toBe(false)
  })
})
