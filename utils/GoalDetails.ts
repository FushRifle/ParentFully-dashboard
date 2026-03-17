type FrequencyUnit = 'days' | 'weeks' | 'months' | 'years'
export const normalizeFrequencyUnit = (unit?: string): FrequencyUnit => {
     switch (unit) {
          case 'day':
          case 'days':
          case 'daily':
               return 'days'

          case 'week':
          case 'weeks':
          case 'weekly':
               return 'weeks'

          case 'month':
          case 'months':
          case 'monthly':
               return 'months'

          case 'year':
          case 'years':
          case 'yearly':
               return 'years'

          default:
               return 'weeks'
     }
}