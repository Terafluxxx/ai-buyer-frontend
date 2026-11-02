<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../api/auth'
import { saveSession } from '../stores/auth'
import { errorMessage } from '../utils/errors'
import AuthCard from '../components/AuthCard.vue'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  companyName: '',
})
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    // Backend сразу создаёт компанию и пользователя и возвращает токен
    const result = await register(form)
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
  <AuthCard title="Регистрация" subtitle="Создайте аккаунт и организацию">
    <form @submit.prevent="onSubmit">
      <p v-if="error" class="alert alert-error">{{ error }}</p>

      <div class="field">
        <label for="name">Ваше имя</label>
        <input id="name" v-model="form.name" required maxlength="255" />
      </div>

      <div class="field">
        <label for="company">Название организации</label>
        <input id="company" v-model="form.companyName" required maxlength="255" />
      </div>

      <div class="field">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" required maxlength="255" autocomplete="email" />
      </div>

      <div class="field">
        <label for="password">Пароль (от 8 символов)</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          minlength="8"
          maxlength="72"
          autocomplete="new-password"
        />
      </div>

      <button class="btn btn-primary full" :disabled="loading">
        {{ loading ? 'Создаём…' : 'Зарегистрироваться' }}
      </button>
    </form>

    <p class="muted switch">
      Уже есть аккаунт? <RouterLink to="/login">Войти</RouterLink>
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
