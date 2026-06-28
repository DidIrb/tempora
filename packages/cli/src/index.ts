import { Command } from 'commander'
import { createRequire } from 'module'
import { registerInitCommand, registerInfoCommand, registerUpdateCommand } from './commands/index.js'

const require = createRequire(import.meta.url)
const { version } = require('../package.json') as { version: string }

const program = new Command()

program
  .name('tempora')
  .description('Scaffold projects from curated templates')
  .version(version, '-v, --version', 'Show the current version')
  .addHelpText('after', `
Examples:
  $ tempora init next-tailwind my-app
  $ tempora init next-tailwind .
  $ tempora init
  $ tempora info next-tailwind
  $ tempora update
  `)

registerInitCommand(program)
registerInfoCommand(program)
registerUpdateCommand(program)

program.parse(process.argv)
