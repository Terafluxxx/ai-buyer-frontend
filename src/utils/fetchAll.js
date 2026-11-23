import pLimit from 'p-limit'

const MAX_CONCURRENT_REQUESTS = 5

const PAGE_SIZE = 100

const limit = pLimit(MAX_CONCURRENT_REQUESTS)

export async function fetchAll(fetchPage, params = {}) {
  const firstPage = await limit(() =>
    fetchPage({
      ...params,
      page: 0,
      size: PAGE_SIZE,
    })
  )

  const items = [...firstPage.items]
  const totalPages = Math.max(firstPage.totalPages ?? 1, 1)

  const remainingPageNumbers = Array.from({ length: totalPages - 1 }, (_, index) => index + 1)

  const remainingPages = await Promise.all(
    remainingPageNumbers.map((page) =>
      limit(() =>
        fetchPage({
          ...params,
          page,
          size: PAGE_SIZE,
        })
      )
    )
  )

  for (const result of remainingPages) {
    items.push(...result.items)
  }

  return items
}
