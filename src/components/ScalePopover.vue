<script setup lang="ts">
import { Minus, Plus } from '@lucide/vue'
import { computed } from 'vue'
import { Button } from './ui/button'

const props = defineProps<{
  x: number
  y: number
  canZoomIn: boolean
  canZoomOut: boolean
}>()

const emit = defineEmits<{
  zoomIn: []
  zoomOut: []
}>()

const style = computed(() => ({
  left: `${props.x}px`,
  top: `${props.y}px`,
}))
</script>

<template>
  <div
    class="fixed z-100 w-28 rounded-lg border border-border bg-card p-3 shadow-lg flex flex-col gap-2"
    :style="style"
    @click.stop
    @contextmenu.prevent
  >
    <p class="text-sm font-semibold text-foreground">
      Масштаб
    </p>
    <div class="flex gap-2">
      <Button
        variant="secondary"
        size="icon"
        class="flex-1 size-9"
        :disabled="!canZoomOut"
        aria-label="Уменьшить масштаб"
        @click.stop="emit('zoomOut')"
      >
        <Minus class="size-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        class="flex-1 size-9"
        :disabled="!canZoomIn"
        aria-label="Увеличить масштаб"
        @click.stop="emit('zoomIn')"
      >
        <Plus class="size-4" />
      </Button>
    </div>
  </div>
</template>
