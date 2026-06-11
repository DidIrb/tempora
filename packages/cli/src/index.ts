import { Command } from 'commander'
import { registerInitCommand } from './commands/index.js'
import { checkVersion } from '@utils'

const program = new Command()

program
  .name('tempora')
  .description('Scaffold projects from curated templates')
  .version('0.1.0', '-v, --version', 'Show the current version')
  .addHelpText('after', `
Examples:
  $ tempora init nextjs-tailwind my-app
  $ tempora init nextjs-tailwind .
  $ tempora init
  $ tempora info nextjs-tailwind
  `)

registerInitCommand(program)

checkVersion().catch(() => undefined)

program.parse(process.argv)
