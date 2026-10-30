/**
 * Split text into words and letters for letter-by-letter animation. Letters are graphemes, so a
 * letter with an accent or an emoji is never cut in two.
 */
const graphemes =
  typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null

export function splitLetters(word) {
  if (!graphemes) return Array.from(word)
  return Array.from(graphemes.segment(word), (part) => part.segment)
}

/** Words (separated by any whitespace), each as a list of letters. */
export const splitWords = (text) => text.split(/\s+/).filter(Boolean).map(splitLetters)
