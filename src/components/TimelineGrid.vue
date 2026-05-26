<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { TableInfo, TimelineEvent } from '@/types'
import { computed, ref } from 'vue'
import { useBookingLayout } from '@/composables/useBookingLayout'
import { useCurrentTime } from '@/composables/useCurrentTime'
import { useGridSelection } from '@/composables/useGridSelection'
import { useTimeGrid } from '@/composables/useTimeGrid'
import SelectionCard from './SelectionCard.vue'
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

const filteredTablesRef = computed(() => props.filteredTables)
const eventsRef = computed(() => props.eventsPerTable)

const {
  startMinutes,
  endMinutes,
  timeSlots,
  gridHeight,
  quarterHeight,
  totalQuarters,
  minutesToPx,
  formatTimeSlot,
} = useTimeGrid(props.openingTime, props.closingTime)

const { tableLayouts } = useBookingLayout(
  filteredTablesRef,
  eventsRef as ComputedRef<Map<string, TimelineEvent[]>>,
  minutesToPx,
)

const { currentTimePosition } = useCurrentTime(startMinutes, endMinutes, minutesToPx)

const gridContainer = ref<HTMLElement | null>(null)

const {
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
  onGridMouseLeave,
  confirmSelection,
  cancelSelection,
  isHoveredQuarter,
} = useGridSelection(gridContainer, filteredTablesRef, quarterHeight, totalQuarters, startMinutes)
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
      :format-time-slot="formatTimeSlot"
    />

    <TableColumn
      v-for="(table, tableIdx) in filteredTables"
      :key="table.id"
      :table="table"
      :table-idx="tableIdx"
      :events="tableLayouts.get(table.id) ?? []"
      :grid-height="gridHeight"
      :time-slots-count="timeSlots.length"
      :total-quarters="totalQuarters"
      :quarter-height="quarterHeight"
      :current-time-position="currentTimePosition"
      :is-hovered-quarter="isHoveredQuarter"
    />

    <SelectionOverlay
      v-if="selection && selectionStyle && !selectionConfirmed"
      :style="selectionStyle"
    />

    <SelectionCard
      v-if="selectionConfirmed && selectionStyle && selectionTimeRange"
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
</template>
