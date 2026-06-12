import fs from 'fs'

if (!fs.existsSync('registry.json')) {
  console.error('registry.json not found — run npm run registry:build from repo root first.')
  process.exit(1)
}

fs.copyFileSync('registry.json', 'dist/registry.json')
console.log('registry.json copied to dist/')
