<script setup lang="ts">
import type { LayoutEvent, TableInfo } from '@/types'
import { computed } from 'vue'
import BookingBubble from './BookingBubble.vue'

const props = defineProps<{
  table: TableInfo
  tableIdx: number
  events: LayoutEvent[]
  gridHeight: number
  slotHeight: number
  timeSlotsCount: number
  totalQuarters: number
  quarterHeight: number
  columnWidth: number
  headerHeight: number
  scale: number
  currentTimePosition: number
  isHoveredQuarter: (tableIdx: number, quarter: number) => boolean
}>()

const emit = defineEmits<{
  contextmenu: [event: MouseEvent]
}>()

const headerStyle = computed(() => ({
  height: `${props.headerHeight}px`,
  fontSize: `${11 * props.scale}px`,
  lineHeight: `${14 * props.scale}px`,
}))

const tableNumberStyle = computed(() => ({
  fontSize: `${13 * props.scale}px`,
  lineHeight: `${20 * props.scale}px`,
}))

function onContextMenu(e: MouseEvent) {
  e.preventDefault()
  emit('contextmenu', e)
}
</script>

<template>
  <div
    class="shrink-0 grow relative"
    :style="{ minWidth: `${columnWidth}px` }"
    @contextmenu="onContextMenu"
  >
    <div
      class="sticky top-0 z-20 bg-background flex flex-col items-center justify-center"
      :style="{ height: `${headerHeight}px` }"
    >
      <div class="flex items-center gap-1" :style="headerStyle">
        <span class="text-foreground/64">#</span>
        <span class="font-semibold" :style="tableNumberStyle">{{ table.number }}</span>
        <span class="text-foreground/64">{{ table.capacity }} чел</span>
      </div>
      <span class="text-foreground/64" :style="headerStyle">{{ table.zone }}</span>
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
        :style="{ top: `${(i - 1) * slotHeight}px` }"
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
        :scale="scale"
      />
    </div>
  </div>
</template>
