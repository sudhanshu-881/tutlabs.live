import 'dotenv/config'
import { execSync } from 'node:child_process'

try {
  execSync('drizzle-kit push', { stdio: 'inherit' })
} catch (err) {
  console.error('Failed to push schema:', err)
  process.exit(1)
}
