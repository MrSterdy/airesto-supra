<script setup lang="ts">
import { LogOut, Moon, Search, Sun } from '@lucide/vue'
import { useTemplateRef } from 'vue'
import { useSearchFocusShortcut } from '@/composables/useSearchFocusShortcut'
import { useUiPreferences } from '@/composables/useUiPreferences'
import { Button } from './ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'

defineProps<{ restaurantName: string }>()

const searchQuery = defineModel<string>('searchQuery', { default: '' })

const searchInputRef = useTemplateRef('searchInput')

function getSearchInput(): HTMLInputElement | null {
  const root = searchInputRef.value?.$el
  if (root instanceof HTMLInputElement)
    return root
  return root?.querySelector?.('input') ?? null
}

useSearchFocusShortcut(getSearchInput)

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
