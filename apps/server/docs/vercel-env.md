# Yaoshun Server Vercel Environment

Deploy `apps/server` as a separate Vercel project.

## Required

```bash
DATABASE_URL=postgresql://postgres.vpfouctsdziefgdymkub:<PASSWORD>@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.vpfouctsdziefgdymkub:<PASSWORD>@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=1d
APP_URL=https://yaoshun-server.vercel.app
CORS_ORIGIN=https://yaoshun-admin.vercel.app,https://www.yaoshuntoys.com
CRON_SECRET=replace-with-a-long-random-string
```

`CRON_SECRET` is used by Vercel Cron. Vercel sends `Authorization: Bearer $CRON_SECRET` to the weekly database keepalive endpoint.

## Media

```bash
BLOB_READ_WRITE_TOKEN=
BLOB_UPLOAD_PREFIX=yaoshun-media
UPLOAD_DIR=/tmp/yaoshun-uploads
```

Vercel runtime should use Vercel Blob for persistent media storage. Local upload is only for development.

## Mail

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=yaoshuntoys@gmail.com
EMAIL_PASS=
EMAIL_FROM=yaoshuntoys@gmail.com
EMAIL_FROM_NAME=Yaoshun Toys
```

## Vercel Project Settings

- Root Directory: `apps/server`
- Build Command: `pnpm prisma:generate && pnpm build`
- Install Command: `cd ../.. && pnpm install --frozen-lockfile`

## Database Keepalive

`apps/server/vercel.json` schedules `GET /api/v1/keepalive/database` every Monday at 02:00 UTC. The endpoint runs `SELECT CURRENT_TIMESTAMP` and writes `database_keepalive_last_run` to `Setting`, keeping PostgreSQL active and leaving an audit timestamp.
