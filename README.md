# AURVIA

Premium medical-travel journey platform for international patients traveling to Türkiye. The first release covers hair transplantation and dental treatment. Demo inventory is fictional and labeled.

## Local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with the project URL and publishable key only. Never put a service-role key in a `NEXT_PUBLIC_` variable.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Roles

New accounts are patients. Promote an owner from the Supabase SQL editor with `scripts/promote-admin.sql`. Provider staff rows live in `provider_members`.

## Vercel

Do not commit `.env.local`. In the Vercel project, set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL` to the production origin

Leave `SUPABASE_SERVICE_ROLE_KEY` unset in the browser and out of `NEXT_PUBLIC_` names. Framework preset is Next.js. No Vercel project is linked in this repository.
