import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLI_ROOT = path.resolve(__dirname, '..')
const TEMPLATES_DIR = path.resolve(CLI_ROOT, '../../templates')
const OUTPUT_FILE = path.resolve(CLI_ROOT, 'dist/registry.json')

function findTemporaConfigs(dir) {
  if (!fs.existsSync(dir)) return []
  const results = []
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

function validateConfig(config, filePath) {
  const required = ['id', 'name', 'language', 'category', 'description', 'tags', 'version']
  for (const key of required) {
    if (!config[key]) {
      console.error(`  ✖ Missing field "${key}" in ${filePath}`)
      return false
    }
  }
  return true
}

function build() {
  console.log('\nBuilding registry...\n')

  const configPaths = findTemporaConfigs(TEMPLATES_DIR)

  if (configPaths.length === 0) {
    console.warn('  No tempora.json files found in templates/.')
    return
  }

  const registry = {
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
    let parsed

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
      .relative(path.resolve(CLI_ROOT, '../..'), path.dirname(configPath))
      .replace(/\\/g, '/')

    registry.templates[parsed.id] = { ...parsed, path: relativePath }

    if (!registry.byLanguage[parsed.language]) registry.byLanguage[parsed.language] = []
    registry.byLanguage[parsed.language].push(parsed.id)

    if (!registry.byCategory[parsed.category]) registry.byCategory[parsed.category] = []
    registry.byCategory[parsed.category].push(parsed.id)

    console.log(`  ✔ ${parsed.id} (${parsed.language} / ${parsed.category})`)
    valid++
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2))
  console.log(`\nRegistry built — ${valid} template(s), ${skipped} skipped → dist/registry.json\n`)
}

build()
