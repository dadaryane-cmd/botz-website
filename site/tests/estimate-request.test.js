import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { estimateRequestEmail, phoneError } from '../public/js/forms/estimate-request.js'
import { isPhone } from '../public/js/forms/phone.js'

describe('phone numbers', () => {
  it('accepts numbers as people type them', () => {
    for (const phone of ['+374 91 003099', '091003099', '(091) 00-30-99']) {
      assert.equal(isPhone(phone), true, phone)
    }
  })

  it('rejects words and numbers too short to call', () => {
    for (const phone of ['call me', '123', '+374 91 abc']) {
      assert.equal(isPhone(phone), false, phone)
    }
  })
})

describe('send me this estimate', () => {
  it('needs a phone or WhatsApp number that can be used', () => {
    assert.equal(phoneError('+374 91 003099'), null)
    assert.equal(phoneError(''), 'required')
    assert.equal(phoneError('my phone'), 'invalidPhone')
  })

  it('tells the team which estimate to send, and where', () => {
    const email = estimateRequestEmail('+374 91 003099', {
      summary: 'SMM Pro, 3 months — 119,000 ֏ per month',
      link: 'https://example.com/en/pricing/?pkg=smm-dominance&months=3#pricing',
      page: '/en/pricing/',
      language: 'en',
    })
    assert.equal(email.subject, 'Send the estimate to +374 91 003099')
    assert.equal(email.fields['Phone / WhatsApp'], '+374 91 003099')
    assert.match(email.fields.Estimate, /^SMM Pro, 3 months/)
    assert.match(email.fields['Estimate link'], /pkg=smm-dominance/)
    assert.equal(email.fields.Language, 'EN')
  })
})
