import { Command } from 'commander'
import ora from 'ora'
import {
  logger,
  resolveTargetDir,
  downloadTemplate,
  printPostInstall,
  fetchRegistry,
  runGuidedSelection,
} from '@utils'

export function registerInitCommand(program: Command): void {
  program
    .command('init [template] [directory]')
    .description('Scaffold a new project from a Tempora template')
    .action(async (template?: string, directory?: string) => {
      const spinner = ora()

      try {
        // -- fetch registry
        spinner.start('Loading registry...')
        const registry = await fetchRegistry()
        spinner.stop()

        let resolvedTemplate = template
        let resolvedDirectory = directory

        // -- guided mode if no template given
        if (!resolvedTemplate) {
          const entry = await runGuidedSelection(registry)
          if (!entry) return
          resolvedTemplate = entry.id
        }

        // -- look up template
        const entry = registry.templates[resolvedTemplate]
        if (!entry) {
          logger.error(`Template "${resolvedTemplate}" not found.`)
          logger.log('Browse all templates at https://tempora.dev/templates')
          process.exit(1)
        }

        // -- resolve target directory
        const targetDir = await resolveTargetDir(resolvedDirectory)
        if (!targetDir) return

        // -- download
        spinner.start(`Scaffolding ${entry.name}...`)
        await downloadTemplate(entry, targetDir)
        spinner.stop()

        // -- post install
        printPostInstall(entry, targetDir)
      } catch (err) {
        spinner.stop()
        logger.error(err instanceof Error ? err.message : 'Something went wrong.')
        process.exit(1)
      }
    })
}
