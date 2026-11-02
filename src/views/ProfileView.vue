<script setup>
import { onMounted, ref } from 'vue'
import { getMe } from '../api/auth'
import { setProfile } from '../stores/auth'
import { errorMessage } from '../utils/errors'
import { formatDateTime } from '../utils/format'

const profile = ref(null)
const error = ref('')

// При открытии страницы запрашиваем свежий профиль с сервера
onMounted(async () => {
  try {
    profile.value = await getMe()
    setProfile(profile.value)
  } catch (e) {
    error.value = errorMessage(e)
  }
})
</script>

<template>
  <div class="page-header">
    <div>
      <h1>Профиль</h1>
      <p class="muted">Информация о пользователе и организации</p>
    </div>
  </div>

  <p v-if="error" class="alert alert-error">{{ error }}</p>

  <div v-if="profile" class="grid">
    <section class="card">
      <h2>Пользователь</h2>
      <dl class="details">
        <dt>Имя</dt>
        <dd>{{ profile.user.name }}</dd>
        <dt>Email</dt>
        <dd>{{ profile.user.email }}</dd>
        <dt>Зарегистрирован</dt>
        <dd>{{ formatDateTime(profile.user.createdAt) }}</dd>
      </dl>
    </section>

    <section class="card">
      <h2>Организация</h2>
      <dl class="details">
        <dt>Название</dt>
        <dd>{{ profile.company.name }}</dd>
        <dt>ID</dt>
        <dd>{{ profile.company.id }}</dd>
        <dt>Создана</dt>
        <dd>{{ formatDateTime(profile.company.createdAt) }}</dd>
      </dl>
    </section>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
</style>
