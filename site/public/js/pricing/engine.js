/**
 * Price calculations. Pure functions over the catalog in content/catalog.json,
 * so they run the same in the browser and in the unit tests.
 */
import { CONTRACT_LENGTHS } from '../config.js'

export const findPackage = (catalog, key) => catalog.packages.find((pkg) => pkg.key === key) ?? null
export const findAddon = (catalog, key) => catalog.addons.find((addon) => addon.key === key) ?? null

/** Contract lengths with a monthly price; a missing price means "not offered". */
export const availableLengths = (pkg) =>
  CONTRACT_LENGTHS.filter((months) => typeof pkg.prices?.[`m${months}`] === 'number')

/** Monthly packages have prices per contract length; website creation has a `oneTimePrice` instead. */
export const isRecurring = (pkg) => availableLengths(pkg).length > 0

/**
 * Monthly fee, total and savings (against paying the 1-month rate) for a contract length,
 * or null when the package is not offered for that length.
 */
export function priceFor(pkg, months) {
  const monthly = pkg.prices?.[`m${months}`]
  const monthToMonth = pkg.prices?.m1
  if (typeof monthly !== 'number' || typeof monthToMonth !== 'number') return null
  return {
    months,
    monthly,
    total: monthly * months,
    savings: Math.max(0, (monthToMonth - monthly) * months),
  }
}

export const lowestMonthlyPrice = (pkg) =>
  Math.min(...availableLengths(pkg).map((months) => pkg.prices[`m${months}`]))

/**
 * Totals for a selection `{ packageKey, months, addons: { key: quantity } }`.
 * Unknown keys and quantities below 1 are ignored.
 */
export function quote(catalog, selection) {
  const pkg = selection.packageKey ? findPackage(catalog, selection.packageKey) : null
  const recurring = pkg && isRecurring(pkg) ? priceFor(pkg, selection.months) : null
  const packageOneTime = pkg && !isRecurring(pkg) ? (pkg.oneTimePrice ?? 0) : 0

  const addons = Object.entries(selection.addons ?? {})
    .map(([key, quantity]) => ({ addon: findAddon(catalog, key), quantity }))
    .filter(({ addon, quantity }) => addon && quantity >= 1)
    .map(({ addon, quantity }) => ({ addon, quantity, total: addon.price * quantity }))

  const oneTimeTotal = packageOneTime + addons.reduce((sum, line) => sum + line.total, 0)
  return {
    pkg,
    recurring,
    packageOneTime,
    addons,
    oneTimeTotal,
    total: (recurring?.total ?? 0) + oneTimeTotal,
    // "From" prices make the total a minimum.
    isMinimum: addons.some(({ addon }) => addon.priceIsFrom),
    isEmpty: !pkg && addons.length === 0,
  }
}
