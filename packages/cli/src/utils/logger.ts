import pc from 'picocolors'

export const logger = {
  info: (msg: string) => console.log(pc.cyan('  info ') + msg),
  success: (msg: string) => console.log(pc.green('  ✔ ') + msg),
  warn: (msg: string) => console.log(pc.yellow('  warn ') + msg),
  error: (msg: string) => console.error(pc.red('  ✖ ') + msg),
  log: (msg: string) => console.log('  ' + msg),
}
