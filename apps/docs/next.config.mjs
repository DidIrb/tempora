import nextra from 'nextra'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

export default withNextra({
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, '../../'),
})
