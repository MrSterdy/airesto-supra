<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { computed } from 'vue'

defineProps<{
  visible: boolean
  left: number
  top: number
  width: number
  height: number
}>()

const prefersReducedMotion = usePreferredReducedMotion()

const overlayClass = computed(() =>
  prefersReducedMotion.value ? 'bg-secondary' : 'bg-secondary transition-colors duration-75',
)
</script>

<template>
  <div
    v-if="visible"
    class="absolute -z-5 pointer-events-none"
    :class="overlayClass"
    :style="{
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    }"
  />
</template>
