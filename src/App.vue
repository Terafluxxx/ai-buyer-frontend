<script setup>
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'

const route = useRoute()
</script>

<template>
  <!-- Страницы входа и регистрации показываем без бокового меню -->
  <RouterView v-if="route.meta.public" />

  <div v-else class="layout">
    <AppSidebar />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.content {
  flex: 1;
  min-width: 0;
  padding: 28px 32px;
  max-width: 1200px;
}

@media (max-width: 760px) {
  .layout {
    flex-direction: column;
  }

  .content {
    padding: 20px 16px;
  }
}
</style>
