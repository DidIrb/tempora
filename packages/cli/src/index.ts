#!/usr/bin/env node

import { Command } from 'commander'
import { registerInitCommand } from './commands'
import { checkVersion } from './utils/versionCheck'

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

// async version check — fires and forgets, never blocks the command
checkVersion().catch(() => undefined)

program.parse(process.argv)
