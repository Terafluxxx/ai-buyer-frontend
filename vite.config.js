import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    // Если порт занят — падаем с ошибкой, а не переезжаем молча на другой
    strictPort: true,
    // Все запросы на /api перенаправляем на backend,
    // чтобы браузер не блокировал их из-за CORS
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
