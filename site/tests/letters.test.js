import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { splitLetters, splitWords } from '../public/js/lib/letters.js'

describe('letters', () => {
  it('splits a word into letters', () => {
    assert.deepEqual(splitLetters('SEO'), ['S', 'E', 'O'])
  })

  it('keeps Armenian and Cyrillic letters whole', () => {
    assert.deepEqual(splitLetters('ԻՆՉ'), ['Ի', 'Ն', 'Չ'])
    assert.deepEqual(splitLetters('ЧТО'), ['Ч', 'Т', 'О'])
  })

  it('keeps a letter with a combining accent as one letter', () => {
    assert.deepEqual(splitLetters('É'), ['É'])
  })

  it('splits text into words of letters, ignoring extra spaces', () => {
    assert.deepEqual(splitWords('  WE  OFFER '), [
      ['W', 'E'],
      ['O', 'F', 'F', 'E', 'R'],
    ])
    assert.deepEqual(splitWords(''), [])
  })
})
