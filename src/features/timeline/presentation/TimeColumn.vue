<script setup lang="ts">
import type { VirtualItem } from '@tanstack/vue-virtual'
import type { TimeColumnLayoutProps } from '@/features/timeline/domain/timelineLayout.types'
import { computed } from 'vue'
import { useScaledTypography } from '@/features/timeline/application/useScaledTypography'
import { TIMELINE_GRID_COLUMN_SEPARATOR } from './timelineGridLines'

const props = defineProps<{
  layout: TimeColumnLayoutProps
  timeSlots: string[]
  formatTimeSlot: (slot: string) => string
  virtualRows: VirtualItem[]
}>()

const { labelStyle, timeLabelOffset } = useScaledTypography(() => props.layout.scale)

/** Виртуализатор отдаёт quarter-строки; чётные индексы - начало 30-минутного слота. */
const slotIndicesInView = computed(() => {
  const indices = new Set<number>()
  for (const row of props.virtualRows) {
    if (row.index % 2 === 0) {
      const slotIndex = row.index / 2
      if (slotIndex < props.timeSlots.length)
        indices.add(slotIndex)
    }
  }
  return indices
})
</script>

<template>
  <div
    class="sticky left-0 z-40 bg-background shrink-0 flex flex-col"
    :style="{
      width: `${layout.timeColWidth}px`,
      boxShadow: TIMELINE_GRID_COLUMN_SEPARATOR,
    }"
  >
    <div
      class="sticky top-0 z-20 bg-background shrink-0"
      :style="{ height: `${layout.headerHeight}px` }"
    />

    <div
      class="relative z-30 shrink-0"
      :style="{ height: `${layout.gridHeight}px` }"
    >
      <div
        v-for="slotIndex in slotIndicesInView"
        :key="timeSlots[slotIndex]"
        class="absolute flex items-start justify-center text-muted-foreground pointer-events-none"
        :style="{
          top: `${slotIndex * layout.slotHeight - timeLabelOffset}px`,
          width: `${layout.timeColWidth}px`,
          ...labelStyle,
        }"
      >
        {{ formatTimeSlot(timeSlots[slotIndex]) }}
      </div>
    </div>
  </div>
</template>
