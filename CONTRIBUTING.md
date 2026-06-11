# Contributing to Tempora

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/). Run `pnpm commit` to use the interactive commitizen prompt.

Valid types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`

Examples:
```
feat(cli): add tempora init guided flow
fix(cli): handle non-empty directory edge case
docs: update MASTER.md with registry conventions
```

---

## Code Rules

- TypeScript strict mode — no `any`
- No `console.log` in production code — use `logger` from `@utils`
- Path aliases only (`@appTypes`, `@utils`, `@shared`) — no relative imports outside the same folder
- Every new folder must have an `index.ts` barrel file
- File edits use exact string replacements — never rewrite entire files unless creating new ones
- Build only what is asked — no scope creep

---

## Branch Naming

```
feat/short-description
fix/short-description
chore/short-description
```

---

## Pull Requests

- One feature or fix per PR
- Title follows conventional commit format
- Update `ROADMAP.md` checkboxes if a stage item is completed

---

## Adding a Template

1. Create a folder under `templates/<language>/<template-name>/`
2. Add a `tempora.json` with all required fields (see `MASTER.md`)
3. Add a `README.md` — this gets synced to the docs site
4. Run `pnpm registry:build` to update `registry.json`
5. Commit with `chore(templates): add <template-name>`
