# Yaoshun Admin 应用说明

`apps/admin` 是尧顺玩具运营平台，技术栈为 `React + Vite + Ant Design`，部署目标为 Vercel 静态站点。

## 本地开发

```bash
pnpm install
pnpm dev:admin
```

默认地址：

- `http://127.0.0.1:8030`

## 环境配置

当前使用同一套配置模板，按环境分别放在：

- `.env.development.local`
- `.env.preview.local`
- `.env.production.local`

关键变量：

- `VITE_PORT`: 本地开发端口
- `VITE_API_PROXY_TARGET`: 本地开发时 `/api` 代理目标
- `VITE_API_BASE_URL`: Vercel/生产环境后端 API 地址

## Vercel 部署

以 `apps/admin` 作为 Vercel Project Root Directory。

- Build Command: `pnpm build`
- Output Directory: `dist`
- Install Command: `cd ../.. && pnpm install --frozen-lockfile`

更多后端与管理系统进度请看 [admin-server-implementation.md](/Users/lukang.liu/Desktop/github/yaoshun/docs/admin-server-implementation.md)。
