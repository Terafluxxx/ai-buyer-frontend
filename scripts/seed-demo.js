// Заполняет backend демонстрационными данными: пользователь, товары, остатки и продажи.
// Запуск: npm run seed (backend должен быть запущен)

const API_URL = process.env.API_URL || 'http://127.0.0.1:8080'
const BASE = `${API_URL}/api/v1`

const DEMO_USER = {
  name: 'Демо Пользователь',
  email: 'demo@demo.ru',
  password: 'demo12345',
  companyName: 'Демо-магазин',
}

// stock — остаток на складе, perDay — продажи в день за последние 30 дней
const PRODUCTS = [
  { sku: 'COFFEE-1', name: 'Кофе молотый', category: 'Бакалея', stock: 2, perDay: 2 },
  { sku: 'MILK-1', name: 'Молоко 1л', category: 'Молочка', stock: 5, perDay: 3 },
  { sku: 'BREAD-1', name: 'Хлеб белый', category: 'Выпечка', stock: 30, perDay: 3 },
  { sku: 'CHEESE-1', name: 'Сыр 200г', category: 'Молочка', stock: 40, perDay: 1 },
  { sku: 'TEA-1', name: 'Чай чёрный', category: 'Бакалея', stock: 12, perDay: 0 },
]

let token = null

// Отправляет запрос к API и возвращает JSON-ответ
async function request(method, path, body) {
  const response = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : null
  if (!response.ok) {
    const error = new Error(`${method} ${path}: ${response.status} ${data?.code}`)
    error.code = data?.code
    throw error
  }
  return data
}

// Дата N дней назад в формате YYYY-MM-DD (UTC, как на backend)
function daysAgo(days) {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - days)
  return date.toISOString().slice(0, 10)
}

async function main() {
  try {
    const result = await request('POST', '/auth/register', DEMO_USER)
    token = result.accessToken
  } catch (error) {
    if (error.code === 'EMAIL_ALREADY_EXISTS') {
      console.log('Демо-пользователь уже существует, данные не трогаем.')
      return
    }
    throw error
  }

  for (const item of PRODUCTS) {
    const product = await request('POST', '/products', {
      sku: item.sku,
      name: item.name,
      category: item.category,
    })

    const inventory = await request('GET', `/products/${product.id}/inventory`)
    await request('PUT', `/products/${product.id}/inventory`, {
      quantity: item.stock,
      version: inventory.version,
    })

    // Продажи за 30 завершённых дней (вчера и раньше)
    if (item.perDay > 0) {
      for (let day = 1; day <= 30; day++) {
        await request('PUT', `/products/${product.id}/sales/${daysAgo(day)}`, {
          quantity: item.perDay,
          version: 0,
        })
      }
    }
    console.log(`Товар «${item.name}» создан`)
  }

  console.log(`\nГотово! Вход: ${DEMO_USER.email} / ${DEMO_USER.password}`)
}

main().catch((error) => {
  console.error('Ошибка:', error.message)
  console.error(`Проверьте, что backend запущен на ${API_URL}`)
  process.exit(1)
})
