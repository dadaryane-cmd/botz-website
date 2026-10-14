/** npm run seed — creates missing content; safe to run repeatedly. */
import config from '@payload-config'
import { getPayload } from 'payload'
import { runSeed } from './seed'

// payload run exits when the module finishes loading, so await at top level.
await runSeed(await getPayload({ config }))
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
