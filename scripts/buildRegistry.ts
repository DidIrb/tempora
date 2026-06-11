/**
 * buildRegistry.ts
 * Walks all templates/.../tempora.json files and compiles registry.json
 * Run with: npm run registry:build from root
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const TEMPLATES_DIR = path.resolve(ROOT_DIR, 'templates')
const OUTPUT_FILE = path.resolve(ROOT_DIR, 'registry.json')

interface TemporaConfig {
  id: string
  name: string
  language: string
  category: string
  description: string
  tags: string[]
  version: string
}

interface TemplateEntry extends TemporaConfig {
  path: string
}

interface Registry {
  version: string
  updatedAt: string
  templates: Record<string, TemplateEntry>
  byLanguage: Record<string, string[]>
  byCategory: Record<string, string[]>
}

function findTemporaConfigs(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const results: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findTemporaConfigs(fullPath))
    } else if (entry.name === 'tempora.json') {
      results.push(fullPath)
    }
  }
  return results
}

function validateConfig(config: unknown, filePath: string): config is TemporaConfig {
  const required = ['id', 'name', 'language', 'category', 'description', 'tags', 'version']
  for (const key of required) {
    if (!(config as Record<string, unknown>)[key]) {
      console.error(`  ✖ Missing field "${key}" in ${filePath}`)
      return false
    }
  }
  return true
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

    const relativePath = path
      .relative(ROOT_DIR, path.dirname(configPath))
      .replace(/\\/g, '/')

    // add to templates map
    registry.templates[parsed.id] = { ...parsed, path: relativePath }

    // add to byLanguage index
    if (!registry.byLanguage[parsed.language]) registry.byLanguage[parsed.language] = []
    registry.byLanguage[parsed.language].push(parsed.id)

    // add to byCategory index
    if (!registry.byCategory[parsed.category]) registry.byCategory[parsed.category] = []
    registry.byCategory[parsed.category].push(parsed.id)

    console.log(`  ✔ ${parsed.id} (${parsed.language} / ${parsed.category})`)
    valid++
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2))

  console.log(`\nDone — ${valid} template(s) added, ${skipped} skipped.`)
  console.log(`Output: ${OUTPUT_FILE}`)
}

build()
