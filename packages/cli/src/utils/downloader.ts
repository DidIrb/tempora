import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import type { TemplateEntry } from '@appTypes'
import { config } from '../config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function findLocalTemplatesDir(): string | null {
  let current = __dirname
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(current, 'templates')
    if (fs.existsSync(candidate)) return candidate
    current = path.dirname(current)
  }
  return null
}

function copyDirLocal(srcDir: string, destDir: string, overwrite: boolean): void {
  fs.mkdirSync(destDir, { recursive: true })
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name)
    const destPath = path.join(destDir, entry.name)
    if (entry.isDirectory()) {
      copyDirLocal(srcPath, destPath, overwrite)
    } else {
      if (!overwrite && fs.existsSync(destPath)) continue
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function cloneTemplateSparse(templatePath: string, targetDir: string, overwrite: boolean): void {
  const repoUrl = `https://github.com/${config.github.org}/${config.github.repo}.git`
  const tmpDir = path.join(targetDir, '.tempora-tmp')

  try {
    fs.mkdirSync(tmpDir, { recursive: true })

    // sparse clone — only fetch the specific template folder
    execSync(`git clone --filter=blob:none --sparse --depth=1 ${repoUrl} .`, {
      cwd: tmpDir,
      stdio: 'pipe',
    })

    execSync(`git sparse-checkout set ${templatePath}`, {
      cwd: tmpDir,
      stdio: 'pipe',
    })

    // copy from the cloned sparse folder into targetDir
    const clonedTemplatePath = path.join(tmpDir, templatePath)
    if (!fs.existsSync(clonedTemplatePath)) {
      throw new Error(`Template path "${templatePath}" not found in repository.`)
    }

    copyDirLocal(clonedTemplatePath, targetDir, overwrite)
  } finally {
    // always clean up tmp folder
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}

export async function downloadTemplate(
  template: TemplateEntry,
  targetDir: string,
  overwrite: boolean
): Promise<void> {
  const localTemplatesDir = findLocalTemplatesDir()

  if (localTemplatesDir) {
    const relativeParts = template.path.replace(/^templates\//, '').split('/')
    const localSrc = path.join(localTemplatesDir, ...relativeParts)
    if (fs.existsSync(localSrc)) {
      copyDirLocal(localSrc, targetDir, overwrite)
      return
    }
    throw new Error(`Template "${template.id}" not found in local templates folder.`)
  }

  cloneTemplateSparse(template.path, targetDir, overwrite)
}
