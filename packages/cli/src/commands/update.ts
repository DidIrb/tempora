import { Command } from 'commander'
import { createRequire } from 'module'
import pc from 'picocolors'

const require = createRequire(import.meta.url)
const { version: current } = require('../package.json') as { version: string }

export function registerUpdateCommand(program: Command): void {
  program
    .command('update')
    .description('Check for updates to the Tempora CLI')
    .action(async () => {
      try {
        console.log('')
        console.log('  Checking for updates...')

        const res = await fetch('https://registry.npmjs.org/tempora-cli/latest', {
          signal: AbortSignal.timeout(5000),
        })

        if (!res.ok) {
          console.log('  ' + pc.red('Could not reach npm registry. Check your connection.'))
          return
        }

        const { version: latest } = (await res.json()) as { version: string }

        if (current === latest) {
          console.log('  ' + pc.green('✔') + ' You are on the latest version ' + pc.bold(current))
        } else {
          const [curMajor, curMinor] = current.split('.').map(Number)
          const [latMajor, latMinor] = latest.split('.').map(Number)

          let type = 'patch'
          if (latMajor > curMajor) type = 'major'
          else if (latMinor > curMinor) type = 'minor'

          console.log('')
          console.log('  ' + pc.bgYellow(pc.black(` ${type.toUpperCase()} UPDATE `)) + ' ' + pc.dim(current) + ' → ' + pc.green(pc.bold(latest)))
          console.log('  ' + pc.dim('Run: ') + pc.cyan('npm install -g tempora-cli'))
          console.log('  ' + pc.dim('https://www.npmjs.com/package/tempora-cli'))
        }
        console.log('')
      } catch {
        console.log('  ' + pc.red('Failed to check for updates.'))
      }
    })
}
