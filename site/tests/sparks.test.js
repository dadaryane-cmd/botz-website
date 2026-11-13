import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { SPARK, newSparks, sparkOpacity, stepSparks } from '../public/js/lib/sparks.js'

const always = (value) => () => value

describe('sparks behind the mouse', () => {
  it('leave none when the mouse moves slowly, one or two when it moves fast', () => {
    assert.deepEqual(newSparks({ x: 10, y: 20, speed: SPARK.minSpeed / 2 }), [])
    assert.equal(newSparks({ x: 10, y: 20, speed: 3, random: always(0.2) }).length, 1)
    assert.equal(newSparks({ x: 10, y: 20, speed: 3, random: always(0.8) }).length, 2)
  })

  it('start where the mouse is, then fall and fade', () => {
    const [spark] = newSparks({ x: 10, y: 20, speed: 3, random: always(0.2) })
    assert.equal(spark.x, 10)
    assert.equal(spark.y, 20)
    const [later] = stepSparks([spark], 200)
    assert.ok(later.y > spark.y, 'pulled down')
    assert.ok(sparkOpacity(later) < sparkOpacity(spark), 'fading')
  })

  it('burn out at the end of their life', () => {
    const [spark] = newSparks({ x: 0, y: 0, speed: 3, random: always(0.2) })
    assert.deepEqual(stepSparks([spark], SPARK.life), [])
  })
})
