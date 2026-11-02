import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { LANGUAGES, PAGES } from '../public/js/config.js'
import {
  isSlug,
  languageOfPath,
  localizeHref,
  pagePath,
  postPath,
  resolvePath,
  routeTable,
} from '../public/js/lib/urls.js'

const routes = {
  pages: {
    home: {},
    services: { hy: 'tsarayutyunner', en: 'services', ru: 'uslugi' },
    pricing: { hy: 'gner', en: 'pricing', ru: 'ceny' },
    blog: { hy: 'blog', en: 'blog', ru: 'blog' },
  },
  posts: { 'google-maps': { hy: 'google-qartez', en: 'google-maps', ru: 'google-karty' } },
}

describe('addresses', () => {
  it('put Armenian at the root and the other languages in a folder', () => {
    assert.equal(pagePath(routes, 'home', 'hy'), './')
    assert.equal(pagePath(routes, 'home', 'ru'), 'ru/')
    assert.equal(pagePath(routes, 'services', 'hy'), 'tsarayutyunner/')
    assert.equal(pagePath(routes, 'services', 'en'), 'en/services/')
    assert.equal(pagePath(routes, 'nothing', 'en'), null)
  })

  it('put articles inside the blog', () => {
    assert.equal(postPath(routes, 'google-maps', 'hy'), 'blog/google-qartez/')
    assert.equal(postPath(routes, 'google-maps', 'ru'), 'ru/blog/google-karty/')
    assert.equal(postPath(routes, 'missing', 'ru'), null)
  })

  it('are read back to the page or article and its language', () => {
    assert.deepEqual(resolvePath(routes, ''), { language: 'hy', page: 'home' })
    assert.deepEqual(resolvePath(routes, 'en/'), { language: 'en', page: 'home' })
    assert.deepEqual(resolvePath(routes, 'ru/uslugi/'), { language: 'ru', page: 'services' })
    assert.deepEqual(resolvePath(routes, 'gner/index.html'), { language: 'hy', page: 'pricing' })
    assert.deepEqual(resolvePath(routes, 'en/blog/google-maps/'), {
      language: 'en',
      post: 'google-maps',
    })
    // An address in the wrong language, or one that does not exist.
    assert.equal(resolvePath(routes, 'ru/services/'), null)
    assert.equal(resolvePath(routes, 'gner/extra/'), null)
    assert.equal(resolvePath(routes, 'blog/unknown/'), null)
  })

  it('use slugs of lowercase Latin letters, digits and hyphens, never missing', () => {
    assert.equal(isSlug('seo-prodvizhenie'), true)
    for (const slug of ['SEO', 'seo prodvizhenie', '-seo', 'seo-', '', undefined, null]) {
      assert.equal(isSlug(slug), false, String(slug))
    }
  })

  it('know their language from the folder', () => {
    assert.equal(languageOfPath('ru/blog/x/'), 'ru')
    assert.equal(languageOfPath('mer-masin/'), 'hy')
    assert.equal(languageOfPath('fr/'), 'hy')
  })
})

describe('links to the site’s pages', () => {
  it('lead to the page in this language, keeping the query and anchor', () => {
    assert.equal(localizeHref('pricing.html?cat=smm', 'ru', routes), 'ru/ceny/?cat=smm')
    assert.equal(localizeHref('services.html#seo', 'hy', routes), 'tsarayutyunner/#seo')
    assert.equal(localizeHref('index.html', 'hy', routes), './')
    assert.equal(localizeHref('index.html', 'en', routes), 'en/')
    assert.equal(localizeHref('post-google-maps.html', 'en', routes), 'en/blog/google-maps/')
  })

  it('leave other links alone', () => {
    for (const href of [
      '#contact',
      'https://example.com/a.html',
      'downloads/smm.pdf',
      'tel:+374',
      'unknown.html',
    ]) {
      assert.equal(localizeHref(href, 'ru', routes), href)
    }
  })
})

describe('the site’s own addresses', () => {
  const contentDir = new URL('../public/content/', import.meta.url)
  const readJson = (path) => JSON.parse(readFileSync(new URL(path, contentDir), 'utf8'))
  const pages = Object.fromEntries(PAGES.map((key) => [key, readJson(`pages/${key}.json`)]))
  const posts = readdirSync(new URL('posts/', contentDir))
    .filter((file) => file.endsWith('.json') && file !== 'index.json')
    .map((file) => readJson(`posts/${file}`))
  const table = routeTable(pages, posts)
  // Folders of the published site an Armenian page address must not take.
  const RESERVED = [
    ...LANGUAGES,
    'content',
    'css',
    'js',
    'images',
    'fonts',
    'media',
    'downloads',
    'preview',
  ]

  for (const [kind, entries] of Object.entries(table)) {
    it(`give every ${kind === 'pages' ? 'page' : 'article'} a valid address in every language`, () => {
      for (const [key, slugs] of Object.entries(entries)) {
        if (key === 'home') continue
        for (const language of LANGUAGES) {
          assert.ok(isSlug(slugs[language]), `${key} → ${language}: "${slugs[language]}"`)
        }
      }
    })

    it(`never give two ${kind} the same address`, () => {
      for (const language of LANGUAGES) {
        const slugs = Object.values(entries)
          .map((slugsOf) => slugsOf[language])
          .filter(Boolean)
        assert.equal(new Set(slugs).size, slugs.length, language)
      }
    })
  }

  it('keep Armenian page addresses clear of the language and file folders', () => {
    for (const [key, slugs] of Object.entries(table.pages)) {
      assert.ok(!RESERVED.includes(slugs.hy), `${key}: "${slugs.hy}" is a folder of the site`)
    }
  })
})
