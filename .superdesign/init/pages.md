# Pages and local dependency trees

## `/login`

Entry: `src/views/login/index.vue`

Dependencies:

- `src/views/login/index.vue` (uses Element Plus components resolved by Vite plugin)
- `src/App.vue` (shared root layout)
- `src/style/index.scss` (global styling imported from `src/main.ts`)
- `src/assets/main.css` (Tailwind entry; currently not imported from `src/main.ts`)

The login page is a minimal Element Plus form with name and password inputs. No dashboard page exists yet.
