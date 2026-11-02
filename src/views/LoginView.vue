<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/auth'
import { saveSession } from '../stores/auth'
import { errorMessage } from '../utils/errors'
import AuthCard from '../components/AuthCard.vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    const result = await login({ email: email.value, password: password.value })
    saveSession(result)
    router.push('/')
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthCard title="Вход" subtitle="Войдите, чтобы продолжить работу">
    <form @submit.prevent="onSubmit">
      <p v-if="error" class="alert alert-error">{{ error }}</p>

      <div class="field">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" required autocomplete="email" />
      </div>

      <div class="field">
        <label for="password">Пароль</label>
        <input id="password" v-model="password" type="password" required autocomplete="current-password" />
      </div>

      <button class="btn btn-primary full" :disabled="loading">
        {{ loading ? 'Входим…' : 'Войти' }}
      </button>
    </form>

    <p class="muted switch">
      Нет аккаунта? <RouterLink to="/register">Зарегистрироваться</RouterLink>
    </p>
  </AuthCard>
</template>

<style scoped>
.full {
  width: 100%;
  justify-content: center;
  margin-top: 4px;
}

.switch {
  margin: 16px 0 0;
  text-align: center;
}
</style>
