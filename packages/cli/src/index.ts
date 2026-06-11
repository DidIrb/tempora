#!/usr/bin/env node

import { Command } from 'commander'
import { registerInitCommand } from './commands'

const program = new Command()

program
  .name('tempora')
  .description('Scaffold projects from curated templates')
  .version('0.1.0', '-v, --version', 'Show the current version')

registerInitCommand(program)

program.parse(process.argv)
