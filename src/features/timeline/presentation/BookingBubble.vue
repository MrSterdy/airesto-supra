<script setup lang="ts">
import type { LayoutEvent, TimelineEvent } from '@/features/timeline/domain/timeline.types'
import { Phone } from '@lucide/vue'
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

const emit = defineEmits<{
  activate: [event: TimelineEvent]
}>()

const event = computed(() => props.layoutEvent.event)

/** Порог движения указателя: выше — считаем drag, модалку не открываем. */
const CLICK_DRAG_THRESHOLD_PX = 5

let pointerDownX = 0
let pointerDownY = 0
let pointerDragged = false

function onBubblePointerDown(pointerEvent: PointerEvent) {
  if (pointerEvent.button !== 0)
    return

  pointerDownX = pointerEvent.clientX
  pointerDownY = pointerEvent.clientY
  pointerDragged = false

  function onDocumentPointerMove(moveEvent: PointerEvent) {
    if ((moveEvent.buttons & 1) === 0)
      return

    const deltaX = moveEvent.clientX - pointerDownX
    const deltaY = moveEvent.clientY - pointerDownY
    if (deltaX * deltaX + deltaY * deltaY > CLICK_DRAG_THRESHOLD_PX ** 2)
      pointerDragged = true
  }

  function onDocumentPointerUp() {
    document.removeEventListener('pointermove', onDocumentPointerMove)
    document.removeEventListener('pointerup', onDocumentPointerUp)
    document.removeEventListener('pointercancel', onDocumentPointerUp)
  }

  document.addEventListener('pointermove', onDocumentPointerMove)
  document.addEventListener('pointerup', onDocumentPointerUp)
  document.addEventListener('pointercancel', onDocumentPointerUp)
}

function onBubbleClick(mouseEvent: MouseEvent) {
  mouseEvent.stopPropagation()
  if (pointerDragged)
    return
  emit('activate', event.value)
}

const HOVER_Z_INDEX = 1000
const color = computed(() => getEventColor(event.value.kind, event.value.status))
const badgeColor = computed(() => getBadgeColor(event.value.status))

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
      class="flex-1 min-w-0 pointer-events-auto cursor-pointer"
      :class="enableHover && hovered ? 'overflow-visible' : 'overflow-hidden'"
      :style="layoutEvent.contentMaxHeight != null
        ? { maxHeight: `${layoutEvent.contentMaxHeight}px` }
        : undefined"
      @pointerdown="onBubblePointerDown"
      @click="onBubbleClick"
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
          <Phone
            class="shrink-0 mr-0.5"
            :size="iconSize"
            aria-hidden="true"
          />
          <span class="truncate">{{ event.phone }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
