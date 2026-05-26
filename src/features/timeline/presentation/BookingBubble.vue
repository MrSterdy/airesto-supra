<script setup lang="ts">
import type { LayoutEvent } from '@/features/timeline/domain/timeline.types'
import { Phone } from '@lucide/vue'
import { useElementHover } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import { useScaledTypography } from '@/features/timeline/application/useScaledTypography'
import { getBadgeColor, getEventColor, getOrderBadgeLabel, getOrderTitle } from '@/shared/constants'

const props = defineProps<{
  layoutEvent: LayoutEvent
  scale: number
}>()

const HOVER_Z_INDEX = 1000

const event = props.layoutEvent.event
const color = getEventColor(event.kind, event.status)
const badgeColor = getBadgeColor(event.status)

const contentRef = useTemplateRef<HTMLElement>('content')
const hovered = useElementHover(contentRef)

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
      ref="content"
      class="flex-1 min-w-0 pointer-events-auto"
      :class="hovered ? 'overflow-visible' : 'overflow-hidden'"
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
          <Phone class="shrink-0 mr-0.5" :size="iconSize" />
          <span class="truncate">{{ event.phone }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
