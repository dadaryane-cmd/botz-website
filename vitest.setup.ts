// Tests never touch the development database: each run uses a fresh file under data/.
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'

// Remove databases left behind by earlier runs.
const dataDir = path.resolve('data')
if (fs.existsSync(dataDir))
  for (const f of fs.readdirSync(dataDir))
    if (/^test-\d+\.db/.test(f)) {
      try {
        fs.rmSync(path.join(dataDir, f), { force: true })
      } catch {
        // still locked by another process
      }
    }

process.env.DATABASE_URL = `file:./data/test-${process.pid}.db`
process.env.PAYLOAD_SECRET = process.env.PAYLOAD_SECRET || 'test-secret-for-automated-tests-only'
// Point email at a closed local port so "notification failed after save" is exercised for real.
process.env.SMTP_HOST = '127.0.0.1'
process.env.SMTP_PORT = '9'
process.env.SMTP_FROM_ADDRESS = 'website@botz.test'
