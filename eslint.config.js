import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  // Не проверяем зависимости, сборку и результаты тестирования
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
  },

  // Рекомендуемые правила JavaScript
  js.configs.recommended,

  // Рекомендуемые правила Vue 3
  ...pluginVue.configs['flat/recommended'],

  // Исходный код frontend: браузерное окружение
  {
    files: ['src/**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
  },

  // Конфигурационные файлы и Node.js-скрипты
  {
    files: ['scripts/**/*.js', 'vite.config.js', 'eslint.config.js', 'vitest.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },

  // Совместимость правил с Prettier
  eslintConfigPrettier,
]
