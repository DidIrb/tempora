# Tempora — Master Reference

## What is Tempora?

Tempora is a CLI scaffolding tool that lets developers instantly bootstrap projects from a curated, community-driven template vault. Think `create-next-app` but language-agnostic, registry-driven, and with a companion documentation site.

A user runs:

```bash
tempora init nextjs-tailwind my-app
```

And gets a fully configured project folder pulled directly from the Tempora GitHub repo — no bloated global install, no cloning the entire repo.

---

## Monorepo Structure

```
tempora/
├── packages/
│   └── cli/              # The CLI tool (@tempora/cli)
├── apps/
│   └── docs/             # Nextra documentation site (@tempora/docs)
├── templates/            # Template vault (language/category/name)
├── scripts/              # buildRegistry.ts, syncDocs.ts
├── registry.json         # Compiled output — never edit manually
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
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
- Use exact string replacements (`str_replace`) — never rewrite entire files
- Read only the files relevant to the task

### Scope
- Build only what is requested
- Ask before acting if scope is unclear
- No gold-plating

---

## Registry

`registry.json` is a compiled file. Never edit it manually. Run:

```bash
pnpm registry:build
```

It walks every `templates/**/tempora.json`, reads `language` and `category`, and builds the `byLanguage` and `byCategory` indexes automatically.

---

## Template Vault

Each template lives at:

```
templates/<language>/<template-name>/
  tempora.json     # metadata — id, name, language, category, description, tags, version
  README.md        # synced to docs site automatically
  ...              # actual starter files
```

---

## CLI Commands

```bash
tempora --help
tempora --version
tempora init <template> [directory]     # direct path
tempora init [directory]                # guided — language → category → pick (max 4 shown)
tempora info <template>                 # show template details and next steps
```

---

## Key Rules

- Anti-overwrite: never scaffold into a non-empty directory without explicit confirmation
- Version checker: async, non-blocking, shows a clean update box if CLI is outdated
- Max 4 templates shown in guided mode — link to docs site if more exist
- The `.` argument means scaffold into the current directory
