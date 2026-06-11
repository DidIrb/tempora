import path from 'path'
import { logger } from '@utils'
import type { TemplateEntry } from '@appTypes'

export function printPostInstall(template: TemplateEntry, targetDir: string): void {
  const isCwd = path.resolve(targetDir) === path.resolve(process.cwd())
  const dirName = isCwd ? null : path.basename(targetDir)

  logger.success(`${template.name} scaffolded successfully!\n`)
  logger.log(`  ${template.description}\n`)
  logger.log('  Next steps:\n')

  if (dirName) {
    logger.log(`    cd ${dirName}`)
  }

  logger.log('    pnpm install')
  logger.log('    pnpm dev\n')
}
