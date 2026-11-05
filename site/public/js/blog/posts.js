/**
 * Blog articles: reading time and the list shown on the blog page. Pure, so the browser, the dev
 * server and the publishing step all use the same rules.
 *
 * Each article is a file in content/posts with a `slug` (its id and file name), a `path` (its
 * address in each language, js/lib/urls.js), a `date`, an `author` (a key in people.json), an
 * optional `cover` and `title`, `description` and `body` (Markdown) in every language.
 */
import { LANGUAGES } from '../config.js'
import { isSlug } from '../lib/urls.js'
import { plainText } from './markdown.js'

export { isSlug }

/** Average reading speed; articles show at least one minute. */
const WORDS_PER_MINUTE = 200

/** How content links to an article: "post-<slug>.html" (pointed at its address by urls.js). */
export const postFile = (slug) => `post-${slug}.html`

/** Minutes to read a Markdown text. */
export function readingMinutes(markdown) {
  const words = plainText(markdown).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

/** What the blog page needs of an article: everything except the text, plus reading times. */
function indexEntry(post) {
  const { body, ...summary } = post
  const minutes = Object.fromEntries(
    LANGUAGES.map((language) => [language, readingMinutes(body?.[language])]),
  )
  return { ...summary, minutes }
}

/** Newest first; articles dated in the future wait (so one can be prepared in advance). */
export function publishedNewestFirst(posts, today = new Date().toISOString().slice(0, 10)) {
  return posts
    .filter((post) => isSlug(post.slug) && hasAddresses(post) && post.date && post.date <= today)
    .sort((first, second) => second.date.localeCompare(first.date))
}

/** An article waits until it has an address in every language (it is saved without one). */
const hasAddresses = (post) => LANGUAGES.every((language) => isSlug(post.path?.[language]))

/** The blog list: what content/posts/index.json holds. */
export const postIndex = (posts, today) => publishedNewestFirst(posts, today).map(indexEntry)
