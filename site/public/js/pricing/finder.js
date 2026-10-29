/**
 * Package finder scoring. Every rule whose conditions all match the answers adds its points
 * (and its reason) to a package. Budget and contract length never hide a package: they rank it,
 * and the result says why.
 */
import { availableLengths, findPackage, isRecurring, priceFor } from './engine.js'

export function recommend(finder, catalog, answers) {
  const months = chosenOption(finder, 'duration', answers)?.months ?? null
  const budget = chosenOption(finder, 'budget', answers)?.budgetMax ?? null

  const candidates = [...scorePackages(finder.rules, answers)]
    .map(([key, score]) => candidate(findPackage(catalog, key), score, months, budget))
    .sort(byBestFit)

  const best = candidates.find((option) => option.withinBudget && option.lengthAvailable) ?? null
  return {
    best,
    alternatives: candidates.filter((option) => option !== best).slice(0, 2),
    suggestCustom: !best || candidates.every((option) => !option.withinBudget),
  }
}

/** The answer option picked for the question with this role ("duration" or "budget"). */
function chosenOption(finder, role, answers) {
  const question = finder.questions.find((item) => item.role === role)
  return question.options.find((option) => option.value === answers[question.key])
}

/** Package key → { points, reasons } from every rule whose conditions all match. */
function scorePackages(rules, answers) {
  const scores = new Map()
  for (const rule of rules) {
    const matches = rule.when.every((condition) =>
      condition.values.includes(answers[condition.question]),
    )
    if (!matches) continue
    const score = scores.get(rule.packageKey) ?? { points: 0, reasons: [] }
    score.points += rule.points
    score.reasons.push(rule.reason)
    scores.set(rule.packageKey, score)
  }
  return scores
}

/** Within budget first, then the wanted length offered, then most points, then cheapest. */
function byBestFit(first, second) {
  return (
    Number(second.withinBudget) - Number(first.withinBudget) ||
    Number(second.lengthAvailable) - Number(first.lengthAvailable) ||
    second.points - first.points ||
    (first.monthly ?? first.total) - (second.monthly ?? second.total)
  )
}

function candidate(pkg, { points, reasons }, months, budget) {
  if (!isRecurring(pkg)) {
    return {
      pkg,
      points,
      reasons,
      months: null,
      monthly: null,
      total: pkg.oneTimePrice,
      withinBudget: true,
      lengthAvailable: true,
    }
  }
  const lengths = availableLengths(pkg)
  const lengthAvailable = !months || lengths.includes(months)
  const pricedMonths = lengthAvailable ? (months ?? lengths[0]) : longestUpTo(lengths, months)
  const { monthly, total } = priceFor(pkg, pricedMonths)
  return {
    pkg,
    points,
    reasons,
    months: pricedMonths,
    monthly,
    total,
    withinBudget: budget === null || monthly <= budget,
    lengthAvailable,
  }
}

/** When the wanted length is not offered, price the longest shorter one so the real cost is visible. */
function longestUpTo(lengths, months) {
  return lengths.filter((length) => length <= months).at(-1) ?? lengths[0]
}
