<script setup>
import { STATUSES } from '../utils/recommendation'

// Цветная метка состояния товара
defineProps({
  status: { type: String, required: true },
})
</script>

<template>
  <span class="badge" :class="status.toLowerCase()">{{ STATUSES[status] }}</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.critical {
  background: var(--danger-soft);
  color: var(--danger);
}

.need_purchase {
  background: var(--warning-soft);
  color: var(--warning);
}

.normal {
  background: var(--success-soft);
  color: var(--success);
}

.no_sales {
  background: #f3f4f6;
  color: var(--muted);
}
</style>
