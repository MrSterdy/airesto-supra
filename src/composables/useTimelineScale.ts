import { computed, ref } from 'vue'
import { COLUMN_WIDTH, INDENT, SLOT_HEIGHT } from '@/constants'

export const SCALE_LEVELS = [0.75, 1, 1.25, 1.5, 1.75] as const
const DEFAULT_LEVEL = 1

export const BASE_TIME_COL_WIDTH = 52
export const BASE_HEADER_HEIGHT = 48

export function useTimelineScale() {
  const level = ref(DEFAULT_LEVEL)

  const scale = computed(() => SCALE_LEVELS[level.value])
  const canZoomIn = computed(() => level.value < SCALE_LEVELS.length - 1)
  const canZoomOut = computed(() => level.value > 0)

  const slotHeight = computed(() => SLOT_HEIGHT * scale.value)
  const columnWidth = computed(() => COLUMN_WIDTH * scale.value)
  const timeColWidth = computed(() => BASE_TIME_COL_WIDTH * scale.value)
  const headerHeight = computed(() => BASE_HEADER_HEIGHT * scale.value)
  const indent = computed(() => INDENT * scale.value)

  function zoomIn() {
    if (canZoomIn.value)
      level.value++
  }

  function zoomOut() {
    if (canZoomOut.value)
      level.value--
  }

  return {
    scale,
    level,
    canZoomIn,
    canZoomOut,
    slotHeight,
    columnWidth,
    timeColWidth,
    headerHeight,
    indent,
    zoomIn,
    zoomOut,
  }
}
