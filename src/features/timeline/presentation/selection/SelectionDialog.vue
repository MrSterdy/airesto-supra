<script setup lang="ts">
import type { SelectionBookingProps } from '@/features/timeline/domain/timeline.types'
import { useScrollLock } from '@vueuse/core'
import { computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatRussianDay } from '@/shared/lib/formatRussianDay'
import BookingSelectionSummary from './BookingSelectionSummary.vue'

const props = defineProps<SelectionBookingProps & {
  open: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const dialogSubtitle = computed(() =>
  `${formatRussianDay(props.selectedDay)} • ${props.timeRange.start} – ${props.timeRange.end}`,
)

const isScrollLocked = useScrollLock(document.body)

watch(() => props.open, (open) => {
  isScrollLocked.value = open
}, { immediate: true })

function onOpenChange(value: boolean) {
  if (!value)
    emit('cancel')
}
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogContent class="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>Новое бронирование</DialogTitle>
        <DialogDescription>
          {{ dialogSubtitle }}
        </DialogDescription>
      </DialogHeader>

      <div class="flex flex-col gap-1 text-muted-foreground text-sm">
        <BookingSelectionSummary
          variant="dialog"
          :selected-day="selectedDay"
          :time-range="timeRange"
          :duration="duration"
          :capacity="capacity"
          :selected-tables="selectedTables"
        />
      </div>

      <DialogFooter class="flex-col gap-2 sm:flex-col">
        <Button class="w-full" @click="emit('confirm')">
          Создать
        </Button>
        <Button variant="outline" class="w-full" @click="emit('cancel')">
          Отменить
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
