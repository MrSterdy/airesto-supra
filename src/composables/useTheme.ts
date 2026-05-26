import { useDark, useToggle } from '@vueuse/core'

const THEME_STORAGE_KEY = 'airesto-theme'

export function useTheme() {
  const isDark = useDark({
    storageKey: THEME_STORAGE_KEY,
    valueDark: 'dark',
    valueLight: '',
    initialValue: 'dark',
  })

  const toggle = useToggle(isDark)

  return { isDark, toggle }
}
