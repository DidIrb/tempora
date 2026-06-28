import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Registry } from '@appTypes'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const REMOTE_REGISTRY_URL =
  'https://raw.githubusercontent.com/DidIrb/tempora/main/packages/cli/registry.json'

/**
 * Loads the registry — tries GitHub raw first for latest templates,
 * falls back to the bundled dist/registry.json if offline or fetch fails.
 */
export async function loadRegistry(): Promise<Registry> {
  try {
    const res = await fetch(REMOTE_REGISTRY_URL, {
      signal: AbortSignal.timeout(4000),
    })
    if (res.ok) {
      const data = await res.json()
      return data as Registry
    }
  } catch {
    // fall through to local
    console.log("Failed")
  }

  const registryPath = path.resolve(__dirname, './registry.json')
  if (!fs.existsSync(registryPath)) {
    throw new Error('Registry not found. Please rebuild the CLI with npm run build.')
  }
  const raw = fs.readFileSync(registryPath, 'utf-8')
  return JSON.parse(raw) as Registry
}
