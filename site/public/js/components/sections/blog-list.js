/**
 * The blog page's list of articles (section type "blogList"): a card each, newest first, with
 * the cover, date and reading time, title, short description and author. The whole card links
 * to the article.
 */
import { postFile } from '../../blog/posts.js'
import { h } from '../../lib/dom.js'
import { t, ui } from '../../lib/i18n.js'
import { publishedPosts } from '../../lib/page.js'
import { REVEAL } from '../../lib/reveal.js'
import { authorLine, cover, dateAndReadingTime } from '../blog/post-meta.js'
import { heading, lead, section } from './section.js'

export function renderBlogList(config) {
  const posts = publishedPosts()
  return section(
    config,
    heading(config.heading),
    lead(config.intro),
    posts.length > 0
      ? h('ul', { class: 'post-list' }, posts.map(postCard))
      : h('p', { class: 'muted' }, ui('blog', 'empty')),
  )
}

function postCard(post) {
  return h(
    'li',
    REVEAL,
    h(
      'a',
      { class: 'post-card', href: postFile(post.slug) },
      cover(post),
      h(
        'div',
        { class: 'post-card-text' },
        h('p', { class: 'post-meta' }, dateAndReadingTime(post)),
        h('h2', { class: 'post-card-title' }, t(post.title)),
        h('p', { class: 'muted' }, t(post.description)),
        h('p', { class: 'post-meta' }, authorLine(post.author)),
      ),
    ),
  )
}
