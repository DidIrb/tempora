import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DOCS_ROOT = path.resolve(__dirname, '..')
const REPO_ROOT = path.resolve(DOCS_ROOT, '../..')
const TEMPLATES_DIR = path.resolve(REPO_ROOT, 'templates')
const DOCS_TEMPLATES_DIR = path.resolve(DOCS_ROOT, 'pages/templates')

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

function sync() {
  console.log('Syncing docs...\n')
  const configPaths = findTemporaConfigs(TEMPLATES_DIR)

  if (configPaths.length === 0) {
    console.warn('  No templates found.')
    return
  }

  const byLanguage = {}
  let synced = 0
  let skipped = 0

  for (const configPath of configPaths) {
    const readmePath = path.join(path.dirname(configPath), 'README.md')
    if (!fs.existsSync(readmePath)) {
      console.warn(`  ⚠ No README.md in ${path.dirname(configPath)} — skipping`)
      skipped++
      continue
    }

    let parsed
    try {
      parsed = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    } catch {
      console.error(`  ✖ Invalid JSON in ${configPath}`)
      skipped++
      continue
    }

    const langDir = path.join(DOCS_TEMPLATES_DIR, parsed.language)
    fs.mkdirSync(langDir, { recursive: true })

    const frontmatter = `---\ntitle: ${parsed.name}\ndescription: ${parsed.description}\n---\n\n`
    const content = frontmatter + fs.readFileSync(readmePath, 'utf-8')
    fs.writeFileSync(path.join(langDir, `${parsed.id}.mdx`), content)

    if (!byLanguage[parsed.language]) byLanguage[parsed.language] = []
    byLanguage[parsed.language].push({ id: parsed.id, name: parsed.name })

    console.log(`  ✔ ${parsed.id} → pages/templates/${parsed.language}/${parsed.id}.mdx`)
    synced++
  }

  for (const [language, templates] of Object.entries(byLanguage)) {
    const meta = {}
    for (const t of templates) meta[t.id] = t.name
    fs.writeFileSync(
      path.join(DOCS_TEMPLATES_DIR, language, '_meta.json'),
      JSON.stringify(meta, null, 2)
    )
  }

  const rootMeta = { index: 'Overview' }
  for (const language of Object.keys(byLanguage)) {
    rootMeta[language] = language.charAt(0).toUpperCase() + language.slice(1)
  }
  fs.writeFileSync(
    path.join(DOCS_TEMPLATES_DIR, '_meta.json'),
    JSON.stringify(rootMeta, null, 2)
  )

  console.log(`\nDone — ${synced} synced, ${skipped} skipped.\n`)
}

sync()
