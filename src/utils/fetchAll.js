// Загружает все страницы списка подряд и возвращает один общий массив.
// fetchPage — функция API, например getProducts.
// 100 — максимальный размер страницы, который разрешает backend.
export async function fetchAll(fetchPage, params = {}) {
  const items = []
  let page = 0
  let totalPages = 1

  while (page < totalPages) {
    const result = await fetchPage({ ...params, page, size: 100 })
    items.push(...result.items)
    totalPages = result.totalPages
    page++
  }

  return items
}
