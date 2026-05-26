import type { ComputedRef, Ref } from 'vue'
import type { VisibleRowRange } from '@/features/timeline/domain/timelineLayout.types'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { computed, nextTick, watch } from 'vue'

const DEFAULT_OVERSCAN = 2
const DRAG_OVERSCAN = 4

export type { VisibleRowRange }

export function useTimelineVirtualizer(options: {
  scrollElement: Ref<HTMLElement | null>
  tableCount: ComputedRef<number>
  totalQuarters: ComputedRef<number>
  columnWidth: ComputedRef<number>
  quarterHeight: ComputedRef<number>
  timeColWidth: ComputedRef<number>
  headerHeight: ComputedRef<number>
  rowScrollMargin: ComputedRef<number>
  colScrollMargin: ComputedRef<number>
  isDragging: Ref<boolean>
}) {
  const overscan = computed(() =>
    options.isDragging.value ? DRAG_OVERSCAN : DEFAULT_OVERSCAN,
  )

  const rowVirtualizerOptions = computed(() => ({
    count: options.totalQuarters.value,
    getScrollElement: () => options.scrollElement.value,
    estimateSize: () => options.quarterHeight.value,
    overscan: overscan.value,
    scrollMargin: options.rowScrollMargin.value,
  }))

  const colVirtualizerOptions = computed(() => ({
    count: options.tableCount.value,
    getScrollElement: () => options.scrollElement.value,
    estimateSize: () => options.columnWidth.value,
    horizontal: true,
    overscan: overscan.value,
    scrollMargin: options.colScrollMargin.value,
  }))

  const rowVirtualizer = useVirtualizer(rowVirtualizerOptions)
  const colVirtualizer = useVirtualizer(colVirtualizerOptions)

  const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())
  const virtualColumns = computed(() => colVirtualizer.value.getVirtualItems())

  const visibleRowRange = computed<VisibleRowRange>(() => {
    const rows = virtualRows.value
    if (!rows.length)
      return { start: 0, end: 0 }
    return {
      start: rows[0].index,
      end: rows[rows.length - 1].index,
    }
  })

  const totalWidth = computed(
    () => options.timeColWidth.value + colVirtualizer.value.getTotalSize(),
  )

  const totalScrollHeight = computed(
    () => options.headerHeight.value + rowVirtualizer.value.getTotalSize(),
  )

  const visibleTableIds = computed(() => {
    const cols = virtualColumns.value
    return new Set(cols.map(col => col.index))
  })

  watch(
    () => [
      options.columnWidth.value,
      options.quarterHeight.value,
      options.rowScrollMargin.value,
      options.colScrollMargin.value,
    ],
    () => {
      void nextTick(() => {
        rowVirtualizer.value.measure()
        colVirtualizer.value.measure()
      })
    },
  )

  return {
    rowVirtualizer,
    colVirtualizer,
    virtualRows,
    virtualColumns,
    visibleRowRange,
    visibleTableIds,
    totalWidth,
    totalScrollHeight,
    overscan,
  }
}
