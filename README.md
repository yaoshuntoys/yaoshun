# yaoshun monorepo

使用 `pnpm workspace` 管理多个子项目，并默认切换到国内镜像源。
当前已按架构文档初始化三个应用的基础工程。

## 项目结构

```text
apps/
  website/   企业官网
  admin/     企业运营后台
  server/    后台服务
```

## 快速开始

```bash
pnpm install
pnpm dev
```

## 说明

- 根目录 `.npmrc` 已切换为 `https://registry.npmmirror.com/`
- `apps/website`：`Next.js 16 + React 19 + next-intl + Tailwind CSS`
- `apps/admin`：`React 19 + Vite 8 + Ant Design 6 + react-router-dom 7 + Zustand`
- `apps/server`：`NestJS 11 + Prisma 7 + PostgreSQL`
*** Add File: /Users/lukang.liu/Desktop/gitlab/yaoshun/tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "moduleDetection": "force"
  }
}
