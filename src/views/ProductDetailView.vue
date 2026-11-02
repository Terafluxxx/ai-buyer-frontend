<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deleteProduct, getProduct, updateProduct } from '../api/products'
import { errorMessage } from '../utils/errors'
import { formatDateTime } from '../utils/format'
import ProductForm from '../components/ProductForm.vue'
import ProductInventory from '../components/ProductInventory.vue'
import ProductSales from '../components/ProductSales.vue'

const route = useRoute()
const router = useRouter()
const productId = route.params.id

const product = ref(null)
const error = ref('')
const editing = ref(false)
const saving = ref(false)

async function load() {
  try {
    product.value = await getProduct(productId)
  } catch (e) {
    error.value = errorMessage(e)
  }
}

async function onSave(values) {
  // В PATCH отправляем только те поля, которые действительно изменились
  const changes = {}
  for (const key of ['sku', 'name', 'category']) {
    if (values[key] !== product.value[key]) {
      changes[key] = values[key]
    }
  }
  if (Object.keys(changes).length === 0) {
    editing.value = false
    return
  }

  saving.value = true
  error.value = ''
  try {
    product.value = await updateProduct(productId, { ...changes, version: product.value.version })
    editing.value = false
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    saving.value = false
  }
}

async function onDelete() {
  if (!confirm(`Удалить товар «${product.value.name}»?`)) return
  error.value = ''
  try {
    await deleteProduct(productId, product.value.version)
    router.push('/products')
  } catch (e) {
    error.value = errorMessage(e)
  }
}

onMounted(load)
</script>

<template>
  <RouterLink to="/products" class="back">← Все товары</RouterLink>

  <p v-if="error" class="alert alert-error">{{ error }}</p>

  <template v-if="product">
    <div class="page-header">
      <div>
        <h1>{{ product.name }}</h1>
        <p class="muted">SKU: {{ product.sku }}</p>
      </div>
      <div v-if="!editing" class="row">
        <button class="btn" @click="editing = true">Редактировать</button>
        <button class="btn btn-danger" @click="onDelete">Удалить</button>
      </div>
    </div>

    <section class="card">
      <h2>Карточка товара</h2>
      <ProductForm
        v-if="editing"
        :initial="product"
        :loading="saving"
        @submit="onSave"
        @cancel="editing = false"
      />
      <dl v-else class="details">
        <dt>SKU</dt>
        <dd>{{ product.sku }}</dd>
        <dt>Название</dt>
        <dd>{{ product.name }}</dd>
        <dt>Категория</dt>
        <dd>{{ product.category || '—' }}</dd>
        <dt>Создан</dt>
        <dd>{{ formatDateTime(product.createdAt) }}</dd>
        <dt>Изменён</dt>
        <dd>{{ formatDateTime(product.updatedAt) }}</dd>
      </dl>
    </section>

    <ProductInventory :product-id="productId" />
    <ProductSales :product-id="productId" />
  </template>
</template>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: 12px;
}
</style>
