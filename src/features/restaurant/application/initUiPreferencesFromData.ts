import type { ApiResponse } from '@/features/restaurant/domain/restaurant.types'
import { applyPreferencesContext, buildPreferencesContext } from '@/core/preferences'

/** Нормализация UI preferences из localStorage после загрузки данных ресторана. */
export function initUiPreferencesFromData(data: ApiResponse) {
  applyPreferencesContext(buildPreferencesContext(data))
}
