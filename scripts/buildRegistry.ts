/**
 * buildRegistry.ts
 * Walks all templates/.../tempora.json files and compiles registry.json
 * Outputs to packages/cli/registry.json
 * Run with: npm run registry:build from root
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { findTemporaConfigs, validateConfig } from './utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const TEMPLATES_DIR = path.resolve(ROOT_DIR, 'templates')
const OUTPUT_FILE = path.resolve(ROOT_DIR, 'packages/cli/registry.json')

interface TemplateEntry {
  id: string
  name: string
  language: string
  category: string
  description: string
  path: string
  tags: string[]
  version: string
  nextSteps?: string[]
}

interface Registry {
  version: string
  updatedAt: string
  templates: Record<string, TemplateEntry>
  byLanguage: Record<string, string[]>
  byCategory: Record<string, string[]>
}

function build(): void {
  console.log('Building registry...\n')

  const configPaths = findTemporaConfigs(TEMPLATES_DIR)

  if (configPaths.length === 0) {
    console.warn('  No tempora.json files found in templates/.')
    return
  }

  const registry: Registry = {
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    templates: {},
    byLanguage: {},
    byCategory: {},
  }

  let valid = 0
  let skipped = 0

  for (const configPath of configPaths) {
    const raw = fs.readFileSync(configPath, 'utf-8')
    let parsed: unknown

    try {
      parsed = JSON.parse(raw)
    } catch {
      console.error(`  ✖ Invalid JSON in ${configPath}`)
      skipped++
      continue
    }

    if (!validateConfig(parsed, configPath)) {
      skipped++
      continue
    }

    // path relative from repo root — used directly in git sparse-checkout
    const relativePath = path
      .relative(ROOT_DIR, path.dirname(configPath))
      .replace(/\\/g, '/')

    registry.templates[parsed.id] = { ...parsed, path: relativePath }

    if (!registry.byLanguage[parsed.language]) registry.byLanguage[parsed.language] = []
    registry.byLanguage[parsed.language].push(parsed.id)

    if (!registry.byCategory[parsed.category]) registry.byCategory[parsed.category] = []
    registry.byCategory[parsed.category].push(parsed.id)

    console.log(`  ✔ ${parsed.id} — path: ${relativePath}`)
    valid++
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2))
  console.log(`\nDone — ${valid} template(s), ${skipped} skipped → packages/cli/registry.json\n`)
}

build()
