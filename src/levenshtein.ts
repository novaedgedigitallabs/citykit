/**
 * Calculate the Levenshtein distance between two strings.
 * Uses the iterative matrix approach with O(min(m,n)) space.
 *
 * @param a - First string
 * @param b - Second string
 * @returns Edit distance (number of insertions, deletions, or substitutions)
 */
export function levenshtein(a: string, b: string): number {
  const aLen = a.length;
  const bLen = b.length;

  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  // Use shorter string for column to minimize space
  if (aLen > bLen) return levenshtein(b, a);

  let prevRow = new Array<number>(aLen + 1);
  let currRow = new Array<number>(aLen + 1);

  for (let i = 0; i <= aLen; i++) {
    prevRow[i] = i;
  }

  for (let j = 1; j <= bLen; j++) {
    currRow[0] = j;
    for (let i = 1; i <= aLen; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow[i] = Math.min(
        currRow[i - 1] + 1,       // insertion
        prevRow[i] + 1,           // deletion
        prevRow[i - 1] + cost     // substitution
      );
    }
    [prevRow, currRow] = [currRow, prevRow];
  }

  return prevRow[aLen];
}
