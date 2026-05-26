import { formatInTimeZone, toZonedTime } from 'date-fns-tz'

function isValidTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone })
    return true
  }
  catch {
    return false
  }
}

/** Минуты от полуночи для момента времени в часовом поясе ресторана. */
export function getMinutesFromMidnight(date: Date, timeZone: string): number | null {
  if (!isValidTimeZone(timeZone))
    return null

  const zoned = toZonedTime(date, timeZone)
  if (Number.isNaN(zoned.getTime()))
    return null

  return zoned.getHours() * 60 + zoned.getMinutes()
}

/** Календарная дата YYYY-MM-DD в часовом поясе ресторана. */
export function isoToCalendarDate(iso: string, timeZone: string): string | null {
  if (!isValidTimeZone(timeZone))
    return null

  const formatted = formatInTimeZone(iso, timeZone, 'yyyy-MM-dd')
  return formatted === 'Invalid Date' ? null : formatted
}

/** Минуты от полуночи в часовом поясе ресторана. */
export function isoToMinutesFromMidnight(iso: string, timeZone: string): number | null {
  return getMinutesFromMidnight(new Date(iso), timeZone)
}
