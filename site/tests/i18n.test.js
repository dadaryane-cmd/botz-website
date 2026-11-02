import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { getLanguage, initLanguage, uiInEveryLanguage } from '../public/js/lib/i18n.js'

describe('the page language', () => {
  it('comes from the address: the en/ and ru/ folders, Armenian elsewhere', () => {
    initLanguage('ru/uslugi/')
    assert.equal(getLanguage(), 'ru')
    initLanguage('en/')
    assert.equal(getLanguage(), 'en')
    initLanguage('mer-masin/')
    assert.equal(getLanguage(), 'hy')
    initLanguage('')
    assert.equal(getLanguage(), 'hy')
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
