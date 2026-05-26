<script setup lang="ts">
import { SLOT_HEIGHT } from '@/constants'

defineProps<{
  timeSlots: string[]
  gridHeight: number
  formatTimeSlot: (slot: string) => string
}>()
</script>

<template>
  <div class="sticky left-0 z-40 bg-background shrink-0" style="width: 52px">
    <div class="sticky top-0 z-20 bg-background" style="height: 48px" />
    <div class="relative z-30" data-grid-body :style="{ height: `${gridHeight}px` }">
      <div
        v-for="(slot, i) in timeSlots"
        :key="slot"
        class="absolute flex items-start justify-center text-[11px] leading-[14px] text-foreground/48"
        :style="{ top: `${i * SLOT_HEIGHT - 7}px`, width: '52px' }"
      >
        {{ formatTimeSlot(slot) }}
      </div>
    </div>
  </div>
</template>
