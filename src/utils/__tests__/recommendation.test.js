import { describe, expect, it } from 'vitest'
import { calculateRecommendation, DEFAULT_LEAD_DAYS } from '../recommendation.js'

describe('calculateRecommendation', () => {
  it('использует срок поставки по умолчанию', () => {
    const result = calculateRecommendation({
      sales30: 30,
      stock: 7,
    })

    expect(DEFAULT_LEAD_DAYS).toBe(7)
    expect(result.status).toBe('CRITICAL')
    expect(result.reorderPoint).toBe(14)
    expect(result.targetStock).toBe(37)
    expect(result.stockDays).toBe(7)
  })

  it('возвращает NO_SALES, если за последние 30 дней не было продаж', () => {
    const result = calculateRecommendation({
      sales30: 0,
      stock: 50,
      minimumOrder: 10,
    })

    expect(result.status).toBe('NO_SALES')
    expect(result.averageDailySales).toBe(0)
    expect(result.stockDays).toBeNull()
    expect(result.reorderPoint).toBe(0)
    expect(result.targetStock).toBe(0)
    expect(result.recommendedQuantity).toBe(0)
    expect(result.reason).toContain('За 30 завершённых дней продажи не зарегистрированы.')
  })

  it('возвращает CRITICAL на точной границе срока поставки', () => {
    const result = calculateRecommendation({
      sales30: 30,
      stock: 7,
      leadDays: 7,
    })

    // Запаса ровно на 7 дней продаж — это критический уровень.
    expect(result.status).toBe('CRITICAL')
    expect(result.recommendedQuantity).toBe(30)
  })

  it('возвращает NEED_PURCHASE на точной границе точки заказа', () => {
    const result = calculateRecommendation({
      sales30: 30,
      stock: 14,
      leadDays: 7,
    })

    // Запаса хватает на 14 дней: срок поставки + 7 дней страховки.
    expect(result.status).toBe('NEED_PURCHASE')
    expect(result.recommendedQuantity).toBe(23)
  })

  it('возвращает NORMAL, если остаток выше точки заказа', () => {
    const result = calculateRecommendation({
      sales30: 30,
      stock: 15,
      leadDays: 7,
    })

    expect(result.status).toBe('NORMAL')
    expect(result.recommendedQuantity).toBe(0)
  })

  it('правильно рассчитывает средние продажи, точку заказа и целевой запас', () => {
    const result = calculateRecommendation({
      sales30: 60,
      stock: 20,
      leadDays: 5,
    })

    expect(result.averageDailySales).toBe(2)
    expect(result.stockDays).toBe(10)
    expect(result.reorderPoint).toBe(24)
    expect(result.targetStock).toBe(70)
    expect(result.status).toBe('NEED_PURCHASE')
    expect(result.recommendedQuantity).toBe(50)
  })

  it('округляет рекомендуемое количество вверх до целого числа', () => {
    const result = calculateRecommendation({
      sales30: 10,
      stock: 1,
      leadDays: 7,
    })

    // Расчётная потребность составляет 11.33, поэтому нужно заказать 12.
    expect(result.recommendedQuantity).toBe(12)
  })

  it('учитывает уже заказанное количество при расчёте закупки', () => {
    const result = calculateRecommendation({
      sales30: 30,
      stock: 7,
      leadDays: 7,
      incoming: 5,
    })

    expect(result.status).toBe('CRITICAL')
    expect(result.recommendedQuantity).toBe(25)
  })

  it('не позволяет рекомендованному количеству быть меньше минимального заказа', () => {
    const result = calculateRecommendation({
      sales30: 30,
      stock: 7,
      leadDays: 7,
      minimumOrder: 40,
    })

    // Расчётная потребность — 30, но минимальный заказ — 40.
    expect(result.recommendedQuantity).toBe(40)
  })

  it('не применяет минимальный заказ, если дополнительная закупка не нужна', () => {
    const result = calculateRecommendation({
      sales30: 30,
      stock: 7,
      leadDays: 7,
      incoming: 40,
      minimumOrder: 20,
    })

    expect(result.status).toBe('CRITICAL')
    expect(result.recommendedQuantity).toBe(0)
  })

  it('формирует текстовое объяснение с округлёнными средними продажами', () => {
    const result = calculateRecommendation({
      sales30: 1,
      stock: 0,
      leadDays: 7,
    })

    expect(result.reason).toContain('Остаток 0 шт.')
    expect(result.reason).toContain('средние продажи 0.03 шт./день')
    expect(result.reason).toContain('Рекомендуется купить 2 шт.')
    expect(result.reason).toContain('Поставщик не выбран, бюджет неизвестен.')
  })
})
