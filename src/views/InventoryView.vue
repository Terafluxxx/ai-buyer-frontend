<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getInventoryList, setProductInventory } from '../api/inventory'
import { getProducts } from '../api/products'
import { fetchAll } from '../utils/fetchAll'
import { errorMessage } from '../utils/errors'
import { formatDateTime } from '../utils/format'
import AppPagination from '../components/AppPagination.vue'

const result = ref({ items: [], page: 0, totalPages: 0, totalElements: 0 })
// Справочник товаров по id, чтобы показать название вместо номера
const products = ref({})
// Значения в полях ввода: productId → количество
const edits = reactive({})
const error = ref('')
const message = ref('')
const loading = ref(false)

async function loadProducts() {
  const list = await fetchAll(getProducts)
  products.value = Object.fromEntries(list.map((p) => [p.id, p]))
}

async function load(page = 0) {
  loading.value = true
  error.value = ''
  try {
    result.value = await getInventoryList({ page, size: 20 })
    for (const row of result.value.items) {
      edits[row.productId] = row.quantity
    }
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}

async function onSave(row) {
  error.value = ''
  message.value = ''
  try {
    const updated = await setProductInventory(row.productId, {
      quantity: edits[row.productId],
      version: row.version,
    })
    // Подменяем строку в таблице свежими данными с сервера
    Object.assign(row, updated)
    message.value = `Остаток «${products.value[row.productId]?.name}» сохранён`
  } catch (e) {
    error.value = errorMessage(e)
  }
}

onMounted(async () => {
  try {
    await loadProducts()
  } catch (e) {
    error.value = errorMessage(e)
  }
  await load()
})
</script>

<template>
  <div class="page-header">
    <div>
      <h1>Остатки</h1>
      <p class="muted">Текущее количество товаров на складе</p>
    </div>
  </div>

  <section class="card">
    <p v-if="error" class="alert alert-error">{{ error }}</p>
    <p v-if="message" class="alert alert-success">{{ message }}</p>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Товар</th>
            <th>SKU</th>
            <th class="num">Остаток</th>
            <th>Обновлено</th>
            <th>Изменить</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in result.items" :key="row.productId">
            <td>
              <RouterLink :to="`/products/${row.productId}`">
                {{ products[row.productId]?.name || `Товар #${row.productId}` }}
              </RouterLink>
            </td>
            <td class="muted">{{ products[row.productId]?.sku }}</td>
            <td class="num"><strong>{{ row.quantity }}</strong></td>
            <td class="muted">{{ formatDateTime(row.updatedAt) }}</td>
            <td>
              <form class="inline-form" @submit.prevent="onSave(row)">
                <input v-model.number="edits[row.productId]" type="number" min="0" step="1" required />
                <button class="btn btn-small" :disabled="edits[row.productId] === row.quantity">Сохранить</button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && result.items.length === 0" class="empty">
        Остатков пока нет — сначала добавьте товары
      </div>
    </div>

    <AppPagination
      :page="result.page"
      :total-pages="result.totalPages"
      :total-elements="result.totalElements"
      @change="load"
    />
  </section>
</template>

<style scoped>
.inline-form {
  display: flex;
  gap: 6px;
}

.inline-form input {
  width: 90px;
  padding: 4px 8px;
}
</style>
