/**
 * syncDocs.ts
 * Walks all templates folders, reads README.md from each,
 * copies it into apps/docs/pages/templates/<language>/<id>.mdx
 * and auto-generates _meta.json for the sidebar.
 * Run with: npm run docs:sync from root
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const TEMPLATES_DIR = path.resolve(ROOT_DIR, 'templates')
const DOCS_TEMPLATES_DIR = path.resolve(ROOT_DIR, 'apps/docs/pages/templates')

interface TemporaConfig {
  id: string
  name: string
  language: string
  category: string
  description: string
  tags: string[]
  version: string
}

interface SyncedTemplate {
  id: string
  name: string
  language: string
}

function findTemplateDirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const results: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const hasConfig = fs.existsSync(path.join(fullPath, 'tempora.json'))
      if (hasConfig) {
        results.push(fullPath)
      } else {
        results.push(...findTemplateDirs(fullPath))
      }
    }
  }
  return results
}

function addFrontmatter(content: string, config: TemporaConfig): string {
  const frontmatter = [
    '---',
    `title: ${config.name}`,
    `description: ${config.description}`,
    '---',
    '',
  ].join('\n')
  return frontmatter + content
}

function sync(): void {
  console.log('Syncing docs...\n')

  const templateDirs = findTemplateDirs(TEMPLATES_DIR)

  if (templateDirs.length === 0) {
    console.warn('  No templates found.')
    return
  }

  // track synced templates grouped by language for _meta.json
  const byLanguage: Record<string, SyncedTemplate[]> = {}

  let synced = 0
  let skipped = 0

  for (const templateDir of templateDirs) {
    const configPath = path.join(templateDir, 'tempora.json')
    const readmePath = path.join(templateDir, 'README.md')

    if (!fs.existsSync(readmePath)) {
      console.warn(`  ⚠ No README.md in ${templateDir} — skipping`)
      skipped++
      continue
    }

    const config: TemporaConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    const readmeContent = fs.readFileSync(readmePath, 'utf-8')

    // create language subfolder if needed
    const langDir = path.join(DOCS_TEMPLATES_DIR, config.language)
    fs.mkdirSync(langDir, { recursive: true })

    // write mdx with frontmatter prepended
    const mdxContent = addFrontmatter(readmeContent, config)
    const outPath = path.join(langDir, `${config.id}.mdx`)
    fs.writeFileSync(outPath, mdxContent)

    if (!byLanguage[config.language]) byLanguage[config.language] = []
    byLanguage[config.language].push({ id: config.id, name: config.name, language: config.language })

    console.log(`  ✔ ${config.id} → pages/templates/${config.language}/${config.id}.mdx`)
    synced++
  }

  // write _meta.json for each language subfolder
  for (const [language, templates] of Object.entries(byLanguage)) {
    const meta: Record<string, string> = {}
    for (const t of templates) {
      meta[t.id] = t.name
    }
    const metaPath = path.join(DOCS_TEMPLATES_DIR, language, '_meta.json')
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2))
    console.log(`  ✔ _meta.json written for ${language}`)
  }

  // update root templates _meta.json to include language sections
  const rootMeta: Record<string, string> = { index: 'Overview' }
  for (const language of Object.keys(byLanguage)) {
    rootMeta[language] = language.charAt(0).toUpperCase() + language.slice(1)
  }
  fs.writeFileSync(
    path.join(DOCS_TEMPLATES_DIR, '_meta.json'),
    JSON.stringify(rootMeta, null, 2)
  )

  console.log(`\nDone — ${synced} synced, ${skipped} skipped.`)
}

sync()
