import http from './http'
import { withoutEmpty } from '../utils/params'

// Продажи за период с пагинацией.
// params: dateFrom и dateTo (обязательны, не больше 365 дней), productId, page, size
export async function getSales(params) {
  const { data } = await http.get('/sales', { params: withoutEmpty(params) })
  return data
}

// Сводка за период: { dateFrom, dateTo, totalQuantity, productCount }
export async function getSalesSummary(params) {
  const { data } = await http.get('/sales/summary', { params: withoutEmpty(params) })
  return data
}

// Ищет запись о продажах товара за конкретный день (или null)
export async function findSale(productId, date) {
  const result = await getSales({ productId, dateFrom: date, dateTo: date })
  return result.items[0] || null
}

// Записывает количество продаж товара за день.
// Для нового дня version = 0, для существующего — его текущая версия.
export async function saveSale(productId, date, { quantity, version }) {
  const { data } = await http.put(`/products/${productId}/sales/${date}`, { quantity, version })
  return data
}
