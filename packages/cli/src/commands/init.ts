import { Command } from 'commander'
import { logger } from '@utils'

export function registerInitCommand(program: Command): void {
  program
    .command('init [template] [directory]')
    .description('Scaffold a new project from a Tempora template')
    .option('-l, --language <language>', 'Filter by language')
    .option('-c, --category <category>', 'Filter by category')
    .action(async (template?: string, directory?: string) => {
      // Full implementation in Stage 2b and 2c
      logger.info('init command coming in Stage 2')
    })
}
