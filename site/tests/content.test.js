import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { PAGES } from '../public/js/config.js'
import { catalog, finder, navigation, people } from '../public/js/content/index.js'
import { loadJson } from '../public/js/content/load.js'
import { interpolate, t, ui } from '../public/js/lib/i18n.js'

const publicDir = fileURLToPath(new URL('../public/', import.meta.url))
const htmlFile = (key) => (key === 'home' ? 'index.html' : `${key}.html`)
const pages = Object.fromEntries(
  await Promise.all(PAGES.map(async (key) => [key, await loadJson(`pages/${key}.json`)])),
)
const SECTION_TYPES = [
  'comparison',
  'contact',
  'cta',
  'faq',
  'finder',
  'hero',
  'packagePreview',
  'pricing',
  'process',
  'samples',
  'serviceDetail',
  'services',
  'sign',
  'split',
  'team',
]

/** Every { en, hy, ru } value inside `value`. */
function* translations(value) {
  if (value && typeof value === 'object') {
    if ('en' in value && 'hy' in value && 'ru' in value) yield value
    else for (const child of Object.values(value)) yield* translations(child)
  }
}

describe('content', () => {
  it('has an HTML file for every page, and a page for every HTML file', () => {
    // Retired pages stay as redirects, so old links still lead somewhere.
    const isRedirect = (file) =>
      readFileSync(join(publicDir, file), 'utf8').includes('http-equiv="refresh"')
    const htmlFiles = readdirSync(publicDir).filter(
      (file) => file.endsWith('.html') && file !== '404.html' && !isRedirect(file),
    )
    assert.deepEqual(PAGES.map(htmlFile).sort(), htmlFiles.sort())
    for (const key of PAGES) {
      const html = readFileSync(join(publicDir, htmlFile(key)), 'utf8')
      assert.ok(
        html.includes(`data-page="${key}"`),
        `${htmlFile(key)} should have data-page="${key}"`,
      )
    }
  })

  it('redirects every retired page to a section that exists on the Services page', () => {
    const services = pages.services.sections.map((section) => section.id).filter(Boolean)
    for (const file of ['smm.html', 'seo.html', 'website-creation.html']) {
      const html = readFileSync(join(publicDir, file), 'utf8')
      const target = html.match(/url=services\.html#([\w-]+)/)?.[1]
      assert.ok(services.includes(target), `${file} should redirect to a Services section`)
    }
  })

  it('has a file for every founder photo', () => {
    for (const person of people.filter((entry) => entry.photo)) {
      assert.ok(existsSync(publicDir + person.photo), `missing ${person.photo}`)
    }
  })

  it('only uses known section types', () => {
    for (const [key, page] of Object.entries(pages)) {
      for (const section of page.sections) {
        assert.ok(SECTION_TYPES.includes(section.type), `${key}: ${section.type}`)
      }
    }
  })

  it('links only to pages and files that exist', () => {
    const links = [
      // A menu group ("Services") holds its links in `children`.
      ...navigation.header.flatMap((item) => item.children ?? [item]),
      navigation.cta,
      ...navigation.footerColumns.flatMap((group) => group.links),
    ]
    // Every "href" and "file" value in the page content.
    const pageLinks = JSON.stringify(pages)
      .match(/"(?:href|file)":"[^"#]+/g)
      .map((match) => match.split(':"')[1])
    for (const href of [...links.map((link) => link.href), ...pageLinks]) {
      if (/^(https?:|mailto:|tel:|#)/.test(href)) continue
      // The file part only: without "?cat=…" and "#section".
      const file = href.split(/[?#]/)[0]
      assert.ok(existsSync(publicDir + file), `missing ${href}`)
    }
  })

  it('loads only stylesheets and images that exist (url() is relative to each CSS file)', () => {
    const visit = (cssFile) => {
      for (const [, ref] of readFileSync(cssFile, 'utf8').matchAll(/url\('([^']+)'\)/g)) {
        if (/^(https?:|data:)/.test(ref)) continue
        const target = join(dirname(cssFile), ref)
        assert.ok(existsSync(target), `${cssFile}: missing ${ref}`)
        if (target.endsWith('.css')) visit(target)
      }
    }
    visit(join(publicDir, 'css/main.css'))
  })

  it('refers only to packages in the catalog', () => {
    const keys = new Set(catalog.packages.map((pkg) => pkg.key))
    for (const rule of finder.rules) assert.ok(keys.has(rule.packageKey), rule.packageKey)
    for (const pkg of catalog.packages) {
      for (const key of pkg.components ?? []) assert.ok(keys.has(key), key)
    }
  })

  it('has every text in all three languages', () => {
    for (const value of translations({ pages, catalog, finder, navigation })) {
      for (const language of ['en', 'hy', 'ru']) {
        assert.ok(value[language]?.trim(), `${value.en} → ${language}`)
      }
    }
  })
})

describe('i18n', () => {
  it('fills placeholders and keeps unknown ones', () => {
    assert.equal(interpolate('{a} and {b}', { a: 1 }), '1 and {b}')
  })

  it('picks the default language (Armenian)', () => {
    assert.equal(t({ en: 'Yes', hy: 'Այո', ru: 'Да' }), 'Այո')
  })

  it('falls back to the key for missing interface text', () => {
    assert.equal(ui('pricing', 'noSuchKey'), 'noSuchKey')
  })
})
