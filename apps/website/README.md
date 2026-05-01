# @yaoshun/website

Minimal Next.js website scaffold.

## Local Development

```bash
pnpm install
pnpm dev:website
```

## Build

```bash
pnpm --filter @yaoshun/website build
```

## Environment Config

Website runtime config is loaded directly from `apps/website/.env`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=
NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_SEND_TO=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

## Vercel

Use environment-specific `.env` values on your deployment platform.

## Contact Form -> Tawk Ticket

The contact form now submits to `POST /api/contact-form`, and the server sends an email to your Tawk ticket inbox.

Create `apps/website/.env` (you can copy from `.env.example`) and configure:

```bash
TAWK_TICKET_EMAIL=ticket+xxxxxx@tawk.to
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=465
EMAIL_USER=your-email-account
EMAIL_PASS=your-email-password-or-app-password
EMAIL_FROM=sales@your-domain.com
```
