import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { nextTick } from 'vue'
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElTooltip } from 'element-plus'
import { LANG } from '@/constant'

let wrapper: VueWrapper | undefined

beforeEach(() => {
  localStorage.clear()
  vi.resetModules()
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
  localStorage.clear()
})

async function mountLanguageSelect() {
  const { default: LanguageSelect } = await import('../index.vue')
  const { default: i18n } = await import('@/i18n')
  const { useLangStore } = await import('@/stores/app')
  const pinia = createPinia()
  wrapper = mount(LanguageSelect, {
    attachTo: document.body,
    global: {
      plugins: [pinia, i18n],
      components: { ElDropdown, ElDropdownItem, ElDropdownMenu, ElTooltip },
      stubs: { SvgIcon: true },
    },
  })
  wrapper.findComponent(ElDropdown).vm.handleOpen()
  await flushPromises()
  await nextTick()
  return { wrapper, i18n, store: useLangStore(pinia) }
}

describe('language dropdown', () => {
  it('switches from initial Chinese to English and back, updating disabled items and storage', async () => {
    const { wrapper, i18n, store } = await mountLanguageSelect()
    const items = wrapper.findAllComponents(ElDropdownItem)
    expect(items).toHaveLength(2)
    expect(items[0]!.props('disabled')).toBe(true)
    expect(items[1]!.props('disabled')).toBe(false)

    await items[1]!.get('li[role="menuitem"]').trigger('click')
    expect(store.language).toBe('en')
    expect(i18n.global.locale.value).toBe('en')
    expect(i18n.global.t('route.profile')).toBe('Profile')
    expect(localStorage.getItem(LANG)).toBe('en')
    expect(items[0]!.props('disabled')).toBe(false)
    expect(items[1]!.props('disabled')).toBe(true)

    await items[0]!.get('li[role="menuitem"]').trigger('click')
    expect(store.language).toBe('zh')
    expect(i18n.global.locale.value).toBe('zh')
    expect(localStorage.getItem(LANG)).toBe('zh')
    expect(items[0]!.props('disabled')).toBe(true)
    expect(items[1]!.props('disabled')).toBe(false)
  })

  it('restores saved English consistently in the store, translations and menu', async () => {
    localStorage.setItem(LANG, 'en')
    const { wrapper, i18n, store } = await mountLanguageSelect()
    expect(store.language).toBe('en')
    expect(i18n.global.locale.value).toBe('en')
    expect(i18n.global.t('route.profile')).toBe('Profile')
    const items = wrapper.findAllComponents(ElDropdownItem)
    expect(items[0]!.props('disabled')).toBe(false)
    expect(items[1]!.props('disabled')).toBe(true)
  })
})
