// Backend сравнивает даты по UTC, поэтому и здесь считаем в UTC.
// Все даты — строки формата YYYY-MM-DD.

export function today() {
  return new Date().toISOString().slice(0, 10)
}

// Дата, отстоящая от сегодняшней на days дней назад
export function daysAgo(days) {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - days)
  return date.toISOString().slice(0, 10)
}
