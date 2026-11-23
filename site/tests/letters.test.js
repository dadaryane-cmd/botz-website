import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { splitLetters, textLines, textWords } from '../public/js/lib/letters.js'

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

  it('splits text into lines at line breaks, skipping empty lines', () => {
    assert.deepEqual(textLines('Strategy meets\n\n  creativity. '), [
      'Strategy meets',
      'creativity.',
    ])
    assert.deepEqual(textLines('One line'), ['One line'])
    assert.deepEqual(textLines(''), [])
  })

  it('splits a line into words, ignoring extra spaces', () => {
    assert.deepEqual(textWords('  We  offer '), ['We', 'offer'])
    assert.deepEqual(textWords(''), [])
  })
})
