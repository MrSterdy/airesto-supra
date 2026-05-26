<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  timeSlots: string[]
  gridHeight: number
  slotHeight: number
  timeColWidth: number
  headerHeight: number
  scale: number
  formatTimeSlot: (slot: string) => string
}>()

const labelOffset = computed(() => 7 * props.scale)

const labelStyle = computed(() => ({
  fontSize: `${11 * props.scale}px`,
  lineHeight: `${14 * props.scale}px`,
}))
</script>

<template>
  <div
    class="sticky left-0 z-40 bg-background shrink-0"
    :style="{ width: `${timeColWidth}px` }"
  >
    <div class="sticky top-0 z-20 bg-background" :style="{ height: `${headerHeight}px` }" />
    <div class="relative z-30" data-grid-body :style="{ height: `${gridHeight}px` }">
      <div
        v-for="(slot, i) in timeSlots"
        :key="slot"
        class="absolute flex items-start justify-center text-foreground/48"
        :style="{
          top: `${i * slotHeight - labelOffset}px`,
          width: `${timeColWidth}px`,
          ...labelStyle,
        }"
      >
        {{ formatTimeSlot(slot) }}
      </div>
    </div>
  </div>
</template>
