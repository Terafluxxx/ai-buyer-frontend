import http from './http'
import { withoutEmpty } from '../utils/params'

// Список товаров с пагинацией.
// params: page, size, q (поиск по SKU и названию), category, sort
export async function getProducts(params = {}) {
  const { data } = await http.get('/products', { params: withoutEmpty(params) })
  return data
}

export async function getProduct(id) {
  const { data } = await http.get(`/products/${id}`)
  return data
}

// product: { sku, name, category }
export async function createProduct(product) {
  const { data } = await http.post('/products', product)
  return data
}

// changes — только изменённые поля + обязательная текущая version
export async function updateProduct(id, changes) {
  const { data } = await http.patch(`/products/${id}`, changes)
  return data
}

// version защищает от удаления товара, который кто-то успел изменить
export async function deleteProduct(id, version) {
  await http.delete(`/products/${id}`, { params: { version } })
}
