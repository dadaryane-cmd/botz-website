import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  initialService,
  inquiryEmail,
  serviceFromSearch,
  suggestedContact,
  validateInquiry,
} from '../public/js/forms/inquiry.js'
import { formSubmitBody } from '../public/js/services/formsubmit.js'
import { firstToSucceed } from '../public/js/services/send-inquiry.js'
import { web3FormsBody } from '../public/js/services/web3forms.js'

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

  it('lets the message stay empty when an estimate is attached', () => {
    const empty = { ...valid, message: '' }
    assert.equal(validateInquiry(empty).message, 'messageTooShort')
    assert.deepEqual(validateInquiry(empty, { hasEstimate: true }), {})
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

  it('names the visitor and service in the subject; replies go to the visitor, if they gave an email', () => {
    const email = inquiryEmail(valid, context)
    assert.equal(email.subject, 'New inquiry: Ani · SEO')
    assert.equal(email.replyTo, 'ani@example.com')
    assert.equal(inquiryEmail({ ...valid, email: '' }, context).replyTo, null)
  })

  it('fills empty values with a dash', () => {
    const { fields } = inquiryEmail({ ...valid, phone: '', message: '' }, context)
    assert.equal(fields.Phone, '—')
    assert.equal(fields.Message, '—')
    assert.equal(fields.Estimate, '—')
    assert.equal(fields.Language, 'HY')
  })
})

describe('delivery formats', () => {
  const email = { subject: 'New inquiry', replyTo: 'ani@example.com', fields: { Name: 'Ani' } }

  it('Web3Forms: access key, subject, sender name and reply-to, then the table', () => {
    assert.deepEqual(web3FormsBody('key-1', email), {
      access_key: 'key-1',
      subject: 'New inquiry',
      from_name: 'BOTZ website',
      replyto: 'ani@example.com',
      Name: 'Ani',
    })
    assert.equal('replyto' in web3FormsBody('key-1', { ...email, replyTo: null }), false)
  })

  it('FormSubmit: underscore settings, then the table', () => {
    assert.deepEqual(formSubmitBody(email), {
      _subject: 'New inquiry',
      _template: 'table',
      _captcha: 'false',
      _replyto: 'ani@example.com',
      Name: 'Ani',
    })
    assert.equal('_replyto' in formSubmitBody({ ...email, replyTo: null }), false)
  })
})

describe('firstToSucceed', () => {
  const quietly = async (run) => {
    const warn = console.warn
    console.warn = () => {}
    try {
      return await run()
    } finally {
      console.warn = warn
    }
  }
  const failing = (message) => async () => {
    throw new Error(message)
  }

  it('uses the first service that delivers and does not try the rest', async () => {
    const tried = []
    const delivered = await firstToSucceed([
      ['A', async () => tried.push('A')],
      ['B', async () => tried.push('B')],
    ])
    assert.equal(delivered, 'A')
    assert.deepEqual(tried, ['A'])
  })

  it('falls back to the next service when one fails', async () => {
    const delivered = await quietly(() =>
      firstToSucceed([
        ['A', failing('down')],
        ['B', async () => {}],
      ]),
    )
    assert.equal(delivered, 'B')
  })

  it("throws the last service's reason when none delivers, or when none is set up", async () => {
    await assert.rejects(
      quietly(() =>
        firstToSucceed([
          ['A', failing('down')],
          ['B', failing('needs activation')],
        ]),
      ),
      /needs activation/,
    )
    await assert.rejects(firstToSucceed([]), /No delivery service/)
  })
})
