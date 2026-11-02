<script setup>
import { ref } from 'vue'
import { findSale, saveSale } from '../api/sales'
import { errorMessage } from '../utils/errors'
import { today } from '../utils/dates'

// Форма «Продажи за день».
// Если передан productId — товар фиксирован, иначе выбирается из списка products.
const props = defineProps({
  productId: { type: String, default: '' },
  products: { type: Array, default: () => [] },
})

const emit = defineEmits(['saved'])

const selectedProduct = ref(props.productId)
const date = ref(today())
const quantity = ref(1)
const error = ref('')
const message = ref('')
const saving = ref(false)

async function onSubmit() {
  error.value = ''
  message.value = ''
  saving.value = true
  try {
    // Узнаём, есть ли уже запись за этот день, чтобы передать её версию
    const existing = await findSale(selectedProduct.value, date.value)
    await saveSale(selectedProduct.value, date.value, {
      quantity: quantity.value,
      version: existing ? existing.version : 0,
    })
    message.value = existing ? 'Продажи за день обновлены' : 'Продажи за день добавлены'
    emit('saved')
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <p v-if="error" class="alert alert-error">{{ error }}</p>
    <p v-if="message" class="alert alert-success">{{ message }}</p>

    <form class="row" @submit.prevent="onSubmit">
      <div v-if="!productId" class="field grow">
        <label for="sale-product">Товар</label>
        <select id="sale-product" v-model="selectedProduct" required>
          <option value="" disabled>Выберите товар</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }} ({{ product.sku }})
          </option>
        </select>
      </div>
      <div class="field">
        <label for="sale-date">Дата</label>
        <input id="sale-date" v-model="date" type="date" :max="today()" required />
      </div>
      <div class="field">
        <label for="sale-quantity">Продано, шт.</label>
        <input id="sale-quantity" v-model.number="quantity" type="number" min="0" step="1" required />
      </div>
      <button class="btn btn-primary" :disabled="saving">Сохранить</button>
    </form>
    <p class="muted hint">
      Продажи хранятся по дням: если за выбранный день уже есть запись, количество будет заменено.
      Остаток на складе при этом не меняется.
    </p>
  </div>
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
</style>
