// Понятные пользователю тексты для кодов ошибок backend
const MESSAGES = {
  BAD_REQUEST: 'Некорректный запрос',
  VALIDATION_ERROR: 'Проверьте правильность заполнения полей',
  UNAUTHORIZED: 'Нужно войти в систему',
  TOKEN_REVOKED: 'Сессия завершена, войдите снова',
  INVALID_CREDENTIALS: 'Неверный email или пароль',
  EMAIL_ALREADY_EXISTS: 'Пользователь с таким email уже зарегистрирован',
  TOO_MANY_REQUESTS: 'Слишком много попыток, подождите минуту',
  RESOURCE_NOT_FOUND: 'Запись не найдена',
  SKU_ALREADY_EXISTS: 'Товар с таким SKU уже существует',
  VERSION_CONFLICT: 'Данные уже кто-то изменил. Обновите страницу',
  RESOURCE_IN_USE: 'Нельзя удалить: у товара есть остаток или продажи',
  NUMERIC_OVERFLOW: 'Слишком большое значение',
  FORBIDDEN: 'Недостаточно прав',
  INTERNAL_ERROR: 'Внутренняя ошибка сервера',
}

// Превращает ошибку axios в строку для показа пользователю
export function errorMessage(error) {
  if (!error?.response) {
    return 'Сервер недоступен. Проверьте, что backend запущен'
  }
  const code = error.response.data?.code
  return MESSAGES[code] || error.response.data?.message || 'Что-то пошло не так'
}
