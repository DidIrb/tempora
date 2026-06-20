import inquirer from 'inquirer'
import { logger } from '@utils'
import { config } from '../config.js'
import type { Registry, TemplateEntry } from '@appTypes'

const MAX_RESULTS = 4

export async function runGuidedSelection(registry: Registry): Promise<TemplateEntry | null> {
  const languages = Object.keys(registry.byLanguage)

  if (languages.length === 0) {
    logger.error('No templates found in registry.')
    logger.log(`Browse templates at ${config.docs.url}`)
    return null
  }

  // step 1 — language
  const { language } = await inquirer.prompt([{
    type: 'list',
    name: 'language',
    message: 'What language?',
    choices: languages,
  }])

  const languageIds = registry.byLanguage[language] ?? []

  // step 2 — category filtered by language
  const availableCategories = Object.entries(registry.byCategory)
    .filter(([, ids]) => ids.some(id => languageIds.includes(id)))
    .map(([cat]) => cat)

  if (availableCategories.length === 0) {
    logger.error(`No templates found for language: ${language}`)
    logger.log(`Browse templates at ${config.docs.url}`)
    return null
  }

  const { category } = await inquirer.prompt([{
    type: 'list',
    name: 'category',
    message: 'What category?',
    choices: availableCategories,
  }])

  const categoryIds = registry.byCategory[category] ?? []
  const afterCategory = languageIds.filter(id => categoryIds.includes(id))

  // step 3 — library filtered by language + category
  const availableLibraries = Object.entries(registry.byLibrary)
    .filter(([, ids]) => ids.some(id => afterCategory.includes(id)))
    .map(([lib]) => lib)

  if (availableLibraries.length === 0) {
    logger.error(`No templates found for ${language} / ${category}`)
    logger.log(`Browse templates at ${config.docs.url}`)
    return null
  }

  const { library } = await inquirer.prompt([{
    type: 'list',
    name: 'library',
    message: 'What library or framework?',
    choices: availableLibraries,
  }])

  const libraryIds = registry.byLibrary[library] ?? []
  const matchedIds = afterCategory.filter(id => libraryIds.includes(id))

  if (matchedIds.length === 0) {
    logger.error(`No templates found for ${language} / ${category} / ${library}`)
    logger.log(`Browse templates at ${config.docs.url}`)
    return null
  }

  // step 4 — pick template, max 4
  const hasMore = matchedIds.length > MAX_RESULTS
  const visibleIds = matchedIds.slice(0, MAX_RESULTS)
  const choices = visibleIds.map(id => ({
    name: `${registry.templates[id].name} — ${registry.templates[id].description}`,
    value: id,
  }))

  if (hasMore) {
    logger.log(`\n  Showing ${MAX_RESULTS} of ${matchedIds.length} templates.`)
    logger.log(`  See all at ${config.docs.url}\n`)
  }

  const { templateId } = await inquirer.prompt([{
    type: 'list',
    name: 'templateId',
    message: 'Pick a template:',
    choices,
  }])

  return registry.templates[templateId] ?? null
}
