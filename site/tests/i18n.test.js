import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { getLanguage, initLanguage, uiInEveryLanguage } from '../public/js/lib/i18n.js'
import {
  fileFromPath,
  fileInLanguage,
  languageFromPath,
  localizeHref,
} from '../public/js/lib/urls.js'

describe('the language of an address', () => {
  it('is in the file name, Armenian without one', () => {
    assert.equal(languageFromPath('/botz-website/about-en.html'), 'en')
    assert.equal(languageFromPath('/botz-website/post-google-business-profile-ru.html'), 'ru')
    assert.equal(languageFromPath('/botz-website/about.html'), 'hy')
    assert.equal(languageFromPath('/botz-website/'), 'hy')
    assert.equal(languageFromPath('/botz-website/about-fr.html'), 'hy')
  })

  it('sets the page language', () => {
    initLanguage('/botz-website/pricing-ru.html')
    assert.equal(getLanguage(), 'ru')
    initLanguage('/botz-website/')
    assert.equal(getLanguage(), 'hy')
  })

  it('names the same page in another language', () => {
    assert.equal(fileFromPath('/botz-website/'), 'index.html')
    assert.equal(fileInLanguage('index.html', 'en'), 'index-en.html')
    assert.equal(fileInLanguage('about-en.html', 'ru'), 'about-ru.html')
    assert.equal(fileInLanguage('about-ru.html', 'hy'), 'about.html')
  })
})

describe('links to the site’s pages', () => {
  it('lead to the page in the same language, keeping the query and anchor', () => {
    assert.equal(localizeHref('pricing.html?cat=smm', 'en'), 'pricing-en.html?cat=smm')
    assert.equal(localizeHref('services.html#seo', 'ru'), 'services-ru.html#seo')
    assert.equal(
      localizeHref('post-instagram-post-ideas.html', 'en'),
      'post-instagram-post-ideas-en.html',
    )
    assert.equal(localizeHref('pricing.html', 'hy'), 'pricing.html')
  })

  it('leave other links alone', () => {
    for (const href of [
      '#contact',
      'https://example.com/a.html',
      'downloads/smm.pdf',
      'tel:+374',
      'about-en.html',
    ]) {
      assert.equal(localizeHref(href, 'ru'), href)
    }
  })
})

describe('uiInEveryLanguage', () => {
  it('gives an interface text in all three languages (a note that follows a language change)', () => {
    const note = uiInEveryLanguage('lamp', 'auditMessage')
    assert.deepEqual(Object.keys(note).sort(), ['en', 'hy', 'ru'])
    assert.match(note.en, /free marketing audit/)
    assert.match(note.ru, /аудит/)
  })

  it('fills placeholders per language, also from { hy, en, ru } values', () => {
    const note = uiInEveryLanguage('pricing', 'availableFor', {
      list: { hy: 'Ա', en: 'A', ru: 'А' },
    })
    assert.equal(note.en, 'Available for A')
    assert.equal(note.ru, 'Доступно: А')
  })
})
