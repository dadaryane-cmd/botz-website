/** Helpers for the agency's social media profiles (content/site.json → social). */

/** The profile of `network` with a link, or null. */
export const profileOf = (social = [], network) =>
  social.find((profile) => profile.network === network && profile.url) ?? null

/**
 * "@botz.agency" from "https://www.instagram.com/botz.agency/" (TikTok's addresses already have
 * the "@": tiktok.com/@botz); '' when the address has no name.
 */
export function profileHandle(url) {
  const name = new URL(url).pathname.split('/').find(Boolean)?.replace(/^@/, '')
  return name ? `@${name}` : ''
}
