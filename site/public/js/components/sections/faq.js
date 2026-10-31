import { h } from '../../lib/dom.js'
import { t, ui } from '../../lib/i18n.js'
import { sectionHref } from '../../lib/page.js'
import { heading, section } from './section.js'

/**
 * Questions and answers (native <details>, so they work without JavaScript). On wide screens the
 * heading and a "write to us" link sit on the left, the questions on the right.
 */
export const renderFaq = (config) =>
  section(
    config,
    h(
      'div',
      { class: 'faq-layout' },
      h(
        'div',
        { class: 'faq-intro' },
        heading(config.heading),
        h(
          'p',
          { class: 'faq-help' },
          `${ui('faq', 'notFound')} `,
          h(
            'a',
            { class: 'link-arrow', href: sectionHref('contact', 'contact.html') },
            ui('faq', 'writeUs'),
          ),
        ),
      ),
      h(
        'div',
        { class: 'faq' },
        config.items.map((item) =>
          h(
            'details',
            { open: Boolean(item.openByDefault) },
            h('summary', null, t(item.question)),
            h('p', null, t(item.answer)),
          ),
        ),
        // A short list can point to the full one on another page.
        config.link?.href &&
          h('a', { class: 'link-arrow faq-more', href: config.link.href }, t(config.link.label)),
      ),
    ),
  )
