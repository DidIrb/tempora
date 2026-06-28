import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLI_ROOT = path.resolve(__dirname, '..')
const REPO_ROOT = path.resolve(CLI_ROOT, '../..')
const TEMPLATES_DIR = path.resolve(REPO_ROOT, 'templates')
const OUTPUT_FILE = path.resolve(CLI_ROOT, 'dist/registry.json')
const REPO_REGISTRY_FILE = path.resolve(CLI_ROOT, 'registry.json')

function findTemporaConfigs(dir) {
  if (!fs.existsSync(dir)) return []
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) results.push(...findTemporaConfigs(fullPath))
    else if (entry.name === 'tempora.json') results.push(fullPath)
  }
  return results
}

function build() {
  console.log('Building registry...\n')
  const configPaths = findTemporaConfigs(TEMPLATES_DIR)

  if (configPaths.length === 0) {
    console.warn('  No tempora.json files found.')
    return
  }

  const registry = {
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    templates: {},
    byLanguage: {},
    byCategory: {},
    byLibrary: {},
  }

  let valid = 0
  let skipped = 0

  for (const configPath of configPaths) {
    let parsed
    try {
      parsed = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    } catch {
      console.error(`  ✖ Invalid JSON in ${configPath}`)
      skipped++
      continue
    }

    const required = ['id', 'name', 'language', 'category', 'library', 'description', 'tags', 'version']
    const missing = required.filter(k => !parsed[k])
    if (missing.length > 0) {
      console.error(`  ✖ Missing fields [${missing.join(', ')}] in ${configPath}`)
      skipped++
      continue
    }

    if (registry.templates[parsed.id]) {
      console.error(`  ✖ Duplicate template id "${parsed.id}" found in:`)
      console.error(`      ${configPath}`)
      console.error(`    The id must be unique across all templates. Build stopped.`)
      process.exit(1)
    }

    const relativePath = path.relative(REPO_ROOT, path.dirname(configPath)).replace(/\\/g, '/')
    registry.templates[parsed.id] = { ...parsed, path: relativePath }

    if (!registry.byLanguage[parsed.language]) registry.byLanguage[parsed.language] = []
    registry.byLanguage[parsed.language].push(parsed.id)

    if (!registry.byCategory[parsed.category]) registry.byCategory[parsed.category] = []
    registry.byCategory[parsed.category].push(parsed.id)

    if (!registry.byLibrary[parsed.library]) registry.byLibrary[parsed.library] = []
    registry.byLibrary[parsed.library].push(parsed.id)

    console.log(`  ✔ ${parsed.id} (${parsed.language} / ${parsed.category} / ${parsed.library})`)
    valid++
  }

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2))
  fs.writeFileSync(REPO_REGISTRY_FILE, JSON.stringify(registry, null, 2))
  console.log(`\nRegistry built — ${valid} template(s), ${skipped} skipped → dist/registry.json + registry.json\n`)
}

build()
