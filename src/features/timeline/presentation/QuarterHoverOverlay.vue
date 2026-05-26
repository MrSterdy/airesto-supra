<script setup lang="ts">
defineProps<{
  left: number
  top: number
  width: number
  height: number
}>()
</script>

<template>
  <div
    class="absolute -z-5 pointer-events-none bg-secondary motion-safe:transition-colors motion-safe:duration-75"
    :style="{
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    }"
  />
</template>
