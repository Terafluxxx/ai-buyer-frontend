<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createProduct, getProducts } from '../api/products'
import { errorMessage } from '../utils/errors'
import { formatDateTime } from '../utils/format'
import AppPagination from '../components/AppPagination.vue'
import ProductForm from '../components/ProductForm.vue'

const router = useRouter()

// Варианты сортировки, которые поддерживает backend
const sortOptions = [
  { value: 'name,asc', label: 'Название А→Я' },
  { value: 'name,desc', label: 'Название Я→А' },
  { value: 'sku,asc', label: 'SKU' },
  { value: 'createdAt,desc', label: 'Сначала новые' },
]

const filters = reactive({ q: '', category: '', sort: 'name,asc' })
const result = ref({ items: [], page: 0, totalPages: 0, totalElements: 0 })
const loading = ref(false)
const error = ref('')

const showForm = ref(false)
const saving = ref(false)
const formError = ref('')

async function load(page = 0) {
  loading.value = true
  error.value = ''
  try {
    result.value = await getProducts({ ...filters, q: filters.q.trim(), category: filters.category.trim(), page, size: 20 })
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  filters.q = ''
  filters.category = ''
  filters.sort = 'name,asc'
  load()
}

async function onCreate(product) {
  saving.value = true
  formError.value = ''
  try {
    const created = await createProduct(product)
    // После создания сразу открываем карточку нового товара
    router.push(`/products/${created.id}`)
  } catch (e) {
    formError.value = errorMessage(e)
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="page-header">
    <div>
      <h1>Товары</h1>
      <p class="muted">Каталог товаров организации</p>
    </div>
    <button v-if="!showForm" class="btn btn-primary" @click="showForm = true">+ Добавить товар</button>
  </div>

  <section v-if="showForm" class="card">
    <h2>Новый товар</h2>
    <p v-if="formError" class="alert alert-error">{{ formError }}</p>
    <ProductForm submit-label="Создать" :loading="saving" @submit="onCreate" @cancel="showForm = false" />
  </section>

  <section class="card">
    <form class="row filters" @submit.prevent="load()">
      <div class="field grow">
        <label for="q">Поиск</label>
        <input id="q" v-model="filters.q" placeholder="SKU или название" />
      </div>
      <div class="field">
        <label for="category">Категория</label>
        <input id="category" v-model="filters.category" placeholder="Точное название" />
      </div>
      <div class="field">
        <label for="sort">Сортировка</label>
        <select id="sort" v-model="filters.sort" @change="load()">
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <button class="btn btn-primary">Найти</button>
      <button type="button" class="btn" @click="resetFilters">Сбросить</button>
    </form>

    <p v-if="error" class="alert alert-error">{{ error }}</p>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Название</th>
            <th>Категория</th>
            <th>Создан</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in result.items" :key="product.id" class="clickable" @click="router.push(`/products/${product.id}`)">
            <td>{{ product.sku }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.category || '—' }}</td>
            <td class="muted">{{ formatDateTime(product.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && result.items.length === 0" class="empty">Товаров не найдено</div>
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
.filters {
  margin-bottom: 16px;
}

.grow {
  flex: 1;
  min-width: 200px;
}

.clickable {
  cursor: pointer;
}
</style>
