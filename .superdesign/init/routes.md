# Routes

| URL | Component | Layout |
| --- | --- | --- |
| `/login` | `src/views/login/index.vue` | `src/App.vue` router view |

## Full router source (`src/router/index.ts`)

```ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: publicRoutes,
})

export default router
```
