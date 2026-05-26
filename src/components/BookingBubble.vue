<script setup lang="ts">
import type { LayoutEvent } from '@/types'
import { Phone } from '@lucide/vue'
import { getBadgeColor, getEventColor, getOrderBadgeLabel, getOrderTitle } from '@/constants'

const props = defineProps<{ layoutEvent: LayoutEvent }>()

const event = props.layoutEvent.event
const color = getEventColor(event.kind, event.status)
const badgeColor = getBadgeColor(event.status)
</script>

<template>
  <div
    class="absolute rounded overflow-hidden flex"
    :class="{ 'opacity-50': event.cancelled }"
    :style="{
      top: `${layoutEvent.top}px`,
      height: `${layoutEvent.height}px`,
      left: `${layoutEvent.left}px`,
      width: `${layoutEvent.width}px`,
      backgroundColor: color.bg,
    }"
  >
    <div class="w-0.5 shrink-0 h-full" :style="{ backgroundColor: color.border }" />
    <div class="flex-1 flex flex-col gap-0.5 p-0.5 overflow-hidden min-w-0">
      <span
        v-if="event.kind === 'order'"
        class="text-[11px] leading-[14px] font-semibold text-foreground truncate"
      >
        {{ getOrderTitle(event.status) }}
      </span>

      <template v-if="event.kind === 'reservation'">
        <div class="flex flex-wrap text-[11px] leading-[14px] font-semibold text-foreground min-w-0">
          <span class="truncate">{{ event.name }};&#32;</span>
          <span>{{ event.guests }}<span class="font-normal">чел</span></span>
        </div>
      </template>

      <span
        class="self-start rounded px-0.5 py-px text-[8px] leading-[8px] font-semibold truncate max-w-full"
        :style="{ backgroundColor: badgeColor.bg, color: badgeColor.text }"
      >
        {{ event.kind === 'order' ? getOrderBadgeLabel(event.status) : event.status }}
      </span>

      <div
        v-if="event.phone"
        class="flex items-center gap-0 text-[11px] leading-[14px] text-foreground"
      >
        <Phone class="size-2.5 shrink-0 mr-0.5" />
        <span class="truncate">{{ event.phone }}</span>
      </div>
    </div>
  </div>
</template>
