import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { pickLanguage } from '../public/js/lib/i18n.js'

describe('pickLanguage', () => {
  it('uses the language asked for in the link first', () => {
    assert.equal(pickLanguage({ fromUrl: 'ru', saved: 'en', browser: ['hy'] }), 'ru')
  })

  it('then the visitor’s saved choice', () => {
    assert.equal(pickLanguage({ fromUrl: null, saved: 'en', browser: ['ru-RU'] }), 'en')
  })

  it('then the first browser language the site has, ignoring the region', () => {
    assert.equal(pickLanguage({ browser: ['ru-RU', 'en-US'] }), 'ru')
    assert.equal(pickLanguage({ browser: ['fr-FR', 'en-GB'] }), 'en')
    assert.equal(pickLanguage({ browser: ['HY-am'] }), 'hy')
  })

  it('falls back to Armenian', () => {
    assert.equal(pickLanguage({ browser: ['fr-FR', 'de'] }), 'hy')
    assert.equal(pickLanguage({}), 'hy')
    assert.equal(pickLanguage({ fromUrl: 'xx', saved: 'yy' }), 'hy')
  })
})
