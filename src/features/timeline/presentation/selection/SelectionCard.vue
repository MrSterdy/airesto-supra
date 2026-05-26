<script setup lang="ts">
import type { SelectionBookingProps, SelectionBoxStyle } from '@/features/timeline/domain/timeline.types'
import { Button } from '@/components/ui/button'
import BookingSelectionSummary from './BookingSelectionSummary.vue'

defineProps<SelectionBookingProps & {
  boxStyle: SelectionBoxStyle
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div
    class="absolute z-9999 rounded-lg bg-card border border-border shadow-lg flex flex-col overflow-hidden"
    :style="boxStyle"
    @mousedown.stop
  >
    <div class="flex-1 p-3 flex flex-col gap-1 overflow-auto">
      <p class="font-semibold text-sm">
        Новое бронирование
      </p>
      <BookingSelectionSummary
        variant="card"
        :selected-day="selectedDay"
        :time-range="timeRange"
        :duration="duration"
        :capacity="capacity"
        :selected-tables="selectedTables"
      />
    </div>
    <div class="flex flex-col gap-2 p-3 pt-0">
      <Button class="w-full" @click.stop="emit('confirm')">
        Создать
      </Button>
      <Button variant="outline" class="w-full" @click.stop="emit('cancel')">
        Отменить
      </Button>
    </div>
  </div>
</template>
