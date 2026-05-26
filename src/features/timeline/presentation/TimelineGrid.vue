<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
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

const grid = useTimelineGrid()

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
    :ref="(el) => { grid.gridContainer.value = el as HTMLElement | null }"
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
      />

      <!-- Y-координаты hover/drag привязаны к этому элементу -->
      <div
        :ref="(el) => { grid.gridBodyRef.value = el as HTMLElement | null }"
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
        :visible="hoverOverlayStyle.visible"
        :left="hoverOverlayStyle.left"
        :top="hoverOverlayStyle.top"
        :width="hoverOverlayStyle.width"
        :height="hoverOverlayStyle.height"
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
