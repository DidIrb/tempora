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
 *
 * @returns Absolute path to the templates folder, or null if not found.
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
 * If overwrite is false, existing files at the destination are skipped.
 *
 * @param srcDir - Source directory to copy from.
 * @param destDir - Destination directory to copy into.
 * @param overwrite - Whether to overwrite existing files.
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
 * Only the specific template folder is fetched — not the full repository.
 *
 * A temporary `.tempora-tmp/` folder is created inside targetDir during the clone
 * and is always cleaned up in the finally block, even if the clone fails.
 *
 * @param templatePath - The registry `path` field, e.g. `templates/typescript/frontend/nextjs/next-tailwind`
 * @param targetDir - The directory to scaffold into.
 * @param overwrite - Whether to overwrite existing files.
 * @throws If git is not installed, there is no internet connection, or the template path is not found in the repo.
 */
function cloneTemplateSparse(templatePath: string, targetDir: string, overwrite: boolean): void {
  const repoUrl = `https://github.com/${config.github.org}/${config.github.repo}.git`
  const tmpDir = path.join(targetDir, '.tempora-tmp')

  // Check git is available before attempting anything
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
    // always clean up tmp folder regardless of success or failure
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}

/**
 * Downloads a template into the target directory.
 *
 * In dev mode (local `templates/` folder detected): copies files directly from disk.
 * In prod mode (no local templates): uses git sparse checkout from GitHub.
 *
 * @param template - The TemplateEntry from the registry.
 * @param targetDir - The directory to scaffold into.
 * @param overwrite - Whether to overwrite existing files.
 */
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
