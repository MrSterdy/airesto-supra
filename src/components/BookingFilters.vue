<script setup lang="ts">
import { computed } from 'vue'
import { Button } from './ui/button'
import { Label } from './ui/label'

const props = defineProps<{
  availableDays: string[]
  currentDay: string
  selectedDay: string
  zones: string[]
  selectedZone: string | null
}>()

const emit = defineEmits<{
  'update:selectedDay': [value: string]
  'update:selectedZone': [value: string | null]
}>()

function formatDay(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`)
  const day = date.getDate()
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
  return `${day} ${months[date.getMonth()]}`
}

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
    label: formatDay(d),
    sub: relativeLabel(d),
  })),
)

function selectZone(zone: string) {
  if (props.selectedZone === zone) {
    emit('update:selectedZone', null)
  }
  else {
    emit('update:selectedZone', zone)
  }
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
          @click="emit('update:selectedDay', day.value)"
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
          :variant="selectedZone === zone || selectedZone === null ? 'default' : 'secondary'"
          @click="selectZone(zone)"
        >
          {{ zone }}
        </Button>
      </div>
    </div>
  </form>
</template>
