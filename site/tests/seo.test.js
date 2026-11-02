import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { ARTICLE_PAGE, LANGUAGES, PAGES } from '../public/js/config.js'
import { routeTable } from '../public/js/lib/urls.js'
import { alternates, pageUrl } from '../scripts/seo/addresses.js'
import { escapeHtml, scriptJson, seoTags, withSeoTags } from '../scripts/seo/head-tags.js'
import { pageDescription, publishedPages } from '../scripts/seo/pages.js'
import { robotsTxt, sitemapXml } from '../scripts/seo/sitemap.js'

const publicDir = new URL('../public/', import.meta.url)
const readJson = (path) => JSON.parse(readFileSync(new URL(path, publicDir), 'utf8'))
const readHtml = (file) => readFileSync(new URL(file, publicDir), 'utf8')

const site = readJson('content/site.json')
const pages = Object.fromEntries(PAGES.map((key) => [key, readJson(`content/pages/${key}.json`)]))
const post = {
  slug: 'google-business-profile',
  path: { hy: 'google-qartez', en: 'google-maps', ru: 'google-karty' },
  date: '2026-11-02',
  author: 'edgar',
  cover: null,
  title: { hy: 'Վերնագիր', en: 'A "title" <b>', ru: 'Заголовок' },
  description: { hy: 'Նկարագիր', en: 'About it', ru: 'Описание' },
}
const routes = routeTable(pages, [post])
const content = {
  site,
  people: readJson('content/people.json').people,
  navigation: readJson('content/navigation.json'),
  catalog: readJson('content/catalog.json'),
  routes,
}
const entries = publishedPages({ pages, posts: [post] })
const entryOf = (key) => entries.find((entry) => (key === 'post' ? entry.post : entry.key === key))
const SITE = 'https://example.com/botz/'

describe('addresses for search engines', () => {
  it('are full addresses, the Armenian home page being the site itself', () => {
    assert.equal(pageUrl(SITE, routes, entryOf('home'), 'hy'), SITE)
    assert.equal(pageUrl(SITE, routes, entryOf('home'), 'en'), `${SITE}en/`)
    assert.equal(pageUrl(SITE, routes, entryOf('about'), 'ru'), `${SITE}ru/o-nas/`)
    assert.equal(pageUrl(SITE, routes, entryOf('post'), 'ru'), `${SITE}ru/blog/google-karty/`)
  })

  it('name every language and an x-default (Armenian)', () => {
    assert.deepEqual(alternates(SITE, routes, entryOf('about')), [
      { hreflang: 'hy', href: `${SITE}mer-masin/` },
      { hreflang: 'en', href: `${SITE}en/about/` },
      { hreflang: 'ru', href: `${SITE}ru/o-nas/` },
      { hreflang: 'x-default', href: `${SITE}mer-masin/` },
    ])
  })

  it('start from the site address in site.json', () => {
    assert.match(site.url, /^https:\/\/\S+\/$/)
  })
})

