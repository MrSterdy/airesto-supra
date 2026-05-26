<script setup lang="ts">
defineProps<{
  style: Record<string, string>
}>()
</script>

<template>
  <div
    class="absolute z-50 rounded border-2 border-primary bg-primary/20 pointer-events-none"
    :style="style"
  />
</template>
