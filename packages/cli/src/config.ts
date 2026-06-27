const org = 'DidIrb'
const repo = 'tempora'
const branch = 'main'

export const config = {
  github: {
    org,
    repo,
    branch,
    apiBase: `https://api.github.com/repos/${org}/${repo}/contents`,
    rawBase: `https://raw.githubusercontent.com/${org}/${repo}/${branch}`,
    registryUrl: `https://raw.githubusercontent.com/${org}/${repo}/${branch}/registry.json`,

  },
  docs: {
    url: 'https://tempora.dev/templates',
  },
} as const
