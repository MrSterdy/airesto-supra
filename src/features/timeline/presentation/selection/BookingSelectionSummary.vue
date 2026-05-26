<script setup lang="ts">
import type { TableInfo } from '@/features/timeline/domain/timeline.types'
import { formatRussianDay } from '@/shared/lib/formatRussianDay'

defineProps<{
  selectedDay: string
  timeRange: { start: string, end: string }
  duration: string
  capacity: number
  selectedTables: TableInfo[]
  variant?: 'card' | 'dialog'
}>()
</script>

<template>
  <template v-if="variant === 'dialog'">
    <p class="flex justify-between items-center">
      Столы
      <span>
        <template v-for="(table, index) in selectedTables" :key="table.id">
          <template v-if="index > 0">
            +
          </template>
          #<span class="text-foreground">{{ table.number }}</span>
        </template>
      </span>
    </p>
    <p class="flex justify-between items-center">
      Количество гостей
      <span class="text-foreground">{{ capacity }}</span>
    </p>
  </template>

  <template v-else>
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
      <template v-for="(table, index) in selectedTables" :key="table.id">
        <template v-if="index > 0">
          +
        </template>
        #<span class="font-bold">{{ table.number }}</span>
      </template>
    </p>
    <p class="text-sm">
      На <span class="font-bold">{{ capacity }}</span> чел
    </p>
  </template>
</template>
