<script setup lang="ts">
import { LogOut, Search, Sun } from '@lucide/vue'
import { Button } from './ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'

defineProps<{ restaurantName: string }>()
</script>

<template>
  <header class="sticky left-0 py-2 bg-secondary px-5 flex items-center justify-between">
    <a href="#" class="font-semibold text-sm">AIRESTO | {{ restaurantName }}</a>
    <nav class="flex gap-2">
      <InputGroup class="h-7">
        <InputGroupInput placeholder="⌘+Л поиск по имени" class="text-xs!" />
        <InputGroupAddon>
          <Search class="size-4" stroke-width="1" />
        </InputGroupAddon>
      </InputGroup>
      <Button size="icon-sm" variant="outline" class="border-none">
        <Sun />
      </Button>
      <Button size="sm" variant="outline" class="border-none">
        <LogOut />
        Выйти
      </Button>
    </nav>
  </header>
</template>
