import type { ComputedRef } from 'vue'
import type { TimelineEvent } from '@/features/timeline/domain/timeline.types'
import { useScroll } from '@vueuse/core'
import { computed, ref, toRef, watch } from 'vue'
import { useBookingLayout } from './useBookingLayout'
import { useCurrentTime } from './useCurrentTime'
import { useGridScrollAnchors } from './useGridScrollAnchors'
import { useGridSelection } from './useGridSelection'
import { useScalePopover } from './useScalePopover'
import { useSelectionPresentation } from './useSelectionPresentation'
import { useTimeGrid } from './useTimeGrid'
import { useTimelineContext } from './useTimelineContext'
import { useTimelineScale } from './useTimelineScale'
import { useTimelineVirtualizer } from './useTimelineVirtualizer'
import { useTimelineZoomShortcuts } from './useTimelineZoomShortcuts'

/**
 * Оркестрация таблицы.
 */
export function useTimelineGrid() {
  const timeline = useTimelineContext()
  if (!timeline)
    throw new Error('TimelineGrid requires provideTimelineContext()')

  const { filteredTables, eventsPerTable, openingTime, closingTime, timeZone, currentDay, selectedDay } = timeline

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

  const { getTableLayout, layoutVersion } = useBookingLayout(
    filteredTablesRef,
    eventsRef,
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
    scrollElement,
    filteredTablesRef,
    quarterHeight,
    totalQuarters,
    startMinutes,
    columnWidth,
    timeColWidth,
    headerHeight,
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

  const { y: scrollY, x: scrollX } = useScroll(scrollElement)

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

  watch([slotHeight, headerHeight, timeColWidth], () => {
    measureGridScrollOffsets()
  })

  useTimelineZoomShortcuts(gridContainer, zoomIn, zoomOut)

  function onTableContextMenu(mouseEvent: MouseEvent) {
    mouseEvent.preventDefault()
    selection.clearSelection()
    scalePopover.openFromEvent(mouseEvent)
  }

  const hoverOverlayStyle = computed(() => {
    if (!selection.isHoverActive())
      return null

    const tableIdx = selection.hoverTableIdx.value
    const quarter = selection.hoverQuarter.value
    if (tableIdx < 0 || quarter < 0)
      return null

    return {
      visible: true,
      left: timeColWidth.value + tableIdx * columnWidth.value,
      top: headerHeight.value + quarter * quarterHeight.value,
      width: columnWidth.value,
      height: quarterHeight.value,
    }
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
    gridContainer,
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
    ...presentation,
    scalePopoverOpen: scalePopover.isOpen,
    scalePopoverPosition: scalePopover.position,
    popoverRef: scalePopover.popoverRef,
    onTableContextMenu,
  }
}
