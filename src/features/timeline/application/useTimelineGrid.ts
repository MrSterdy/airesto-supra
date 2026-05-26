import type { ComputedRef } from 'vue'
import type { TimelineEvent } from '@/features/timeline/domain/timeline.types'
import { useScroll } from '@vueuse/core'
import { computed, ref, toRef, watch } from 'vue'
import { findScrollableParent } from '@/shared/lib/findScrollableParent'
import { useBookingLayout } from './useBookingLayout'
import { useCurrentTime } from './useCurrentTime'
import { useGridSelection } from './useGridSelection'
import { useScalePopover } from './useScalePopover'
import { useSelectionPresentation } from './useSelectionPresentation'
import { useTimeGrid } from './useTimeGrid'
import { useTimelineContext } from './useTimelineContext'
import { useTimelineScale } from './useTimelineScale'
import { useTimelineZoomShortcuts } from './useTimelineZoomShortcuts'

/**
 * Оркестрация таблицы.
 */
export function useTimelineGrid() {
  const timeline = useTimelineContext()
  if (!timeline)
    throw new Error('TimelineGrid requires provideTimelineContext()')

  const { filteredTables, eventsPerTable, openingTime, closingTime, selectedDay } = timeline

  const filteredTablesRef = toRef(() => filteredTables.value)
  const eventsRef = toRef(() => eventsPerTable.value) as ComputedRef<Map<string, TimelineEvent[]>>

  const {
    scale,
    canZoomIn,
    canZoomOut,
    slotHeight,
    columnWidth,
    timeColWidth,
    headerHeight,
    indent,
    zoomIn,
    zoomOut,
  } = useTimelineScale()

  const {
    startMinutes,
    endMinutes,
    timeSlots,
    gridHeight,
    quarterHeight,
    totalQuarters,
    minutesToPx,
    formatTimeSlot,
  } = useTimeGrid(openingTime, closingTime, slotHeight)

  const { tableLayouts } = useBookingLayout(
    filteredTablesRef,
    eventsRef,
    minutesToPx,
    columnWidth,
    indent,
  )

  const { currentTimePosition } = useCurrentTime(startMinutes, endMinutes, minutesToPx)

  const gridContainer = ref<HTMLElement | null>(null)

  const scrollTarget = computed(() => findScrollableParent(gridContainer.value))
  const { y: scrollY, x: scrollX } = useScroll(scrollTarget)

  const selection = useGridSelection(
    gridContainer,
    filteredTablesRef,
    quarterHeight,
    totalQuarters,
    startMinutes,
    columnWidth,
    timeColWidth,
    headerHeight,
  )

  const presentation = useSelectionPresentation(
    selection.selectionConfirmed,
    selection.selectionDimensions,
    scale,
  )

  const scalePopover = useScalePopover()

  watch([scrollY, scrollX], () => {
    if (scalePopover.isOpen.value)
      scalePopover.close()
  })

  useTimelineZoomShortcuts(gridContainer, zoomIn, zoomOut)

  function onTableContextMenu(mouseEvent: MouseEvent) {
    mouseEvent.preventDefault()
    selection.clearSelection()
    scalePopover.openFromEvent(mouseEvent)
  }

  return {
    gridContainer,
    filteredTables,
    selectedDay,
    timeSlots,
    gridHeight,
    slotHeight,
    columnWidth,
    timeColWidth,
    headerHeight,
    scale,
    quarterHeight,
    totalQuarters,
    formatTimeSlot,
    tableLayouts,
    currentTimePosition,
    canZoomIn,
    canZoomOut,
    zoomIn,
    zoomOut,
    ...selection,
    ...presentation,
    scalePopoverOpen: scalePopover.isOpen,
    scalePopoverPosition: scalePopover.position,
    popoverRef: scalePopover.popoverRef,
    onTableContextMenu,
  }
}
