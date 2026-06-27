import type { DocsThemeConfig } from 'nextra-theme-docs'
import React from 'react'

const config: DocsThemeConfig = {
  logo: <strong>Tempora</strong>,
  project: {
    link: 'https://github.com/your-org/tempora',
  },
  docsRepositoryBase: 'https://github.com/your-org/tempora/tree/main/apps/docs',
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Tempora — scaffold projects from curated templates" />
    </>
  ),
  footer: {
    content: <span>MIT © {new Date().getFullYear()} Tempora</span>,
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
}

export default config
