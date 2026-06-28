# Contributing to Tempora

Thank you for contributing! This guide explains how to add a new template to the Tempora registry.

## Adding a Template

### Folder Structure

Templates live under the `templates/` directory, organized by language, category, and library:

```
templates/
  <language>/
    <category>/
      <library>/
        <template-id>/
          tempora.json
          README.md
          ... (optional template files)
```

Example:
```
templates/
  typescript/
    frontend/
      nextjs/
        next-tailwind/
          tempora.json
          README.md
```

### tempora.json

Every template must have a `tempora.json` file. This is the template's metadata and is used to register it in the CLI.

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

#### Fields

| Field | Required | Description |
|-------|----------|-------------|
| id | Yes | Unique identifier used in tempora init <id>. Must be unique across ALL templates. |
| name | Yes | Human readable name shown in the guided selector. |
| language | Yes | Primary language e.g. typescript, javascript, python, rust. |
| category | Yes | Project category e.g. frontend, backend, fullstack, cli, library. |
| library | Yes | Framework or library e.g. nextjs, express, angular, fastapi. |
| description | Yes | Short one-line description shown in the CLI. |
| tags | Yes | Array of searchable tags. |
| version | Yes | Template version e.g. 1.0.0. |
| nextSteps | No | Array of commands shown after scaffolding e.g. pnpm install, pnpm dev. |

The id field is the unique identifier for your template. If two templates share the same id, the build will fail. Choose something descriptive and specific e.g. next-tailwind, express-prisma-pg, angular-starter.

### README.md

Every template must have a README.md. This is displayed in the docs and shown to users after scaffolding.

The README must include a Quick Start section showing the tempora init command:

# Template Name

Short description of what this template includes.

## Quick Start

npx tempora-cli init <your-template-id> my-app

## Stack

List the main technologies

## Getting Started

pnpm install
pnpm dev

You can add as much detail as you want beyond that.

### Testing Locally

Before submitting a PR, run the build to confirm your template is picked up:

```bash
pnpm build
```

The build will validate your tempora.json fields, check for duplicate IDs and stop if found, register your template in registry.json, and sync your README into the docs.

### Submitting a PR

1. Fork the repo
2. Add your template under templates/
3. Run pnpm build and confirm it passes
4. Open a PR with a clear description of what the template includes
