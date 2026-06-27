import { Command } from 'commander'
import { createRequire } from 'module'
import { registerInitCommand } from './commands/index.js'
import { registerInfoCommand } from './commands/index.js'
import { checkVersion } from '@utils'

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
  `)

registerInitCommand(program)
registerInfoCommand(program)

checkVersion().catch(() => undefined)

program.parse(process.argv)
