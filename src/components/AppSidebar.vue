<script setup>
import { useRouter } from 'vue-router'
import { logout } from '../api/auth'
import { auth, clearSession } from '../stores/auth'

const router = useRouter()

// Пункты единого навигационного меню
const links = [
  { to: '/products', label: 'Товары' },
  { to: '/inventory', label: 'Остатки' },
  { to: '/profile', label: 'Профиль' },
]

async function onLogout() {
  try {
    await logout()
  } finally {
    // Даже если сервер не ответил, локально сессию всё равно удаляем
    clearSession()
    router.push('/login')
  }
}
</script>

<template>
  <aside class="sidebar">
    <div class="logo">AI Закупщик</div>

    <nav>
      <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link">
        {{ link.label }}
      </RouterLink>
    </nav>

    <div class="user">
      <div class="user-name">{{ auth.user?.name }}</div>
      <div class="muted">{{ auth.company?.name }}</div>
      <button class="btn btn-small" @click="onLogout">Выйти</button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 20px 12px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.logo {
  font-weight: 700;
  font-size: 16px;
  padding: 0 10px 20px;
  color: var(--primary);
}

nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.nav-link {
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--text);
}

.nav-link:hover {
  background: #f3f4f6;
  text-decoration: none;
}

/* router-link-active — класс, который Vue Router ставит активной ссылке */
.nav-link.router-link-active {
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 500;
}

.user {
  border-top: 1px solid var(--border);
  padding: 16px 10px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
}

.user-name {
  font-weight: 500;
}

@media (max-width: 760px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }

  nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
