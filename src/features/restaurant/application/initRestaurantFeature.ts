import { mockData } from '@/data/mock'
import { applyPreferencesContext } from './useUiPreferences'

/** Инициализация ресторана: нормализация preferences из localStorage. */
export function initRestaurantFeature() {
  const zones = Array.from(new Set(mockData.tables.map(table => table.zone)))

  applyPreferencesContext({
    currentDay: mockData.current_day,
    availableDays: mockData.available_days,
    zones,
  })
}
