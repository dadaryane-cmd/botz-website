import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { catalog } from '../public/js/content/index.js'
import { findPackage, monthToMonthPrice, priceFor, quote } from '../public/js/pricing/engine.js'
import { categoryFromSearch, fromParams, toParams } from '../public/js/pricing/selection.js'

const pkg = (key) => findPackage(catalog, key)

describe('priceFor', () => {
  it('returns monthly fee, total and savings against the 1-month rate', () => {
    assert.deepEqual(priceFor(pkg('smm-start'), 6), {
      months: 6,
      monthly: 73000,
      total: 438000,
      savings: 36000,
    })
  })

  it('has no savings on the 1-month rate', () => {
    assert.equal(priceFor(pkg('smm-gold'), 1).savings, 0)
  })

  it('returns null for a contract length the package is not offered for', () => {
    assert.equal(priceFor(pkg('seo-fundamental'), 12), null)
  })
})

describe('monthToMonthPrice', () => {
  it('is the 1-month rate, the base for the savings', () => {
    const start = pkg('smm-start')
    const sixMonths = priceFor(start, 6)
    assert.equal(monthToMonthPrice(start) - sixMonths.monthly, sixMonths.savings / 6)
  })

  it('is null for one-time packages', () => {
    const website = catalog.packages.find((item) => item.category === 'website')
    assert.equal(monthToMonthPrice(website), null)
  })
})

describe('quote', () => {
  it('adds recurring fees and one-time add-ons', () => {
    const totals = quote(catalog, { packageKey: 'seo-vision', months: 12, addons: { reel: 2 } })
    assert.equal(totals.recurring.total, 299000 * 12)
    assert.equal(totals.oneTimeTotal, 50000)
    assert.equal(totals.total, 299000 * 12 + 50000)
    assert.equal(totals.isMinimum, false)
  })

  it('treats website creation as a one-time price', () => {
    const totals = quote(catalog, { packageKey: 'website-creation', months: 6, addons: {} })
    assert.equal(totals.recurring, null)
    assert.equal(totals.total, 299000)
  })

  it('marks totals with "from" add-ons as a minimum', () => {
    assert.equal(
      quote(catalog, { packageKey: null, months: 6, addons: { article: 1 } }).isMinimum,
      true,
    )
  })

  it('ignores unknown add-ons and zero quantities', () => {
    const totals = quote(catalog, { packageKey: null, months: 6, addons: { nope: 3, reel: 0 } })
    assert.equal(totals.isEmpty, true)
    assert.equal(totals.total, 0)
  })
})

describe('shareable selection links', () => {
  it('round-trips a selection through URL parameters', () => {
    const selection = {
      packageKey: 'smm-gold',
      months: 9,
      addons: { reel: 2, 'landing-page': 1 },
      note: null,
    }
    assert.deepEqual(fromParams(toParams(selection)), selection)
  })

  it('drops unknown values and clamps quantities', () => {
    const parsed = fromParams(
      new URLSearchParams('pkg=nope&months=7&addons=reel:99,fake:1,article:0'),
    )
    assert.equal(parsed.packageKey, null)
    assert.equal(parsed.months, 6)
    assert.deepEqual(parsed.addons, { reel: 20 })
  })
})

describe('categoryFromSearch', () => {
  it('reads a known package group from ?cat=', () => {
    assert.equal(categoryFromSearch('?cat=seo'), 'seo')
    assert.equal(categoryFromSearch('?lang=en&cat=bundle'), 'bundle')
  })

  it('ignores missing or unknown groups', () => {
    assert.equal(categoryFromSearch(''), null)
    assert.equal(categoryFromSearch('?cat=strategy'), null)
  })
})

describe('catalog', () => {
  it('lists what every SMM, SEO and combined package includes, in all three languages', () => {
    for (const item of catalog.packages.filter((entry) => entry.category !== 'website')) {
      assert.ok(item.includes?.length > 0, `${item.key} has no "includes"`)
      for (const text of item.includes) assert.ok(text.hy && text.en && text.ru, item.key)
    }
  })
})
