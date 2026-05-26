<script setup lang="ts">
import type { SelectionBookingProps } from '@/features/timeline/domain/timeline.types'
import { computed } from 'vue'
import { formatRussianDay } from '@/shared/lib/formatRussianDay'

const props = withDefaults(defineProps<SelectionBookingProps & {
  variant?: 'card' | 'dialog'
}>(), {
  variant: 'card',
})

const tableListLabel = computed(() =>
  props.selectedTables.map(table => `#${table.number}`).join(' + '),
)
</script>

<template>
  <template v-if="variant === 'dialog'">
    <p class="flex justify-between items-center">
      Столы
      <span class="text-foreground">{{ tableListLabel }}</span>
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
      Столы <span class="font-bold">{{ tableListLabel }}</span>
    </p>
    <p class="text-sm">
      На <span class="font-bold">{{ capacity }}</span> чел
    </p>
  </template>
</template>
