import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { inquiryEmail, validateInquiry } from '../public/js/forms/inquiry.js'

const valid = {
  name: 'Ani',
  email: 'ani@example.com',
  phone: '',
  service: 'seo',
  message: 'Hello there',
}

describe('validateInquiry', () => {
  it('accepts a complete inquiry', () => {
    assert.deepEqual(validateInquiry(valid), {})
  })

  it('needs an email or a phone number', () => {
    assert.equal(validateInquiry({ ...valid, email: '' }).email, 'needEmailOrPhone')
    assert.deepEqual(validateInquiry({ ...valid, email: '', phone: '+374 91 003099' }), {})
  })

  it('rejects malformed contact details and short messages', () => {
    const errors = validateInquiry({ ...valid, email: 'ani@', phone: 'abc', message: 'hi' })
    assert.deepEqual(errors, {
      email: 'invalidEmail',
      phone: 'invalidPhone',
      message: 'messageTooShort',
    })
  })
})

describe('inquiryEmail', () => {
  const context = {
    serviceLabel: 'SEO',
    contactName: 'Edgar',
    estimate: '',
    page: 'seo.html',
    language: 'hy',
  }

  it('sets reply-to only when the visitor gave an email', () => {
    assert.equal(inquiryEmail(valid, context)._replyto, 'ani@example.com')
    assert.equal('_replyto' in inquiryEmail({ ...valid, email: '' }, context), false)
  })

  it('fills empty values with a dash', () => {
    const email = inquiryEmail({ ...valid, phone: '' }, context)
    assert.equal(email.Phone, '—')
    assert.equal(email.Estimate, '—')
    assert.equal(email.Language, 'HY')
  })
})
