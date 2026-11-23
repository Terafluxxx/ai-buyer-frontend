import { describe, expect, it, vi } from 'vitest'
import { fetchAll } from '../fetchAll.js'

describe('fetchAll', () => {
  it('загружает одну страницу', async () => {
    const items = [{ id: 1 }, { id: 2 }]

    const fetchPage = vi.fn().mockResolvedValue({
      items,
      totalPages: 1,
    })

    const result = await fetchAll(fetchPage)

    expect(result).toEqual(items)
    expect(fetchPage).toHaveBeenCalledTimes(1)
    expect(fetchPage).toHaveBeenCalledWith({
      page: 0,
      size: 100,
    })
  })

  it('ограничивает количество одновременных запросов пятью', async () => {
    let activeRequests = 0
    let maxActiveRequests = 0

    const fetchPage = vi.fn(async ({ page }) => {
      activeRequests++
      maxActiveRequests = Math.max(maxActiveRequests, activeRequests)

      await new Promise((resolve) => setTimeout(resolve, (11 - page) * 2))

      activeRequests--

      return {
        items: [page],
        totalPages: 11,
      }
    })

    const result = await fetchAll(fetchPage)

    expect(maxActiveRequests).toBe(5)
    expect(fetchPage).toHaveBeenCalledTimes(11)
    expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('загружает все страницы и объединяет результаты', async () => {
    const pages = [
      {
        items: [{ id: 1 }, { id: 2 }],
        totalPages: 3,
      },
      {
        items: [{ id: 3 }],
        totalPages: 3,
      },
      {
        items: [{ id: 4 }, { id: 5 }],
        totalPages: 3,
      },
    ]

    const fetchPage = vi.fn(({ page }) => Promise.resolve(pages[page]))

    const result = await fetchAll(fetchPage)

    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])

    expect(fetchPage).toHaveBeenCalledTimes(3)
  })

  it('передаёт правильные номера страниц и размер страницы', async () => {
    const fetchPage = vi.fn(({ page }) =>
      Promise.resolve({
        items: [`item-${page}`],
        totalPages: 3,
      })
    )

    await fetchAll(fetchPage)

    expect(fetchPage).toHaveBeenNthCalledWith(1, {
      page: 0,
      size: 100,
    })

    expect(fetchPage).toHaveBeenNthCalledWith(2, {
      page: 1,
      size: 100,
    })

    expect(fetchPage).toHaveBeenNthCalledWith(3, {
      page: 2,
      size: 100,
    })
  })

  it('передаёт дополнительные параметры запроса', async () => {
    const fetchPage = vi.fn().mockResolvedValue({
      items: [],
      totalPages: 1,
    })

    await fetchAll(fetchPage, {
      category: 'Electronics',
      active: false,
    })

    expect(fetchPage).toHaveBeenCalledWith({
      category: 'Electronics',
      active: false,
      page: 0,
      size: 100,
    })
  })

  it('переопределяет page и size из дополнительных параметров', async () => {
    const fetchPage = vi.fn().mockResolvedValue({
      items: [],
      totalPages: 1,
    })

    await fetchAll(fetchPage, {
      page: 10,
      size: 20,
    })

    expect(fetchPage).toHaveBeenCalledWith({
      page: 0,
      size: 100,
    })
  })

  it('возвращает пустой массив, если страницы не содержат элементов', async () => {
    const fetchPage = vi.fn().mockResolvedValue({
      items: [],
      totalPages: 1,
    })

    const result = await fetchAll(fetchPage)

    expect(result).toEqual([])
  })

  it('не изменяет исходные параметры запроса', async () => {
    const params = {
      category: 'Electronics',
      page: 5,
      size: 20,
    }

    const original = { ...params }

    const fetchPage = vi.fn().mockResolvedValue({
      items: [],
      totalPages: 1,
    })

    await fetchAll(fetchPage, params)

    expect(params).toEqual(original)
  })

  it('пробрасывает ошибку API вызывающему коду', async () => {
    const error = new Error('Ошибка загрузки данных')

    const fetchPage = vi.fn().mockRejectedValue(error)

    await expect(fetchAll(fetchPage)).rejects.toBe(error)
  })
})
