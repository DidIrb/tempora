import { createRequire } from 'module'
import { logger } from '@utils'

const require = createRequire(import.meta.url)
const { version: current } = require('../package.json') as { version: string }

/**
 * Checks whether a newer version of tempora is available on npm.
 *
 * Runs async and non-blocking — must never throw or crash the CLI.
 * The current version is read at runtime from package.json.
 * The latest version is fetched from the npm registry so it always
 * reflects what is actually published, not just what is on the main branch.
 *
 * Only prompts the user on minor or major updates — patch bumps are silent.
 * If the fetch fails (offline, timeout, npm down), it silently does nothing.
 */
export async function checkVersion(): Promise<void> {
  try {
    const res = await fetch('https://registry.npmjs.org/tempora/latest', {
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return

    const { version: latest } = (await res.json()) as { version: string }
    if (!current || !latest || current === latest) return

    const [curMajor, curMinor] = current.split('.').map(Number)
    const [latMajor, latMinor] = latest.split('.').map(Number)

    const isMinorOrMajor = latMajor > curMajor || (latMajor === curMajor && latMinor > curMinor)
    if (!isMinorOrMajor) return

    logger.warn(`Update available: ${current} → ${latest}`)
    logger.log('  Run: npm install -g tempora')
    logger.log('')
  } catch {
    // silently ignore — must never crash the CLI
  }
}
