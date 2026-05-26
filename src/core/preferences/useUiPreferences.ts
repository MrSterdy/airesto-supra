import type { PreferencesContext, UiPreferences } from './normalizePreferences'
import { createSharedComposable, useColorMode, useStorage, useToggle } from '@vueuse/core'
import { computed } from 'vue'
import { SCALE_LEVELS } from '@/shared/constants'
import {
  createDefaultPreferences,
  DEFAULT_SCALE_LEVEL,
  isValidScaleLevel,
  normalizePreferences,
  UI_PREFERENCES_STORAGE_KEY,
} from './normalizePreferences'

export { UI_PREFERENCES_STORAGE_KEY }
export type { PreferencesContext, ThemePreference, UiPreferences } from './normalizePreferences'

const MAX_SCALE_LEVEL = SCALE_LEVELS.length - 1

function preferencesEqual(a: UiPreferences, b: UiPreferences): boolean {
  return a.theme === b.theme
    && a.scaleLevel === b.scaleLevel
    && a.selectedDay === b.selectedDay
    && a.selectedZones.length === b.selectedZones.length
    && a.selectedZones.every((zone, index) => zone === b.selectedZones[index])
}

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

  const scaleLevel = computed({
    get: () => {
      const level = storage.value.scaleLevel
      return isValidScaleLevel(level) ? level : DEFAULT_SCALE_LEVEL
    },
    set: (level: number) => {
      storage.value = {
        ...storage.value,
        scaleLevel: isValidScaleLevel(level) ? level : DEFAULT_SCALE_LEVEL,
      }
    },
  })

  const scale = computed(() => SCALE_LEVELS[scaleLevel.value])
  const canZoomIn = computed(() => scaleLevel.value < MAX_SCALE_LEVEL)
  const canZoomOut = computed(() => scaleLevel.value > 0)

  const zoomIn = () => {
    if (canZoomIn.value)
      scaleLevel.value++
  }

  const zoomOut = () => {
    if (canZoomOut.value)
      scaleLevel.value--
  }

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

/** Нормализация preferences после загрузки контекста ресторана. */
export function applyPreferencesContext(context: PreferencesContext) {
  const storage = useUiPreferences().prefs
  const defaults = createDefaultPreferences(context.currentDay)
  const normalized = normalizePreferences(storage.value, context, defaults)

  if (!preferencesEqual(normalized, storage.value))
    storage.value = normalized
}
