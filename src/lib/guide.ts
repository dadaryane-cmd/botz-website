import { availableDurations, findPackage, isDuration, monthlyFee, priceLine } from './pricing/engine'
import type { Catalog, Duration, Pkg } from './pricing/types'

export type GuideOption = { value: string; label: string; budgetMax?: number | null; months?: number | null }
export type GuideQuestion = { key: string; role: 'normal' | 'budget' | 'duration'; label: string; help?: string | null; options: GuideOption[] }
export type GuideRule = { key: string; packageKey: string; points: number; when: { question: string; values: string[] }[]; reason: string }
export type GuideConfig = { questions: GuideQuestion[]; rules: GuideRule[] }
export type Answers = Record<string, string>

export type Candidate = {
  pkg: Pkg
  score: number
  reasons: string[]
  duration: Duration | null
  monthly: number | null
  total: number | null
  withinBudget: boolean
  durationAvailable: boolean
}

export type GuideResult = {
  best: Candidate | null
  alternatives: Candidate[]
  suggestCustom: boolean
  duration: Duration | null
  budgetMax: number | null
}

/**
 * Transparent scoring: each rule whose conditions all match adds its points
 * to a package and contributes its reason. Budget and term questions never
 * remove a package from consideration silently — they rank it and the UI
 * says why (e.g. over budget, term unavailable).
 */
export function recommend(config: GuideConfig, catalog: Catalog, answers: Answers): GuideResult {
  const durationQ = config.questions.find((q) => q.role === 'duration')
  const budgetQ = config.questions.find((q) => q.role === 'budget')
  const months = durationQ?.options.find((o) => o.value === answers[durationQ.key])?.months
  const duration = isDuration(months) ? months : null
  const budgetMaxRaw = budgetQ?.options.find((o) => o.value === answers[budgetQ.key])?.budgetMax
  const budgetMax = typeof budgetMaxRaw === 'number' && budgetMaxRaw > 0 ? budgetMaxRaw : null

  const scores = new Map<string, { score: number; reasons: string[] }>()
  for (const rule of config.rules) {
    const matches = rule.when.every((c) => c.values.includes(answers[c.question]))
    if (!matches) continue
    const pkg = findPackage(catalog, rule.packageKey)
    if (!pkg || !pkg.visible) continue
    const entry = scores.get(pkg.key) ?? { score: 0, reasons: [] }
    entry.score += rule.points
    if (rule.reason && !entry.reasons.includes(rule.reason)) entry.reasons.push(rule.reason)
    scores.set(pkg.key, entry)
  }

  const candidates: Candidate[] = []
  for (const [key, { score, reasons }] of scores) {
    if (score <= 0) continue
    const pkg = findPackage(catalog, key)!
    let d: Duration | null = null
    let monthly: number | null = null
    let total: number | null = null
    let durationAvailable = true
    if (pkg.category === 'website') {
      total = pkg.oneTimePrice ?? null
    } else {
      const avail = availableDurations(pkg)
      d = duration && avail.includes(duration) ? duration : null
      durationAvailable = duration ? d !== null : true
      // If the preferred term is unavailable, show the longest available term so the true cost is visible.
      if (!d) d = duration ? avail.filter((x) => x <= duration).pop() ?? avail[0] ?? null : avail[0] ?? null
      if (d) {
        const line = priceLine(pkg, d)
        monthly = line?.monthly ?? null
        total = line?.recurringTotal ?? null
      }
    }
    const withinBudget = budgetMax === null || pkg.category === 'website' || (monthly !== null && monthly <= budgetMax)
    candidates.push({ pkg, score, reasons, duration: d, monthly, total, withinBudget, durationAvailable })
  }

  // Rank by fit: within budget and term first, then score, then lower price.
  candidates.sort(
    (a, b) =>
      Number(b.withinBudget) - Number(a.withinBudget) ||
      Number(b.durationAvailable) - Number(a.durationAvailable) ||
      b.score - a.score ||
      (a.monthly ?? a.total ?? 0) - (b.monthly ?? b.total ?? 0),
  )

  const best = candidates.find((c) => c.withinBudget && c.durationAvailable) ?? null
  const alternatives = candidates.filter((c) => c !== best).slice(0, 2)
  const suggestCustom = !best || candidates.every((c) => !c.withinBudget)
  return { best, alternatives, suggestCustom, duration, budgetMax }
}

export const cheapestMonthly = (pkg: Pkg) =>
  Math.min(...availableDurations(pkg).map((d) => monthlyFee(pkg, d) ?? Infinity))
