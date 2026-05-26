<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { TableInfo, TimelineEvent } from '@/types'
import { toRef, useTemplateRef } from 'vue'
import { useBookingLayout } from '@/composables/useBookingLayout'
import { useCurrentTime } from '@/composables/useCurrentTime'
import { useGridSelection } from '@/composables/useGridSelection'
import { useScalePopover } from '@/composables/useScalePopover'
import { useSelectionPresentation } from '@/composables/useSelectionPresentation'
import { useTimeGrid } from '@/composables/useTimeGrid'
import { useTimelineScale } from '@/composables/useTimelineScale'
import { useTimelineZoomShortcuts } from '@/composables/useTimelineZoomShortcuts'
import ScalePopover from './ScalePopover.vue'
import SelectionCard from './SelectionCard.vue'
import SelectionDialog from './SelectionDialog.vue'
import SelectionOverlay from './SelectionOverlay.vue'
import TableColumn from './TableColumn.vue'
import TimeColumn from './TimeColumn.vue'

const props = defineProps<{
  filteredTables: TableInfo[]
  eventsPerTable: Map<string, TimelineEvent[]>
  openingTime: string
  closingTime: string
  selectedDay: string
}>()

const filteredTablesRef = toRef(props, 'filteredTables')
const eventsRef = toRef(props, 'eventsPerTable')

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
} = useTimeGrid(props.openingTime, props.closingTime, slotHeight)

const { tableLayouts } = useBookingLayout(
  filteredTablesRef,
  eventsRef as ComputedRef<Map<string, TimelineEvent[]>>,
  minutesToPx,
  columnWidth,
  indent,
)

const { currentTimePosition } = useCurrentTime(startMinutes, endMinutes, minutesToPx)

const gridContainer = useTemplateRef<HTMLElement>('gridContainer')

const {
  selection,
  selectionConfirmed,
  selectionDimensions,
  selectionStyle,
  selectedTables,
  selectionTimeRange,
  selectionDuration,
  selectionCapacity,
  onGridMouseDown,
  onGridMouseMove,
  onGridMouseUp,
  onGridMouseLeave,
  confirmSelection,
  cancelSelection,
  clearSelection,
  isHoveredQuarter,
} = useGridSelection(
  gridContainer,
  filteredTablesRef,
  quarterHeight,
  totalQuarters,
  startMinutes,
  columnWidth,
  timeColWidth,
  headerHeight,
)

const { useInlineCard, useDialog } = useSelectionPresentation(
  selectionConfirmed,
  selectionDimensions,
  scale,
)

const { isOpen: scalePopoverOpen, position: scalePopoverPosition, popoverRef, openFromEvent } = useScalePopover()

useTimelineZoomShortcuts(gridContainer, zoomIn, zoomOut)

function onTableContextMenu(e: MouseEvent) {
  e.preventDefault()
  clearSelection()
  openFromEvent(e)
}

function handleZoomIn() {
  zoomIn()
}

function handleZoomOut() {
  zoomOut()
}
</script>

<template>
  <div
    ref="gridContainer"
    class="mt-8 flex min-w-full relative select-none"
    @mousedown="onGridMouseDown"
    @mousemove="onGridMouseMove"
    @mouseup="onGridMouseUp"
    @mouseleave="onGridMouseLeave"
  >
    <TimeColumn
      :time-slots="timeSlots"
      :grid-height="gridHeight"
      :slot-height="slotHeight"
      :time-col-width="timeColWidth"
      :header-height="headerHeight"
      :scale="scale"
      :format-time-slot="formatTimeSlot"
    />

    <TableColumn
      v-for="(table, tableIdx) in filteredTables"
      :key="table.id"
      :table="table"
      :table-idx="tableIdx"
      :events="tableLayouts.get(table.id) ?? []"
      :grid-height="gridHeight"
      :slot-height="slotHeight"
      :time-slots-count="timeSlots.length"
      :total-quarters="totalQuarters"
      :quarter-height="quarterHeight"
      :column-width="columnWidth"
      :header-height="headerHeight"
      :scale="scale"
      :current-time-position="currentTimePosition"
      :is-hovered-quarter="isHoveredQuarter"
      @contextmenu="onTableContextMenu"
    />

    <SelectionOverlay
      v-if="selection && selectionStyle && !selectionConfirmed"
      :style="selectionStyle"
    />

    <SelectionCard
      v-if="useInlineCard && selectionStyle && selectionTimeRange"
      :style="selectionStyle"
      :time-range="selectionTimeRange"
      :duration="selectionDuration"
      :capacity="selectionCapacity"
      :selected-tables="selectedTables"
      :selected-day="selectedDay"
      @confirm="confirmSelection"
      @cancel="cancelSelection"
    />

    <Teleport to="body">
      <SelectionDialog
        v-if="useDialog && selectionTimeRange"
        :open="useDialog"
        :time-range="selectionTimeRange"
        :duration="selectionDuration"
        :capacity="selectionCapacity"
        :selected-tables="selectedTables"
        :selected-day="selectedDay"
        @confirm="confirmSelection"
        @cancel="cancelSelection"
      />
      <ScalePopover
        v-if="scalePopoverOpen"
        ref="popoverRef"
        :x="scalePopoverPosition.x"
        :y="scalePopoverPosition.y"
        :can-zoom-in="canZoomIn"
        :can-zoom-out="canZoomOut"
        @zoom-in="handleZoomIn"
        @zoom-out="handleZoomOut"
      />
    </Teleport>
  </div>
</template>
