import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { catalog, finder } from '../public/js/content/index.js'
import { recommend } from '../public/js/pricing/finder.js'

const answers = (overrides) => ({
  goal: 'social',
  website: 'yes',
  social: 'active',
  production: 'none',
  budget: 'unsure',
  term: 'm6',
  ...overrides,
})

describe('recommend', () => {
  it('suggests a website when that is the goal', () => {
    assert.equal(
      recommend(finder, catalog, answers({ goal: 'site' })).best.pkg.key,
      'website-creation',
    )
  })

  it('suggests a combined plan for social and search', () => {
    const result = recommend(finder, catalog, answers({ goal: 'both', budget: 'b700' }))
    assert.equal(result.best.pkg.key, 'business-boost')
    assert.equal(result.best.total, 420000 * 6)
  })

  it('prefers packages within budget', () => {
    const result = recommend(finder, catalog, answers({ goal: 'social', budget: 'b100' }))
    assert.equal(result.best.pkg.key, 'smm-start')
    assert.ok(result.best.monthly <= 100000)
  })

  it('suggests a custom plan when nothing fits the budget', () => {
    const result = recommend(finder, catalog, answers({ goal: 'search', budget: 'b100' }))
    assert.equal(result.best, null)
    assert.equal(result.suggestCustom, true)
  })

  it('prices an unavailable contract length at the longest one offered', () => {
    const result = recommend(
      finder,
      catalog,
      answers({ goal: 'search', website: 'yes', social: undefined, term: 'm12' }),
    )
    const fundamental = [result.best, ...result.alternatives].find(
      (option) => option?.pkg.key === 'seo-fundamental',
    )
    assert.equal(fundamental.lengthAvailable, false)
    assert.equal(fundamental.months, 6)
  })
})
