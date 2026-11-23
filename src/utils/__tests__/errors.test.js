import { describe, expect, it } from 'vitest'
import { errorMessage } from '../errors.js'

describe('errorMessage', () => {
  it.each([
    ['BAD_REQUEST', 'Некорректный запрос'],
    ['VALIDATION_ERROR', 'Проверьте правильность заполнения полей'],
    ['UNAUTHORIZED', 'Нужно войти в систему'],
    ['TOKEN_REVOKED', 'Сессия завершена, войдите снова'],
    ['INVALID_CREDENTIALS', 'Неверный email или пароль'],
    ['EMAIL_ALREADY_EXISTS', 'Пользователь с таким email уже зарегистрирован'],
    ['TOO_MANY_REQUESTS', 'Слишком много попыток, подождите минуту'],
    ['RESOURCE_NOT_FOUND', 'Запись не найдена'],
    ['SKU_ALREADY_EXISTS', 'Товар с таким SKU уже существует'],
    ['VERSION_CONFLICT', 'Данные уже кто-то изменил. Обновите страницу'],
    ['RESOURCE_IN_USE', 'Нельзя удалить: у товара есть остаток или продажи'],
    ['NUMERIC_OVERFLOW', 'Слишком большое значение'],
    ['FORBIDDEN', 'Недостаточно прав'],
    ['INTERNAL_ERROR', 'Внутренняя ошибка сервера'],
  ])('возвращает правильное сообщение для ошибки %s', (code, expectedMessage) => {
    const error = {
      response: {
        data: { code },
      },
    }

    expect(errorMessage(error)).toBe(expectedMessage)
  })

  it('возвращает сообщение о недоступности сервера, если response отсутствует', () => {
    const error = new Error('Network Error')

    expect(errorMessage(error)).toBe('Сервер недоступен. Проверьте, что backend запущен')
  })

  it('возвращает сообщение backend, если код ошибки неизвестен', () => {
    const error = {
      response: {
        data: {
          code: 'UNKNOWN_ERROR',
          message: 'Неизвестная ошибка сервера',
        },
      },
    }

    expect(errorMessage(error)).toBe('Неизвестная ошибка сервера')
  })

  it('использует стандартное сообщение, если код и сообщение backend неизвестны', () => {
    const error = {
      response: {
        data: {
          code: 'UNKNOWN_ERROR',
        },
      },
    }

    expect(errorMessage(error)).toBe('Что-то пошло не так')
  })

  it('использует стандартное сообщение, если данные ответа отсутствуют', () => {
    const error = {
      response: {},
    }

    expect(errorMessage(error)).toBe('Что-то пошло не так')
  })

  it('отдаёт приоритет известному коду ошибки перед сообщением backend', () => {
    const error = {
      response: {
        data: {
          code: 'UNAUTHORIZED',
          message: 'Другое сообщение',
        },
      },
    }

    expect(errorMessage(error)).toBe('Нужно войти в систему')
  })
})
