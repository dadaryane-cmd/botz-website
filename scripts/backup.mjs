/**
 * Backup and restore for the local SQLite database and uploaded media.
 *
 *   node scripts/backup.mjs              → backups/<timestamp>/{botz.db, media/}
 *   node scripts/backup.mjs restore <dir> → restores that backup (stop the site first)
 *
 * Uses SQLite "VACUUM INTO", which makes a consistent copy even while the
 * site is running. For Turso/libSQL cloud databases use the provider's
 * backups instead; for S3 media use bucket versioning (see README).
 */
import { createClient } from '@libsql/client'
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const url = process.env.DATABASE_URL || 'file:./data/botz.db'
if (!url.startsWith('file:')) {
  console.error('DATABASE_URL is not a local file. Use your database provider’s backup tools.')
  process.exit(1)
}
const dbPath = path.resolve(root, url.replace(/^file:/, ''))
const mediaDir = path.resolve(root, 'media')

const [, , cmd, arg] = process.argv

if (cmd === 'restore') {
  const dir = path.resolve(root, arg ?? '')
  const src = path.join(dir, 'botz.db')
  if (!arg || !fs.existsSync(src)) {
    console.error('Usage: node scripts/backup.mjs restore backups/<timestamp>')
    process.exit(1)
  }
  // Keep the current state too, just in case.
  if (fs.existsSync(dbPath)) fs.copyFileSync(dbPath, `${dbPath}.before-restore-${Date.now()}`)
  for (const ext of ['-wal', '-shm']) fs.rmSync(`${dbPath}${ext}`, { force: true })
  fs.copyFileSync(src, dbPath)
  if (fs.existsSync(path.join(dir, 'media'))) {
    fs.rmSync(mediaDir, { recursive: true, force: true })
    fs.cpSync(path.join(dir, 'media'), mediaDir, { recursive: true })
  }
  // Cached pages would otherwise show pre-restore content until they expire.
  fs.rmSync(path.resolve(root, '.next', 'cache', 'fetch-cache'), { recursive: true, force: true })
  fs.rmSync(path.resolve(root, '.next', 'dev', 'cache', 'fetch-cache'), { recursive: true, force: true })
  console.log(`Restored database and media from ${dir}. Start the site again.`)
  process.exit(0)
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const out = path.resolve(root, 'backups', stamp)
fs.mkdirSync(out, { recursive: true })
const client = createClient({ url })
const target = path.join(out, 'botz.db').replace(/\\/g, '/').replace(/'/g, "''")
await client.execute(`VACUUM INTO '${target}'`)
client.close()
if (fs.existsSync(mediaDir)) fs.cpSync(mediaDir, path.join(out, 'media'), { recursive: true })
console.log(`Backup written to ${path.relative(root, out)}`)
