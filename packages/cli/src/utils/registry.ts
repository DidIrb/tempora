import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Registry } from '@appTypes'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function loadRegistry(): Registry {
  const registryPath = path.resolve(__dirname, './registry.json')
  if (!fs.existsSync(registryPath)) {
    throw new Error('Registry not found. Please rebuild the CLI with npm run build.')
  }
  const raw = fs.readFileSync(registryPath, 'utf-8')
  return JSON.parse(raw) as Registry
}
