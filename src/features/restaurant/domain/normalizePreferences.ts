import { SCALE_LEVELS } from '@/shared/constants'

export const UI_PREFERENCES_STORAGE_KEY = 'airesto-ui'

export type ThemePreference = 'dark' | 'light'

export interface UiPreferences {
  theme: ThemePreference
  scaleLevel: number
  selectedDay: string
  selectedZones: string[]
}

export interface PreferencesContext {
  currentDay: string
  availableDays: string[]
  zones: string[]
}

const DEFAULT_SCALE_LEVEL = 1
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function createDefaultPreferences(currentDay: string): UiPreferences {
  return {
    theme: 'dark',
    scaleLevel: DEFAULT_SCALE_LEVEL,
    selectedDay: currentDay,
    selectedZones: [],
  }
}

function isValidScaleLevel(value: unknown): value is number {
  return typeof value === 'number'
    && Number.isInteger(value)
    && value >= 0
    && value < SCALE_LEVELS.length
}

/**
 * Валидация и нормализация preferences из localStorage.
 * Невалидный день заменяется на currentDay; зоны вне списка отбрасываются.
 */
export function normalizePreferences(
  raw: unknown,
  context: PreferencesContext,
  defaults: UiPreferences,
): UiPreferences {
  const result: UiPreferences = { ...defaults }

  if (typeof raw !== 'object' || raw === null)
    return result

  const source = raw as Record<string, unknown>

  if (source.theme === 'dark' || source.theme === 'light')
    result.theme = source.theme

  if (isValidScaleLevel(source.scaleLevel))
    result.scaleLevel = source.scaleLevel

  if (typeof source.selectedDay === 'string' && ISO_DATE_RE.test(source.selectedDay)) {
    result.selectedDay = context.availableDays.includes(source.selectedDay)
      ? source.selectedDay
      : context.currentDay
  }

  if (Array.isArray(source.selectedZones)) {
    const zoneSet = new Set(context.zones)
    result.selectedZones = source.selectedZones
      .filter((zone): zone is string => typeof zone === 'string')
      .filter(zone => zoneSet.has(zone))
  }

  return result
}
