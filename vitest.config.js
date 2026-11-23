import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Среда браузера для тестирования Vue-компонентов
      environment: 'jsdom',

      // Очищаем историю вызовов mock-функций между тестами
      clearMocks: true,

      // Восстанавливаем оригинальные реализации spy-функций
      restoreMocks: true,

      // Настройки анализа покрытия кода
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],

        // Ключевые модули, для которых собираем покрытие
        include: [
          'src/utils/recommendation.js',
          'src/utils/params.js',
          'src/utils/fetchAll.js',
          'src/utils/errors.js',
          'src/components/StatusBadge.vue',
          'src/components/AppPagination.vue',
          'src/components/ProductForm.vue',
          'src/composables/useAnalysis.js',
        ],
      },
    },
  })
)
