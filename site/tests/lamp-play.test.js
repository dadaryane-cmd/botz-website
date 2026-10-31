import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  FIRST_TIP_PULL,
  lampReaction,
  nextTipIndex,
} from '../public/js/components/bulb/lamp-play.js'

describe('lamp play', () => {
  it('stays quiet on ordinary pulls', () => {
    for (const pulls of [1, 2, 4, 5, 7, 8, 9]) assert.equal(lampReaction(pulls), null)
  })

  it('says something on the 3rd and 6th pull', () => {
    assert.equal(lampReaction(3), 'oneMore')
    assert.equal(lampReaction(6), 'likePlaying')
  })

  it('shows a tip from the 10th pull on', () => {
    assert.equal(FIRST_TIP_PULL, 10)
    for (const pulls of [10, 11, 25]) assert.equal(lampReaction(pulls), 'tip')
  })

  it('starts with the first tip when none was seen', () => {
    for (const previous of [null, undefined, -1, 'x', 1.5]) {
      assert.equal(nextTipIndex(previous, 10), 0)
    }
  })

  it('moves to the next tip and starts over after the last', () => {
    assert.equal(nextTipIndex(0, 10), 1)
    assert.equal(nextTipIndex(9, 10), 0)
    // The list got shorter since the last visit.
    assert.equal(nextTipIndex(12, 10), 3)
  })
})
