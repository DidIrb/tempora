import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'fs'
import { Readable } from 'stream'
import { logger } from '@utils'
import type { TemplateEntry } from '@appTypes'
import { config } from '../config.js'

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

async function downloadDir(remotePath: string, localPath: string): Promise<void> {
  const entries = await fetchDirContents(remotePath)
  for (const entry of entries) {
    if (entry.type === 'file') {
      await downloadFile(entry.path, path.join(localPath, entry.name))
    } else if (entry.type === 'dir') {
      await downloadDir(entry.path, path.join(localPath, entry.name))
    }
  }
}

export async function downloadTemplate(template: TemplateEntry, targetDir: string): Promise<void> {
  logger.info(`Downloading ${template.name}...`)
  await downloadDir(template.path, targetDir)
}
