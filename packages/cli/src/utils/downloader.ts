import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import type { TemplateEntry } from '@appTypes'
import { config } from '../config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Walks up the directory tree from the current file looking for a `templates/` folder.
 * Used to detect dev mode — when running from the local monorepo, templates are
 * available on disk and no git clone is needed.
 */
function findLocalTemplatesDir(): string | null {
  let current = __dirname
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(current, 'templates')
    if (fs.existsSync(candidate)) return candidate
    current = path.dirname(current)
  }
  return null
}

/**
 * Recursively copies a directory from src to dest.
 */
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

/**
 * Downloads a template from GitHub using git sparse checkout.
 */
function cloneTemplateSparse(templatePath: string, targetDir: string, overwrite: boolean): void {
  const repoUrl = `https://github.com/${config.github.org}/${config.github.repo}.git`
  const tmpDir = path.join(targetDir, '.tempora-tmp')

  try {
    execSync('git --version', { stdio: 'pipe' })
  } catch {
    throw new Error(
      'git is not installed or not available on your PATH.\n' +
      'Tempora requires git to download templates. Install it from https://git-scm.com and try again.'
    )
  }

  try {
    fs.mkdirSync(tmpDir, { recursive: true })

    try {
      execSync(`git clone --filter=blob:none --sparse --depth=1 ${repoUrl} .`, {
        cwd: tmpDir,
        stdio: 'pipe',
      })
    } catch {
      throw new Error(
        'Could not connect to GitHub to download the template.\n' +
        'Check your internet connection and try again.'
      )
    }

    try {
      execSync(`git sparse-checkout set ${templatePath}`, {
        cwd: tmpDir,
        stdio: 'pipe',
      })
    } catch {
      throw new Error(
        `Failed to checkout template path "${templatePath}" from the repository.\n` +
        'The template may have been moved or removed. Run "tempora init" to browse available templates.'
      )
    }

    const clonedTemplatePath = path.join(tmpDir, templatePath)
    if (!fs.existsSync(clonedTemplatePath)) {
      throw new Error(`Template path "${templatePath}" not found in repository.`)
    }

    copyDirLocal(clonedTemplatePath, targetDir, overwrite)
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}

/**
 * Downloads a template into the target directory.
 *
 * In dev mode (local templates/ folder detected): copies from disk.
 * In prod mode: uses git sparse checkout from GitHub — no local fallback.
 */
export async function downloadTemplate(
  template: TemplateEntry,
  targetDir: string,
  overwrite: boolean,
  spinner?: { text: string }
): Promise<void> {
  const localTemplatesDir = findLocalTemplatesDir()

  if (localTemplatesDir) {
    if (spinner) spinner.text = 'Copying template from local...'
    await new Promise(r => setTimeout(r, 50))
    const relativeParts = template.path.replace(/^templates\//, '').split('/')
    const localSrc = path.join(localTemplatesDir, ...relativeParts)
    if (fs.existsSync(localSrc)) {
      copyDirLocal(localSrc, targetDir, overwrite)
      return
    }
  }

  if (spinner) spinner.text = `Downloading ${template.name} from GitHub...`
  await new Promise(r => setTimeout(r, 50))
  cloneTemplateSparse(template.path, targetDir, overwrite)
}
