<script setup>
import { formatDate, formatDateTime } from '../utils/format'

// Таблица продаж. products — справочник товаров по id (необязателен)
defineProps({
  items: { type: Array, required: true },
  products: { type: Object, default: null },
})
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Дата</th>
          <th v-if="products">Товар</th>
          <th class="num">Продано, шт.</th>
          <th>Запись создана</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in items" :key="sale.id">
          <td>{{ formatDate(sale.saleDate) }}</td>
          <td v-if="products">
            <RouterLink :to="`/products/${sale.productId}`">
              {{ products[sale.productId]?.name || `Товар #${sale.productId}` }}
            </RouterLink>
          </td>
          <td class="num">{{ sale.quantity }}</td>
          <td class="muted">{{ formatDateTime(sale.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="items.length === 0" class="empty">Продаж за период нет</div>
  </div>
</template>
