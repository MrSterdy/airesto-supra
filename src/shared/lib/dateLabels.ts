import { differenceInCalendarDays, format, parse } from 'date-fns'
import { ru } from 'date-fns/locale'

/**
 * Относительная подпись дня для кнопок фильтра.
 */
export function getRelativeDayLabel(dateStr: string, currentDay: string): string {
  const today = parse(currentDay, 'yyyy-MM-dd', new Date())
  const target = parse(dateStr, 'yyyy-MM-dd', new Date())
  const dayDiff = differenceInCalendarDays(target, today)

  if (dayDiff === 0)
    return 'сегодня'
  if (dayDiff === 1)
    return 'завтра'

  return format(target, 'EEEE', { locale: ru })
}
