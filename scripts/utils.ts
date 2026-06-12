import fs from 'fs'
import path from 'path'

export interface TemporaConfig {
  id: string
  name: string
  language: string
  category: string
  description: string
  tags: string[]
  version: string
  nextSteps?: string[]
}

export function findTemporaConfigs(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const results: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findTemporaConfigs(fullPath))
    } else if (entry.name === 'tempora.json') {
      results.push(fullPath)
    }
  }
  return results
}

export function validateConfig(config: unknown, filePath: string): config is TemporaConfig {
  const required = ['id', 'name', 'language', 'category', 'description', 'tags', 'version']
  for (const key of required) {
    if (!(config as Record<string, unknown>)[key]) {
      console.error(`  ✖ Missing field "${key}" in ${filePath}`)
      return false
    }
  }
  return true
}
