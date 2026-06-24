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

  // track by language > category > library for _meta.json generation
  const tree = {}
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

    const { id, name, language, category, library, description } = parsed
    if (!id || !language || !category || !library) {
      console.warn(`  ⚠ Missing required fields (id/language/category/library) in ${configPath} — skipping`)
      skipped++
      continue
    }
    const outDir = path.join(DOCS_TEMPLATES_DIR, language, category, library)
    fs.mkdirSync(outDir, { recursive: true })

    const frontmatter = `---\ntitle: ${name}\ndescription: ${description}\n---\n\n`
    fs.writeFileSync(path.join(outDir, `${id}.mdx`), frontmatter + fs.readFileSync(readmePath, 'utf-8'))

    // build tree for meta files
    if (!tree[language]) tree[language] = {}
    if (!tree[language][category]) tree[language][category] = {}
    if (!tree[language][category][library]) tree[language][category][library] = {}
    tree[language][category][library][id] = name

    console.log(`  ✔ ${id} → pages/templates/${language}/${category}/${library}/${id}.mdx`)
    synced++
  }

  // write _meta.json files at each level
  for (const [lang, categories] of Object.entries(tree)) {
    const langDir = path.join(DOCS_TEMPLATES_DIR, lang)
    const langMeta = {}
    for (const [cat, libraries] of Object.entries(categories)) {
      langMeta[cat] = cat.charAt(0).toUpperCase() + cat.slice(1)
      const catDir = path.join(langDir, cat)
      const catMeta = {}
      for (const [lib, templates] of Object.entries(libraries)) {
        catMeta[lib] = lib.charAt(0).toUpperCase() + lib.slice(1)
        const libDir = path.join(catDir, lib)
        const libMeta = {}
        for (const [id, name] of Object.entries(templates)) libMeta[id] = name
        fs.writeFileSync(path.join(libDir, '_meta.ts'), `export default ${JSON.stringify(libMeta, null, 2)}\n`)
      }
      fs.writeFileSync(path.join(catDir, '_meta.ts'), `export default ${JSON.stringify(catMeta, null, 2)}\n`)
    }
    fs.writeFileSync(path.join(langDir, '_meta.ts'), `export default ${JSON.stringify(langMeta, null, 2)}\n`)
  }

  // root templates _meta.json
  const rootMeta = { index: 'Overview' }
  for (const lang of Object.keys(tree)) rootMeta[lang] = lang.charAt(0).toUpperCase() + lang.slice(1)
  fs.writeFileSync(path.join(DOCS_TEMPLATES_DIR, '_meta.ts'), `export default ${JSON.stringify(rootMeta, null, 2)}\n`)

  console.log(`\nDone — ${synced} synced, ${skipped} skipped.\n`)
}

sync()
