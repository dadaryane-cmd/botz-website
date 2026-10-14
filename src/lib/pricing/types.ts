/**
 * Plain data shapes used by the pricing engine. These mirror the
 * `pricing-catalog` global after it has been read for ONE locale and
 * stripped of private fields (see toPublicCatalog).
 */
export const DURATIONS = [1, 3, 6, 9, 12] as const
export type Duration = (typeof DURATIONS)[number]

export type Category = 'smm' | 'seo' | 'bundle' | 'website' | 'addon'
export type FeatureStatus = 'included' | 'not_included' | 'not_specified' | 'replaced'
export type Cadence = 'monthly' | 'first_month' | 'quarterly' | 'one_time' | 'ongoing' | 'per_project'
export type ContactKey = 'mariam' | 'edgar'
export type FeatureGroup =
  | 'scope'
  | 'content'
  | 'platforms'
  | 'production'
  | 'ads'
  | 'reporting'
  | 'support'
  | 'setup'
  | 'delivery'

export type FeatureDef = {
  key: string
  label: string
  group: FeatureGroup
  unit?: string | null
  order: number
  compare: boolean
}

export type PackageFeature = {
  featureKey: string
  status: FeatureStatus
  quantity?: number | null
  quantityMax?: number | null
  unit?: string | null
  cadence?: Cadence | null
  detail?: string | null
  note?: string | null
  replacedBy?: string | null
  order?: number | null
}

export type Prices = { m1?: number | null; m3?: number | null; m6?: number | null; m9?: number | null; m12?: number | null }

export type Pkg = {
  key: string
  category: Exclude<Category, 'addon'>
  name: string
  tagline?: string | null
  summary?: string | null
  prices: Prices
  oneTimePrice?: number | null
  priceIsFrom?: boolean | null
  recommended?: boolean | null
  badge?: string | null
  visible: boolean
  order: number
  inherits?: string | null
  components?: string[]
  contact?: ContactKey | 'either' | null
  features: PackageFeature[]
  boundaries: { text: string }[]
  inheritBoundaries?: boolean | null
}

export type Addon = {
  key: string
  name: string
  description?: string | null
  price: number
  priceIsFrom?: boolean | null
  units?: number | null
  relatedFeatureKey?: string | null
  appliesTo?: Category[]
  contact?: ContactKey | 'either' | null
  visible: boolean
  order: number
}

export type Catalog = {
  version: string
  currency: 'AMD'
  features: FeatureDef[]
  packages: Pkg[]
  addons: Addon[]
  terms: { text: string }[]
  /** True when this catalog is an authenticated draft preview. */
  isDraft?: boolean
}

export type ResolvedFeature = PackageFeature & {
  def?: FeatureDef
  /** Package key the value came from when inherited unchanged. */
  inheritedFrom?: string
  /** True when this package replaced an inherited value. */
  overridesInherited?: boolean
}

export type Selection = {
  packageKey?: string | null
  duration?: number | null
  addons?: { key: string; qty: number }[]
}

export type PriceLine = {
  monthly: number
  oneMonthFee: number
  months: number
  recurringTotal: number
  savings: number
}

export type Quote = {
  packageKey?: string
  duration?: number
  recurring?: PriceLine
  oneTimePackage?: number
  addons: { key: string; qty: number; unitPrice: number; total: number; priceIsFrom: boolean }[]
  oneTimeTotal: number
  combinedTotal: number
  isMinimum: boolean
  errors: QuoteError[]
}

export type QuoteError =
  | { code: 'unknown_package'; key: string }
  | { code: 'duration_unavailable'; key: string; duration: number }
  | { code: 'invalid_duration'; duration: number }
  | { code: 'unknown_addon'; key: string }
  | { code: 'invalid_quantity'; key: string }
  | { code: 'hidden'; key: string }
