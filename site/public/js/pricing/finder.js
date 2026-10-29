/**
 * Package finder scoring. Every rule whose conditions all match the answers adds its points
 * (and its reason) to a package. Budget and contract length never hide a package: they rank it,
 * and the result says why.
 */
import { availableLengths, findPackage, isRecurring, priceFor } from './engine.js'

export function recommend(finder, catalog, answers) {
  const lengthQuestion = finder.questions.find((q) => q.role === 'duration')
  const budgetQuestion = finder.questions.find((q) => q.role === 'budget')
  const months =
    lengthQuestion.options.find((o) => o.value === answers[lengthQuestion.key])?.months ?? null
  const budget =
    budgetQuestion.options.find((o) => o.value === answers[budgetQuestion.key])?.budgetMax ?? null

  const scores = new Map()
  for (const rule of finder.rules) {
    if (!rule.when.every((condition) => condition.values.includes(answers[condition.question])))
      continue
    const score = scores.get(rule.packageKey) ?? { points: 0, reasons: [] }
    score.points += rule.points
    score.reasons.push(rule.reason)
    scores.set(rule.packageKey, score)
  }

  const candidates = [...scores].map(([key, { points, reasons }]) =>
    candidate(findPackage(catalog, key), points, reasons, months, budget),
  )
  candidates.sort(
    (a, b) =>
      b.withinBudget - a.withinBudget ||
      b.lengthAvailable - a.lengthAvailable ||
      b.points - a.points ||
      (a.monthly ?? a.total) - (b.monthly ?? b.total),
  )

  const best = candidates.find((c) => c.withinBudget && c.lengthAvailable) ?? null
  return {
    best,
    alternatives: candidates.filter((c) => c !== best).slice(0, 2),
    suggestCustom: !best || candidates.every((c) => !c.withinBudget),
  }
}

function candidate(pkg, points, reasons, months, budget) {
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
  // When the wanted length is not offered, price the longest shorter one so the real cost is visible.
  const priced = lengthAvailable
    ? (months ?? lengths[0])
    : (lengths.filter((m) => m <= months).pop() ?? lengths[0])
  const { monthly, total } = priceFor(pkg, priced)
  return {
    pkg,
    points,
    reasons,
    months: priced,
    monthly,
    total,
    withinBudget: budget === null || monthly <= budget,
    lengthAvailable,
  }
}
