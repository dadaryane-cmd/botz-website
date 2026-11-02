import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import {
  articlePage,
  earlierAddresses,
  redirectPage,
  withBase,
  withNoindex,
} from '../scripts/build-site.js'
import { LANGUAGES } from '../public/js/config.js'
import { people } from '../public/js/content/index.js'
import { formatDate } from '../public/js/lib/format.js'
import { isSafeHref, parseInline, parseMarkdown } from '../public/js/blog/markdown.js'
import {
  isSlug,
  postFile,
  postIndex,
  publishedNewestFirst,
  readingMinutes,
} from '../public/js/blog/posts.js'

const publicDir = new URL('../public/', import.meta.url)
const postsDir = new URL('content/posts/', publicDir)
const postFiles = readdirSync(postsDir)
  .filter((file) => file.endsWith('.json') && file !== 'index.json')
  .map((file) => [file, JSON.parse(readFileSync(new URL(file, postsDir), 'utf8'))])
const posts = postFiles.map(([, post]) => post)
const peopleKeys = people.map((person) => person.key)

/** Every link and picture address in an article's Markdown. */
function links(markdown) {
  const found = []
  const visit = (parts) => {
    for (const part of parts ?? []) {
      if (part.type === 'link') found.push(part.href)
      visit(part.children)
    }
  }
  for (const block of parseMarkdown(markdown)) {
    if (block.type === 'image') found.push(block.src)
    visit(block.children)
    for (const item of block.items ?? []) visit(item)
  }
  return found
}

describe('markdown', () => {
  it('reads headings, paragraphs, lists, quotes and images', () => {
    const blocks = parseMarkdown(
      '## Why\n\nFirst line\nsame paragraph.\n\n- one\n- two\n\n1. first\n2. second\n\n> A quote\n\n![Map](images/map.webp)',
    )
    assert.deepEqual(
      blocks.map((block) => block.type),
      ['heading', 'paragraph', 'list', 'list', 'quote', 'image'],
    )
    assert.equal(blocks[0].level, 2)
    assert.deepEqual(blocks[1].children, [{ type: 'text', text: 'First line same paragraph.' }])
    assert.equal(blocks[2].ordered, false)
    assert.equal(blocks[3].ordered, true)
    assert.equal(blocks[3].items.length, 2)
    assert.deepEqual(blocks[5], { type: 'image', alt: 'Map', src: 'images/map.webp' })
  })

  it('keeps counting a numbered list that continues after a heading', () => {
    const [list] = parseMarkdown('5. five\n6. six')
    assert.equal(list.start, 5)
  })

  it('keeps "#" for the article title: headings in the text start at level 2', () => {
    assert.equal(parseMarkdown('# Title')[0].level, 2)
    assert.equal(parseMarkdown('### Detail')[0].level, 3)
  })

  it('reads bold, italic, code and links', () => {
    assert.deepEqual(parseInline('a **b** *c* _d_ `e` [f](https://x.am)'), [
      { type: 'text', text: 'a ' },
      { type: 'strong', children: [{ type: 'text', text: 'b' }] },
      { type: 'text', text: ' ' },
      { type: 'em', children: [{ type: 'text', text: 'c' }] },
      { type: 'text', text: ' ' },
      { type: 'em', children: [{ type: 'text', text: 'd' }] },
      { type: 'text', text: ' ' },
      { type: 'code', text: 'e' },
      { type: 'text', text: ' ' },
      { type: 'link', href: 'https://x.am', children: [{ type: 'text', text: 'f' }] },
    ])
  })

  it('never links to javascript: and the like', () => {
    assert.equal(isSafeHref('javascript:alert(1)'), false)
    assert.equal(isSafeHref('data:text/html,x'), false)
    for (const href of ['https://botz.am', 'mailto:a@b.am', 'tel:+374', 'pricing.html#faq']) {
      assert.equal(isSafeHref(href), true, href)
    }
    assert.deepEqual(parseInline('[x](javascript:alert)')[0], {
      type: 'text',
      text: '[x](javascript:alert)',
    })
    assert.deepEqual(parseMarkdown('![x](javascript:alert)'), [])
  })
})

