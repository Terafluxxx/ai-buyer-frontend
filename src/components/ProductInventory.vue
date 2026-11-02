<script setup>
import { onMounted, ref } from 'vue'
import { getProductInventory, setProductInventory } from '../api/inventory'
import { errorMessage } from '../utils/errors'
import { formatDateTime } from '../utils/format'

// Блок «Остаток на складе» в карточке товара
const props = defineProps({
  productId: { type: String, required: true },
})

const inventory = ref(null)
const quantity = ref(0)
const error = ref('')
const message = ref('')
const saving = ref(false)

async function load() {
  try {
    inventory.value = await getProductInventory(props.productId)
    quantity.value = inventory.value.quantity
  } catch (e) {
    error.value = errorMessage(e)
  }
}

async function onSave() {
  error.value = ''
  message.value = ''
  saving.value = true
  try {
    inventory.value = await setProductInventory(props.productId, {
      quantity: quantity.value,
      version: inventory.value.version,
    })
    message.value = 'Остаток сохранён'
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="card">
    <h2>Остаток на складе</h2>
    <p v-if="error" class="alert alert-error">{{ error }}</p>
    <p v-if="message" class="alert alert-success">{{ message }}</p>

    <template v-if="inventory">
      <div class="current">
        <span class="stat-value">{{ inventory.quantity }}</span>
        <span class="muted">шт. · обновлено {{ formatDateTime(inventory.updatedAt) }}</span>
      </div>

      <form class="row" @submit.prevent="onSave">
        <div class="field">
          <label for="quantity">Новое количество</label>
          <input id="quantity" v-model.number="quantity" type="number" min="0" step="1" required />
        </div>
        <button class="btn btn-primary" :disabled="saving">Сохранить</button>
      </form>
    </template>
  </section>
</template>

<style scoped>
.current {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
