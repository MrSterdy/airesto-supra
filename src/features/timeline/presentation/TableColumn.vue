<script setup lang="ts">
import type { LayoutEvent, TableInfo } from '@/features/timeline/domain/timeline.types'
import type { TableColumnLayoutProps, VisibleRowRange } from '@/features/timeline/domain/timelineLayout.types'
import { computed } from 'vue'
import { useScaledTypography } from '@/features/timeline/application/useScaledTypography'
import { isLayoutEventInRowRange } from '@/features/timeline/domain/visibleRange'
import BookingBubble from './BookingBubble.vue'
import {
  TIMELINE_GRID_COLUMN_SEPARATOR,
  timelineHorizontalGridBackground,
} from './timelineGridLines'

const props = defineProps<{
  table: TableInfo
  events: LayoutEvent[]
  layout: TableColumnLayoutProps
  currentTimePosition: number
  visibleRowRange: VisibleRowRange
  columnLeft: number
}>()

const emit = defineEmits<{
  contextmenu: [event: MouseEvent]
}>()

const { labelStyle, titleStyle } = useScaledTypography(() => props.layout.scale)

const gridLineBackground = computed(() =>
  timelineHorizontalGridBackground(props.layout.slotHeight),
)

const visibleEvents = computed(() =>
  props.events.filter(event =>
    isLayoutEventInRowRange(
      event,
      props.visibleRowRange.start,
      props.visibleRowRange.end,
      props.layout.quarterHeight,
    ),
  ),
)

const showCurrentTimeLine = computed(() => props.currentTimePosition >= 0)

function onContextMenu(mouseEvent: MouseEvent) {
  mouseEvent.preventDefault()
  emit('contextmenu', mouseEvent)
}
</script>

<template>
  <div
    class="absolute top-0 flex flex-col"
    :style="{
      left: `${columnLeft}px`,
      width: `${layout.columnWidth}px`,
      height: `${layout.headerHeight + layout.gridHeight}px`,
      boxShadow: TIMELINE_GRID_COLUMN_SEPARATOR,
    }"
    @contextmenu="onContextMenu"
  >
    <div
      class="sticky top-0 z-20 bg-background flex flex-col items-center justify-center shrink-0"
      :style="{ height: `${layout.headerHeight}px` }"
    >
      <div class="flex items-center gap-1" :style="labelStyle">
        <span class="text-muted-foreground">#</span>
        <span class="font-semibold" :style="titleStyle">{{ table.number }}</span>
        <span class="text-muted-foreground">{{ table.capacity }} чел</span>
      </div>
      <span class="text-muted-foreground" :style="labelStyle">{{ table.zone }}</span>
    </div>

    <div
      class="relative shrink-0"
      :style="{
        height: `${layout.gridHeight}px`,
        backgroundImage: gridLineBackground,
      }"
    >
      <div
        v-if="showCurrentTimeLine"
        class="absolute w-full z-10 pointer-events-none"
        :style="{ top: `${currentTimePosition}px` }"
      >
        <div class="h-px w-full bg-amber-500" />
      </div>

      <BookingBubble
        v-for="layoutEvent in visibleEvents"
        :key="layoutEvent.event.id"
        :layout-event="layoutEvent"
        :scale="layout.scale"
        :enable-hover="true"
      />
    </div>
  </div>
</template>
