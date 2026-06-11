import { createRequire } from 'module'
import { logger } from '@utils'

const REMOTE_PKG_URL =
  'https://raw.githubusercontent.com/your-org/tempora/main/packages/cli/package.json'

export async function checkVersion(): Promise<void> {
  try {
    const require = createRequire(import.meta.url)
    const { version: current } = require('../../package.json') as { version: string }

    const res = await fetch(REMOTE_PKG_URL, { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return

    const { version: latest } = (await res.json()) as { version: string }

    if (current !== latest) {
      logger.warn(`Update available: ${current} → ${latest}`)
      logger.log('  Run: pnpm install -g @tempora/cli')
      logger.log('')
    }
  } catch {
    // silently ignore — must never crash the CLI
  }
}
