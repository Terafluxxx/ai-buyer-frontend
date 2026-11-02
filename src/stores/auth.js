import { reactive } from 'vue'

const STORAGE_KEY = 'ai-buyer-session'

// Читаем сохранённую сессию из localStorage (если она ещё не истекла)
function loadSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved && saved.expiresAt > Date.now()) {
      return saved
    }
  } catch {
    // повреждённые данные просто игнорируем
  }
  return { token: null, expiresAt: 0, user: null, company: null }
}

// Глобальное реактивное состояние авторизации.
// Любой компонент, который его использует, обновится при изменениях.
export const auth = reactive(loadSession())

export function isLoggedIn() {
  return Boolean(auth.token) && auth.expiresAt > Date.now()
}

// Сохраняем ответ от /auth/login или /auth/register
export function saveSession(result) {
  auth.token = result.accessToken
  auth.expiresAt = Date.now() + result.expiresIn * 1000
  auth.user = result.user
  auth.company = result.company
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export function setProfile(profile) {
  auth.user = profile.user
  auth.company = profile.company
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export function clearSession() {
  auth.token = null
  auth.expiresAt = 0
  auth.user = null
  auth.company = null
  localStorage.removeItem(STORAGE_KEY)
}
