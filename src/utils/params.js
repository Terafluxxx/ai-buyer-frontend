// Убирает пустые параметры запроса.
// Backend отвечает ошибкой 400 на параметры вида ?q= (пустое значение).
export function withoutEmpty(params) {
  const result = {}
  for (const [key, value] of Object.entries(params)) {
    if (value !== '' && value !== null && value !== undefined) {
      result[key] = value
    }
  }
  return result
}
