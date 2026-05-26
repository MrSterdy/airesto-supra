import type { ComputedRef, Ref } from 'vue'
import { computed } from 'vue'
import { computeOverlayPixels } from '@/features/timeline/domain/overlayStyle'

interface GridSelectionFacade {
  isHoverActive: () => boolean
  hoverTableIdx: Ref<number>
  hoverQuarter: Ref<number>
}

/** DTO раскладки колонок и hover-overlay (без оркестрации time grid). */
export function useTimelineGridLayout(
  gridHeight: ComputedRef<number>,
  slotHeight: ComputedRef<number>,
  scale: ComputedRef<number>,
  headerHeight: ComputedRef<number>,
  quarterHeight: ComputedRef<number>,
  columnWidth: ComputedRef<number>,
  totalQuarters: ComputedRef<number>,
  timeSlots: ComputedRef<string[]>,
  timeColWidth: ComputedRef<number>,
  selection: GridSelectionFacade,
) {
  const hoverOverlayStyle = computed(() => {
    if (!selection.isHoverActive())
      return null

    const tableIdx = selection.hoverTableIdx.value
    const quarter = selection.hoverQuarter.value
    if (tableIdx < 0 || quarter < 0)
      return null

    return computeOverlayPixels(
      tableIdx,
      quarter,
      timeColWidth.value,
      columnWidth.value,
      headerHeight.value,
      quarterHeight.value,
    )
  })

  const tableColumnLayout = computed(() => ({
    gridHeight: gridHeight.value,
    slotHeight: slotHeight.value,
    scale: scale.value,
    headerHeight: headerHeight.value,
    quarterHeight: quarterHeight.value,
    columnWidth: columnWidth.value,
    totalQuarters: totalQuarters.value,
    timeSlotsCount: timeSlots.value.length,
  }))

  const timeColumnLayout = computed(() => ({
    gridHeight: gridHeight.value,
    slotHeight: slotHeight.value,
    scale: scale.value,
    headerHeight: headerHeight.value,
    timeColWidth: timeColWidth.value,
  }))

  return {
    hoverOverlayStyle,
    tableColumnLayout,
    timeColumnLayout,
  }
}
