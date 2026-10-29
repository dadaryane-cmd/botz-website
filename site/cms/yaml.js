/**
 * Minimal YAML writer for the CMS configuration: objects, arrays, strings, numbers and booleans.
 * Strings that could be misread (special words, numbers, ":" or "#", braces…) are double-quoted,
 * using JSON escaping, which is valid YAML.
 */

const PLAIN = /^[A-Za-z][\w .,/()&'+-]*$/
const RESERVED = /^(true|false|yes|no|on|off|null|~)$/i

function scalar(value) {
  if (typeof value !== 'string') return String(value)
  const safe = PLAIN.test(value) && !RESERVED.test(value) && !value.endsWith(' ')
  return safe ? value : JSON.stringify(value)
}

/** Arrays of plain values are written inline: [a, b, c]. */
const isInlineList = (value) =>
  Array.isArray(value) && value.every((item) => typeof item !== 'object')

function lines(value, indent) {
  const pad = ' '.repeat(indent)

  if (isInlineList(value)) return [`${pad}[${value.map(scalar).join(', ')}]`]

  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      const [first, ...rest] = lines(item, indent + 2)
      return [`${pad}- ${first.trimStart()}`, ...rest]
    })
  }

  return Object.entries(value)
    .filter(([, child]) => child !== undefined)
    .flatMap(([key, child]) => {
      if (isInlineList(child)) return [`${pad}${key}: [${child.map(scalar).join(', ')}]`]
      if (child !== null && typeof child === 'object') {
        return Object.keys(child).length
          ? [`${pad}${key}:`, ...lines(child, indent + 2)]
          : [`${pad}${key}: {}`]
      }
      return [`${pad}${key}: ${scalar(child)}`]
    })
}

export const toYaml = (value) => `${lines(value, 0).join('\n')}\n`
