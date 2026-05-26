import { formatDate } from '@vueuse/core'

export function formatRussianDay(dateStr: string): string {
  return formatDate(new Date(`${dateStr}T00:00:00`), 'D MMMM', { locales: 'ru-RU' })
}
