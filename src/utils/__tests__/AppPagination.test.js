import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppPagination from '../../components/AppPagination.vue'

describe('AppPagination', () => {
  it('не отображает пагинацию, если нет страниц и элементов', () => {
    const wrapper = mount(AppPagination, {
      props: {
        page: 0,
        totalPages: 1,
        totalElements: 0,
      },
    })

    expect(wrapper.find('.pagination').exists()).toBe(false)
  })

  it('отображает количество элементов без кнопок, если страница только одна', () => {
    const wrapper = mount(AppPagination, {
      props: {
        page: 0,
        totalPages: 1,
        totalElements: 25,
      },
    })

    expect(wrapper.text()).toContain('Всего: 25')
    expect(wrapper.findAll('button')).toHaveLength(0)
  })

  it('отображает текущую страницу и общее количество страниц', () => {
    const wrapper = mount(AppPagination, {
      props: {
        page: 1,
        totalPages: 5,
        totalElements: 42,
      },
    })

    expect(wrapper.text()).toContain('Всего: 42')
    expect(wrapper.text()).toContain('2 / 5')
  })

  it('блокирует кнопку «Назад» на первой странице', () => {
    const wrapper = mount(AppPagination, {
      props: {
        page: 0,
        totalPages: 3,
      },
    })

    const buttons = wrapper.findAll('button')

    expect(buttons[0].element.disabled).toBe(true)
    expect(buttons[1].element.disabled).toBe(false)
  })

  it('блокирует кнопку «Вперёд» на последней странице', () => {
    const wrapper = mount(AppPagination, {
      props: {
        page: 2,
        totalPages: 3,
      },
    })

    const buttons = wrapper.findAll('button')

    expect(buttons[0].element.disabled).toBe(false)
    expect(buttons[1].element.disabled).toBe(true)
  })

  it('переключает на следующую страницу при нажатии «Вперёд»', async () => {
    const wrapper = mount(AppPagination, {
      props: {
        page: 1,
        totalPages: 3,
      },
    })

    await wrapper.findAll('button')[1].trigger('click')

    expect(wrapper.emitted('change')).toEqual([[2]])
  })

  it('переключает на предыдущую страницу при нажатии «Назад»', async () => {
    const wrapper = mount(AppPagination, {
      props: {
        page: 1,
        totalPages: 3,
      },
    })

    await wrapper.findAll('button')[0].trigger('click')

    expect(wrapper.emitted('change')).toEqual([[0]])
  })
})
