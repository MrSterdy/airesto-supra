<script setup lang="ts">
import type { LayoutEvent } from '@/types'
import { Phone } from '@lucide/vue'
import { computed, ref } from 'vue'
import { getBadgeColor, getEventColor, getOrderBadgeLabel, getOrderTitle } from '@/constants'

const props = defineProps<{
  layoutEvent: LayoutEvent
  scale: number
}>()

const HOVER_Z_INDEX = 1000

const event = props.layoutEvent.event
const color = getEventColor(event.kind, event.status)
const badgeColor = getBadgeColor(event.status)
const hovered = ref(false)

const textStyle = computed(() => ({
  fontSize: `${11 * props.scale}px`,
  lineHeight: `${14 * props.scale}px`,
}))

const badgeStyle = computed(() => ({
  fontSize: `${8 * props.scale}px`,
  lineHeight: `${8 * props.scale}px`,
  padding: `${1 * props.scale}px ${2 * props.scale}px`,
}))

const iconSize = computed(() => 10 * props.scale)
const contentPadding = computed(() => 2 * props.scale)
const contentGap = computed(() => 2 * props.scale)
const borderWidth = computed(() => Math.max(1, 2 * props.scale))
</script>

<template>
  <div
    class="absolute rounded overflow-hidden flex pointer-events-none"
    :class="[
      { 'opacity-50': event.cancelled },
      hovered && 'backdrop-blur-sm',
    ]"
    :style="{
      top: `${layoutEvent.top}px`,
      height: `${layoutEvent.height}px`,
      left: `${layoutEvent.left}px`,
      width: `${layoutEvent.width}px`,
      zIndex: hovered ? HOVER_Z_INDEX : layoutEvent.stackIndex,
      backgroundColor: color.bg,
    }"
  >
    <div
      class="shrink-0 h-full"
      :style="{ width: `${borderWidth}px`, backgroundColor: color.border }"
    />
    <div
      class="flex-1 min-w-0 pointer-events-auto"
      :class="hovered ? 'overflow-visible' : 'overflow-hidden'"
      :style="layoutEvent.contentMaxHeight != null
        ? { maxHeight: `${layoutEvent.contentMaxHeight}px` }
        : undefined"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <div
        class="flex flex-col pointer-events-none"
        :style="{ gap: `${contentGap}px`, padding: `${contentPadding}px` }"
      >
        <span
          v-if="event.kind === 'order'"
          class="font-semibold text-foreground truncate"
          :style="textStyle"
        >
          {{ getOrderTitle(event.status) }}
        </span>

        <template v-if="event.kind === 'reservation'">
          <div
            class="flex flex-wrap font-semibold text-foreground min-w-0"
            :style="{ ...textStyle, gap: `${contentGap}px` }"
          >
            <span class="truncate">{{ event.name }};</span>
            <span>{{ event.guests }}&nbsp;<span class="font-normal">чел</span></span>
          </div>
        </template>

        <span
          class="self-start rounded font-semibold truncate max-w-full"
          :style="{ ...badgeStyle, backgroundColor: badgeColor.bg, color: badgeColor.text }"
        >
          {{ event.kind === 'order' ? getOrderBadgeLabel(event.status) : event.status }}
        </span>

        <div
          v-if="event.phone"
          class="flex items-center text-foreground"
          :style="textStyle"
        >
          <Phone class="shrink-0 mr-0.5" :size="iconSize" />
          <span class="truncate">{{ event.phone }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
