import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Registry } from '@appTypes'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Loads the compiled registry.json from the CLI dist folder.
 *
 * The registry is built by `buildRegistry.mjs` at CLI build time and bundled
 * into `dist/` alongside the compiled CLI code. It is never fetched at runtime —
 * no network call is made here.
 *
 * @throws If registry.json is missing (i.e. CLI was not built yet).
 * @returns The full Registry object with templates, byLanguage, byCategory, byLibrary indexes.
 */
export function loadRegistry(): Registry {
  const registryPath = path.resolve(__dirname, './registry.json')
  if (!fs.existsSync(registryPath)) {
    throw new Error('Registry not found. Please rebuild the CLI with npm run build.')
  }
  const raw = fs.readFileSync(registryPath, 'utf-8')
  return JSON.parse(raw) as Registry
}
