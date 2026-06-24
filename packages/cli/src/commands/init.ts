import { Command } from 'commander'
import ora from 'ora'
import {
  logger,
  resolveTargetDir,
  downloadTemplate,
  printPostInstall,
  loadRegistry,
  runGuidedSelection,
} from '@utils'
import { config } from '../config.js'

/**
 * Registers the `tempora init` command with the CLI program.
 *
 * Supports two modes:
 * - Direct: `tempora init <template> [directory]` — scaffolds immediately if template ID is known.
 * - Guided: `tempora init [directory]` — runs interactive prompts (language → category → library → template).
 *
 * The `directory` argument defaults to a folder named after the template ID.
 * Passing `.` scaffolds into the current directory.
 * A non-empty target directory triggers an overwrite confirmation.
 *
 * @param program - The root Commander program instance.
 */
export function registerInitCommand(program: Command): void {
  program
    .command('init [template] [directory]')
    .description('Scaffold a new project from a Tempora template')
    .action(async (template?: string, directory?: string) => {
      const spinner = ora()

      try {
        const registry = loadRegistry()

        let resolvedTemplate = template
        let resolvedDirectory = directory

        if (!resolvedTemplate) {
          const entry = await runGuidedSelection(registry)
          if (!entry) return
          resolvedTemplate = entry.id
        }

        const entry = registry.templates[resolvedTemplate]
        if (!entry) {
          logger.error(`Template "${resolvedTemplate}" not found.`)
          logger.log(`Browse all templates at ${config.docs.url}`)
          process.exit(1)
        }

        const result = await resolveTargetDir(resolvedDirectory)
        if (!result) return

        const { targetDir, overwrite } = result

        spinner.start(`Scaffolding ${entry.name}...`)
        await downloadTemplate(entry, targetDir, overwrite)
        spinner.succeed(`${entry.name} scaffolded successfully!`)

        printPostInstall(entry, targetDir)
      } catch (err) {
        spinner.stop()
        logger.error(err instanceof Error ? err.message : 'Something went wrong.')
        process.exit(1)
      }
    })
}
