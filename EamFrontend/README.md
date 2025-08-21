# EAM Frontend (Auth Test)

Minimal React + TypeScript app to test authentication endpoints:

- POST `/api/auth/register` with `{ email, password, CIN?, phone?, role?, department?, avatar? }`
- POST `/api/auth/login` with `{ email, password }`

After login, it stores the JWT in localStorage and shows a welcome page:

Hello "name" your role is "role"

## Run

1. Ensure backend gateway runs at `http://localhost:8080`.
2. Install deps:

```bash
cd EamFrontend
npm install
```

3. Start dev server:

```bash
npm run dev
```

Open the shown URL (default `http://localhost:5173`).

Proxy to `/api` is configured in `vite.config.ts`.

## Env

- Copy `.env.example` to `.env` to override API base URL, e.g.:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

If set, the frontend will use it instead of the Vite proxy. Useful when serving the built app with a different origin.

## Troubleshooting connectivity

- Check browser DevTools Console and Network panels. Requests log as `[api:req]` and failures as `[api:err]`.
- If you see CORS errors, adjust allowed origins in the API Gateway CORS config to include your dev origin (e.g., `http://localhost:5173`).
- Ensure the API Gateway is reachable at the configured URL. Try `curl http://localhost:8080/api/auth/login` to verify the path is routed.
- If using `.env`, verify the value is `http://host:port/api` (with `/api` suffix).