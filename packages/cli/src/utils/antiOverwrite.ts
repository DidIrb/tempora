import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import { logger } from '@utils'

export async function resolveTargetDir(directory?: string): Promise<string | null> {
  const target = path.resolve(process.cwd(), directory ?? '.')

  if (!fs.existsSync(target)) return target

  const entries = fs.readdirSync(target).filter(f => f !== '.git' && f !== '.DS_Store')
  if (entries.length === 0) return target

  logger.warn(`Directory "${path.basename(target)}" is not empty.`)

  const { proceed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: 'Proceeding may overwrite existing files. Continue?',
      default: false,
    },
  ])

  if (!proceed) {
    logger.error('Aborted. No files were changed.')
    return null
  }

  return target
}
