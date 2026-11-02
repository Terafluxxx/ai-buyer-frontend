<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getSales, getSalesSummary } from '../api/sales'
import { getProducts } from '../api/products'
import { fetchAll } from '../utils/fetchAll'
import { errorMessage } from '../utils/errors'
import { daysAgo, today } from '../utils/dates'
import { formatDate } from '../utils/format'
import AppPagination from '../components/AppPagination.vue'
import SaleForm from '../components/SaleForm.vue'
import SalesTable from '../components/SalesTable.vue'

// По умолчанию показываем последние 30 дней — основной расчётный период MVP
const filters = reactive({ dateFrom: daysAgo(30), dateTo: today(), productId: '' })

const productList = ref([])
const products = ref({})
const summary = ref(null)
const result = ref({ items: [], page: 0, totalPages: 0, totalElements: 0 })
const error = ref('')
const showForm = ref(false)

async function loadProducts() {
  productList.value = await fetchAll(getProducts)
  products.value = Object.fromEntries(productList.value.map((p) => [p.id, p]))
}

async function load(page = 0) {
  error.value = ''
  if (filters.dateFrom > filters.dateTo) {
    error.value = 'Дата начала периода позже даты окончания'
    return
  }
  try {
    summary.value = await getSalesSummary(filters)
    result.value = await getSales({ ...filters, page, size: 20 })
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
      <h1>Продажи</h1>
      <p class="muted">Продажи товаров по дням за выбранный период</p>
    </div>
    <button v-if="!showForm" class="btn btn-primary" @click="showForm = true">+ Записать продажи</button>
  </div>

  <section v-if="showForm" class="card">
    <div class="form-header">
      <h2>Продажи за день</h2>
      <button class="btn btn-small" @click="showForm = false">Скрыть</button>
    </div>
    <SaleForm :products="productList" @saved="load()" />
  </section>

  <section class="card">
    <form class="row" @submit.prevent="load()">
      <div class="field">
        <label for="from">С</label>
        <input id="from" v-model="filters.dateFrom" type="date" :max="today()" required />
      </div>
      <div class="field">
        <label for="to">По</label>
        <input id="to" v-model="filters.dateTo" type="date" :max="today()" required />
      </div>
      <div class="field grow">
        <label for="product">Товар</label>
        <select id="product" v-model="filters.productId">
          <option value="">Все товары</option>
          <option v-for="product in productList" :key="product.id" :value="product.id">
            {{ product.name }} ({{ product.sku }})
          </option>
        </select>
      </div>
      <button class="btn btn-primary">Показать</button>
    </form>
    <p class="muted hint">Период — не больше 365 дней.</p>
  </section>

  <p v-if="error" class="alert alert-error">{{ error }}</p>

  <div v-if="summary" class="stats">
    <div class="stat">
      <div class="stat-label">Продано за период, шт.</div>
      <div class="stat-value">{{ summary.totalQuantity }}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Товаров с продажами</div>
      <div class="stat-value">{{ summary.productCount }}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Период</div>
      <div class="period">{{ formatDate(summary.dateFrom) }} — {{ formatDate(summary.dateTo) }}</div>
    </div>
  </div>

  <section class="card">
    <SalesTable :items="result.items" :products="products" />
    <AppPagination
      :page="result.page"
      :total-pages="result.totalPages"
      :total-elements="result.totalElements"
      @change="load"
    />
  </section>
</template>

<style scoped>
.grow {
  flex: 1;
  min-width: 220px;
}

.hint {
  font-size: 13px;
  margin: 10px 0 0;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.period {
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
}
</style>