describe('head tags', () => {
  it('are escaped, and JSON-LD can never close its script element', () => {
    assert.equal(escapeHtml('a & "b" <c>'), 'a &amp; &quot;b&quot; &lt;c&gt;')
    assert.equal(scriptJson({ text: '</script>' }), '{"text":"\\u003c/script>"}')
  })

  it('give each page its title, description, canonical, hreflang and schema in each language', () => {
    for (const entry of entries) {
      for (const language of LANGUAGES) {
        const page = pageDescription(entry, language, content)
        const name = `${entry.key ?? entry.post.slug} ${language}`
        assert.ok(page.title.trim() && page.description.trim(), name)
        assert.equal(page.url, pageUrl(site.url, routes, entry, language))
        assert.equal(page.alternates.length, LANGUAGES.length + 1)
        const tags = seoTags(page).join('\n')
        assert.match(tags, /<link rel="canonical" href="https:/)
        assert.match(tags, /hreflang="x-default"/)
        assert.match(tags, /<script type="application\/ld\+json">/)
      }
    }
  })

  it('give each page a title of at most 60 characters and a description of at most 160', () => {
    for (const entry of entries.filter((candidate) => candidate.page)) {
      for (const language of LANGUAGES) {
        const page = pageDescription(entry, language, content)
        assert.ok(page.title.length <= 60, `${entry.key} ${language}: "${page.title}"`)
        assert.ok(page.description.length <= 160, `${entry.key} ${language}: description`)
      }
    }
  })

  it('give no two pages the same title or description, in any language', () => {
    const real = publishedPages({ pages, posts: [] })
    for (const field of ['title', 'description']) {
      const values = LANGUAGES.flatMap((language) =>
        real.map((entry) => pageDescription(entry, language, content)[field]),
      )
      const repeated = values.filter((value, index) => values.indexOf(value) !== index)
      assert.deepEqual(repeated, [], `the same ${field} twice`)
    }
  })

  it('are written into the page between the markers, with the page language', () => {
    for (const key of [...PAGES, ARTICLE_PAGE]) {
      const file = key === 'home' ? 'index.html' : `${key}.html`
      const page = pageDescription(entryOf(key), 'ru', content)
      const published = withSeoTags(readHtml(file), page)
      assert.match(published, /^<!doctype html>\n<html lang="ru"/, file)
      assert.equal(published.split('<title>').length, 2, `${file}: one title`)
      assert.equal(published.split('og:image').length, 2, `${file}: one og:image`)
    }
  })
})

describe('schema.org', () => {
  const schemaOf = (key, language = 'en') =>
    pageDescription(entryOf(key), language, content).schema['@graph']
  const types = (graph) => graph.map((node) => node['@type'])

  it('describes the agency on every page, with its contact details', () => {
    for (const entry of entries) {
      const [agency] = pageDescription(entry, 'hy', content).schema['@graph']
      assert.equal(agency['@type'], 'ProfessionalService')
      assert.equal(agency['@id'], `${site.url}#organization`)
      assert.equal(agency.telephone, site.phoneE164)
      assert.equal(agency.founder.length, content.people.length)
    }
  })

  it('adds the website on the home page, breadcrumbs elsewhere', () => {
    assert.deepEqual(types(schemaOf('home')).slice(0, 2), ['ProfessionalService', 'WebSite'])
    const crumbs = schemaOf('about').find((node) => node['@type'] === 'BreadcrumbList')
    assert.deepEqual(
      crumbs.itemListElement.map((step) => [step.name, step.item]),
      [
        ['Home', `${site.url}en/`],
        ['About', `${site.url}en/about/`],
      ],
    )
  })

  it('describes each article with its author and date', () => {
    const graph = schemaOf('post')
    const article = graph.find((node) => node['@type'] === 'BlogPosting')
    assert.equal(article.headline, 'A "title" <b>')
    assert.equal(article.author.name, 'Edgar')
    assert.equal(article.datePublished, '2026-11-02')
    assert.equal(article.mainEntityOfPage, `${site.url}en/blog/google-maps/`)
    const crumbs = graph.find((node) => node['@type'] === 'BreadcrumbList')
    assert.deepEqual(
      crumbs.itemListElement.map((step) => step.name),
      ['Home', 'Blog', 'A "title" <b>'],
    )
  })

  it('describes each service on the Services page, with its prices in AMD', () => {
    const offered = schemaOf('services', 'ru').filter((node) => node['@type'] === 'Service')
    assert.deepEqual(
      offered.map((node) => node.url),
      ['smm', 'seo', 'website', 'strategy'].map((id) => `${site.url}ru/uslugi/#${id}`),
    )
    const smm = offered[0]
    assert.equal(smm.provider['@id'], `${site.url}#organization`)
    const start = smm.hasOfferCatalog.itemListElement[0]
    assert.deepEqual(start.priceSpecification, {
      '@type': 'UnitPriceSpecification',
      minPrice: 70000,
      maxPrice: 79000,
      priceCurrency: 'AMD',
      unitCode: 'MON',
    })
    const website = offered[2].hasOfferCatalog.itemListElement[0]
    assert.equal(website.priceSpecification.minPrice, 299000)
    // Strategy has no packages: no prices to show.
    assert.equal(offered[3].hasOfferCatalog, undefined)
  })

  it('lists questions and answers only where the full list is (not a short list linking to it)', () => {
    const pagesWithFaq = PAGES.filter((key) => types(schemaOf(key)).includes('FAQPage'))
    assert.deepEqual(pagesWithFaq, ['pricing'])
  })
})

describe('sitemap.xml and robots.txt', () => {
  it('list every page in every language, each with its other languages', () => {
    const listed = [entryOf('home'), { ...entryOf('about'), lastModified: '2026-11-02' }]
    const xml = sitemapXml(SITE, routes, listed)
    assert.equal(xml.split('<url>').length - 1, 2 * LANGUAGES.length)
    assert.equal(xml.split('<xhtml:link').length - 1, 2 * LANGUAGES.length * (LANGUAGES.length + 1))
    assert.match(xml, new RegExp(`<loc>${SITE}ru/o-nas/</loc>\\n    <lastmod>2026-11-02</lastmod>`))
    assert.match(xml, new RegExp(`<loc>${SITE}</loc>`))
  })

  it('let everything be crawled except the preview, and name the sitemap', () => {
    assert.equal(
      robotsTxt(SITE),
      `User-agent: *\nAllow: /\nDisallow: /botz/preview/\n\nSitemap: ${SITE}sitemap.xml\n`,
    )
  })
})
