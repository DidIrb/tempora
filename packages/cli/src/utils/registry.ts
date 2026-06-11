import type { Registry } from '@appTypes'

const REGISTRY_URL =
  'https://raw.githubusercontent.com/your-org/tempora/main/registry.json'

export async function fetchRegistry(): Promise<Registry> {
  const res = await fetch(REGISTRY_URL, {
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Failed to fetch registry: ${res.status}`)
  return res.json() as Promise<Registry>
}
