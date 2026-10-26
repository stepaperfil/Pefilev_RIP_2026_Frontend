export const ROUTES = {
  FEED: '/feed',
  ADD: '/life_cycle_stages/new',
  TILES: '/life_cycle_stages',
  LOGIN: '/login',
} as const

export type RouteKey = keyof typeof ROUTES

export const ROUTE_LABELS: Record<RouteKey, string> = {
  FEED: 'Лента',
  ADD: 'Добавление',
  TILES: 'Плитка',
  LOGIN: 'Вход',
}
