<script setup lang="ts">
import type { SelectionBoxStyle } from '@/features/timeline/domain/timeline.types'

defineProps<{
  boxStyle: SelectionBoxStyle
}>()
</script>

<template>
  <div
    class="absolute z-50 rounded border-2 border-primary bg-primary/20 pointer-events-none"
    :style="boxStyle"
  />
</template>
