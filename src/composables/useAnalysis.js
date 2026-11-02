import { computed, ref } from 'vue'
import { getProducts } from '../api/products'
import { getInventoryList } from '../api/inventory'
import { getSales } from '../api/sales'
import { fetchAll } from '../utils/fetchAll'
import { daysAgo } from '../utils/dates'
import { errorMessage } from '../utils/errors'
import { calculateRecommendation } from '../utils/recommendation'

// Порядок сортировки: сначала самые срочные товары
const STATUS_ORDER = { CRITICAL: 0, NEED_PURCHASE: 1, NORMAL: 2, NO_SALES: 3 }

// Загружает товары, остатки и продажи и считает анализ по каждому товару.
// Используется на дашборде и на странице рекомендаций.
export function useAnalysis() {
  // 30 завершённых дней: со вчерашнего дня на 30 дней назад
  const period = { dateFrom: daysAgo(30), dateTo: daysAgo(1) }

  const rows = ref([])
  const loading = ref(false)
  const error = ref('')

  async function load() {
    loading.value = true
    error.value = ''
    try {
      // Три списка не зависят друг от друга — грузим параллельно
      const [products, inventory, sales] = await Promise.all([
        fetchAll(getProducts),
        fetchAll(getInventoryList),
        fetchAll(getSales, period),
      ])

      // Остаток по id товара
      const stockByProduct = {}
      for (const item of inventory) {
        stockByProduct[item.productId] = item.quantity
      }

      // Сумма продаж за период по id товара
      const salesByProduct = {}
      for (const sale of sales) {
        salesByProduct[sale.productId] = (salesByProduct[sale.productId] || 0) + sale.quantity
      }

      rows.value = products
        .map((product) => {
          const stock = stockByProduct[product.id] || 0
          const sales30 = salesByProduct[product.id] || 0
          return { product, stock, sales30, ...calculateRecommendation({ sales30, stock }) }
        })
        .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || (a.stockDays ?? 0) - (b.stockDays ?? 0))
    } catch (e) {
      error.value = errorMessage(e)
    } finally {
      loading.value = false
    }
  }

  // Количество товаров в каждом состоянии
  const counts = computed(() => {
    const result = { CRITICAL: 0, NEED_PURCHASE: 0, NORMAL: 0, NO_SALES: 0 }
    for (const row of rows.value) {
      result[row.status]++
    }
    return result
  })

  // Товары, которым нужна закупка
  const recommendations = computed(() => rows.value.filter((row) => row.recommendedQuantity > 0))

  return { period, rows, counts, recommendations, loading, error, load }
}
