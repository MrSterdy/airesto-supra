<script setup lang="ts">
import type { LayoutEvent, TableInfo } from '@/types'
import { COLUMN_WIDTH, SLOT_HEIGHT } from '@/constants'
import BookingBubble from './BookingBubble.vue'

defineProps<{
  table: TableInfo
  tableIdx: number
  events: LayoutEvent[]
  gridHeight: number
  timeSlotsCount: number
  totalQuarters: number
  quarterHeight: number
  currentTimePosition: number
  isHoveredQuarter: (tableIdx: number, quarter: number) => boolean
}>()
</script>

<template>
  <div class="shrink-0 grow relative" :style="{ minWidth: `${COLUMN_WIDTH}px` }">
    <div class="sticky top-0 z-20 bg-background flex flex-col items-center justify-center" style="height: 48px">
      <div class="flex items-center gap-1">
        <span class="text-[11px] text-foreground/64">#</span>
        <span class="text-[13px] font-semibold leading-[20px]">{{ table.number }}</span>
        <span class="text-[11px] text-foreground/64">{{ table.capacity }} чел</span>
      </div>
      <span class="text-[11px] text-foreground/64">{{ table.zone }}</span>
    </div>

    <div class="relative" :style="{ height: `${gridHeight}px` }">
      <div
        v-for="q in totalQuarters"
        :key="`hover-${q}`"
        class="absolute w-full transition-colors duration-75"
        :class="isHoveredQuarter(tableIdx, q - 1) ? 'bg-secondary' : ''"
        :style="{ top: `${(q - 1) * quarterHeight}px`, height: `${quarterHeight}px` }"
      />

      <div
        v-for="i in timeSlotsCount"
        :key="`line-${i}`"
        class="absolute w-full border-t border-foreground/8 pointer-events-none"
        :style="{ top: `${(i - 1) * SLOT_HEIGHT}px` }"
      />

      <div
        v-if="currentTimePosition >= 0"
        class="absolute w-full z-10 pointer-events-none"
        :style="{ top: `${currentTimePosition}px` }"
      >
        <div class="h-0.5 w-full bg-red-500" />
      </div>

      <BookingBubble
        v-for="event in events"
        :key="event.event.id"
        :layout-event="event"
      />
    </div>
  </div>
</template>
