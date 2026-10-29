import { h } from '../lib/dom.js'
import { ui } from '../lib/i18n.js'

export const renderNotFound = () =>
  h(
    'section',
    { class: 'hero' },
    h(
      'div',
      { class: 'container' },
      h('h1', { class: 'heading' }, ui('errors', 'notFoundTitle')),
      h('p', { class: 'lead' }, ui('errors', 'notFoundText')),
      h('a', { class: 'btn btn-primary', href: 'index.html' }, ui('errors', 'backHome')),
    ),
  )
