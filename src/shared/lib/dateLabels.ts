/**
 * Относительная подпись дня для кнопок фильтра («сегодня», «завтра», день недели).
 */
export function getRelativeDayLabel(dateStr: string, currentDay: string): string {
  const today = new Date(`${currentDay}T00:00:00`)
  const target = new Date(`${dateStr}T00:00:00`)
  const dayDiff = Math.round((target.getTime() - today.getTime()) / 86400000)

  if (dayDiff === 0)
    return 'сегодня'
  if (dayDiff === 1)
    return 'завтра'

  const weekdays = [
    'воскресенье',
    'понедельник',
    'вторник',
    'среда',
    'четверг',
    'пятница',
    'суббота',
  ]
  return weekdays[target.getDay()]
}
