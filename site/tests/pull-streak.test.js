import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createPullStreak } from '../public/js/components/bulb/pull-streak.js'

/** A streak counter driven by a fake clock. */
function streakAt(times, options = { needed: 5, maxGapMs: 2000 }) {
  let index = 0
  const count = createPullStreak({ ...options, now: () => times[index] })
  const results = []
  for (index = 0; index < times.length; index++) results.push(count())
  return results
}

describe('pull streak (lamp easter egg)', () => {
  it('uses the lamp settings: three pulls, at most 3 seconds apart', () => {
    const lamp = { needed: 3, maxGapMs: 3000 }
    assert.deepEqual(streakAt([0, 2900, 5800], lamp), [false, false, true])
    assert.deepEqual(streakAt([0, 2900, 6000], lamp), [false, false, false])
  })

  it('triggers on the fifth quick pull', () => {
    assert.deepEqual(streakAt([0, 500, 1000, 1500, 2000]), [false, false, false, false, true])
  })

  it('starts again after a pause longer than the allowed gap', () => {
    assert.deepEqual(streakAt([0, 500, 1000, 5000, 5500, 6000, 6500]), [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ])
  })

  it('needs a fresh streak after triggering', () => {
    const times = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    assert.deepEqual(streakAt(times).map(Number).join(''), '0000100001')
  })
})
