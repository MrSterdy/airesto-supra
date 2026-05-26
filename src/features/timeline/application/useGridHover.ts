import type { ComputedRef, MaybeRef, Ref } from 'vue'
import type { TableInfo } from '@/features/timeline/domain/timeline.types'
import { useMouseInElement } from '@vueuse/core'
import { computed, ref, toValue, watch } from 'vue'

/** Подсветка слота под курсором. */
export function useGridHover(
  gridContainer: Ref<HTMLElement | null>,
  filteredTables: ComputedRef<TableInfo[]> | Ref<TableInfo[]>,
  quarterHeightPx: MaybeRef<number>,
  totalQuarters: ComputedRef<number>,
  columnWidthPx: MaybeRef<number>,
  timeColumnWidthPx: MaybeRef<number>,
) {
  const resolvedQuarterHeight = computed(() => toValue(quarterHeightPx))
  const resolvedColumnWidth = computed(() => toValue(columnWidthPx))
  const resolvedTimeColWidth = computed(() => toValue(timeColumnWidthPx))

  const hoverTableIdx = ref(-1)
  const hoverQuarter = ref(-1)

  const { isOutside: isMouseOutsideGrid } = useMouseInElement(gridContainer)

  watch(isMouseOutsideGrid, (outside) => {
    if (outside) {
      hoverTableIdx.value = -1
      hoverQuarter.value = -1
    }
  })

  function getGridBody(): HTMLElement | null {
    return (gridContainer.value as HTMLElement | null)?.querySelector('[data-grid-body]') as HTMLElement | null
  }

  function getTableIndexFromClientX(clientX: number): number {
    if (!gridContainer.value)
      return 0
    const rect = gridContainer.value.getBoundingClientRect()
    const offsetFromGridLeft = clientX - rect.left + gridContainer.value.scrollLeft
    const tableColumnIndex = Math.floor((offsetFromGridLeft - resolvedTimeColWidth.value) / resolvedColumnWidth.value)
    return Math.max(0, Math.min(tableColumnIndex, filteredTables.value.length - 1))
  }

  function getHoverQuarterIndexFromClientY(clientY: number, gridBodyElement: HTMLElement): number {
    const rect = gridBodyElement.getBoundingClientRect()
    const offsetFromBodyTop = clientY - rect.top
    const quarterIndex = Math.floor(offsetFromBodyTop / resolvedQuarterHeight.value)
    return Math.max(0, Math.min(quarterIndex, totalQuarters.value - 1))
  }

  function updateHoverFromEvent(mouseEvent: MouseEvent) {
    const gridBodyElement = getGridBody()
    if (!gridBodyElement)
      return

    hoverTableIdx.value = getTableIndexFromClientX(mouseEvent.clientX)
    hoverQuarter.value = getHoverQuarterIndexFromClientY(mouseEvent.clientY, gridBodyElement)
  }

  function isHoveredQuarter(tableIndex: number, quarterIndex: number): boolean {
    return hoverTableIdx.value === tableIndex && hoverQuarter.value === quarterIndex
  }

  return {
    hoverTableIdx,
    hoverQuarter,
    updateHoverFromEvent,
    getTableIndexFromClientX,
    isHoveredQuarter,
    getGridBody,
  }
}
