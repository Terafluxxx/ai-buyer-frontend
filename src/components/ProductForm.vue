<script setup>
import { reactive, watch } from 'vue'

// Форма товара, используется и для создания, и для редактирования
const props = defineProps({
  initial: { type: Object, default: () => ({ sku: '', name: '', category: '' }) },
  submitLabel: { type: String, default: 'Сохранить' },
  loading: Boolean,
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({ sku: '', name: '', category: '' })

// Заполняем форму начальными значениями (и при их изменении тоже)
watch(
  () => props.initial,
  (value) => {
    form.sku = value.sku || ''
    form.name = value.name || ''
    form.category = value.category || ''
  },
  { immediate: true },
)

function onSubmit() {
  emit('submit', {
    sku: form.sku.trim(),
    name: form.name.trim(),
    // пустая категория = категории нет
    category: form.category.trim() || null,
  })
}
</script>

<template>
  <form class="row" @submit.prevent="onSubmit">
    <div class="field">
      <label for="sku">SKU</label>
      <input id="sku" v-model="form.sku" required maxlength="100" placeholder="ART-001" />
    </div>
    <div class="field grow">
      <label for="name">Название</label>
      <input id="name" v-model="form.name" required maxlength="255" placeholder="Название товара" />
    </div>
    <div class="field">
      <label for="category">Категория</label>
      <input id="category" v-model="form.category" maxlength="255" placeholder="Необязательно" />
    </div>
    <button class="btn btn-primary" :disabled="loading">{{ submitLabel }}</button>
    <button type="button" class="btn" @click="emit('cancel')">Отмена</button>
  </form>
</template>

<style scoped>
.grow {
  flex: 1;
  min-width: 200px;
}
</style>
