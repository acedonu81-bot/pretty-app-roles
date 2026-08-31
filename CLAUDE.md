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
- `npx vercel --prod --yes` — deploy producción (Vercel no auto-despliega desde GitHub)
- `git push origin main` — sube código a GitHub (token en macOS Keychain; sí funciona)
- `npm run indexnow` — notifica a Bing/IndexNow las URLs del sitemap. Ejecutar SOLO tras un deploy real a producción, nunca en builds locales de prueba (spamea el ping)

## Convenciones
- Responder siempre en español
- No crear archivos .md de documentación salvo que se pida
- Colores brand: dorado `#D4AF37`, fondo `#0a0908`
- Auth: auto-confirm ON en Supabase, trigger `handle_new_user` crea profile
- VITE_SITE_URL configurada en Vercel env vars (production + preview)
- Edge functions usan `info@xpeak.site` como FROM (no cambiar sin reconfigurar SMTP)

## MCP
- `.mcp.json` en la raíz declara `chrome-devtools` (npx chrome-devtools-mcp) para que `verify-flows` funcione en cualquier sesión/máquina sin depender de config global

## Ahorro de tokens (CRÍTICO)
- Respuestas cortas, sin narración ni resúmenes finales
- No explicar qué vas a hacer, hacerlo directamente
- `grep -rl` o `grep -l`, NUNCA `grep -c`
- `Read` con `offset`/`limit`, no archivos enteros
- Combinar Bash con `&&`, no 5 llamadas separadas
- No releer archivos tras Edit (el sistema confirma)
- Deploy: `2>&1 | tail -15` para truncar output
- `take_snapshot` > `take_screenshot` salvo verificación visual
- No lanzar subagentes sin que el usuario lo pida
- No deployar más de una vez por sesión salvo emergencia
- No crear archivos .md de documentación salvo que se pida
- Máxima autonomía: actuar antes de preguntar, escalar solo si es técnicamente imposible

## Verificación obligatoria antes de dar un fix por cerrado
- Invocar la skill `verify-flows` tras tocar código de registro, directorio, carrito "Mi evento", perfil público o Flash Booking
- Un `tsc --noEmit` limpio NO es suficiente — reproducir la acción real (clic, rellenar, eliminar) en el navegador antes de decir "arreglado"
