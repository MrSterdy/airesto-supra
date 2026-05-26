import type { RemovableRef } from '@vueuse/core'
import { useStorage } from '@vueuse/core'
import { computed, watchEffect } from 'vue'
import { SCALE_LEVELS } from '@/constants'

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

function createDefaults(currentDay: string): UiPreferences {
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

export function normalizePreferences(
  raw: unknown,
  ctx: PreferencesContext,
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
    result.selectedDay = ctx.availableDays.includes(source.selectedDay)
      ? source.selectedDay
      : ctx.currentDay
  }

  if (Array.isArray(source.selectedZones)) {
    const zoneSet = new Set(ctx.zones)
    result.selectedZones = source.selectedZones
      .filter((zone): zone is string => typeof zone === 'string')
      .filter(zone => zoneSet.has(zone))
  }

  return result
}

let prefs: RemovableRef<UiPreferences> | null = null
let themeSyncStarted = false

function getPrefs(): RemovableRef<UiPreferences> {
  if (!prefs) {
    prefs = useStorage<UiPreferences>(UI_PREFERENCES_STORAGE_KEY, createDefaults(''), localStorage)
    if (!themeSyncStarted) {
      themeSyncStarted = true
      watchEffect(() => {
        document.documentElement.classList.toggle('dark', prefs!.value.theme === 'dark')
      })
    }
  }
  return prefs
}

export function applyPreferencesContext(ctx: PreferencesContext) {
  const storage = getPrefs()
  const defaults = createDefaults(ctx.currentDay)
  const normalized = normalizePreferences(storage.value, ctx, defaults)

  if (JSON.stringify(normalized) !== JSON.stringify(storage.value))
    storage.value = normalized
}

export function useUiPreferences() {
  const storage = getPrefs()

  const isDark = computed(() => storage.value.theme === 'dark')

  function toggleTheme() {
    storage.value = {
      ...storage.value,
      theme: storage.value.theme === 'dark' ? 'light' : 'dark',
    }
  }

  const scaleLevel = computed({
    get: () => storage.value.scaleLevel,
    set: (level: number) => {
      storage.value = {
        ...storage.value,
        scaleLevel: isValidScaleLevel(level) ? level : DEFAULT_SCALE_LEVEL,
      }
    },
  })

  const scale = computed(() => SCALE_LEVELS[scaleLevel.value])
  const canZoomIn = computed(() => scaleLevel.value < SCALE_LEVELS.length - 1)
  const canZoomOut = computed(() => scaleLevel.value > 0)

  function zoomIn() {
    if (canZoomIn.value)
      scaleLevel.value = scaleLevel.value + 1
  }

  function zoomOut() {
    if (canZoomOut.value)
      scaleLevel.value = scaleLevel.value - 1
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
}