describe('blog articles', () => {
  const path = { hy: 'hodvac', en: 'article', ru: 'statya' }

  it('are linked to as post-<id>.html, with ids of lowercase Latin letters', () => {
    assert.equal(postFile('google-maps'), 'post-google-maps.html')
    assert.equal(isSlug('Google Maps'), false)
    assert.equal(isSlug('seo-for-russian-speakers'), true)
  })

  it('show at least one minute of reading, about 200 words a minute', () => {
    assert.equal(readingMinutes(''), 1)
    assert.equal(readingMinutes('word '.repeat(1000)), 5)
  })

  it('are listed newest first, without future, broken or unaddressed ones', () => {
    const list = publishedNewestFirst(
      [
        { slug: 'old', path, date: '2026-01-01' },
        { slug: 'new', path, date: '2026-03-01' },
        { slug: 'later', path, date: '2099-01-01' },
        { slug: 'Bad Slug', path, date: '2026-02-01' },
        { slug: 'no-address', date: '2026-02-01' },
        { slug: 'half-address', path: { ...path, ru: null }, date: '2026-02-01' },
      ],
      '2026-06-01',
    )
    assert.deepEqual(
      list.map((post) => post.slug),
      ['new', 'old'],
    )
  })

  it('leave the text out of the list, with reading times per language', () => {
    const body = { hy: 'x', en: 'word '.repeat(400), ru: 'y' }
    const [entry] = postIndex([{ slug: 'a', path, date: '2026-01-01', body }], '2026-06-01')
    assert.equal(entry.body, undefined)
    assert.deepEqual(entry.minutes, { hy: 1, en: 2, ru: 1 })
  })

  for (const [file, post] of postFiles) {
    it(`"${post.slug}" is complete in every language`, () => {
      assert.ok(isSlug(post.slug), 'slug: lowercase Latin letters, digits and hyphens')
      assert.equal(file, `${post.slug}.json`, 'the file is named after the slug')
      assert.match(post.date, /^\d{4}-\d{2}-\d{2}$/)
      assert.ok(peopleKeys.includes(post.author), `unknown author "${post.author}"`)
      for (const field of ['title', 'description', 'body']) {
        for (const language of LANGUAGES) {
          assert.ok(post[field]?.[language]?.trim(), `${field} → ${language}`)
        }
      }
    })

    it(`"${post.slug}" links only to pages and pictures that exist`, () => {
      const targets = [post.cover, ...LANGUAGES.flatMap((language) => links(post.body[language]))]
      for (const target of targets.filter(Boolean)) {
        if (/^(https?:|mailto:|tel:|#)/.test(target)) continue
        const path = target.split(/[?#]/)[0]
        assert.ok(existsSync(new URL(path, publicDir)), `missing ${target}`)
      }
    })
  }

  it('have different slugs', () => {
    const slugs = posts.map((post) => post.slug)
    assert.equal(new Set(slugs).size, slugs.length)
  })
})

describe('article dates', () => {
  it('are written in each language, as the calendar day of the date', () => {
    assert.equal(formatDate('2026-11-02', 'hy'), '2 նոյեմբերի, 2026 թ.')
    assert.equal(formatDate('2026-01-31', 'hy'), '31 հունվարի, 2026 թ.')
    assert.equal(formatDate('2026-11-02', 'en'), '2 November 2026')
    assert.match(formatDate('2026-11-02', 'ru'), /^2 ноября 2026/)
    assert.equal(formatDate('soon', 'en'), 'soon')
  })
})

describe('publishing', () => {
  it("writes each article's page from post.html, naming it and fetching it up front", () => {
    const template = readFileSync(new URL('post.html', publicDir), 'utf8')
    const html = articlePage(template, 'google-business-profile')
    const preload =
      '<link rel="preload" href="content/posts/google-business-profile.json" as="fetch" crossorigin />'
    const named = 'data-page="post" data-post="google-business-profile"'
    assert.ok(html.includes(preload))
    assert.ok(html.includes(named))
    // Before the modules, inside the generated block, and the rest of the page unchanged.
    assert.ok(html.indexOf(preload) < html.indexOf('<link rel="modulepreload"'))
    assert.ok(html.indexOf(preload) < html.indexOf('<!-- preload:end -->'))
    assert.equal(html.replace(`${preload}\n    `, '').replace(named, 'data-page="post"'), template)
  })

  it('gives every page the site’s root as its base', () => {
    const page = readFileSync(new URL('about.html', publicDir), 'utf8')
    const published = withBase(page, '/botz-website/')
    assert.ok(published.includes('<base href="/botz-website/" />'))
    // Before anything the page loads.
    assert.ok(published.indexOf('<base') < published.indexOf('<link'))
  })

  it('redirects every earlier address to the page’s address now', () => {
    const routes = {
      pages: {
        home: {},
        about: { hy: 'mer-masin', en: 'about', ru: 'o-nas' },
        services: { hy: 'tsarayutyunner', en: 'services', ru: 'uslugi' },
        blog: { hy: 'blog', en: 'blog', ru: 'blog' },
      },
      posts: { maps: { hy: 'qartez', en: 'maps', ru: 'karty' } },
    }
    const redirects = Object.fromEntries(
      earlierAddresses(routes).map(({ file, path }) => [file, path]),
    )
    assert.equal(redirects['about.html'], 'mer-masin/')
    assert.equal(redirects['about-ru.html'], 'ru/o-nas/')
    assert.equal(redirects['index-en.html'], 'en/')
    assert.equal(redirects['index.html'], undefined, 'index.html is the home page itself')
    assert.equal(redirects['post-maps-en.html'], 'en/blog/maps/')
    assert.equal(redirects['seo.html'], 'tsarayutyunner/#seo')
  })

  it('writes redirect pages that keep search engines, ?queries and #anchors on the new address', () => {
    const html = redirectPage('https://example.com/ru/o-nas/')
    assert.match(html, /<meta name="robots" content="noindex" \/>/)
    assert.match(html, /<link rel="canonical" href="https:\/\/example.com\/ru\/o-nas\/" \/>/)
    assert.match(html, /http-equiv="refresh" content="0; url=https:\/\/example.com\/ru\/o-nas\/"/)
    assert.match(
      html,
      /location\.replace\("https:\/\/example.com\/ru\/o-nas\/" \+ location\.search \+ location\.hash\)/,
    )
    // A new address with its own anchor keeps it.
    assert.match(redirectPage('https://example.com/a/#seo'), /\+ location\.search \+ ''\)/)
  })

  it('keeps preview pages out of search results, once', () => {
    const noindex = '<meta name="robots" content="noindex" />'
    const page = readFileSync(new URL('index.html', publicDir), 'utf8')
    const preview = withNoindex(page)
    assert.equal(preview.split(noindex).length, 2)
    assert.ok(preview.indexOf(noindex) < preview.indexOf('</head>'))
    assert.equal(withNoindex(preview), preview)
  })
})
