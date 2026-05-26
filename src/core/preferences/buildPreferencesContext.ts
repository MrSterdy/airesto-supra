import type { PreferencesContext } from './normalizePreferences'
import type { ApiResponse } from '@/features/restaurant/domain/restaurant.types'

/** Контекст для нормализации UI prefs из загруженных данных ресторана. */
export function buildPreferencesContext(data: ApiResponse): PreferencesContext {
  const zones = Array.from(new Set(data.tables.map(table => table.zone)))
  return {
    currentDay: data.current_day,
    availableDays: data.available_days,
    zones,
  }
}
