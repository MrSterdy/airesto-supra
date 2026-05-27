<script setup lang="ts">
import type { EventDetailsViewModel } from '@/features/timeline/domain/timeline.types'
import { Phone } from '@lucide/vue'
import { computed } from 'vue'
import { getOrderBadgeLabel, getOrderTitle } from '@/shared/constants'
import { formatRussianDay } from '@/shared/lib/formatRussianDay'

const props = defineProps<{
  details: EventDetailsViewModel
}>()

const { event, table, selectedDay, timeRange, duration } = props.details

const kindLabel = computed(() =>
  event.kind === 'order' ? getOrderTitle(event.status) : 'Бронирование',
)

const statusLabel = computed(() =>
  event.kind === 'order' ? getOrderBadgeLabel(event.status) : event.status,
)

const guestLine = computed(() => {
  if (event.kind !== 'reservation' || event.guests == null)
    return null
  return `${event.guests} чел`
})
</script>

<template>
  <p class="flex justify-between items-center gap-4">
    <span>Тип</span>
    <span class="text-foreground text-right">{{ kindLabel }}</span>
  </p>
  <p class="flex justify-between items-center gap-4">
    <span>Дата</span>
    <span class="text-foreground text-right">{{ formatRussianDay(selectedDay) }}</span>
  </p>
  <p class="flex justify-between items-center gap-4">
    <span>Время</span>
    <span class="text-foreground text-right">{{ timeRange.start }} – {{ timeRange.end }}</span>
  </p>
  <p class="flex justify-between items-center gap-4">
    <span>Длительность</span>
    <span class="text-foreground text-right">{{ duration }}</span>
  </p>
  <p class="flex justify-between items-center gap-4">
    <span>Стол</span>
    <span class="text-foreground text-right">#{{ table.number }} · {{ table.zone }}</span>
  </p>
  <p
    v-if="guestLine"
    class="flex justify-between items-center gap-4"
  >
    <span>Гости</span>
    <span class="text-foreground text-right">{{ guestLine }}</span>
  </p>
  <p
    v-if="event.kind === 'reservation' && event.name"
    class="flex justify-between items-center gap-4"
  >
    <span>Имя</span>
    <span class="text-foreground text-right">{{ event.name }}</span>
  </p>
  <p class="flex justify-between items-center gap-4">
    <span>Статус</span>
    <span class="text-foreground text-right">{{ statusLabel }}</span>
  </p>
  <p
    v-if="event.cancelled"
    class="text-destructive text-right"
  >
    Отменено
  </p>
  <p
    v-if="event.phone"
    class="flex justify-between items-center gap-4"
  >
    <span>Телефон</span>
    <a
      :href="`tel:${event.phone}`"
      class="text-foreground inline-flex items-center gap-1 hover:underline"
    >
      <Phone class="size-3.5 shrink-0" aria-hidden="true" />
      {{ event.phone }}
    </a>
  </p>
</template>
