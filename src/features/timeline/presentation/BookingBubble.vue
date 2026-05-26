<script setup lang="ts">
import type { LayoutEvent } from '@/features/timeline/domain/timeline.types'
import { useElementHover } from '@vueuse/core'
import { computed, useTemplateRef } from 'vue'
import { useScaledTypography } from '@/features/timeline/application/useScaledTypography'
import { getBadgeColor, getEventColor, getOrderBadgeLabel, getOrderTitle } from '@/shared/constants'

const props = withDefaults(defineProps<{
  layoutEvent: LayoutEvent
  scale: number
  enableHover?: boolean
}>(), {
  enableHover: true,
})

const HOVER_Z_INDEX = 1000

const event = props.layoutEvent.event
const color = getEventColor(event.kind, event.status)
const badgeColor = getBadgeColor(event.status)

const contentRef = useTemplateRef<HTMLElement>('content')
const elementHovered = useElementHover(contentRef)
const hovered = computed(() => props.enableHover && elementHovered.value)

const {
  labelStyle: textStyle,
  badgeStyle,
  iconSize,
  contentPadding,
  contentGap,
  borderWidth,
} = useScaledTypography(() => props.scale)
</script>

<template>
  <div
    class="absolute rounded overflow-hidden flex pointer-events-none"
    :class="[
      { 'opacity-50': event.cancelled },
      enableHover && hovered && 'backdrop-blur-sm',
    ]"
    :style="{
      top: `${layoutEvent.top}px`,
      height: `${layoutEvent.height}px`,
      left: `${layoutEvent.left}px`,
      width: `${layoutEvent.width}px`,
      zIndex: enableHover && hovered ? HOVER_Z_INDEX : layoutEvent.stackIndex,
      backgroundColor: color.bg,
    }"
  >
    <div
      class="shrink-0 h-full"
      :style="{ width: `${borderWidth}px`, backgroundColor: color.border }"
    />
    <div
      ref="content"
      class="flex-1 min-w-0 pointer-events-auto"
      :class="enableHover && hovered ? 'overflow-visible' : 'overflow-hidden'"
      :style="layoutEvent.contentMaxHeight != null
        ? { maxHeight: `${layoutEvent.contentMaxHeight}px` }
        : undefined"
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
          <svg
            class="shrink-0 mr-0.5"
            :width="iconSize"
            :height="iconSize"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span class="truncate">{{ event.phone }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
