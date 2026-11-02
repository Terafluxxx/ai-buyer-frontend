// Расчёт рекомендации по закупке.
// Это перенос формулы из backend (RecommendationCalculator.java).
// Пока у backend нет REST-метода для рекомендаций, считаем на клиенте.

// Срок поставки по умолчанию, если поставщик не выбран (как в backend)
export const DEFAULT_LEAD_DAYS = 7

// Состояния товара (FR-09)
export const STATUSES = {
  CRITICAL: 'Критично',
  NEED_PURCHASE: 'Нужна закупка',
  NORMAL: 'В норме',
  NO_SALES: 'Нет продаж',
}

// sales30 — сколько продано за последние 30 завершённых дней
// stock — текущий остаток
// incoming — уже заказано, но ещё не пришло (закупок пока нет, поэтому 0)
export function calculateRecommendation({ sales30, stock, leadDays = DEFAULT_LEAD_DAYS, minimumOrder = 1, incoming = 0 }) {
  const averageDailySales = sales30 / 30
  // Точка заказа: запас на время поставки + 7 дней страховки
  const reorderPoint = averageDailySales * (leadDays + 7)
  // Целевой запас: на время поставки + 30 дней продаж
  const targetStock = averageDailySales * (leadDays + 30)
  // Сколько дней хватит текущего остатка
  const stockDays = sales30 === 0 ? null : stock / averageDailySales

  // Сравниваем целые числа (всё умножено на 30), чтобы не было ошибок округления
  let status
  if (sales30 === 0) {
    status = 'NO_SALES'
  } else if (stock * 30 <= sales30 * leadDays) {
    status = 'CRITICAL' // остатка не хватит даже на время поставки
  } else if (stock * 30 <= sales30 * (leadDays + 7)) {
    status = 'NEED_PURCHASE' // остаток ниже точки заказа
  } else {
    status = 'NORMAL'
  }

  // Рекомендуемое количество: добрать до целевого запаса
  let recommendedQuantity = 0
  if (status === 'CRITICAL' || status === 'NEED_PURCHASE') {
    const needed = Math.ceil((sales30 * (leadDays + 30) - stock * 30 - incoming * 30) / 30)
    recommendedQuantity = Math.max(needed, 0)
    if (recommendedQuantity > 0) {
      recommendedQuantity = Math.max(recommendedQuantity, minimumOrder)
    }
  }

  // Текстовое объяснение рекомендации (FR-13), как его формирует backend
  let reason =
    `Остаток ${stock} шт., средние продажи ${round(averageDailySales)} шт./день, ` +
    `срок поставки ${leadDays} дней. Уже заказано ${incoming} шт. ` +
    `Рекомендуется купить ${recommendedQuantity} шт.`
  if (sales30 === 0) reason += ' За 30 завершённых дней продажи не зарегистрированы.'
  reason += ' Поставщик не выбран, бюджет неизвестен.'

  return {
    averageDailySales,
    stockDays,
    reorderPoint,
    targetStock,
    recommendedQuantity,
    status,
    reason,
  }
}

function round(value) {
  return Math.round(value * 100) / 100
}
