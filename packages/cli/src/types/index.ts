export interface TemplateEntry {
  id: string
  name: string
  language: string
  category: string
  library: string
  description: string
  path: string
  tags: string[]
  version: string
  nextSteps?: string[]
}

export interface Registry {
  version: string
  updatedAt: string
  templates: Record<string, TemplateEntry>
  byLanguage: Record<string, string[]>
  byCategory: Record<string, string[]>
  byLibrary: Record<string, string[]>
}

export interface TemporaConfig {
  id: string
  name: string
  language: string
  category: string
  library: string
  description: string
  tags: string[]
  version: string
  nextSteps?: string[]
}
