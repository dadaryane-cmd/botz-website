import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { pickLanguage, uiInEveryLanguage } from '../public/js/lib/i18n.js'

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

describe('uiInEveryLanguage', () => {
  it('gives an interface text in all three languages (a note that follows a language change)', () => {
    const note = uiInEveryLanguage('lamp', 'auditMessage')
    assert.deepEqual(Object.keys(note).sort(), ['en', 'hy', 'ru'])
    assert.match(note.en, /free marketing audit/)
    assert.match(note.ru, /аудит/)
  })

  it('fills placeholders per language, also from { hy, en, ru } values', () => {
    const note = uiInEveryLanguage('pricing', 'availableFor', {
      list: { hy: 'Ա', en: 'A', ru: 'А' },
    })
    assert.equal(note.en, 'Available for A')
    assert.equal(note.ru, 'Доступно: А')
  })
})
