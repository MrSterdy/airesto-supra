<script setup lang="ts">
defineProps<{
  style: Record<string, string>
}>()
</script>

<template>
  <div
    class="absolute z-50 rounded border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
    :style="style"
  />
</template>
