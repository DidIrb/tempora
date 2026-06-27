import { createRequire } from 'module'
import pc from 'picocolors'

const require = createRequire(import.meta.url)
const { version: current } = require('../package.json') as { version: string }

export async function checkVersion(): Promise<void> {
  try {
    const res = await fetch('https://registry.npmjs.org/tempora-cli/latest', {
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return

    const { version: latest } = (await res.json()) as { version: string }
    if (!current || !latest || current === latest) return

    const [curMajor, curMinor] = current.split('.').map(Number)
    const [latMajor, latMinor] = latest.split('.').map(Number)

    const isMinorOrMajor = latMajor > curMajor || (latMajor === curMajor && latMinor > curMinor)
    if (!isMinorOrMajor) return

    console.log('')
    console.log('  ' + pc.bgYellow(pc.black(' UPDATE ')) + ' ' + pc.dim(current) + ' → ' + pc.green(pc.bold(latest)))
    console.log('  ' + pc.dim('Run: ') + pc.cyan('npm install -g tempora-cli'))
    console.log('  ' + pc.dim('https://www.npmjs.com/package/tempora-cli'))
    console.log('')
  } catch {
    // silently ignore — must never crash the CLI
  }
}
