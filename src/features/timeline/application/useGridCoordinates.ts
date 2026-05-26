import type { ComputedRef, MaybeRef, MaybeRefOrGetter, Ref } from 'vue'
import type { QuarterClampMode, QuarterSnapMode } from '@/features/timeline/domain/gridCoordinates'
import type { TableListRef } from '@/features/timeline/domain/timeline.types'
import { toRef, toValue } from 'vue'
import { offsetToQuarterIndex, offsetToTableIndex } from '@/features/timeline/domain/gridCoordinates'

/**
 * Координаты курсора - индекс стола / quarter.
 * Y привязан к единому элементу [data-grid-body] в TimelineGrid.
 */
export function useGridCoordinates(
  gridContainer: Ref<HTMLElement | null>,
  gridBody: MaybeRefOrGetter<HTMLElement | null>,
  filteredTables: TableListRef,
  quarterHeightPx: MaybeRef<number>,
  totalQuarters: ComputedRef<number>,
  columnWidthPx: MaybeRef<number>,
  timeColumnWidthPx: MaybeRef<number>,
) {
  const resolvedQuarterHeight = toRef(quarterHeightPx)
  const resolvedColumnWidth = toRef(columnWidthPx)
  const resolvedTimeColWidth = toRef(timeColumnWidthPx)

  function getGridBody(): HTMLElement | null {
    return toValue(gridBody)
  }

  function getTableIndexFromClientX(clientX: number): number {
    const grid = gridContainer.value
    if (!grid)
      return 0
    const rect = grid.getBoundingClientRect()
    const offsetFromGridLeft = clientX - rect.left
    return offsetToTableIndex(
      offsetFromGridLeft,
      resolvedTimeColWidth.value,
      resolvedColumnWidth.value,
      filteredTables.value.length,
    )
  }

  function getQuarterIndexFromClientY(
    clientY: number,
    gridBodyElement: HTMLElement,
    snapMode: QuarterSnapMode = 'round',
    clampMode: QuarterClampMode = 'drag',
  ): number {
    const rect = gridBodyElement.getBoundingClientRect()
    const offsetFromBodyTop = clientY - rect.top
    return offsetToQuarterIndex(
      offsetFromBodyTop,
      resolvedQuarterHeight.value,
      totalQuarters.value,
      snapMode,
      clampMode,
    )
  }

  return {
    getGridBody,
    getTableIndexFromClientX,
    getQuarterIndexFromClientY,
  }
}
