/**
 * Мультивыбор зон: пустой массив = все зоны.
 */
export function useZoneFilter(selectedZones: { value: string[] }) {
  function isZoneActive(zone: string) {
    return selectedZones.value.length === 0 || selectedZones.value.includes(zone)
  }

  function toggleZone(zone: string) {
    if (selectedZones.value.length === 0) {
      selectedZones.value = [zone]
      return
    }

    if (selectedZones.value.includes(zone)) {
      selectedZones.value = selectedZones.value.filter(selectedZone => selectedZone !== zone)
      return
    }

    selectedZones.value = [...selectedZones.value, zone]
  }

  return { isZoneActive, toggleZone }
}
