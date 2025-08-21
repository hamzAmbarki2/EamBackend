# EAM Frontend (Auth Test)

Minimal React + TypeScript app to test authentication endpoints:

- POST `/api/auth/register` with `{ email, password }`
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