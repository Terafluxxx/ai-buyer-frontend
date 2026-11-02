// Дата и время из ISO-строки в привычный вид: 02.11.2026, 14:30
export function formatDateTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Дата вида 2026-11-02 → 02.11.2026
export function formatDate(date) {
  if (!date) return '—'
  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year}`
}

// Число с разделителями тысяч: 12 345,5
export function formatNumber(value) {
  if (value === null || value === undefined) return '—'
  return Number(value).toLocaleString('ru-RU', { maximumFractionDigits: 2 })
}
