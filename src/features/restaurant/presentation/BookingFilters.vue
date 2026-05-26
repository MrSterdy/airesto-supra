<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useZoneFilter } from '@/features/restaurant/application/useZoneFilter'
import { getRelativeDayLabel } from '@/shared/lib/dateLabels'
import { formatRussianDay } from '@/shared/lib/formatRussianDay'

const props = defineProps<{
  availableDays: string[]
  currentDay: string
  zones: string[]
}>()

const selectedDay = defineModel<string>('selectedDay', { required: true })
const selectedZones = defineModel<string[]>('selectedZones', { required: true })

const { isZoneActive, toggleZone } = useZoneFilter(selectedZones)

const displayDays = computed(() =>
  props.availableDays.map(day => ({
    value: day,
    label: formatRussianDay(day),
    sub: getRelativeDayLabel(day, props.currentDay),
  })),
)
</script>

<template>
  <section class="sticky left-0 flex flex-col gap-4 px-4 mt-4">
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
  </section>
</template>
