/**
 * Create an administrator from the server's command line.
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a long passphrase' npm run admin:create
 *
 * Refuses to run when an administrator already exists, unless ADMIN_ADD=true
 * (then it adds one more). There is no public sign-up page.
 */
import config from '@payload-config'
import crypto from 'node:crypto'
import { getPayload } from 'payload'

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim()
  let password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME?.trim() || undefined
  if (!email) throw new Error('Set ADMIN_EMAIL (and ADMIN_PASSWORD) before running this command.')

  const payload = await getPayload({ config })
  const admins = await payload.count({ collection: 'users', where: { roles: { contains: 'admin' } }, overrideAccess: true })
  if (admins.totalDocs > 0 && process.env.ADMIN_ADD !== 'true') {
    throw new Error('An administrator already exists. Sign in and invite users from the admin, or set ADMIN_ADD=true.')
  }

  let generated = false
  if (!password) {
    password = crypto.randomBytes(18).toString('base64url')
    generated = true
  }
  if (password.length < 12) throw new Error('Use a password of at least 12 characters.')

  await payload.create({
    collection: 'users',
    data: { email, password, name, roles: ['admin'] },
    overrideAccess: true,
    context: { allowAdminSetup: true },
  })
  console.log(`Administrator ${email} created.`)
  if (generated) console.log(`Generated password (shown once, store it in a password manager): ${password}`)
  process.exit(0)
}

// payload run exits when the module finishes loading, so await at top level.
await main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
