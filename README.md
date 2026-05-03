# yaoshun monorepo

Yaoshun 的 pnpm workspace，用于管理企业官网以及后续后台、服务端应用。

## 项目结构

```text
apps/
  website/   Next.js 企业官网
  admin/     预留的运营后台工作区
  server/    预留的服务端工作区
```

当前主要代码集中在 `apps/website`。`admin` 与 `server` 目前仅保留占位目录，避免 README 描述超前于实际实现。

## 常用命令

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

## 技术基线

- 包管理：`pnpm` workspace
- 官网：Next.js 16、React 19、TypeScript、Tailwind CSS
- 共享配置：根目录 `tsconfig.base.json`
- 运行时环境：各应用自己的 `.env*` 文件
