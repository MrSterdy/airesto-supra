<script setup lang="ts">
import type { TimeColumnLayoutProps } from '@/features/timeline/domain/timelineLayout.types'
import { useScaledTypography } from '@/features/timeline/application/useScaledTypography'

const props = defineProps<{
  layout: TimeColumnLayoutProps
  timeSlots: string[]
  formatTimeSlot: (slot: string) => string
}>()

const { labelStyle, timeLabelOffset } = useScaledTypography(() => props.layout.scale)
</script>

<template>
  <div
    class="sticky left-0 z-40 bg-background shrink-0"
    :style="{ width: `${layout.timeColWidth}px` }"
  >
    <div class="sticky top-0 z-20 bg-background" :style="{ height: `${layout.headerHeight}px` }" />
    <div class="relative z-30" data-grid-body :style="{ height: `${layout.gridHeight}px` }">
      <div
        v-for="(slot, index) in timeSlots"
        :key="slot"
        class="absolute flex items-start justify-center text-foreground/48"
        :style="{
          top: `${index * layout.slotHeight - timeLabelOffset}px`,
          width: `${layout.timeColWidth}px`,
          ...labelStyle,
        }"
      >
        {{ formatTimeSlot(slot) }}
      </div>
    </div>
  </div>
</template>
