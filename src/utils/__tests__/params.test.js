import { describe, expect, it } from 'vitest'
import { withoutEmpty } from '../params.js'

describe('withoutEmpty', () => {
  it('удаляет пустые строки', () => {
    const params = {
      name: '',
      category: 'Electronics',
      search: '',
    }

    const result = withoutEmpty(params)

    expect(result).toEqual({
      category: 'Electronics',
    })
  })

  it('удаляет null и undefined', () => {
    const params = {
      name: null,
      category: undefined,
      status: 'ACTIVE',
    }

    const result = withoutEmpty(params)

    expect(result).toEqual({
      status: 'ACTIVE',
    })
  })

  it('сохраняет числовой ноль и false', () => {
    const params = {
      page: 0,
      size: 0,
      active: false,
    }

    const result = withoutEmpty(params)

    expect(result).toEqual({
      page: 0,
      size: 0,
      active: false,
    })
  })

  it('сохраняет обычные строки и другие корректные значения', () => {
    const params = {
      query: 'Laptop',
      minPrice: 100,
      maxPrice: 500,
      sort: 'price',
      enabled: true,
    }

    const result = withoutEmpty(params)

    expect(result).toEqual(params)
  })

  it('сохраняет строку, состоящую из пробелов', () => {
    const params = {
      query: '   ',
    }

    const result = withoutEmpty(params)

    expect(result).toEqual({
      query: '   ',
    })
  })

  it('сохраняет пустые массивы и объекты', () => {
    const params = {
      filters: [],
      options: {},
    }

    const result = withoutEmpty(params)

    expect(result).toEqual({
      filters: [],
      options: {},
    })
  })

  it('возвращает пустой объект, если все параметры пустые', () => {
    const params = {
      name: '',
      category: null,
      status: undefined,
    }

    const result = withoutEmpty(params)

    expect(result).toEqual({})
  })

  it('не изменяет исходный объект', () => {
    const params = {
      name: 'Laptop',
      category: '',
      page: 0,
    }

    const original = { ...params }

    withoutEmpty(params)

    expect(params).toEqual(original)
  })

  it('возвращает новый объект, а не исходную ссылку', () => {
    const params = {
      name: 'Laptop',
    }

    const result = withoutEmpty(params)

    expect(result).not.toBe(params)
    expect(result).toEqual(params)
  })
})
