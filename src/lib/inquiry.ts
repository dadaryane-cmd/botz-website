import { z } from 'zod'
import { locales } from '@/i18n/config'

export const inquirySchema = z
  .object({
    submissionId: z.string().uuid(),
    formToken: z.string().min(10).max(200),
    website: z.string().max(200).optional().default(''), // honeypot
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().max(200).optional().default(''),
    phone: z.string().trim().max(40).optional().default(''),
    service: z.enum(['smm', 'seo', 'bundle', 'website', 'addon', 'other']),
    message: z.string().trim().min(5).max(4000),
    preferredContact: z.enum(['mariam', 'edgar', 'either']),
    locale: z.enum(locales),
    source: z.string().max(300).optional().default(''),
    selection: z
      .object({
        packageKey: z.string().max(60).nullable().optional(),
        duration: z.number().int().nullable().optional(),
        addons: z.array(z.object({ key: z.string().max(60), qty: z.number().int().min(1).max(20) })).max(20).optional(),
      })
      .nullable()
      .optional(),
    estimateToken: z.string().max(100).optional(),
  })
  .superRefine((v, ctx) => {
    const email = v.email ?? ''
    const phone = v.phone ?? ''
    if (!email && !phone) ctx.addIssue({ code: 'custom', path: ['email'], message: 'needEmailOrPhone' })
    if (email && !z.string().email().safeParse(email).success) ctx.addIssue({ code: 'custom', path: ['email'], message: 'invalidEmail' })
    if (phone && !/^\+?[0-9 ()-]{6,20}$/.test(phone)) ctx.addIssue({ code: 'custom', path: ['phone'], message: 'invalidPhone' })
  })

export type InquiryInput = z.infer<typeof inquirySchema>

/** Map zod issues to field → message-key pairs used by the localized form. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? 'form')
    if (out[field]) continue
    if (issue.code === 'custom') out[field] = issue.message
    else if (field === 'message' && issue.code === 'too_small') out[field] = 'messageTooShort'
    else out[field] = 'required'
  }
  return out
}

/** Heuristic spam signals for free-text fields. */
export function looksLikeSpam(input: { message: string; name: string }) {
  const links = (input.message.match(/https?:\/\//gi) ?? []).length
  if (links > 3) return true
  if (/https?:\/\//i.test(input.name)) return true
  if (/<\s*a\s+href|\[url=/i.test(input.message)) return true
  return false
}
