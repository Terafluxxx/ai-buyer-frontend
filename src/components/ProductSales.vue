<script setup>
import { onMounted, ref } from 'vue'
import { getSales, getSalesSummary } from '../api/sales'
import { errorMessage } from '../utils/errors'
import { daysAgo, today } from '../utils/dates'
import AppPagination from './AppPagination.vue'
import SaleForm from './SaleForm.vue'
import SalesTable from './SalesTable.vue'

// Блок «Продажи за последние 30 дней» в карточке товара
const props = defineProps({
  productId: { type: String, required: true },
})

const period = { dateFrom: daysAgo(30), dateTo: today() }
const summary = ref(null)
const result = ref({ items: [], page: 0, totalPages: 0, totalElements: 0 })
const error = ref('')

async function load(page = 0) {
  error.value = ''
  try {
    const params = { ...period, productId: props.productId }
    summary.value = await getSalesSummary(params)
    result.value = await getSales({ ...params, page, size: 10 })
  } catch (e) {
    error.value = errorMessage(e)
  }
}

onMounted(load)
</script>

<template>
  <section class="card">
    <h2>Продажи за последние 30 дней</h2>
    <p v-if="error" class="alert alert-error">{{ error }}</p>

    <p v-if="summary" class="total">
      Всего продано: <strong>{{ summary.totalQuantity }} шт.</strong>
    </p>

    <SalesTable :items="result.items" />
    <AppPagination
      :page="result.page"
      :total-pages="result.totalPages"
      :total-elements="result.totalElements"
      @change="load"
    />

    <h2 class="form-title">Записать продажи за день</h2>
    <SaleForm :product-id="productId" @saved="load()" />
  </section>
</template>

<style scoped>
.total {
  margin-top: 0;
}

.form-title {
  margin-top: 24px;
}
</style>
