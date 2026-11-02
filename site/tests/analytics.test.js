import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { contactMethod, isMeasurementId } from '../public/js/services/analytics.js'
import { verificationTags } from '../scripts/seo/head-tags.js'

describe('analytics', () => {
  it('names the contact method a link opens', () => {
    assert.equal(contactMethod('tel:+37491003099'), 'phone')
    assert.equal(contactMethod('mailto:botz@example.com?subject=Hi'), 'email')
    assert.equal(contactMethod('https://wa.me/37491003099?text=Hello'), 'whatsapp')
    assert.equal(contactMethod('https://api.whatsapp.com/send?phone=374'), 'whatsapp')
    assert.equal(contactMethod('https://t.me/botz'), 'telegram')
    assert.equal(contactMethod('https://example.com/wa.me/'), null)
    assert.equal(contactMethod('ru/kontakty/'), null)
  })

  it('starts only with a real GA4 measurement id', () => {
    assert.equal(isMeasurementId('G-ABC123XYZ'), true)
    for (const id of [null, undefined, '', 'UA-12345-1', 'G-abc', 'G-ABC"><script>']) {
      assert.equal(isMeasurementId(id), false, String(id))
    }
  })
})

describe('search engine verification', () => {
  it('writes a tag for each code that is set', () => {
    assert.deepEqual(verificationTags({ google: 'abc', yandex: null }), [
      '<meta name="google-site-verification" content="abc" />',
    ])
    assert.deepEqual(verificationTags({ yandex: 'y"1', bing: 'B2' }), [
      '<meta name="yandex-verification" content="y&quot;1" />',
      '<meta name="msvalidate.01" content="B2" />',
    ])
    assert.deepEqual(verificationTags(), [])
  })
})
