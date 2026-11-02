# 3. Структура проекта

```text
ai-buyer-frontend/
├── index.html              единственная HTML-страница, в неё монтируется Vue
├── package.json            зависимости и npm-скрипты
├── vite.config.js          настройки Vite: порт, proxy на backend
├── public/favicon.svg      иконка вкладки
├── scripts/seed-demo.js    заполнение backend демо-данными
├── docs/                   эта документация
└── src/
    ├── main.js             точка входа
    ├── App.vue             корневой компонент, общий макет
    ├── assets/main.css     общие стили
    ├── router/             маршруты
    ├── stores/             состояние авторизации
    ├── api/                запросы к backend
    ├── utils/              вспомогательные функции
    ├── composables/        общая логика страниц
    ├── components/         переиспользуемые компоненты
    └── views/              страницы
```

## Как приложение запускается

1. Браузер открывает `index.html`. В нём есть `<div id="app">` и подключение `src/main.js`.
2. `main.js` создаёт Vue-приложение из `App.vue`, подключает роутер и стили, монтирует всё в `#app`.
3. `App.vue` смотрит на текущий маршрут: для входа и регистрации показывает только страницу,
   для остальных — боковое меню и страницу справа.
4. Роутер выбирает нужную страницу из `views/`, страница при появлении (`onMounted`)
   запрашивает данные через функции из `api/`.

## Слои и правило зависимостей

```text
views/  →  components/  →  api/  →  http.js  →  backend
   ↘           ↘          ↗
      composables/  utils/  stores/
```

- **views** — страницы. Собирают экран из компонентов, загружают данные.
- **components** — кирпичики интерфейса. Не знают, на какой странице находятся.
- **api** — только запросы к серверу, никакой разметки.
- **utils** — чистые функции без Vue: форматирование, даты, формула.

## `src/api/` — запросы к backend

| Файл | Функции | Эндпоинты |
| --- | --- | --- |
| `http.js` | общий экземпляр axios, перехватчики | — |
| `auth.js` | `register`, `login`, `logout`, `getMe`, `getCurrentCompany` | `/auth/*`, `/companies/current` |
| `products.js` | `getProducts`, `getProduct`, `createProduct`, `updateProduct`, `deleteProduct` | `/products`, `/products/{id}` |
| `inventory.js` | `getInventoryList`, `getProductInventory`, `setProductInventory` | `/inventory`, `/products/{id}/inventory` |
| `sales.js` | `getSales`, `getSalesSummary`, `findSale`, `saveSale` | `/sales`, `/sales/summary`, `/products/{id}/sales/{date}` |

## `src/stores/auth.js` — состояние авторизации

Хранит токен, время его истечения, пользователя и организацию. Сохраняет всё в `localStorage`,
чтобы после перезагрузки страницы не входить заново. Подробнее — в [04-auth.md](04-auth.md).

## `src/utils/` — вспомогательные функции

| Файл | Что делает |
| --- | --- |
| `errors.js` | Превращает ошибку от backend (`SKU_ALREADY_EXISTS` и т.п.) в понятный русский текст |
| `format.js` | Форматирует даты (`02.11.2026`) и числа (`1 234,5`) |
| `dates.js` | Сегодняшняя дата и «N дней назад» в формате `YYYY-MM-DD` по UTC |
| `params.js` | Убирает пустые параметры запроса — backend отвечает 400 на `?q=` |
| `fetchAll.js` | Загружает все страницы списка подряд (нужно для аналитики и справочников) |
| `recommendation.js` | Формула рекомендаций, перенесённая из backend. См. [06-recommendations.md](06-recommendations.md) |

## `src/composables/useAnalysis.js`

Загружает параллельно все товары, остатки и продажи за 30 дней, считает для каждого товара
рекомендацию и сортирует от самых срочных. Возвращает `rows`, `counts` (сколько товаров
в каждом состоянии), `recommendations` (кому нужна закупка), `loading`, `error`, `load`.

## `src/components/` — компоненты

| Компонент | Что это | Где используется |
| --- | --- | --- |
| `AppSidebar.vue` | Боковое меню, имя пользователя, кнопка «Выйти» | `App.vue` |
| `AuthCard.vue` | Рамка для страниц входа и регистрации (через слот) | Login, Register |
| `AppPagination.vue` | Кнопки «Назад / Вперёд» и счётчик записей | Товары, Остатки, Продажи |
| `ProductForm.vue` | Форма SKU / название / категория | создание и редактирование товара |
| `ProductInventory.vue` | Блок остатка в карточке товара | ProductDetail |
| `ProductSales.vue` | Блок продаж за 30 дней в карточке товара | ProductDetail |
| `SaleForm.vue` | Форма «продажи за день» | ProductSales, SalesView |
| `SalesTable.vue` | Таблица продаж | ProductSales, SalesView |
| `StatusBadge.vue` | Цветная метка состояния товара | Дашборд, Рекомендации |

## `src/views/` — страницы

| Страница | Адрес |
| --- | --- |
| `LoginView.vue` | `/login` |
| `RegisterView.vue` | `/register` |
| `DashboardView.vue` | `/dashboard` (главная) |
| `RecommendationsView.vue` | `/recommendations` |
| `ProductsView.vue` | `/products` |
| `ProductDetailView.vue` | `/products/:id` |
| `InventoryView.vue` | `/inventory` |
| `SalesView.vue` | `/sales` |
| `ProfileView.vue` | `/profile` |

Подробно о каждой — в [05-pages.md](05-pages.md).

## Стили

- `src/assets/main.css` — общие стили: цвета в CSS-переменных (`--primary`, `--danger`…),
  кнопки (`.btn`, `.btn-primary`), карточки (`.card`), таблицы, поля, сетка статистики.
- `<style scoped>` внутри компонентов — стили, нужные только этому компоненту.
- Адаптивность: при ширине экрана меньше 760px меню переезжает наверх (`@media`).
