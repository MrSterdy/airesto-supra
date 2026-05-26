<script setup lang="ts">
import { computed } from 'vue'
import { formatRussianDay } from '@/composables/useRussianDate'
import { Button } from './ui/button'
import { Label } from './ui/label'

const props = defineProps<{
  availableDays: string[]
  currentDay: string
  zones: string[]
}>()

const selectedDay = defineModel<string>('selectedDay', { required: true })
const selectedZones = defineModel<string[]>('selectedZones', { required: true })

function relativeLabel(dateStr: string) {
  const today = new Date(`${props.currentDay}T00:00:00`)
  const target = new Date(`${dateStr}T00:00:00`)
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000)
  if (diff === 0)
    return 'сегодня'
  if (diff === 1)
    return 'завтра'
  const weekdays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
  return weekdays[target.getDay()]
}

const displayDays = computed(() =>
  props.availableDays.map(d => ({
    value: d,
    label: formatRussianDay(d),
    sub: relativeLabel(d),
  })),
)

function isZoneActive(zone: string) {
  return selectedZones.value.length === 0 || selectedZones.value.includes(zone)
}

function toggleZone(zone: string) {
  if (selectedZones.value.length === 0) {
    selectedZones.value = [zone]
    return
  }

  if (selectedZones.value.includes(zone)) {
    selectedZones.value = selectedZones.value.filter(z => z !== zone)
    return
  }

  selectedZones.value = [...selectedZones.value, zone]
}
</script>

<template>
  <form class="sticky left-0 flex flex-col gap-4 px-4 mt-4">
    <div class="flex flex-col gap-1">
      <Label class="text-muted-foreground">Дата</Label>
      <div class="flex gap-2">
        <Button
          v-for="day in displayDays"
          :key="day.value"
          type="button"
          class="flex flex-col h-auto gap-0 py-1 items-start"
          :variant="selectedDay === day.value ? 'default' : 'secondary'"
          @click="selectedDay = day.value"
        >
          <span class="leading-tight font-semibold">{{ day.label }}</span>
          <span class="leading-tight">{{ day.sub }}</span>
        </Button>
      </div>
    </div>
    <div class="flex flex-col gap-1">
      <Label class="text-muted-foreground">Отображаемые зоны</Label>
      <div class="flex gap-2">
        <Button
          v-for="zone in zones"
          :key="zone"
          type="button"
          size="sm"
          :variant="isZoneActive(zone) ? 'default' : 'secondary'"
          @click="toggleZone(zone)"
        >
          {{ zone }}
        </Button>
      </div>
    </div>
  </form>
</template>
