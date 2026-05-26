<script setup lang="ts">
import type { LayoutEvent, TableInfo } from '@/features/timeline/domain/timeline.types'
import type { TableColumnLayoutProps } from '@/features/timeline/domain/timelineLayout.types'
import { usePreferredReducedMotion } from '@vueuse/core'
import { computed } from 'vue'
import { useScaledTypography } from '@/features/timeline/application/useScaledTypography'
import BookingBubble from './BookingBubble.vue'

const props = defineProps<{
  table: TableInfo
  tableIdx: number
  events: LayoutEvent[]
  layout: TableColumnLayoutProps
  currentTimePosition: number
  isHoveredQuarter: (tableIdx: number, quarter: number) => boolean
}>()

const emit = defineEmits<{
  contextmenu: [event: MouseEvent]
}>()

const prefersReducedMotion = usePreferredReducedMotion()
const { labelStyle, titleStyle } = useScaledTypography(() => props.layout.scale)

const quarterHoverClass = computed(() =>
  prefersReducedMotion.value ? '' : 'transition-colors duration-75',
)

function onContextMenu(mouseEvent: MouseEvent) {
  mouseEvent.preventDefault()
  emit('contextmenu', mouseEvent)
}
</script>

<template>
  <div
    class="shrink-0 grow relative"
    :style="{ minWidth: `${layout.columnWidth}px` }"
    @contextmenu="onContextMenu"
  >
    <div
      class="sticky top-0 z-20 bg-background flex flex-col items-center justify-center"
      :style="{ height: `${layout.headerHeight}px` }"
    >
      <div class="flex items-center gap-1" :style="labelStyle">
        <span class="text-foreground/64">#</span>
        <span class="font-semibold" :style="titleStyle">{{ table.number }}</span>
        <span class="text-foreground/64">{{ table.capacity }} чел</span>
      </div>
      <span class="text-foreground/64" :style="labelStyle">{{ table.zone }}</span>
    </div>

    <div class="relative" :style="{ height: `${layout.gridHeight}px` }">
      <div
        v-for="quarter in layout.totalQuarters"
        :key="`hover-${quarter}`"
        class="absolute w-full"
        :class="[quarterHoverClass, isHoveredQuarter(tableIdx, quarter - 1) ? 'bg-secondary' : '']"
        :style="{ top: `${(quarter - 1) * layout.quarterHeight}px`, height: `${layout.quarterHeight}px` }"
      />

      <div
        v-for="lineIndex in layout.timeSlotsCount"
        :key="`line-${lineIndex}`"
        class="absolute w-full border-t border-foreground/8 pointer-events-none"
        :style="{ top: `${(lineIndex - 1) * layout.slotHeight}px` }"
      />

      <div
        v-if="currentTimePosition >= 0"
        class="absolute w-full z-10 pointer-events-none"
        :style="{ top: `${currentTimePosition}px` }"
      >
        <div class="h-px w-full bg-amber-500" />
      </div>

      <BookingBubble
        v-for="event in events"
        :key="event.event.id"
        :layout-event="event"
        :scale="layout.scale"
      />
    </div>
  </div>
</template>
