import http from './http'
import { withoutEmpty } from '../utils/params'

// Остатки всех товаров с пагинацией. params: page, size, productId
export async function getInventoryList(params = {}) {
  const { data } = await http.get('/inventory', { params: withoutEmpty(params) })
  return data
}

// Остаток одного товара: { productId, quantity, version, updatedAt }
export async function getProductInventory(productId) {
  const { data } = await http.get(`/products/${productId}/inventory`)
  return data
}

// Установить новое количество. version — текущая версия остатка
export async function setProductInventory(productId, { quantity, version }) {
  const { data } = await http.put(`/products/${productId}/inventory`, { quantity, version })
  return data
}
