import { LIFE_CYCLE_STAGES_MOCK } from './mock'

export interface LifeCycleStage {
  id: number
  title: string
  description: string
  image_url: string
  video_url: string
  price_per_unit: number | null
  stage_position: number | null
  likes_count: number
  is_liked: number
}

export interface LifeCycleStageTile {
  id: number
  title: string
  image_url: string
  price_per_unit: number | null
  likes_count: number
  is_mine: number
}

export const DEFAULT_IMAGE = '/default-life-cycle-stage.jpg'
export const DEFAULT_VIDEO = '/default-life-cycle-stage.mp4'

const byPosition = (a: LifeCycleStage, b: LifeCycleStage) =>
  (a.stage_position ?? 0) - (b.stage_position ?? 0) || a.id - b.id

const toTile = (s: LifeCycleStage): LifeCycleStageTile => ({
  id: s.id,
  title: s.title,
  image_url: s.image_url,
  price_per_unit: s.price_per_unit,
  likes_count: s.likes_count,
  is_mine: 0,
})

async function request<T>(url: string): Promise<T | undefined> {
  const response = await fetch(url, { signal: AbortSignal.timeout(3000) })
  if (response.status === 404) {
    return undefined
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json() as Promise<T>
}

function getTilesFromMock(maxPricePerUnit?: number): LifeCycleStageTile[] {
  return [...LIFE_CYCLE_STAGES_MOCK]
    .sort(byPosition)
    .filter((s) => maxPricePerUnit === undefined || (s.price_per_unit ?? 0) <= maxPricePerUnit)
    .map(toTile)
}

function getFeedFromMock(id?: number, next = false): LifeCycleStage | undefined {
  const stages = [...LIFE_CYCLE_STAGES_MOCK].sort(byPosition)
  if (id === undefined) {
    return stages[0]
  }
  const index = stages.findIndex((s) => s.id === id)
  if (index === -1) {
    return undefined
  }
  return next ? stages[index + 1] : stages[index]
}

export async function getLifeCycleStages(maxPricePerUnit?: number): Promise<LifeCycleStageTile[]> {
  const query = maxPricePerUnit !== undefined ? `?max_price_per_unit=${maxPricePerUnit}` : ''
  try {
    return (await request<LifeCycleStageTile[]>(`/api/life_cycle_stages${query}`)) ?? []
  } catch {
    return getTilesFromMock(maxPricePerUnit)
  }
}

export async function getLifeCycleStageFeed(id?: number, next = false): Promise<LifeCycleStage | undefined> {
  const params = new URLSearchParams()
  if (id !== undefined) params.set('id', String(id))
  if (next) params.set('next', 'true')
  const query = params.toString() ? `?${params}` : ''
  try {
    return await request<LifeCycleStage>(`/api/life_cycle_stages/feed${query}`)
  } catch {
    return getFeedFromMock(id, next)
  }
}
