# Tempora — Master Reference

## What is Tempora?

Tempora is a CLI scaffolding tool that lets developers instantly bootstrap projects from a curated, community-driven template vault. Think `create-next-app` but language-agnostic, registry-driven, and with a companion documentation site.

A user runs:

```bash
tempora init next-tailwind my-app
```

And gets a fully configured project folder pulled directly from the Tempora GitHub repo via git sparse checkout — only the template folder you pick is downloaded, not the entire repo.

---

## Monorepo Structure

```
tempora/
├── packages/
│   └── cli/                        # @tempora/cli
│       ├── bin/
│       │   └── tempora.js          # global entry point → imports dist/index.js
│       ├── src/
│       │   ├── index.ts            # commander setup, registers all commands
│       │   ├── config.ts           # github org/repo/branch constants
│       │   ├── commands/
│       │   │   ├── index.ts        # barrel
│       │   │   ├── init.ts         # tempora init — direct and guided mode
│       │   │   └── info.ts         # tempora info <template> — prints template details
│       │   ├── utils/
│       │   │   ├── index.ts        # barrel
│       │   │   ├── logger.ts       # all logging — no raw console.log in prod
│       │   │   ├── antiOverwrite.ts
│       │   │   ├── downloader.ts   # dev=local copy, prod=git sparse checkout
│       │   │   ├── guided.ts       # language→category→library→template guided flow
│       │   │   ├── postInstall.ts  # prints nextSteps from template after scaffold
│       │   │   ├── registry.ts     # loadRegistry() reads dist/registry.json
│       │   │   └── versionCheck.ts # async non-blocking npm update checker
│       │   └── types/
│       │       └── index.ts        # TemplateEntry, Registry, TemporaConfig interfaces
│       ├── scripts/
│       │   └── buildRegistry.mjs   # walks templates/, writes dist/registry.json
│       ├── tsup.config.ts
│       └── package.json
├── apps/
│   └── docs/                       # @tempora/docs — Nextra v3
│       ├── scripts/
│       │   └── syncDocs.mjs        # walks templates/, copies READMEs into pages/templates/
│       ├── pages/
│       │   ├── index.tsx           # standalone landing page — no Nextra chrome
│       │   ├── home.mdx
│       │   ├── getting-started.mdx
│       │   ├── cli.mdx
│       │   ├── add-template.mdx
│       │   ├── changelog.mdx
│       │   ├── _meta.ts            # sidebar order
│       │   ├── _app.tsx
│       │   └── templates/
│       │       └── index.mdx       # auto-populated by syncDocs
│       ├── next.config.mjs
│       ├── theme.config.tsx
│       └── package.json
├── templates/                      # template vault
│   └── typescript/
│       └── frontend/
│           └── nextjs/
│               └── next-tailwind/
│                   ├── tempora.json
│                   └── README.md
├── .husky/
├── .github/
│   └── workflows/
│       └── ci.yml
├── MASTER.md
├── ROADMAP.md
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

---

## Template Vault Structure

Templates follow a strict 4-level hierarchy:

```
templates/<language>/<category>/<library>/<template-id>/
  tempora.json     # metadata — single source of truth
  README.md        # synced to docs site automatically on every build
  ...              # actual starter files
```

Example:
```
templates/typescript/frontend/nextjs/next-tailwind/
```

---

## tempora.json Schema

```json
{
  "id": "next-tailwind",
  "name": "Next.js + Tailwind",
  "language": "typescript",
  "category": "frontend",
  "library": "nextjs",
  "description": "Next.js 14 app router with Tailwind CSS and Prettier preconfigured.",
  "tags": ["nextjs", "tailwind", "typescript", "react"],
  "version": "1.0.0",
  "nextSteps": ["pnpm install", "pnpm dev"]
}
```

All fields are required. `buildRegistry.mjs` and `syncDocs.mjs` will skip and warn on any template missing required fields.

---

## registry.json Shape

Built into `dist/` by `buildRegistry.mjs`. Never edit manually.

```json
{
  "version": "1.0.0",
  "updatedAt": "...",
  "templates": {
    "next-tailwind": {
      "...all tempora.json fields",
      "path": "templates/typescript/frontend/nextjs/next-tailwind"
    }
  },
  "byLanguage": { "typescript": ["next-tailwind"] },
  "byCategory": { "frontend": ["next-tailwind"] },
  "byLibrary":  { "nextjs": ["next-tailwind"] }
}
```

The `path` field is used directly in git sparse checkout:
```bash
git sparse-checkout set templates/typescript/frontend/nextjs/next-tailwind
```

---

## CLI Commands

```bash
tempora --help
tempora --version
tempora init <template> [directory]     # direct — scaffold immediately
tempora init [directory]                # guided — language → category → library → template
tempora info <template>                 # show template details and next steps
```

---

## Build Flow

```
pnpm build (from root)
  → packages/cli: tsup builds src/ into dist/
                  buildRegistry.mjs walks templates/, writes dist/registry.json
  → apps/docs:   syncDocs.mjs copies READMEs into pages/templates/<language>/<category>/<library>/
                 next build

pnpm dev        → CLI dev only (tsx watch)
pnpm docs:dev   → syncDocs then next dev
```

---

## Core Conventions

### TypeScript
- Strict mode always on
- No `any` — use `unknown` and narrow properly
- Path aliases only — never relative imports outside the same folder
  - `@appTypes` → `packages/cli/src/types`
  - `@utils` → `packages/cli/src/utils`
  - `@shared` → `packages/cli/src/shared`
- Every folder must have an `index.ts` barrel file

### Logging
- No `console.log` in production code — use `logger` from `@utils`
- `logger.info`, `logger.success`, `logger.warn`, `logger.error`

### File Edits
- Use exact string replacements — never rewrite entire files unless creating new ones
- Read only files relevant to the task

### Scope
- Build only what is requested
- No gold-plating

---

## Key Behaviours

- **Anti-overwrite** — never scaffold into a non-empty directory without explicit confirmation
- **Version checker** — async, non-blocking, shows a clean update box if CLI is outdated (verified post-npm-publish)
- **Dev mode** — downloader detects local `templates/` folder and copies files directly, no git needed
- **Prod mode** — downloader uses git sparse checkout with the `path` from registry
- **Guided mode** — max 4 templates shown per step, links to docs site if more exist
- **`.` argument** — scaffolds into current directory
