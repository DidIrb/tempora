import type { Registry } from '@appTypes'
import { config } from '../config.js'

export async function fetchRegistry(): Promise<Registry> {
  const res = await fetch(config.github.registryUrl, {
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Failed to fetch registry: ${res.status}`)
  return res.json() as Promise<Registry>
}
