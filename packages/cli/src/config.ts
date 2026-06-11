import 'dotenv/config'

function required(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

const org = required('TEMPORA_GITHUB_ORG')
const repo = required('TEMPORA_GITHUB_REPO')
const branch = required('TEMPORA_GITHUB_BRANCH')

export const config = {
  github: {
    org,
    repo,
    branch,
    apiBase: `https://api.github.com/repos/${org}/${repo}/contents`,
    rawBase: `https://raw.githubusercontent.com/${org}/${repo}/${branch}`,
    registryUrl: `https://raw.githubusercontent.com/${org}/${repo}/${branch}/registry.json`,
    cliPkgUrl: `https://raw.githubusercontent.com/${org}/${repo}/${branch}/packages/cli/package.json`,
  },
  docs: {
    url: process.env['TEMPORA_DOCS_URL'] ?? 'https://tempora.dev/templates',
  },
} as const
