<script setup>
import { computed, onMounted } from 'vue'
import { useAnalysis } from '../composables/useAnalysis'
import { formatNumber } from '../utils/format'
import StatusBadge from '../components/StatusBadge.vue'

const { rows, counts, recommendations, loading, error, load } = useAnalysis()

// На дашборде показываем только первые 10 рекомендаций
const topRecommendations = computed(() => recommendations.value.slice(0, 10))

onMounted(load)
</script>

<template>
  <div class="page-header">
    <div>
      <h1>Дашборд</h1>
      <p class="muted">Состояние склада и потребность в закупках</p>
    </div>
    <button class="btn" :disabled="loading" @click="load">Обновить</button>
  </div>

  <p v-if="error" class="alert alert-error">{{ error }}</p>

  <div class="stats">
    <div class="stat">
      <div class="stat-label">Всего товаров</div>
      <div class="stat-value">{{ rows.length }}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Критических</div>
      <div class="stat-value critical">{{ counts.CRITICAL }}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Нужна закупка</div>
      <div class="stat-value warning">{{ counts.NEED_PURCHASE }}</div>
    </div>
    <div class="stat">
      <div class="stat-label">В норме</div>
      <div class="stat-value">{{ counts.NORMAL }}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Без продаж</div>
      <div class="stat-value">{{ counts.NO_SALES }}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Рекомендуемый бюджет</div>
      <div class="stat-value muted">—</div>
      <div class="muted small">нужны цены поставщиков</div>
    </div>
  </div>

  <section class="card">
    <div class="section-header">
      <h2>Требуют закупки</h2>
      <RouterLink to="/recommendations">Все рекомендации →</RouterLink>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Товар</th>
            <th>Состояние</th>
            <th class="num">Остаток</th>
            <th class="num">Хватит на, дн.</th>
            <th class="num">Купить, шт.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in topRecommendations" :key="row.product.id">
            <td>
              <RouterLink :to="`/products/${row.product.id}`">{{ row.product.name }}</RouterLink>
            </td>
            <td><StatusBadge :status="row.status" /></td>
            <td class="num">{{ row.stock }}</td>
            <td class="num">{{ formatNumber(row.stockDays) }}</td>
            <td class="num"><strong>{{ row.recommendedQuantity }}</strong></td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && topRecommendations.length === 0" class="empty">
        Все товары в норме — закупать ничего не нужно
      </div>
      <div v-if="loading" class="empty">Считаем…</div>
    </div>
  </section>
</template>

<style scoped>
.critical {
  color: var(--danger);
}

.warning {
  color: var(--warning);
}

.small {
  font-size: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
</style>
