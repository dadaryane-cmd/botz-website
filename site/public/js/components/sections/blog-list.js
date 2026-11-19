/**
 * A list of articles (section type "blogList"): a card each, with the cover, date and reading
 * time, title, short description and author. The whole card links to the article. On the blog
 * page it lists them all, newest first; elsewhere (a service page's "Read more") the articles named
 * in `posts`, in that order.
 */
import { chosenPosts, postFile } from '../../blog/posts.js'
import { h } from '../../lib/dom.js'
import { t, ui } from '../../lib/i18n.js'
import { publishedPosts } from '../../lib/page.js'
import { REVEAL } from '../../lib/reveal.js'
import { authorLine, cover, dateAndReadingTime } from '../blog/post-meta.js'
import { heading, lead, section } from './section.js'

export function renderBlogList(config) {
  const isSelection = config.posts?.length > 0
  const posts = chosenPosts(publishedPosts(), config.posts)
  // A selection sits under its own heading on another page: its card titles are a level below.
  const titleLevel = isSelection ? 'h3' : 'h2'
  if (isSelection && posts.length === 0) return null
  return section(
    config,
    heading(config.heading),
    lead(config.intro),
    posts.length > 0
      ? h(
          'ul',
          { class: 'post-list' },
          posts.map((post) => postCard(post, titleLevel)),
        )
      : h('p', { class: 'muted' }, ui('blog', 'empty')),
  )
}

function postCard(post, titleLevel) {
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
        h(titleLevel, { class: 'post-card-title' }, t(post.title)),
        h('p', { class: 'muted' }, t(post.description)),
        h('p', { class: 'post-meta' }, authorLine(post.author)),
      ),
    ),
  )
}
