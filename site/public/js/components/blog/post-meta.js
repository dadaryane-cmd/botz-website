/**
 * Pieces shared by the blog list and the article page: the author with photo, the date and
 * reading time, and the cover (or, without one, a quiet branded panel of the same shape).
 */
import { people } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { formatDate } from '../../lib/format.js'
import { getLanguage, t, ui } from '../../lib/i18n.js'
import { logoPicture } from '../logo.js'
import { picture } from '../picture.js'
import { portrait } from '../sections/team.js'

export function authorLine(authorKey) {
  const person = people.find((candidate) => candidate.key === authorKey)
  if (!person) return null
  return h(
    'span',
    { class: 'post-author' },
    portrait(person, 'avatar avatar-small'),
    h('span', null, t(person.name)),
  )
}

/** "2 November 2026 · 3 min read" */
export function dateAndReadingTime(post) {
  const minutes = post.minutes?.[getLanguage()] ?? 1
  return h(
    'span',
    { class: 'post-date' },
    h('time', { datetime: post.date }, formatDate(post.date)),
    ` · ${ui('blog', 'readingTime', { n: minutes })}`,
  )
}

/** 16:9, so the space is kept while it loads. `eager` for the cover at the top of an article. */
export function cover(post, { eager = false } = {}) {
  if (!post.cover) {
    return h(
      'div',
      { class: 'post-cover post-cover-empty', 'aria-hidden': 'true' },
      // The light-on-dark logo: the panel is night navy in both themes (blog.css).
      logoPicture('dark', {
        alt: '',
        class: 'post-cover-logo',
        sizes: '200px',
        width: 600,
        height: 235,
      }),
    )
  }
  return picture({
    class: 'post-cover',
    src: post.cover,
    alt: t(post.coverAlt) || '',
    loading: eager ? 'eager' : 'lazy',
    fetchpriority: eager ? 'high' : null,
    decoding: 'async',
  })
}
