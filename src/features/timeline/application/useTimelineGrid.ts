import { computed, ref, watch } from 'vue'
import { useBookingLayout } from './useBookingLayout'
import { useCurrentTime } from './useCurrentTime'
import { useEventDetails } from './useEventDetails'
import { useGridScrollAnchors } from './useGridScrollAnchors'
import { useGridSelection } from './useGridSelection'
import { useScalePopover } from './useScalePopover'
import { useSelectionPresentation } from './useSelectionPresentation'
import { useTimeGrid } from './useTimeGrid'
import { useTimelineContext } from './useTimelineContext'
import { useTimelineGridLayout } from './useTimelineGridLayout'
import { useTimelineScale } from './useTimelineScale'
import { useTimelineVirtualizer } from './useTimelineVirtualizer'
import { useTimelineZoomShortcuts } from './useTimelineZoomShortcuts'

/**
 * Оркестрация таблицы бронирований.
 */
export function useTimelineGrid() {
  const timeline = useTimelineContext()
  if (!timeline)
    throw new Error('TimelineGrid requires provideTimelineContext()')

  const { filteredTables, eventsPerTable, openingTime, closingTime, timeZone, currentDay, selectedDay } = timeline

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

  const { getTableLayout, layoutVersion } = useBookingLayout(
    eventsPerTable,
    minutesToPx,
    columnWidth,
    indent,
    slotHeight,
  )

  const { currentTimePosition } = useCurrentTime(
    startMinutes,
    endMinutes,
    minutesToPx,
    timeZone,
    selectedDay,
    currentDay,
  )

  const gridContainer = ref<HTMLElement | null>(null)
  /** Единый якорь Y-координат для hover/drag (см. TimelineGrid [data-grid-body]). */
  const gridBodyRef = ref<HTMLElement | null>(null)

  const {
    scrollElement,
    gridOffsetLeft,
    rowScrollMargin,
    colScrollMargin,
    measureOffsets: measureGridScrollOffsets,
  } = useGridScrollAnchors(gridContainer, headerHeight, timeColWidth)

  const tableCount = computed(() => filteredTables.value.length)

  const selection = useGridSelection(
    gridContainer,
    gridBodyRef,
    scrollElement,
    filteredTables,
    quarterHeight,
    totalQuarters,
    startMinutes,
    columnWidth,
    timeColWidth,
    headerHeight,
  )

  const eventDetails = useEventDetails(
    filteredTables,
    selectedDay,
    selection.clearSelection,
  )

  const gridInteraction = {
    isHoverActive(): boolean {
      if (eventDetails.isOpen.value)
        return false
      return selection.isHoverActive()
    },
    hoverTableIdx: selection.hoverTableIdx,
    hoverQuarter: selection.hoverQuarter,
  }

  const { hoverOverlayStyle, tableColumnLayout, timeColumnLayout } = useTimelineGridLayout(
    gridHeight,
    slotHeight,
    scale,
    headerHeight,
    quarterHeight,
    columnWidth,
    totalQuarters,
    timeSlots,
    timeColWidth,
    gridInteraction,
  )

  const virtualizer = useTimelineVirtualizer({
    scrollElement,
    tableCount,
    totalQuarters,
    columnWidth,
    quarterHeight,
    timeColWidth,
    headerHeight,
    rowScrollMargin,
    colScrollMargin,
    isDragging: selection.isDragging,
  })

  const { useInlineCard, isDialogOpen } = useSelectionPresentation(
    selection.selectionConfirmed,
    selection.selectionDimensions,
    scale,
  )

  const scalePopover = useScalePopover()

  watch([slotHeight, headerHeight, timeColWidth], () => {
    measureGridScrollOffsets()
  })

  useTimelineZoomShortcuts(gridContainer, zoomIn, zoomOut)

  function onTableContextMenu(mouseEvent: MouseEvent) {
    mouseEvent.preventDefault()
    selection.clearSelection()
    scalePopover.openFromEvent(mouseEvent)
  }

  return {
    gridContainer,
    gridBodyRef,
    scrollElement,
    gridOffsetLeft,
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
    getTableLayout,
    layoutVersion,
    currentTimePosition,
    canZoomIn,
    canZoomOut,
    zoomIn,
    zoomOut,
    virtualizer,
    hoverOverlayStyle,
    tableColumnLayout,
    timeColumnLayout,
    ...selection,
    eventDetailsOpen: eventDetails.isOpen,
    eventDetails: eventDetails.details,
    openEventDetails: eventDetails.openEvent,
    closeEventDetails: eventDetails.closeEvent,
    useInlineCard,
    isDialogOpen,
    scalePopoverOpen: scalePopover.isOpen,
    scalePopoverPosition: scalePopover.position,
    popoverRef: scalePopover.popoverRef,
    onTableContextMenu,
  }
}
