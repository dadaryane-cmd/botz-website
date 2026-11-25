import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  initialService,
  inquiryEmail,
  serviceFromSearch,
  splitContact,
  suggestedContact,
  validateInquiry,
} from '../public/js/forms/inquiry.js'
import { formSubmitBody } from '../public/js/services/formsubmit.js'
import { firstToSucceed } from '../public/js/services/send-inquiry.js'
import { web3FormsBody } from '../public/js/services/web3forms.js'

const valid = {
  name: 'Ani',
  contact: 'ani@example.com',
  service: 'seo',
  message: 'Hello there',
}

describe('splitContact', () => {
  it('reads an address with "@" as an email, anything else as a phone number', () => {
    assert.deepEqual(splitContact('ani@example.com'), { email: 'ani@example.com', phone: '' })
    assert.deepEqual(splitContact('+374 91 003099'), { email: '', phone: '+374 91 003099' })
  })
})

describe('validateInquiry', () => {
  it('needs only a name and a phone number or an email', () => {
    assert.deepEqual(validateInquiry(valid), {})
    assert.deepEqual(validateInquiry({ name: 'Ani', contact: '+374 91 003099' }), {})
    assert.deepEqual(validateInquiry({ ...valid, service: '', message: '' }), {})
  })

  it('asks for a way to reach the visitor', () => {
    assert.deepEqual(validateInquiry({ name: 'A', contact: '' }), {
      name: 'required',
      contact: 'needEmailOrPhone',
    })
  })

  it('rejects a malformed email or phone number', () => {
    assert.equal(validateInquiry({ ...valid, contact: 'ani@' }).contact, 'invalidEmail')
    assert.equal(validateInquiry({ ...valid, contact: 'abc' }).contact, 'invalidPhone')
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
    assert.equal(inquiryEmail({ ...valid, contact: '+374 91 003099' }, context).replyTo, null)
  })

  it('puts the contact in the email or phone row, and fills empty values with a dash', () => {
    const { fields } = inquiryEmail({ ...valid, contact: '+374 91 003099', message: '' }, context)
    assert.equal(fields.Phone, '+374 91 003099')
    assert.equal(fields.Email, '—')
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
