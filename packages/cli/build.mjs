import esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'

const outfile = path.resolve('dist/index.cjs')

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile,
  format: 'cjs',
  minify: false,
})

const content = fs.readFileSync(outfile, 'utf-8')
if (!content.startsWith('#!/usr/bin/env node')) {
  fs.writeFileSync(outfile, '#!/usr/bin/env node\n' + content)
}

fs.chmodSync(outfile, '755')
console.log('Build complete → dist/index.cjs')
