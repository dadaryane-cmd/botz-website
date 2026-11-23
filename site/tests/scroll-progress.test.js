import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { litWords, revealProgress } from '../public/js/lib/scroll-progress.js'

describe('revealProgress', () => {
  const viewport = 1000
  const box = (top) => ({ top, height: 400 })

  it('is 0 until the top comes up to 90% of the window', () => {
    assert.equal(revealProgress(box(1200), viewport), 0)
    assert.equal(revealProgress(box(900), viewport), 0)
  })

  it('is 1 once the middle reaches 45% of the window, and stays there', () => {
    assert.equal(revealProgress(box(250), viewport), 1)
    assert.equal(revealProgress(box(-300), viewport), 1)
  })

  it('rises evenly in between', () => {
    assert.equal(revealProgress(box(575), viewport), 0.5)
  })
})

describe('litWords', () => {
  it('lights no word at 0 and every word at 1', () => {
    assert.equal(litWords(0, 6), 0)
    assert.ok(litWords(1, 6) >= 6 + 1)
  })
})
