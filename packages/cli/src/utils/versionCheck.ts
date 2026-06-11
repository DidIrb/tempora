import { logger } from '@utils'
import { config } from '../config.js'

export async function checkVersion(): Promise<void> {
  try {
    const { createRequire } = await import('module')
    const require = createRequire(import.meta.url)
    const { version: current } = require('../../package.json') as { version: string }

    const res = await fetch(config.github.cliPkgUrl, { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return

    const { version: latest } = (await res.json()) as { version: string }

    if (current !== latest) {
      logger.warn(`Update available: ${current} → ${latest}`)
      logger.log('  Run: pnpm add -g @tempora/cli')
      logger.log('')
    }
  } catch {
    // silently ignore — must never crash the CLI
  }
}
