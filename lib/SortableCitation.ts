/**
 * Subset of the `Citation` class that doesn't require all
 * kinds of random fields non-optionally.
 */
export type SortableCitation = {
  start?: string
  startLine?: number
  end?: string
}
