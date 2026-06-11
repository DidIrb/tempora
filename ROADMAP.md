# Tempora — Roadmap

## Stage 1 — Monorepo Foundation ✅
- [x] pnpm workspace setup
- [x] `tsconfig.base.json` shared config
- [x] `packages/cli` scaffold with path aliases
- [x] `apps/docs` placeholder
- [x] Husky + commitlint + commitizen
- [x] GitHub Actions CI stub
- [x] `scripts/buildRegistry.ts` stub
- [x] `scripts/syncDocs.ts` stub
- [x] Types: `TemplateEntry`, `Registry`, `TemporaConfig`
- [x] Logger utility (no prod console.log)
- [x] Dummy `tempora.json` for nextjs-tailwind
- [x] MASTER.md + ROADMAP.md

---

## Stage 2a — CLI Scaffold + Global Install
- [ ] Entry point wired up with commander
- [ ] `tempora --help` and `tempora --version` working
- [ ] `pnpm link` or `npm install -g` — runs as real global `tempora` command
- [ ] esbuild producing `dist/index.js` with correct shebang

## Stage 2b — `tempora init <template>` Direct Path
- [ ] Download single template folder from GitHub using registry path
- [ ] Anti-overwrite guard (block if directory non-empty)
- [ ] Post-install message (description + next steps: cd, install, dev)
- [ ] `.` argument support for current directory

## Stage 2c — `tempora init` Guided Path
- [ ] Language filter prompt
- [ ] Category filter prompt
- [ ] Show max 4 results from registry indexes
- [ ] Show docs link if more than 4 results exist
- [ ] Async version checker — non-blocking update box

---

## Stage 3 — Registry Build Script
- [ ] `buildRegistry.ts` fully implemented
- [ ] Walks all `templates/**/tempora.json`
- [ ] Compiles `templates` map, `byLanguage`, `byCategory`
- [ ] `pnpm registry:build` works end-to-end

---

## Stage 4 — Docs + Wiring
- [ ] Nextra docs site fully configured
- [ ] `syncDocs.ts` copies template READMEs into `apps/docs/pages/templates/`
- [ ] `tempora info <template>` command
- [ ] End-to-end test with one real dummy template
- [ ] CONTRIBUTING.md finalized
