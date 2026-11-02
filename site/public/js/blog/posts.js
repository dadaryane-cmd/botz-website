/**
 * Blog articles: their addresses, reading time and the list shown on the blog page. Pure, so the
 * browser, the dev server and the publishing step all use the same rules.
 *
 * Each article is a file in content/posts with a `slug` (its address), a `date`, an `author`
 * (a key in people.json), an optional `cover` and `title`, `description` and `body` (Markdown)
 * in every language.
 */
import { DEFAULT_LANGUAGE, LANGUAGES } from '../config.js'
import { fileFromPath, fileInLanguage, languageFromPath } from '../lib/urls.js'
import { plainText } from './markdown.js'

/** Average reading speed; articles show at least one minute. */
const WORDS_PER_MINUTE = 200

/**
 * A slug is lowercase Latin letters, digits and hyphens: "google-business-profile". It may not end
 * in a language ("-en", "-ru"): post-<slug>-en.html is the article's English address.
 */
export const isSlug = (slug) =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(slug)) &&
  languageFromPath(`${slug}.html`) === DEFAULT_LANGUAGE

/** The article's page: post-<slug>.html (written for every article when the site is published). */
export const postFile = (slug) => `post-${slug}.html`

/** The slug in an article's address, in any language ("…/post-google-business-profile-en.html"). */
export function slugFromPath(pathname) {
  const file = fileInLanguage(fileFromPath(pathname), DEFAULT_LANGUAGE)
  const slug = file.match(/^post-(.+)\.html$/)?.[1]
  return slug && isSlug(slug) ? slug : null
}

/** Minutes to read a Markdown text. */
export function readingMinutes(markdown) {
  const words = plainText(markdown).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

/** What the blog page needs of an article: everything except the text, plus reading times. */
export function indexEntry(post) {
  const { body, ...summary } = post
  const minutes = Object.fromEntries(
    LANGUAGES.map((language) => [language, readingMinutes(body?.[language])]),
  )
  return { ...summary, minutes }
}

/** Newest first; articles dated in the future wait (so one can be prepared in advance). */
export function publishedNewestFirst(posts, today = new Date().toISOString().slice(0, 10)) {
  return posts
    .filter((post) => isSlug(post.slug) && post.date && post.date <= today)
    .sort((first, second) => second.date.localeCompare(first.date))
}

/** The blog list: what content/posts/index.json holds. */
export const postIndex = (posts, today) => publishedNewestFirst(posts, today).map(indexEntry)
