import { formatInTimeZone, toZonedTime } from 'date-fns-tz'

/** Календарная дата YYYY-MM-DD в часовом поясе ресторана. */
export function isoToCalendarDate(iso: string, timeZone: string): string {
  return formatInTimeZone(iso, timeZone, 'yyyy-MM-dd')
}

/** Минуты от полуночи в часовом поясе ресторана. */
export function isoToMinutesFromMidnight(iso: string, timeZone: string): number {
  const zoned = toZonedTime(iso, timeZone)
  return zoned.getHours() * 60 + zoned.getMinutes()
}
