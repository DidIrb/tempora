import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'fs'
import { Readable } from 'stream'
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

interface GithubEntry {
  type: 'file' | 'dir'
  name: string
  path: string
}

async function fetchDirContents(apiPath: string): Promise<GithubEntry[]> {
  const res = await fetch(`${config.github.apiBase}/${apiPath}`, {
    headers: { Accept: 'application/vnd.github+json' },
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  return res.json() as Promise<GithubEntry[]>
}

async function downloadFile(remotePath: string, localPath: string, overwrite: boolean): Promise<void> {
  if (!overwrite && fs.existsSync(localPath)) return
  const res = await fetch(`${config.github.rawBase}/${remotePath}`, {
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`Failed to download ${remotePath}: ${res.status}`)
  fs.mkdirSync(path.dirname(localPath), { recursive: true })
  await pipeline(
    Readable.fromWeb(res.body as import('stream/web').ReadableStream),
    createWriteStream(localPath)
  )
}

async function downloadDirRemote(remotePath: string, localPath: string, overwrite: boolean): Promise<void> {
  const entries = await fetchDirContents(remotePath)
  for (const entry of entries) {
    if (entry.type === 'file') {
      await downloadFile(entry.path, path.join(localPath, entry.name), overwrite)
    } else if (entry.type === 'dir') {
      await downloadDirRemote(entry.path, path.join(localPath, entry.name), overwrite)
    }
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
    // local templates dir exists but template not found — do not fall through to GitHub
    throw new Error(`Template "${template.id}" not found in local templates folder.`)
  }

  await downloadDirRemote(template.path, targetDir, overwrite)
}
