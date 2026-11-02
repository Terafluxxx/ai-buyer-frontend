<script setup>
// Общая обёртка для страниц входа и регистрации
defineProps({
  title: String,
  subtitle: String,
})
</script>

<template>
  <div class="auth-page">
    <div class="card auth-card">
      <div class="logo">AI Закупщик</div>
      <h1>{{ title }}</h1>
      <p class="muted">{{ subtitle }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.auth-card {
  width: 100%;
  max-width: 380px;
  padding: 32px;
}

.logo {
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 20px;
}
</style>
