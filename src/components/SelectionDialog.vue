<script setup lang="ts">
import type { TableInfo } from '@/types'
import { formatRussianDay } from '@/composables/useRussianDate'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

defineProps<{
  open: boolean
  timeRange: { start: string, end: string }
  duration: string
  capacity: number
  selectedTables: TableInfo[]
  selectedDay: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

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
          {{ formatRussianDay(selectedDay) }}
          {{ ' • ' }}
          {{ timeRange.start }} – {{ timeRange.end }}
        </DialogDescription>
      </DialogHeader>

      <div class="flex flex-col gap-1 text-muted-foreground text-sm">
        <p class="flex justify-between items-center">
          Столы
          <span>
            <template v-for="(t, i) in selectedTables" :key="t.id">
              <template v-if="i > 0">
                +
              </template>
              #<span class="text-foreground">{{ t.number }}</span>
            </template>
          </span>
        </p>
        <p class="flex justify-between items-center">
          Количество гостей
          <span class="text-foreground">{{ capacity }}</span>
        </p>
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
