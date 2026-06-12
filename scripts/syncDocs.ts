/**
 * syncDocs.ts
 * Reads README.md from each template folder and copies it into
 * apps/docs/pages/templates/<language>/<id>.mdx
 * Run with: npm run docs:sync from root
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { findTemporaConfigs, validateConfig, type TemporaConfig } from './utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const TEMPLATES_DIR = path.resolve(ROOT_DIR, 'templates')
const DOCS_TEMPLATES_DIR = path.resolve(ROOT_DIR, 'apps/docs/pages/templates')

interface SyncedTemplate {
  id: string
  name: string
  language: string
}

function addFrontmatter(content: string, config: TemporaConfig): string {
  return ['---', `title: ${config.name}`, `description: ${config.description}`, '---', '', content].join('\n')
}

function sync(): void {
  console.log('Syncing docs...\n')

  const configPaths = findTemporaConfigs(TEMPLATES_DIR)

  if (configPaths.length === 0) {
    console.warn('  No templates found.')
    return
  }

  const byLanguage: Record<string, SyncedTemplate[]> = {}
  let synced = 0
  let skipped = 0

  for (const configPath of configPaths) {
    const readmePath = path.join(path.dirname(configPath), 'README.md')

    if (!fs.existsSync(readmePath)) {
      console.warn(`  ⚠ No README.md in ${path.dirname(configPath)} — skipping`)
      skipped++
      continue
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    } catch {
      console.error(`  ✖ Invalid JSON in ${configPath}`)
      skipped++
      continue
    }

    if (!validateConfig(parsed, configPath)) {
      skipped++
      continue
    }

    const config = parsed as TemporaConfig
    const readmeContent = fs.readFileSync(readmePath, 'utf-8')
    const langDir = path.join(DOCS_TEMPLATES_DIR, config.language)
    fs.mkdirSync(langDir, { recursive: true })

    const mdxContent = addFrontmatter(readmeContent, config)
    fs.writeFileSync(path.join(langDir, `${config.id}.mdx`), mdxContent)

    if (!byLanguage[config.language]) byLanguage[config.language] = []
    byLanguage[config.language].push({ id: config.id, name: config.name, language: config.language })

    console.log(`  ✔ ${config.id} → pages/templates/${config.language}/${config.id}.mdx`)
    synced++
  }

  for (const [language, templates] of Object.entries(byLanguage)) {
    const meta: Record<string, string> = {}
    for (const t of templates) meta[t.id] = t.name
    fs.writeFileSync(path.join(DOCS_TEMPLATES_DIR, language, '_meta.json'), JSON.stringify(meta, null, 2))
  }

  const rootMeta: Record<string, string> = { index: 'Overview' }
  for (const language of Object.keys(byLanguage)) {
    rootMeta[language] = language.charAt(0).toUpperCase() + language.slice(1)
  }
  fs.writeFileSync(path.join(DOCS_TEMPLATES_DIR, '_meta.json'), JSON.stringify(rootMeta, null, 2))

  console.log(`\nDone — ${synced} synced, ${skipped} skipped.\n`)
}

sync()
