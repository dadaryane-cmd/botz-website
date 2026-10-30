import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { people } from '../public/js/content/index.js'
import { responsibleFor } from '../public/js/lib/people.js'

const keys = (service) => responsibleFor(people, service).map((person) => person.key)

describe('responsibleFor', () => {
  it('names the founder for each single service', () => {
    assert.deepEqual(keys('smm'), ['mariam'])
    assert.deepEqual(keys('seo'), ['edgar'])
    assert.deepEqual(keys('website'), ['edgar'])
  })

  it('names both founders for combined plans', () => {
    assert.deepEqual(keys('bundle'), ['mariam', 'edgar'])
  })

  it('is empty for a service nobody handles', () => {
    assert.deepEqual(keys('unknown'), [])
  })
})
