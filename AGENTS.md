# Movie Ticket Booking System — Frontend

Next.js 16 App Router + React 19 + Tailwind CSS 4 + shadcn/ui (Radix Rhea style).

## Commands

```sh
npm run dev      # dev server on :3000
npm run build    # production build
npm run lint     # ESLint (flat config, eslint.config.mjs)
```

No test runner configured. No typecheck script — rely on `tsc --noEmit` manually or via editor.

## Key paths

| Area | Path |
|------|------|
| App routes | `src/app/` (App Router) |
| Feature modules | `src/features/<name>/` (api, types, hooks, components/) |
| UI primitives | `src/components/ui/` (shadcn, regenerate via `npx shadcn add`) |
| API client | `src/lib/config/api-client.ts` (axios singleton, 401 auto-refresh via `/auth/refresh`, queues concurrent requests) |
| API request helper | `src/lib/config/axios.ts` (`apiRequest<T>(method, url, body?)`) |
| State | Zustand stores per feature (e.g. `auth.store.ts`, `language.store.ts`) |
| Proxy (was middleware) | `src/proxy.ts` — JWT decode (jose, no verify), guards `/admin`/`/cashier`/`/profile` by role cookie `access_token` |
| Auth provider | `src/features/auth/providers/authInit.provider.tsx` — wraps root layout |
| Path alias | `@/*` → `./src/*` |
| Env | `NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1` (committed `.env`) |

## Architecture

- **Feature-per-directory** under `src/features/`. Each owns its api layer (axios calls), types, hooks, Zustand store, and components.
- API base URL is the backend at `http://localhost:3000/api/v1` — the frontend dev server runs on port 3000, so both share the same origin in dev. Adjust `NEXT_PUBLIC_API_BASE_URL` if backend moves.
- Axios interceptor silently refreshes tokens on 401 and retries the original request. On refresh failure it clears auth and rejects.
- `next.config.ts` allows images from `res.cloudinary.com` (any path) and `localhost:3000/api/v1/files/**`.
- Role-based routing: `ADMIN`, `CASHIER`, `USER`. Unauthorized access rewrites to `/unauthorized` or `/404`.
- Proxy matches `/profile/:path*`, `/admin/:path*`, `/cashier/:path*` only. Public and `/auth` routes are unrestricted.

## Conventions

- **No test runner** — verify by running `npm run dev` and checking the browser, or `npm run build` for compilation errors.
- **Fonts**: Roboto (`--font-sans`), Kantumruy_Pro (`--font-khmer`), Geist (`--font-geist-sans/mono`) via `next/font/google`.
- **Icons**: lucide-react (via shadcn `iconLibrary`).
- **CSS**: Tailwind CSS v4 with `@tailwindcss/postcss` plugin. Global styles in `src/app/globals.css`.
- This is **Next.js 16** — read `node_modules/next/dist/docs/` before writing code. APIs and conventions may differ from older versions.
