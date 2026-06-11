export interface TemplateEntry {
  id: string
  name: string
  language: string
  category: string
  description: string
  path: string
  tags: string[]
  version: string
}

export interface Registry {
  version: string
  updatedAt: string
  templates: Record<string, TemplateEntry>
  byLanguage: Record<string, string[]>
  byCategory: Record<string, string[]>
}

export interface TemporaConfig {
  id: string
  name: string
  language: string
  category: string
  description: string
  tags: string[]
  version: string
}
