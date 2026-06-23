import { Command } from 'commander'
import { logger, loadRegistry } from '@utils'

export function registerInfoCommand(program: Command): void {
  program
    .command('info <template>')
    .description('Show details about a specific template')
    .action((template: string) => {
      try {
        const registry = loadRegistry()
        const entry = registry.templates[template]

        if (!entry) {
          logger.error(`Template "${template}" not found.`)
          logger.log('Run tempora init to browse available templates.')
          process.exit(1)
        }

        logger.log('')
        logger.log(`  ${entry.name}`)
        logger.log(`  ${entry.description}`)
        logger.log('')
        logger.log(`  Language  ${entry.language}`)
        logger.log(`  Category  ${entry.category}`)
        logger.log(`  Library   ${entry.library}`)
        logger.log(`  Version   ${entry.version}`)
        logger.log(`  Tags      ${entry.tags.join(', ')}`)
        logger.log('')

        if (entry.nextSteps && entry.nextSteps.length > 0) {
          logger.log('  Next steps after scaffolding:')
          for (const step of entry.nextSteps) {
            logger.log(`    ${step}`)
          }
          logger.log('')
        }
      } catch (err) {
        logger.error(err instanceof Error ? err.message : 'Something went wrong.')
        process.exit(1)
      }
    })
}
