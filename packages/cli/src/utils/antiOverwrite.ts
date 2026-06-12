import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import { logger } from '@utils'

export interface TargetDirResult {
  targetDir: string
  overwrite: boolean
}

export async function resolveTargetDir(directory?: string): Promise<TargetDirResult | null> {
  const target = path.resolve(process.cwd(), directory ?? '.')

  if (!fs.existsSync(target)) {
    return { targetDir: target, overwrite: false }
  }

  const entries = fs.readdirSync(target).filter(f => f !== '.git' && f !== '.DS_Store')
  if (entries.length === 0) {
    return { targetDir: target, overwrite: false }
  }

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

  return { targetDir: target, overwrite: true }
}
