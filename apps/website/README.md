# @yaoshun/website

Yaoshun 企业官网，基于 Next.js App Router、React 19、TypeScript 与 Tailwind CSS。

## 目录结构

```text
src/
  app/         路由、布局、metadata、API route
  components/ 复用组件，按职责分组
  content/    站点文案、页面数据、内容种子
  lib/        i18n、路由、SEO、分析、站点配置等领域工具
  styles/     全局样式与页面样式
data/         外部产品数据源
public/       静态资源
docs/         项目文档
```

`src/app` 只承载 Next.js 路由边界；页面所需的数据种子放在 `src/content/pages`，共享组件放在 `src/components/*`，避免共享层反向依赖路由目录。

## 组件分层

```text
components/
  forms/      表单组件
  layout/     站点框架、导航、页脚数据
  media/      图片与媒体基础能力
  products/   产品展示组件
  sections/   跨页面区块组件
  seo/        结构化数据
  tracking/   分析与第三方脚本
  ui/         小型 UI 基元
```

## 本地开发

```bash
pnpm install
pnpm dev:website
```

## 验证与构建

```bash
pnpm --filter @yaoshun/website lint
pnpm --filter @yaoshun/website typecheck
pnpm --filter @yaoshun/website build
```

## 环境变量

官网运行时配置从 `apps/website/.env*` 读取。可从 `.env.example` 或 `.env.local.example` 复制：

```bash
NEXT_PUBLIC_SITE_URL=https://www.yaoshuntoys.com
NEXT_PUBLIC_ENABLE_THIRD_PARTY_TRACKING=
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=
NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_SEND_TO=
NEXT_PUBLIC_GOOGLE_ADS_CONTACT_CONVERSION_SEND_TO=
NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_CURRENCY=CNY
NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_VALUE=1
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

`NEXT_PUBLIC_ENABLE_THIRD_PARTY_TRACKING` 留空时默认开启；填 `0` 可关闭 GA/Google Ads 脚本，填 `1` 可显式开启。

联系表单会提交到 `POST /api/contact-form`，并通过邮件转发到 Tawk ticket inbox：

```bash
TAWK_TICKET_EMAIL=ticket+xxxxxx@tawk.to
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=465
EMAIL_USER=your-email-account
EMAIL_PASS=your-email-password-or-app-password
EMAIL_FROM=sales@your-domain.com
```
