import { computed, onMounted, onUnmounted, ref } from 'vue'

export function useCurrentTime(startMinutes: number, endMinutes: number, minutesToPx: (min: number) => number) {
  const now = ref(new Date())
  let timer: ReturnType<typeof setInterval>

  onMounted(() => {
    timer = setInterval(() => {
      now.value = new Date()
    }, 60_000)
  })

  onUnmounted(() => clearInterval(timer))

  const currentTimePosition = computed(() => {
    const h = now.value.getHours()
    const m = now.value.getMinutes()
    const totalMin = h * 60 + m
    if (totalMin < startMinutes || totalMin > endMinutes)
      return -1
    return minutesToPx(totalMin)
  })

  return { currentTimePosition }
}
