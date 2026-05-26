<script setup lang="ts">
import type { TableColumnLayoutProps, TimeColumnLayoutProps } from '@/features/timeline/domain/timelineLayout.types'
import { computed } from 'vue'
import { useTimelineGrid } from '@/features/timeline/application/useTimelineGrid'
import ScalePopover from './ScalePopover.vue'
import SelectionCard from './selection/SelectionCard.vue'
import SelectionDialog from './selection/SelectionDialog.vue'
import SelectionOverlay from './selection/SelectionOverlay.vue'
import TableColumn from './TableColumn.vue'
import TimeColumn from './TimeColumn.vue'

const grid = useTimelineGrid()

const {
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
  useDialog,
  scalePopoverOpen,
  scalePopoverPosition,
  onTableContextMenu,
  isHoveredQuarter,
} = grid

const timeColumnLayout = computed<TimeColumnLayoutProps>(() => ({
  gridHeight: gridHeight.value,
  slotHeight: slotHeight.value,
  scale: scale.value,
  headerHeight: headerHeight.value,
  timeColWidth: timeColWidth.value,
}))

const tableColumnLayout = computed<TableColumnLayoutProps>(() => ({
  gridHeight: gridHeight.value,
  slotHeight: slotHeight.value,
  scale: scale.value,
  headerHeight: headerHeight.value,
  quarterHeight: quarterHeight.value,
  columnWidth: columnWidth.value,
  totalQuarters: totalQuarters.value,
  timeSlotsCount: timeSlots.value.length,
}))
</script>

<template>
  <div
    :ref="(el) => { grid.gridContainer.value = el as HTMLElement | null }"
    class="mt-8 flex min-w-full relative select-none"
    @mousedown="onGridMouseDown"
    @mousemove="onGridMouseMove"
    @mouseup="onGridMouseUp"
  >
    <TimeColumn
      :layout="timeColumnLayout"
      :time-slots="timeSlots"
      :format-time-slot="formatTimeSlot"
    />

    <TableColumn
      v-for="(table, tableIdx) in filteredTables"
      :key="table.id"
      :table="table"
      :table-idx="tableIdx"
      :events="tableLayouts.get(table.id) ?? []"
      :layout="tableColumnLayout"
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
