<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAnalysis } from '../composables/useAnalysis'
import { STATUSES, DEFAULT_LEAD_DAYS } from '../utils/recommendation'
import { formatDate, formatNumber } from '../utils/format'
import StatusBadge from '../components/StatusBadge.vue'

const { period, rows, recommendations, loading, error, load } = useAnalysis()

// Фильтр: только товары к закупке или конкретное состояние
const filter = ref('PURCHASE')
// id товара, у которого раскрыто объяснение
const expanded = ref(null)

const visibleRows = computed(() => {
  if (filter.value === 'PURCHASE') return recommendations.value
  if (filter.value === 'ALL') return rows.value
  return rows.value.filter((row) => row.status === filter.value)
})

function toggle(id) {
  expanded.value = expanded.value === id ? null : id
}

onMounted(load)
</script>

<template>
  <div class="page-header">
    <div>
      <h1>Рекомендации</h1>
      <p class="muted">
        Анализ по продажам за {{ formatDate(period.dateFrom) }} — {{ formatDate(period.dateTo) }}
      </p>
    </div>
    <div class="row">
      <select v-model="filter">
        <option value="PURCHASE">Нужна закупка</option>
        <option value="ALL">Все товары</option>
        <option v-for="(label, status) in STATUSES" :key="status" :value="status">{{ label }}</option>
      </select>
      <button class="btn" :disabled="loading" @click="load">Обновить</button>
    </div>
  </div>

  <p class="alert alert-info">
    Поставщики пока не подключены, поэтому используется срок поставки по умолчанию —
    {{ DEFAULT_LEAD_DAYS }} дней, а стоимость закупки не рассчитывается.
  </p>
  <p v-if="error" class="alert alert-error">{{ error }}</p>

  <section class="card">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Товар</th>
            <th>Состояние</th>
            <th class="num">Остаток</th>
            <th class="num">Продаж в день</th>
            <th class="num">Хватит на, дн.</th>
            <th class="num">Точка заказа</th>
            <th class="num">Целевой запас</th>
            <th class="num">Купить, шт.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="row in visibleRows" :key="row.product.id">
            <tr>
              <td>
                <RouterLink :to="`/products/${row.product.id}`">{{ row.product.name }}</RouterLink>
                <div class="muted small">{{ row.product.sku }}</div>
              </td>
              <td><StatusBadge :status="row.status" /></td>
              <td class="num">{{ row.stock }}</td>
              <td class="num">{{ formatNumber(row.averageDailySales) }}</td>
              <td class="num">{{ formatNumber(row.stockDays) }}</td>
              <td class="num">{{ formatNumber(row.reorderPoint) }}</td>
              <td class="num">{{ formatNumber(row.targetStock) }}</td>
              <td class="num"><strong>{{ row.recommendedQuantity }}</strong></td>
              <td>
                <button class="btn btn-small" @click="toggle(row.product.id)">
                  {{ expanded === row.product.id ? 'Скрыть' : 'Почему?' }}
                </button>
              </td>
            </tr>
            <!-- Объяснение рекомендации (FR-13) -->
            <tr v-if="expanded === row.product.id" class="reason-row">
              <td colspan="9">{{ row.reason }}</td>
            </tr>
          </template>
        </tbody>
      </table>
      <div v-if="!loading && visibleRows.length === 0" class="empty">Нет товаров в этой категории</div>
      <div v-if="loading" class="empty">Считаем…</div>
    </div>
  </section>
</template>

<style scoped>
.small {
  font-size: 12px;
}

.reason-row td {
  background: var(--primary-soft);
  color: var(--text);
}
</style>
