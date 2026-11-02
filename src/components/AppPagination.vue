<script setup>
// page — номер текущей страницы, начиная с 0 (так считает backend)
const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  totalElements: { type: Number, default: 0 },
})

const emit = defineEmits(['change'])

function goTo(page) {
  if (page >= 0 && page < props.totalPages) {
    emit('change', page)
  }
}
</script>

<template>
  <div v-if="totalPages > 1 || totalElements > 0" class="pagination">
    <span class="muted">Всего: {{ totalElements }}</span>
    <div v-if="totalPages > 1" class="buttons">
      <button class="btn btn-small" :disabled="page === 0" @click="goTo(page - 1)">← Назад</button>
      <span>{{ page + 1 }} / {{ totalPages }}</span>
      <button class="btn btn-small" :disabled="page >= totalPages - 1" @click="goTo(page + 1)">Вперёд →</button>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
}

.buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
