# setar-test

Vue 3 + Vite starter with a JSON-backed mock API for car registrations.

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

Starts Vite at `http://localhost:3000` and the mock API on port 3001 together.
API responses have a 1,500 ms delay
so the loading state is visible. Use `yarn dev:vite` to start only Vite.

### Type-Check, Compile and Minify for Production

```sh
yarn build
```

## Tailwind CSS and theme

The app uses Tailwind CSS 4 through the Vite plugin. Shared design tokens are
defined in `src/style.css`.

## Data and routing

The app uses [VueUse](https://vueuse.org/) `useFetch` for API requests and
[Vue Router file-based routing](https://router.vuejs.org/file-based-routing/).
Routes are generated automatically from files in `src/pages`.

## Car registration mock API

The mock API starts automatically with `yarn dev`. To run it on its own:

```sh
yarn mock:api
```

The API is available at `http://localhost:3001/carRegistrations`. JSON Server
persists changes to `db.json` while it is running.

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| GET    | `/carRegistrations`     | List registrations    |
| GET    | `/carRegistrations/:id` | Get a registration    |
| POST   | `/carRegistrations`     | Create a registration |
| PATCH  | `/carRegistrations/:id` | Update a registration |
| DELETE | `/carRegistrations/:id` | Delete a registration |

Registration records contain `model`, `brand`, `type`, `buildYear`,
`registrationNumber`, and `registeredBy`; the API assigns an `id`. The
corresponding `CarRegistration`, `NewCarRegistration`, and
`CarRegistrationUpdate` TypeScript types are in
`src/types/car-registration.ts`. Typed fetch helpers are in
`src/services/car-registrations.ts`.

Vite loads `VITE_API_URL` from the project-root `.env` file. It defaults to
`http://localhost:3001`; the value in `.env` is used as the API origin.
