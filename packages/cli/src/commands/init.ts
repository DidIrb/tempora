import { Command } from 'commander'
import ora from 'ora'
import { logger, resolveTargetDir, downloadTemplate, printPostInstall, fetchRegistry } from '@utils'

export function registerInitCommand(program: Command): void {
  program
    .command('init [template] [directory]')
    .description('Scaffold a new project from a Tempora template')
    .option('-l, --language <language>', 'Filter by language')
    .option('-c, --category <category>', 'Filter by category')
    .action(async (template?: string, directory?: string) => {
      const spinner = ora()

      try {
        spinner.start('Loading registry...')
        const registry = await fetchRegistry()
        spinner.stop()

        if (!template) {
          logger.info('Guided mode coming in Stage 2c.')
          logger.log('Usage: tempora init <template> [directory]')
          logger.log('Browse templates at https://tempora.dev/templates')
          return
        }

        const entry = registry.templates[template]
        if (!entry) {
          logger.error(`Template "${template}" not found.`)
          logger.log('Browse all templates at https://tempora.dev/templates')
          process.exit(1)
        }

        const targetDir = await resolveTargetDir(directory)
        if (!targetDir) return

        spinner.start(`Scaffolding ${entry.name}...`)
        await downloadTemplate(entry, targetDir)
        spinner.stop()

        printPostInstall(entry, targetDir)
      } catch (err) {
        spinner.stop()
        logger.error(err instanceof Error ? err.message : 'Something went wrong.')
        process.exit(1)
      }
    })
}
