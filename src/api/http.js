import axios from 'axios'
import { auth, clearSession } from '../stores/auth'

// Общий экземпляр axios: все запросы идут на /api/v1
const http = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Перед каждым запросом добавляем JWT-токен, если пользователь вошёл
http.interceptors.request.use((config) => {
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

// Если сервер ответил 401 — токен истёк или отозван, отправляем на вход
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = ['/auth/login', '/auth/register'].includes(error.config?.url)
    if (error.response?.status === 401 && !isLoginRequest) {
      clearSession()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default http
