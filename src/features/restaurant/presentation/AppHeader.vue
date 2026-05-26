<script setup lang="ts">
import { LogOut, Moon, Search, Sun } from '@lucide/vue'
import { unrefElement } from '@vueuse/core'
import { computed, useTemplateRef } from 'vue'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { useSearchFocusShortcut } from '@/features/restaurant/application/useSearchFocusShortcut'
import { useUiPreferences } from '@/features/restaurant/application/useUiPreferences'

defineProps<{ restaurantName: string }>()

const searchQuery = defineModel<string>('searchQuery', { default: '' })

const searchInputRef = useTemplateRef('searchInput')
const searchInput = computed(() => {
  const element = unrefElement(searchInputRef)
  return element instanceof HTMLInputElement ? element : element?.querySelector('input') ?? null
})

useSearchFocusShortcut(searchInput)

const { isDark, toggleTheme } = useUiPreferences()
</script>

<template>
  <header class="sticky left-0 py-2 bg-secondary px-5 flex items-center justify-between">
    <a href="#" class="font-semibold text-sm">AIRESTO | {{ restaurantName }}</a>
    <nav class="flex gap-2">
      <InputGroup class="h-7">
        <InputGroupInput
          ref="searchInput"
          v-model="searchQuery"
          placeholder="⌘+Л поиск по имени"
          class="text-xs!"
        />
        <InputGroupAddon>
          <Search class="size-4" stroke-width="1" />
        </InputGroupAddon>
      </InputGroup>
      <Button
        size="icon-sm"
        variant="outline"
        class="border-none"
        :aria-label="isDark ? 'Включить светлую тему' : 'Включить тёмную тему'"
        @click="toggleTheme()"
      >
        <Sun v-if="isDark" />
        <Moon v-else />
      </Button>
      <Button size="sm" variant="outline" class="border-none">
        <LogOut />
        Выйти
      </Button>
    </nav>
  </header>
</template>
