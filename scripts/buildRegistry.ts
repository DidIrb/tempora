/**
 * buildRegistry.ts
 * Walks all templates/**/tempora.json files and compiles registry.json
 * Full implementation in Stage 3
 */

import fs from 'fs'
import path from 'path'
import type { Registry, TemporaConfig } from '../packages/cli/src/types'

const TEMPLATES_DIR = path.resolve(__dirname, '../templates')
const OUTPUT_FILE = path.resolve(__dirname, '../registry.json')

function findTemporaConfigs(dir: string): string[] {
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

async function build(): Promise<void> {
  const configPaths = findTemporaConfigs(TEMPLATES_DIR)

  const registry: Registry = {
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    templates: {},
    byLanguage: {},
    byCategory: {},
  }

  for (const configPath of configPaths) {
    const raw = fs.readFileSync(configPath, 'utf-8')
    const config: TemporaConfig = JSON.parse(raw)
    const relativePath = path
      .relative(path.resolve(__dirname, '..'), path.dirname(configPath))
      .replace(/\\/g, '/')

    registry.templates[config.id] = { ...config, path: relativePath }

    if (!registry.byLanguage[config.language]) registry.byLanguage[config.language] = []
    registry.byLanguage[config.language].push(config.id)

    if (!registry.byCategory[config.category]) registry.byCategory[config.category] = []
    registry.byCategory[config.category].push(config.id)
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2))
  console.log(`Registry built — ${configPaths.length} template(s) found.`)
}

build()
