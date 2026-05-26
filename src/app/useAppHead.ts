import type { MaybeRefOrGetter } from 'vue'
import { useTitle } from '@vueuse/core'
import { computed, toValue } from 'vue'

/** Заголовок вкладки приложения. */
export function useAppHead(restaurantName: MaybeRefOrGetter<string>) {
  useTitle(computed(() => `AIRESTO | ${toValue(restaurantName)}`))
}
