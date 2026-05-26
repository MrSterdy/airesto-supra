import type { ComputedRef, MaybeRef, Ref } from 'vue'
import type { TableInfo } from '@/features/timeline/domain/timeline.types'
import { useThrottleFn } from '@vueuse/core'
import { useGridHover } from './useGridHover'
import { useGridPanning } from './useGridPanning'
import { useGridSelectionDrag } from './useGridSelectionDrag'

/**
 * Выделение диапазона столов и времени на сетке бронирований.
 * Фасад: pan (СКМ), hover, drag ЛКМ + подтверждение. Публичный API без изменений.
 */
export function useGridSelection(
  gridContainer: Ref<HTMLElement | null>,
  filteredTables: ComputedRef<TableInfo[]> | Ref<TableInfo[]>,
  quarterHeight: MaybeRef<number>,
  totalQuarters: ComputedRef<number>,
  startMinutes: number,
  columnWidth: MaybeRef<number>,
  timeColWidth: MaybeRef<number>,
  headerHeight: MaybeRef<number>,
) {
  const panning = useGridPanning(gridContainer)

  const hover = useGridHover(
    gridContainer,
    filteredTables,
    quarterHeight,
    totalQuarters,
    columnWidth,
    timeColWidth,
  )

  const drag = useGridSelectionDrag(
    filteredTables,
    quarterHeight,
    totalQuarters,
    startMinutes,
    columnWidth,
    timeColWidth,
    headerHeight,
    hover.getTableIndexFromClientX,
    hover.getGridBody,
  )

  function onGridMouseDown(mouseEvent: MouseEvent) {
    if (panning.startPanningFromMouseDown(mouseEvent))
      return
    drag.onGridMouseDown(mouseEvent)
  }

  const onGridMouseMove = useThrottleFn((mouseEvent: MouseEvent) => {
    if (panning.isPanning.value)
      return

    hover.updateHoverFromEvent(mouseEvent)
    drag.updateSelectionFromEvent(mouseEvent)
  }, 16)

  function isHoveredQuarter(tableIdx: number, quarter: number): boolean {
    if (drag.isDragging.value || drag.selectionConfirmed.value)
      return false
    return hover.isHoveredQuarter(tableIdx, quarter)
  }

  return {
    isDragging: drag.isDragging,
    selection: drag.selection,
    selectionConfirmed: drag.selectionConfirmed,
    hoverTableIdx: hover.hoverTableIdx,
    hoverQuarter: hover.hoverQuarter,
    normalizedSelection: drag.normalizedSelection,
    selectionDimensions: drag.selectionDimensions,
    selectionStyle: drag.selectionStyle,
    selectedTables: drag.selectedTables,
    selectionTimeRange: drag.selectionTimeRange,
    selectionDuration: drag.selectionDuration,
    selectionCapacity: drag.selectionCapacity,
    onGridMouseDown,
    onGridMouseMove,
    onGridMouseUp: drag.onGridMouseUp,
    confirmSelection: drag.confirmSelection,
    cancelSelection: drag.cancelSelection,
    clearSelection: drag.clearSelection,
    isHoveredQuarter,
  }
}
