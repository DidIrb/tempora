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
  // walk up from dist/ looking for templates/ folder
  let current = __dirname
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(current, 'templates')
    if (fs.existsSync(candidate)) return candidate
    current = path.dirname(current)
  }
  return null
}

function copyDirLocal(srcDir: string, destDir: string): void {
  fs.mkdirSync(destDir, { recursive: true })
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name)
    const destPath = path.join(destDir, entry.name)
    if (entry.isDirectory()) {
      copyDirLocal(srcPath, destPath)
    } else {
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

async function downloadFile(remotePath: string, localPath: string): Promise<void> {
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

async function downloadDirRemote(remotePath: string, localPath: string): Promise<void> {
  const entries = await fetchDirContents(remotePath)
  for (const entry of entries) {
    if (entry.type === 'file') {
      await downloadFile(entry.path, path.join(localPath, entry.name))
    } else if (entry.type === 'dir') {
      await downloadDirRemote(entry.path, path.join(localPath, entry.name))
    }
  }
}

export async function downloadTemplate(template: TemplateEntry, targetDir: string): Promise<void> {
  const localTemplatesDir = findLocalTemplatesDir()

  if (localTemplatesDir) {
    // strip leading "templates/" from path since we already have the templates dir
    const relativeParts = template.path.replace(/^templates\//, '').split('/')
    const localSrc = path.join(localTemplatesDir, ...relativeParts)
    if (fs.existsSync(localSrc)) {
      copyDirLocal(localSrc, targetDir)
      return
    }
  }

  await downloadDirRemote(template.path, targetDir)
}
