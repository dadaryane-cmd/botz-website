import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { profileHandle, profileOf } from '../public/js/lib/social.js'

describe('social profiles', () => {
  const social = [
    { network: 'instagram', url: 'https://www.instagram.com/botz.agency/' },
    { network: 'facebook', url: '' },
  ]

  it('finds a network only when it has a link', () => {
    assert.equal(profileOf(social, 'instagram'), social[0])
    assert.equal(profileOf(social, 'facebook'), null)
    assert.equal(profileOf(undefined, 'tiktok'), null)
  })

  it('reads the handle from the profile address', () => {
    assert.equal(profileHandle('https://www.instagram.com/botz.agency/'), '@botz.agency')
    assert.equal(profileHandle('https://www.tiktok.com/@botz'), '@botz')
    assert.equal(profileHandle('https://www.instagram.com/'), '')
  })
})
