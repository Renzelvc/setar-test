# setar-test

Vue 3 + Vite starter with a JSON-backed mock API for car registrations.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```

## Tailwind CSS and theme

The app uses Tailwind CSS 4 through the Vite plugin. Shared design tokens are
defined in `src/style.css` under `@theme`; use them in templates as utilities
such as `bg-paper`, `text-ink`, `text-forest-700`, and `font-display`.
Update those `--color-*` and `--font-*` values to theme the application.

## Fetching data

`src/App.vue` uses [VueUse's `useFetch`](https://vueuse.org/core/useFetch/)
with the API URL and `.get().json<CarRegistration[]>()`. It returns reactive
`data`, `isFetching` (aliased to `isLoading`), and `error` state, plus an
`execute` function for retries.

## Car registration mock API

Start the mock API in a separate terminal:

```sh
yarn mock:api
```

The API is available at `http://localhost:3001/carRegistrations`. JSON Server
persists changes to `db.json` while it is running.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/carRegistrations` | List registrations |
| GET | `/carRegistrations/:id` | Get a registration |
| POST | `/carRegistrations` | Create a registration |
| PATCH | `/carRegistrations/:id` | Update a registration |
| DELETE | `/carRegistrations/:id` | Delete a registration |

Registration records contain `model`, `brand`, `type`, `buildYear`,
`registrationNumber`, and `registeredBy`; the API assigns an `id`. The
corresponding `CarRegistration`, `NewCarRegistration`, and
`CarRegistrationUpdate` TypeScript types are in
`src/types/car-registration.ts`. Typed fetch helpers are in
`src/services/car-registrations.ts`.

Vite loads `VITE_API_URL` from the project-root `.env` file. It defaults to
`http://localhost:3001`; the value in `.env` is used as the API origin.
