/**
 * An article page: a link back to the blog, the title, author, date and reading time, the cover
 * and the text, then an invitation to the free marketing audit. A missing article (an old or
 * mistyped address) says so and links to the blog.
 */
import { readingMinutes } from '../../blog/posts.js'
import { h } from '../../lib/dom.js'
import { t, ui, uiInEveryLanguage } from '../../lib/i18n.js'
import { updateSelection } from '../../pricing/selection.js'
import { authorLine, cover, dateAndReadingTime } from './post-meta.js'
import { renderMarkdown } from './markdown.js'

export function renderArticle(post) {
  if (!post) return missingArticle()
  // The list carries reading times; a single article works its own out.
  const withMinutes = {
    ...post,
    minutes: Object.fromEntries(
      Object.entries(post.body ?? {}).map(([language, text]) => [language, readingMinutes(text)]),
    ),
  }
  return h(
    'article',
    { class: 'section article' },
    h(
      'div',
      { class: 'container container-narrow' },
      h('a', { class: 'link-back', href: 'blog.html' }, ui('blog', 'backToBlog')),
      h('h1', { class: 'article-title' }, t(post.title)),
      h(
        'p',
        { class: 'post-meta article-meta' },
        authorLine(post.author),
        dateAndReadingTime(withMinutes),
      ),
      cover(post, { eager: true }),
      h('div', { class: 'article-body' }, renderMarkdown(t(post.body))),
      auditInvitation(),
    ),
  )
}

function auditInvitation() {
  return h(
    'aside',
    { class: 'card article-cta' },
    h('p', { class: 'article-cta-title' }, ui('blog', 'ctaTitle')),
    h('p', { class: 'muted' }, ui('blog', 'ctaText')),
    h(
      'a',
      {
        class: 'btn btn-primary',
        href: 'contact.html',
        onclick: () => updateSelection({ note: uiInEveryLanguage('blog', 'ctaMessage') }),
      },
      ui('blog', 'ctaButton'),
    ),
  )
}

function missingArticle() {
  return h(
    'section',
    { class: 'section' },
    h(
      'div',
      { class: 'container container-narrow' },
      h('h1', { class: 'article-title' }, ui('blog', 'missingTitle')),
      h('p', { class: 'muted' }, ui('blog', 'missingText')),
      h('a', { class: 'btn btn-primary', href: 'blog.html' }, ui('blog', 'backToBlog')),
    ),
  )
}
