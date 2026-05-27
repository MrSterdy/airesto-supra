<script setup lang="ts">
import { defineAsyncComponent, useTemplateRef, watchEffect } from 'vue'
import { useTimelineGrid } from '@/features/timeline/application/useTimelineGrid'
import QuarterHoverOverlay from './QuarterHoverOverlay.vue'
import ScalePopover from './ScalePopover.vue'
import SelectionCard from './selection/SelectionCard.vue'
import SelectionOverlay from './selection/SelectionOverlay.vue'
import TableColumn from './TableColumn.vue'
import TimeColumn from './TimeColumn.vue'

const SelectionDialog = defineAsyncComponent(
  () => import('./selection/SelectionDialog.vue'),
)

const EventDetailsDialog = defineAsyncComponent(
  () => import('./event/EventDetailsDialog.vue'),
)

const grid = useTimelineGrid()

const gridContainerEl = useTemplateRef<HTMLElement>('gridContainer')
const gridBodyEl = useTemplateRef<HTMLElement>('gridBody')

watchEffect(() => {
  grid.gridContainer.value = gridContainerEl.value
  grid.gridBodyRef.value = gridBodyEl.value
})

const {
  filteredTables,
  selectedDay,
  timeSlots,
  formatTimeSlot,
  getTableLayout,
  layoutVersion,
  currentTimePosition,
  canZoomIn,
  canZoomOut,
  zoomIn,
  zoomOut,
  selection,
  selectionConfirmed,
  selectionStyle,
  selectedTables,
  selectionTimeRange,
  selectionDuration,
  selectionCapacity,
  onGridMouseDown,
  onGridMouseMove,
  onGridMouseUp,
  confirmSelection,
  cancelSelection,
  useInlineCard,
  isDialogOpen,
  scalePopoverOpen,
  scalePopoverPosition,
  onTableContextMenu,
  eventDetailsOpen,
  eventDetails,
  openEventDetails,
  closeEventDetails,
  virtualizer,
  gridOffsetLeft,
  hoverOverlayStyle,
  tableColumnLayout,
  timeColumnLayout,
} = grid

const {
  virtualRows,
  virtualColumns,
  visibleRowRange,
  totalWidth,
  totalScrollHeight,
} = virtualizer
</script>

<template>
  <div
    ref="gridContainer"
    class="mt-8 flex min-w-full flex-col relative select-none"
    @mousedown="onGridMouseDown"
    @mousemove="onGridMouseMove"
    @mouseup="onGridMouseUp"
  >
    <div
      class="relative min-w-full"
      :style="{
        width: `${totalWidth}px`,
        height: `${totalScrollHeight}px`,
      }"
    >
      <TimeColumn
        :layout="timeColumnLayout"
        :time-slots="timeSlots"
        :format-time-slot="formatTimeSlot"
        :virtual-rows="virtualRows"
      />

      <TableColumn
        v-for="virtualCol in virtualColumns"
        :key="`${filteredTables[virtualCol.index]?.id ?? virtualCol.index}-${layoutVersion}`"
        :table="filteredTables[virtualCol.index]!"
        :events="getTableLayout(filteredTables[virtualCol.index]!.id)"
        :layout="tableColumnLayout"
        :current-time-position="currentTimePosition"
        :visible-row-range="visibleRowRange"
        :column-left="virtualCol.start - gridOffsetLeft"
        @contextmenu="onTableContextMenu"
        @event-activate="openEventDetails"
      />

      <!-- Y-координаты hover/drag привязаны к этому элементу -->
      <div
        ref="gridBody"
        data-grid-body
        class="absolute pointer-events-none"
        :style="{
          left: `${timeColumnLayout.timeColWidth}px`,
          top: `${timeColumnLayout.headerHeight}px`,
          width: `${totalWidth - timeColumnLayout.timeColWidth}px`,
          height: `${timeColumnLayout.gridHeight}px`,
        }"
      />

      <QuarterHoverOverlay
        v-if="hoverOverlayStyle"
        v-bind="hoverOverlayStyle"
      />

      <SelectionOverlay
        v-if="selection && selectionStyle && !selectionConfirmed"
        :box-style="selectionStyle"
      />

      <SelectionCard
        v-if="useInlineCard && selectionStyle && selectionTimeRange"
        :box-style="selectionStyle"
        :time-range="selectionTimeRange"
        :duration="selectionDuration"
        :capacity="selectionCapacity"
        :selected-tables="selectedTables"
        :selected-day="selectedDay"
        @confirm="confirmSelection"
        @cancel="cancelSelection"
      />
    </div>

    <Teleport to="body">
      <SelectionDialog
        v-if="isDialogOpen && selectionTimeRange"
        :open="isDialogOpen"
        :time-range="selectionTimeRange"
        :duration="selectionDuration"
        :capacity="selectionCapacity"
        :selected-tables="selectedTables"
        :selected-day="selectedDay"
        @confirm="confirmSelection"
        @cancel="cancelSelection"
      />
      <EventDetailsDialog
        v-if="eventDetailsOpen && eventDetails"
        :open="eventDetailsOpen"
        :details="eventDetails"
        @close="closeEventDetails"
      />
      <ScalePopover
        v-if="scalePopoverOpen"
        :ref="(el) => { grid.popoverRef.value = el as HTMLElement }"
        :x="scalePopoverPosition.x"
        :y="scalePopoverPosition.y"
        :can-zoom-in="canZoomIn"
        :can-zoom-out="canZoomOut"
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
      />
    </Teleport>
  </div>
</template>
