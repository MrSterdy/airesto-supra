import type { PreferencesContext, UiPreferences } from '@/features/restaurant/domain/normalizePreferences'
import { createSharedComposable, useColorMode, useCounter, useStorage, useToggle } from '@vueuse/core'
import { computed, watch } from 'vue'
import {
  createDefaultPreferences,
  normalizePreferences,
  UI_PREFERENCES_STORAGE_KEY,
} from '@/features/restaurant/domain/normalizePreferences'
import { SCALE_LEVELS } from '@/shared/constants'

export { UI_PREFERENCES_STORAGE_KEY }
export type { PreferencesContext, ThemePreference, UiPreferences } from '@/features/restaurant/domain/normalizePreferences'

const DEFAULT_SCALE_LEVEL = 1
const MAX_SCALE_LEVEL = SCALE_LEVELS.length - 1

export const useUiPreferences = createSharedComposable(() => {
  const storage = useStorage<UiPreferences>(
    UI_PREFERENCES_STORAGE_KEY,
    createDefaultPreferences(''),
    localStorage,
  )

  const themeStorageRef = computed({
    get: () => storage.value.theme,
    set: (theme) => {
      if (theme === 'dark' || theme === 'light')
        storage.value = { ...storage.value, theme }
    },
  })

  useColorMode({
    attribute: 'class',
    modes: { dark: 'dark', light: '' },
    storageRef: themeStorageRef,
    initialValue: 'dark',
  })

  const isDark = computed({
    get: () => storage.value.theme === 'dark',
    set: (value: boolean) => {
      storage.value = {
        ...storage.value,
        theme: value ? 'dark' : 'light',
      }
    },
  })

  const toggleTheme = useToggle(isDark)

  const scaleCounter = useCounter(DEFAULT_SCALE_LEVEL, { min: 0, max: MAX_SCALE_LEVEL })

  watch(
    () => storage.value.scaleLevel,
    (level) => {
      if (typeof level === 'number' && Number.isInteger(level) && level >= 0 && level < SCALE_LEVELS.length) {
        if (scaleCounter.get() !== level)
          scaleCounter.set(level)
      }
    },
    { immediate: true },
  )

  watch(
    () => scaleCounter.count.value,
    (level) => {
      if (storage.value.scaleLevel !== level)
        storage.value = { ...storage.value, scaleLevel: level }
    },
  )

  const scaleLevel = computed({
    get: () => scaleCounter.count.value,
    set: (level: number) => {
      const isValid = typeof level === 'number' && Number.isInteger(level) && level >= 0 && level < SCALE_LEVELS.length
      scaleCounter.set(isValid ? level : DEFAULT_SCALE_LEVEL)
    },
  })

  const scale = computed(() => SCALE_LEVELS[scaleLevel.value])
  const canZoomIn = computed(() => scaleLevel.value < MAX_SCALE_LEVEL)
  const canZoomOut = computed(() => scaleLevel.value > 0)

  const zoomIn = () => scaleCounter.inc()
  const zoomOut = () => scaleCounter.dec()

  const selectedDay = computed({
    get: () => storage.value.selectedDay,
    set: (day: string) => {
      storage.value = { ...storage.value, selectedDay: day }
    },
  })

  const selectedZones = computed({
    get: () => storage.value.selectedZones,
    set: (zones: string[]) => {
      storage.value = { ...storage.value, selectedZones: zones }
    },
  })

  return {
    prefs: storage,
    isDark,
    toggleTheme,
    scaleLevel,
    scale,
    canZoomIn,
    canZoomOut,
    zoomIn,
    zoomOut,
    selectedDay,
    selectedZones,
  }
})

/** Нормализация preferences после загрузки mock-контекста. */
export function applyPreferencesContext(context: PreferencesContext) {
  const storage = useUiPreferences().prefs
  const defaults = createDefaultPreferences(context.currentDay)
  const normalized = normalizePreferences(storage.value, context, defaults)

  if (JSON.stringify(normalized) !== JSON.stringify(storage.value))
    storage.value = normalized
}
