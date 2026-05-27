<script setup lang="ts">
import type { EventDetailsViewModel } from '@/features/timeline/domain/timeline.types'
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
import { getOrderTitle } from '@/shared/constants'
import { formatRussianDay } from '@/shared/lib/formatRussianDay'
import EventDetailsSummary from './EventDetailsSummary.vue'

const props = defineProps<{
  open: boolean
  details: EventDetailsViewModel
}>()

const emit = defineEmits<{
  close: []
}>()

const dialogTitle = computed(() => {
  const { event } = props.details
  if (event.kind === 'order')
    return getOrderTitle(event.status)
  return event.name ?? 'Бронирование'
})

const dialogSubtitle = computed(() =>
  `${formatRussianDay(props.details.selectedDay)} • ${props.details.timeRange.start} – ${props.details.timeRange.end}`,
)

const isScrollLocked = useScrollLock(document.body)

watch(() => props.open, (open) => {
  isScrollLocked.value = open
}, { immediate: true })

function onOpenChange(value: boolean) {
  if (!value)
    emit('close')
}
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogContent class="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>
          {{ dialogSubtitle }}
        </DialogDescription>
      </DialogHeader>

      <div class="flex flex-col gap-1 text-muted-foreground text-sm">
        <EventDetailsSummary :details="details" />
      </div>

      <DialogFooter>
        <Button variant="outline" class="w-full" @click="emit('close')">
          Закрыть
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
