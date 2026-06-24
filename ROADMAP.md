# Tempora — Roadmap

## Stage 1 — Monorepo Foundation ✅
- [x] pnpm workspace setup
- [x] `tsconfig.base.json` shared config
- [x] `packages/cli` scaffold with path aliases
- [x] `apps/docs` placeholder
- [x] Husky + commitlint + commitizen
- [x] GitHub Actions CI stub
- [x] Types: `TemplateEntry`, `Registry`, `TemporaConfig`
- [x] Logger utility
- [x] Dummy template: `next-tailwind`
- [x] MASTER.md + ROADMAP.md

---

## Stage 2 — CLI Core ✅
- [x] Entry point wired up with commander
- [x] `tempora --help` and `tempora --version`
- [x] Global install via `npm install -g` — runs as `tempora` command
- [x] tsup building `dist/index.cjs` with correct shebang
- [x] `tempora init <template> [dir]` — direct path
- [x] `tempora init [dir]` — guided mode (language → category → library → template)
- [x] Anti-overwrite guard — blocks non-empty dirs, prompts confirmation
- [x] Post-install message — prints `nextSteps` from `tempora.json`
- [x] `.` argument support for current directory
- [x] `tempora info <template>` — prints template details
- [x] Async non-blocking version checker
- [x] Dev mode — local file copy (no git needed)
- [x] Prod mode — git sparse checkout using `path` from registry

---

## Stage 3 — Registry Build Script ✅
- [x] `buildRegistry.mjs` fully implemented
- [x] Walks all `templates/**/tempora.json`
- [x] Compiles `templates` map, `byLanguage`, `byCategory`, `byLibrary`
- [x] Skips and warns on templates missing required fields
- [x] `pnpm registry:build` works end-to-end

---

## Stage 4 — Docs Site (Nextra v3) ✅
- [x] Nextra v3 fully configured
- [x] `syncDocs.mjs` copies template READMEs into `pages/templates/<language>/<category>/<library>/`
- [x] `syncDocs.mjs` generates `_meta.ts` at every level (language, category, library, root)
- [x] `syncDocs.mjs` guards against templates missing required fields
- [x] `_meta.json` → `_meta.ts` migration (Nextra v3 breaking change)
- [x] Landing page (`index.tsx`) — standalone, no Nextra chrome
- [x] Hydration error fixed (MDX `<p>` nesting — converted to `.tsx`)
- [x] Docs dev server running

---

## Stage 15 — Polish + Pre-Deploy

### 15a — Accuracy Pass ✅
- [x] ROADMAP.md updated to reflect actual state
- [x] MASTER.md updated — 4-level template structure, correct file tree, all commands
- [x] CONTRIBUTING.md updated — correct 4-level template path, changeset instructions

### 15b — Docs Site Completion
- [ ] `outputFileTracingRoot` in `next.config.mjs` — silence lockfile warning
- [ ] `theme.config.tsx` — replace placeholder links and logo
- [ ] Add pages: Contributing, Code of Conduct, FAQ, Roadmap, License
- [ ] Update `_meta.ts` sidebar to include new pages

### 15c — CLI Polish
- [ ] JSDoc comments on key files: `init.ts`, `downloader.ts`, `guided.ts`, `registry.ts`
- [ ] Offline/no-git error handling — clean user-facing messages when sparse checkout fails

### 15d — Versioning Setup
- [ ] Changesets configured in monorepo
- [ ] GitHub Actions workflow for version PR + npm publish on merge
- [ ] `config.ts` updated with real GitHub org/repo (owner)

### 15e — Deploy + Verify
- [ ] Push to GitHub
- [ ] Vercel deploy for docs site
- [ ] Publish `@tempora/cli` to npm
- [ ] Verify `versionCheck` works against live npm package
- [ ] End-to-end test with real template from published registry
