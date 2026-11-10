import axios, { isAxiosError } from 'axios'

export const http = axios.create({ timeout: 6000 })
export const tokenKey = 'tco_access_token'
export const authorization = (token: string) => token ? { Authorization: `Bearer ${token}` } : undefined

export const hasStatus = (error: unknown, status: number) =>
  isAxiosError(error) && error.response?.status === status

export const serviceUnavailable = (error: unknown) => isAxiosError(error) && (
  !error.response || [502, 503, 504].includes(error.response.status)
)

export function describeError(error: unknown): string {
  if (hasStatus(error, 401)) return 'Проверьте логин и пароль или войдите снова.'
  if (serviceUnavailable(error)) return 'Веб-сервис недоступен. Попробуйте ещё раз.'
  if (isAxiosError(error) && typeof error.response?.data?.error === 'string') {
    return error.response.data.error
  }
  return 'Не удалось выполнить запрос.'
}

export function mediaUrl(url?: string): string {
  if (!url) return ''
  const bucketPath = new URL(url, window.location.origin).pathname
  return bucketPath.startsWith('/tco-assets/') ? bucketPath : url
}
