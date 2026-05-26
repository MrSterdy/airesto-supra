import { computed } from 'vue'
import { useUiPreferences } from '@/core/preferences'
import { COLUMN_WIDTH, INDENT, SCALE_LEVELS, SLOT_HEIGHT } from '@/shared/constants'

export { SCALE_LEVELS }

export const BASE_TIME_COL_WIDTH = 52
export const BASE_HEADER_HEIGHT = 48

export function useTimelineScale() {
  const {
    scale,
    scaleLevel,
    canZoomIn,
    canZoomOut,
    zoomIn,
    zoomOut,
  } = useUiPreferences()

  const slotHeight = computed(() => SLOT_HEIGHT * scale.value)
  const columnWidth = computed(() => COLUMN_WIDTH * scale.value)
  const timeColWidth = computed(() => BASE_TIME_COL_WIDTH * scale.value)
  const headerHeight = computed(() => BASE_HEADER_HEIGHT * scale.value)
  const indent = computed(() => INDENT * scale.value)

  return {
    scale,
    level: scaleLevel,
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
