<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { computed } from 'vue'
import { initRestaurantFeature } from '@/features/restaurant/application/initRestaurantFeature'
import { useRestaurantData } from '@/features/restaurant/application/useRestaurantData'
import AppHeader from '@/features/restaurant/presentation/AppHeader.vue'
import BookingFilters from '@/features/restaurant/presentation/BookingFilters.vue'
import { provideTimelineContext } from '@/features/timeline/application/useTimelineContext'
import TimelineGrid from '@/features/timeline/presentation/TimelineGrid.vue'

initRestaurantFeature()

const {
  restaurant,
  availableDays,
  currentDay,
  selectedDay,
  selectedZones,
  zones,
  filteredTables,
  eventsPerTable,
  searchQuery,
} = useRestaurantData()

useTitle(computed(() => `AIRESTO | ${restaurant.restaurant_name}`))

provideTimelineContext({
  filteredTables,
  eventsPerTable,
  openingTime: restaurant.opening_time,
  closingTime: restaurant.closing_time,
  selectedDay,
})
</script>

<template>
  <main class="flex flex-col h-screen overflow-auto">
    <AppHeader
      v-model:search-query="searchQuery"
      :restaurant-name="restaurant.restaurant_name"
    />

    <h2 class="sticky left-0 mt-8 text-xl font-bold px-4">
      Бронирования
    </h2>

    <BookingFilters
      v-model:selected-day="selectedDay"
      v-model:selected-zones="selectedZones"
      :available-days="availableDays"
      :current-day="currentDay"
      :zones="zones"
    />

    <TimelineGrid />
  </main>
</template>
