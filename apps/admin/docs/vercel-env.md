# Yaoshun Admin Vercel Environment

Deploy `apps/admin` as a separate Vercel project.

```bash
VITE_API_BASE_URL=https://yaoshun-server.vercel.app
VITE_API_PROXY_TARGET=https://yaoshun-server.vercel.app
VITE_PORT=8030
```

## Vercel Project Settings

- Root Directory: `apps/admin`
- Build Command: `pnpm build`
- Output Directory: `dist`
- Install Command: `cd ../.. && pnpm install --frozen-lockfile`

Update `apps/admin/vercel.json` if the server project domain changes.
