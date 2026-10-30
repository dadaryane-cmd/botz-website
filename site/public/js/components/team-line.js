/** "M Mariam", or "M E Mariam & Edgar": who handles a service, from content/people.json. */
import { people } from '../content/index.js'
import { h } from '../lib/dom.js'
import { t } from '../lib/i18n.js'
import { responsibleFor } from '../lib/people.js'

export function teamLine(service) {
  const team = responsibleFor(people, service)
  if (team.length === 0) return null
  const names = team.map((person) => t(person.name))
  return h(
    'p',
    { class: 'service-team' },
    names.map((name) => h('span', { class: 'service-initial', 'aria-hidden': 'true' }, name[0])),
    h('span', null, names.join(' & ')),
  )
}
