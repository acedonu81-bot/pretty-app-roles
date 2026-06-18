# XPEAK — Directorio profesional de eventos

## Stack
- Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui
- Supabase (auth, database, edge functions, storage)
- Vercel (hosting, analytics)
- Project ID Supabase: `ddrqhwravupjzysriblq`
- Dominio: `xpeak.es` | Email SMTP: `info@xpeak.site`

## Estructura
```
src/pages/          — rutas principales (Auth, Dashboard, Landing, Blog*, Legal)
src/components/     — componentes reutilizables
src/components/dashboard/ — vistas del dashboard por rol
src/hooks/          — custom hooks (useAuth, useProfile, useActivityFeed)
src/integrations/supabase/ — client.ts y types.ts
src/data/profiles.ts — perfiles demo/seed
supabase/functions/ — edge functions (send-email)
scripts/            — prerender-meta.mjs, update-sitemap.mjs
```

## Comandos
- `npm run dev` — dev server (localhost:5173)
- `npm run build` — build + prerender + sitemap
- `npm test` — vitest
- `npx tsc --noEmit` — type check
- `npx vercel --prod --yes` — deploy producción (git push no funciona, token expirado)

## Convenciones
- Responder siempre en español
- No crear archivos .md de documentación salvo que se pida
- Colores brand: dorado `#D4AF37`, fondo `#0a0908`
- Auth: auto-confirm ON en Supabase, trigger `handle_new_user` crea profile
- VITE_SITE_URL configurada en Vercel env vars (production + preview)
- Edge functions usan `info@xpeak.site` como FROM (no cambiar sin reconfigurar SMTP)

## Cosas que NO hacer
- No usar `grep -c` (output enorme)
- No leer archivos enteros si solo necesitas unas líneas
- No deployar más de una vez por sesión salvo emergencia
- No lanzar subagentes sin que el usuario lo pida
