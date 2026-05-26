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
  selectedZone,
  zones,
  filteredTables,
  eventsPerTable,
} = useRestaurantData()
</script>

<template>
  <main class="flex flex-col h-screen overflow-auto">
    <AppHeader :restaurant-name="restaurant.restaurant_name" />

    <h2 class="sticky left-0 mt-8 text-xl font-bold px-4">
      Бронирования
    </h2>

    <BookingFilters
      :available-days="availableDays"
      :current-day="currentDay"
      :selected-day="selectedDay"
      :zones="zones"
      :selected-zone="selectedZone"
      @update:selected-day="selectedDay = $event"
      @update:selected-zone="selectedZone = $event"
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
