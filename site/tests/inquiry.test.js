import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  initialService,
  inquiryEmail,
  serviceFromSearch,
  suggestedContact,
  validateInquiry,
} from '../public/js/forms/inquiry.js'

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

describe('initialService', () => {
  it('prefers the chosen package, then add-ons, then the page', () => {
    const base = { packageCategory: null, hasAddons: false, pageService: 'seo' }
    assert.equal(initialService({ ...base, packageCategory: 'smm', hasAddons: true }), 'smm')
    assert.equal(initialService({ ...base, hasAddons: true }), 'addon')
    assert.equal(initialService(base), 'seo')
    assert.equal(initialService({ ...base, pageService: undefined }), '')
  })

  it('puts the service a link asked for first', () => {
    const base = { packageCategory: 'seo', hasAddons: true, pageService: 'seo' }
    assert.equal(initialService({ ...base, requested: 'smm' }), 'smm')
  })
})

describe('serviceFromSearch', () => {
  it('reads a known service from ?service=', () => {
    assert.equal(serviceFromSearch('?service=smm'), 'smm')
    assert.equal(serviceFromSearch('?lang=hy&service=website'), 'website')
  })

  it('ignores missing or unknown services', () => {
    assert.equal(serviceFromSearch(''), null)
    assert.equal(serviceFromSearch('?service=coffee'), null)
  })
})

describe('suggestedContact', () => {
  const people = [
    { key: 'mariam', services: ['smm', 'bundle'] },
    { key: 'edgar', services: ['seo', 'website', 'bundle'] },
  ]

  it('suggests the one founder who handles the service', () => {
    assert.equal(suggestedContact(people, 'smm'), 'mariam')
    assert.equal(suggestedContact(people, 'website'), 'edgar')
  })

  it('suggests either founder when both or nobody handle it', () => {
    assert.equal(suggestedContact(people, 'bundle'), 'either')
    assert.equal(suggestedContact(people, 'other'), 'either')
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
