import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { filterRouters, generateMenus } from '../route'

const component = { template: '<div />' }

describe('generateMenus', () => {
  it('handles raw children without meta from router.getRoutes()', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          component,
          children: [
            { path: '/profile', component, meta: { title: 'profile', icon: 'personnel' } },
            { path: '/404', component },
            { path: '/401', component },
          ],
        },
        { path: '/login', component },
      ],
    })

    expect(generateMenus(filterRouters(router.getRoutes()))).toEqual([
      { path: '/profile', meta: { title: 'profile', icon: 'personnel' }, children: [] },
    ])
  })

  it('preserves nested menus and promotes children of routes without menu meta', () => {
    expect(
      generateMenus([
        {
          path: '/admin',
          component,
          meta: { title: 'admin', icon: 'settings' },
          children: [
            {
              path: 'group',
              component,
              children: [
                { path: 'users', component, meta: { title: 'users', icon: 'personnel' } },
                { path: '/chart', component, meta: { title: 'chart', icon: 'chart' } },
                { path: 'detail', component, meta: { title: 'detail' } },
              ],
            },
          ],
        },
      ]),
    ).toEqual([
      {
        path: '/admin',
        meta: { title: 'admin', icon: 'settings' },
        children: [
          { path: '/admin/group/users', meta: { title: 'users', icon: 'personnel' }, children: [] },
          { path: '/chart', meta: { title: 'chart', icon: 'chart' }, children: [] },
        ],
      },
    ])
  })
})
