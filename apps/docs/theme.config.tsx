import { DocsThemeConfig } from 'nextra-theme-docs'
import React from 'react'

const config: DocsThemeConfig = {
  logo: <strong>Tempora</strong>,
  project: {
    link: 'https://github.com/your-org/tempora',
  },
  docsRepositoryBase: 'https://github.com/your-org/tempora/tree/main/apps/docs',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Tempora',
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Tempora — scaffold projects from curated templates" />
    </>
  ),
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{' '}
        <a href="https://github.com/your-org/tempora" target="_blank">
          Tempora
        </a>
      </span>
    ),
  },
  sidebar: {
    titleComponent({ title }) {
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 1,
  },
}

export default config
