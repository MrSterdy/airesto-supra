import { format, parse } from 'date-fns'
import { ru } from 'date-fns/locale'

/** Форматирует календарную дату YYYY-MM-DD. */
export function formatRussianDay(dateStr: string): string {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date())
  return format(date, 'd MMMM', { locale: ru })
}
