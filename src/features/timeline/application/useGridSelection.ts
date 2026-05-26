import type { ComputedRef, MaybeRef, Ref } from 'vue'
import type { TableInfo } from '@/features/timeline/domain/timeline.types'
import { useGridEdgeScroll } from './useGridEdgeScroll'
import { useGridHover } from './useGridHover'
import { useGridPanning } from './useGridPanning'
import { useGridSelectionDrag } from './useGridSelectionDrag'

/**
 * Выделение диапазона столов и времени на сетке бронирований.
 * Фасад: pan (СКМ), hover, drag ЛКМ + подтверждение. Публичный API без изменений.
 */
export function useGridSelection(
  gridContainer: Ref<HTMLElement | null>,
  scrollElement: Ref<HTMLElement | null>,
  filteredTables: ComputedRef<TableInfo[]> | Ref<TableInfo[]>,
  quarterHeight: MaybeRef<number>,
  totalQuarters: ComputedRef<number>,
  startMinutes: number,
  columnWidth: MaybeRef<number>,
  timeColWidth: MaybeRef<number>,
  headerHeight: MaybeRef<number>,
) {
  const panning = useGridPanning(gridContainer, scrollElement)

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

  const edgeScroll = useGridEdgeScroll(scrollElement)

  let pendingMoveEvent: MouseEvent | null = null
  let moveRafId = 0

  function processMouseMove(mouseEvent: MouseEvent) {
    if (panning.isPanning.value)
      return

    hover.updateHoverFromEvent(mouseEvent)
    drag.updateSelectionFromEvent(mouseEvent)
    edgeScroll.updateEdgeScroll(mouseEvent.clientX, mouseEvent.clientY, drag.isDragging.value)
  }

  function onGridMouseDown(mouseEvent: MouseEvent) {
    if (panning.startPanningFromMouseDown(mouseEvent))
      return
    drag.onGridMouseDown(mouseEvent)
  }

  function onGridMouseMove(mouseEvent: MouseEvent) {
    pendingMoveEvent = mouseEvent
    if (moveRafId)
      return
    moveRafId = requestAnimationFrame(() => {
      moveRafId = 0
      const event = pendingMoveEvent
      pendingMoveEvent = null
      if (event)
        processMouseMove(event)
    })
  }

  function onGridMouseUp(mouseEvent: MouseEvent) {
    edgeScroll.stopEdgeScroll()
    drag.onGridMouseUp(mouseEvent)
  }

  function isHoverActive(): boolean {
    if (drag.isDragging.value || drag.selectionConfirmed.value)
      return false
    return hover.hoverTableIdx.value >= 0 && hover.hoverQuarter.value >= 0
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
    onGridMouseUp,
    confirmSelection: drag.confirmSelection,
    cancelSelection: drag.cancelSelection,
    clearSelection: drag.clearSelection,
    isHoverActive,
  }
}
