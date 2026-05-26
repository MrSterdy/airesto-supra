<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import BookingFilters from '@/components/BookingFilters.vue'
import TimelineGrid from '@/components/TimelineGrid.vue'
import { useRestaurantData } from '@/composables/useRestaurantData'

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

    <TimelineGrid
      :filtered-tables="filteredTables"
      :events-per-table="eventsPerTable"
      :opening-time="restaurant.opening_time"
      :closing-time="restaurant.closing_time"
      :selected-day="selectedDay"
    />
  </main>
</template>
