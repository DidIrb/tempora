import { Command } from 'commander'
import { registerInitCommand } from './commands/index.js'
import { registerInfoCommand } from './commands/index.js'
import { checkVersion } from '@utils'

const program = new Command()

program
  .name('tempora')
  .description('Scaffold projects from curated templates')
  .version('0.1.0', '-v, --version', 'Show the current version')
  .addHelpText('after', `
Examples:
  $ tempora init next-tailwind my-app
  $ tempora init next-tailwind .
  $ tempora init
  $ tempora info next-tailwind
  `)

registerInitCommand(program)
registerInfoCommand(program)

checkVersion().catch(() => undefined)

program.parse(process.argv)
