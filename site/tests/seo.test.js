import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { ARTICLE_PAGE, LANGUAGES, PAGES } from '../public/js/config.js'
import { alternates, pageUrl } from '../scripts/seo/addresses.js'
import { escapeHtml, scriptJson, seoTags, withSeoTags } from '../scripts/seo/head-tags.js'
import { pageDescription, publishedPages } from '../scripts/seo/pages.js'
import { robotsTxt, sitemapXml } from '../scripts/seo/sitemap.js'

const publicDir = new URL('../public/', import.meta.url)
const readJson = (path) => JSON.parse(readFileSync(new URL(path, publicDir), 'utf8'))
const readHtml = (file) => readFileSync(new URL(file, publicDir), 'utf8')

const site = readJson('content/site.json')
const content = {
  site,
  people: readJson('content/people.json').people,
  navigation: readJson('content/navigation.json'),
}
const pages = Object.fromEntries(PAGES.map((key) => [key, readJson(`content/pages/${key}.json`)]))
const post = {
  slug: 'google-business-profile',
  date: '2026-11-02',
  author: 'edgar',
  cover: null,
  title: { hy: 'Վերնագիր', en: 'A "title" <b>', ru: 'Заголовок' },
  description: { hy: 'Նկարագիր', en: 'About it', ru: 'Описание' },
}
const entries = publishedPages({ pages, posts: [post] })
const SITE = 'https://example.com/botz/'

describe('addresses for search engines', () => {
  it('are full addresses, the Armenian home page being the site itself', () => {
    assert.equal(pageUrl(SITE, 'index.html', 'hy'), SITE)
    assert.equal(pageUrl(SITE, 'index.html', 'en'), `${SITE}index-en.html`)
    assert.equal(pageUrl(SITE, 'about.html', 'ru'), `${SITE}about-ru.html`)
  })

  it('name every language and an x-default (Armenian)', () => {
    assert.deepEqual(alternates(SITE, 'about.html'), [
      { hreflang: 'hy', href: `${SITE}about.html` },
      { hreflang: 'en', href: `${SITE}about-en.html` },
      { hreflang: 'ru', href: `${SITE}about-ru.html` },
      { hreflang: 'x-default', href: `${SITE}about.html` },
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
        assert.ok(page.title.trim() && page.description.trim(), `${entry.file} ${language}`)
        assert.equal(page.url, pageUrl(site.url, entry.file, language))
        assert.equal(page.alternates.length, LANGUAGES.length + 1)
        const tags = seoTags(page).join('\n')
        assert.match(tags, /<link rel="canonical" href="https:/)
        assert.match(tags, /hreflang="x-default"/)
        assert.match(tags, /<script type="application\/ld\+json">/)
      }
    }
  })

  it('are written into the page between the markers, with the page language', () => {
    for (const file of [
      ...PAGES.map((key) => (key === 'home' ? 'index.html' : `${key}.html`)),
      `${ARTICLE_PAGE}.html`,
    ]) {
      const html = readHtml(file)
      const entry = entries.find((candidate) => candidate.file === file) ?? entries.at(-1)
      const page = pageDescription(entry, 'ru', content)
      const published = withSeoTags(html, page)
      assert.match(published, /^<!doctype html>\n<html lang="ru"/, file)
      assert.equal(published.split('<title>').length, 2, `${file}: one title`)
      assert.equal(published.split('og:image').length, 2, `${file}: one og:image`)
    }
  })
})

describe('schema.org', () => {
  const schemaOf = (file, language = 'en') =>
    pageDescription(
      entries.find((entry) => entry.file === file),
      language,
      content,
    ).schema['@graph']
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
    assert.deepEqual(types(schemaOf('index.html')).slice(0, 2), ['ProfessionalService', 'WebSite'])
    const crumbs = schemaOf('about.html').find((node) => node['@type'] === 'BreadcrumbList')
    assert.deepEqual(
      crumbs.itemListElement.map((step) => step.name),
      ['Home', 'About'],
    )
  })

  it('describes each article with its author and date', () => {
    const graph = schemaOf('post-google-business-profile.html')
    const article = graph.find((node) => node['@type'] === 'BlogPosting')
    assert.equal(article.headline, 'A "title" <b>')
    assert.equal(article.author.name, 'Edgar')
    assert.equal(article.datePublished, '2026-11-02')
    const crumbs = graph.find((node) => node['@type'] === 'BreadcrumbList')
    assert.deepEqual(
      crumbs.itemListElement.map((step) => step.name),
      ['Home', 'Blog', 'A "title" <b>'],
    )
  })

  it('lists questions and answers only where the full list is (not a short list linking to it)', () => {
    const pagesWithFaq = entries
      .filter((entry) => entry.page)
      .filter((entry) => types(schemaOf(entry.file)).includes('FAQPage'))
      .map((entry) => entry.file)
    assert.deepEqual(pagesWithFaq, ['pricing.html'])
  })
})

describe('sitemap.xml and robots.txt', () => {
  it('list every page in every language, each with its other languages', () => {
    const xml = sitemapXml(SITE, [
      { file: 'index.html' },
      { file: 'about.html', lastModified: '2026-11-02' },
    ])
    assert.equal(xml.split('<url>').length - 1, 2 * LANGUAGES.length)
    assert.equal(xml.split('<xhtml:link').length - 1, 2 * LANGUAGES.length * (LANGUAGES.length + 1))
    assert.match(
      xml,
      new RegExp(`<loc>${SITE}about-ru.html</loc>\\n    <lastmod>2026-11-02</lastmod>`),
    )
    assert.match(xml, new RegExp(`<loc>${SITE}</loc>`))
  })

  it('let everything be crawled except the preview, and name the sitemap', () => {
    assert.equal(
      robotsTxt(SITE),
      `User-agent: *\nAllow: /\nDisallow: /botz/preview/\n\nSitemap: ${SITE}sitemap.xml\n`,
    )
  })
})
