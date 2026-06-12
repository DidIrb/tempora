import path from 'path'
import { logger } from '@utils'
import type { TemplateEntry } from '@appTypes'

const DEFAULT_NEXT_STEPS = ['pnpm install', 'pnpm dev']

export function printPostInstall(template: TemplateEntry, targetDir: string): void {
  const isCwd = path.resolve(targetDir) === path.resolve(process.cwd())
  const dirName = isCwd ? null : path.basename(targetDir)
  const steps = template.nextSteps ?? DEFAULT_NEXT_STEPS

  logger.log(`\n  ${template.description}\n`)
  logger.log('  Next steps:\n')

  if (dirName) {
    logger.log(`    cd ${dirName}`)
  }

  for (const step of steps) {
    logger.log(`    ${step}`)
  }

  logger.log('')
}
