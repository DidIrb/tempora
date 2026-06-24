# Contributing to Tempora

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/). Run `pnpm commit` to use the interactive commitizen prompt.

Valid types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`

Examples:
```
feat(cli): add tempora init guided flow
fix(cli): handle non-empty directory edge case
docs: update MASTER.md with registry conventions
chore(templates): add python-fastapi template
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
- Run `pnpm lint` before opening a PR — Husky enforces this on commit anyway

---

## Versioning

Tempora uses [Changesets](https://github.com/changesets/changesets) to manage versions and changelogs.

When your change warrants a version bump:

```bash
pnpm changeset
```

Follow the prompts — select the package (`@tempora/cli`), the bump type (`patch`, `minor`, `major`), and write a summary. Commit the generated `.changeset/*.md` file alongside your changes.

Version PRs and npm publishing are handled automatically by the GitHub Actions workflow on merge to `main`.

---

## Adding a Template

1. Create a folder under `templates/<language>/<category>/<library>/<template-id>/`

   Example:
   ```
   templates/typescript/frontend/nextjs/next-tailwind/
   ```

2. Add a `tempora.json` with all required fields:

   ```json
   {
     "id": "your-template-id",
     "name": "Human Readable Name",
     "language": "typescript",
     "category": "frontend",
     "library": "nextjs",
     "description": "Short description of what this template sets up.",
     "tags": ["nextjs", "tailwind"],
     "version": "1.0.0",
     "nextSteps": ["pnpm install", "pnpm dev"]
   }
   ```

3. Add a `README.md` — this gets synced to the docs site automatically on every build.

4. Run `pnpm registry:build` to update `registry.json`.

5. Run `pnpm docs:dev` to verify the template appears in the docs site.

6. Commit with `chore(templates): add <template-id>`.
