import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusBadge from '../../components/StatusBadge.vue'

describe('StatusBadge', () => {
  it.each([
    ['CRITICAL', 'Критично', 'critical'],
    ['NEED_PURCHASE', 'Нужна закупка', 'need_purchase'],
    ['NORMAL', 'В норме', 'normal'],
    ['NO_SALES', 'Нет продаж', 'no_sales'],
  ])(
    'отображает правильный текст и CSS-класс для статуса %s',
    (status, expectedText, expectedClass) => {
      const wrapper = mount(StatusBadge, {
        props: { status },
      })

      expect(wrapper.text()).toBe(expectedText)
      expect(wrapper.classes()).toContain('badge')
      expect(wrapper.classes()).toContain(expectedClass)
    }
  )
})
