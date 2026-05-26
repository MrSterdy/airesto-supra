<script setup lang="ts">
import type { TableInfo } from '@/types'
import { formatRussianDay } from '@/composables/useRussianDate'
import { Button } from './ui/button'

defineProps<{
  style: Record<string, string>
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
</script>

<template>
  <div
    class="absolute z-9999 rounded-lg bg-card border border-border shadow-lg flex flex-col overflow-hidden"
    :style="style"
  >
    <div class="flex-1 p-3 flex flex-col gap-1 overflow-auto">
      <p class="font-semibold text-sm">
        Новое бронирование
      </p>
      <p class="text-xs text-muted-foreground">
        {{ formatRussianDay(selectedDay) }}
      </p>
      <p class="text-lg font-bold leading-tight">
        {{ timeRange.start }} – {{ timeRange.end }}
      </p>
      <p class="text-xs text-muted-foreground">
        {{ duration }}
      </p>
      <p class="text-sm mt-1">
        Столы
        <template v-for="(t, i) in selectedTables" :key="t.id">
          <template v-if="i > 0">
            +
          </template>
          #<span class="font-bold">{{ t.number }}</span>
        </template>
      </p>
      <p class="text-sm">
        На <span class="font-bold">{{ capacity }}</span> чел
      </p>
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
