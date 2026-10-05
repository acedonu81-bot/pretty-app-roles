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
- Colores brand: crema (`#FFFDF7`/`#FBF3DD`), dorado `#D4AF37` (texto `#8B6A00`), azul `#2563EB`, verde `#059669`. Fondo blanco/crema. NUNCA fondos negros en páginas públicas ni blogs (decisión del usuario, 30 sep 2026)
- Auth: auto-confirm ON en Supabase, trigger `handle_new_user` crea profile
- VITE_SITE_URL configurada en Vercel env vars (production + preview)
- Edge functions usan `info@xpeak.site` como FROM (no cambiar sin reconfigurar SMTP)

## INNEGOCIABLE: XDS (XPEAK Decision System) antes de construir (decisión del usuario, 5 oct 2026)
Fuente: "The XPEAK Book, Edición Fundacional v1.0". Ninguna funcionalidad, oficio/categoría, alianza, plan de precios o campaña pasa a desarrollo por intuición, presión o entusiasmo. Antes de escribir código para algo nuevo, entregar una **Ficha XDS** y esperar el visto bueno:
1. Idea en una frase · usuario afectado · problema real que resuelve.
2. **Gate eliminatorio** (1-5): Confianza ≥4, Problema real ≥4, Valor usuario ≥4. Si falla uno, no se construye: backlog o replantear.
3. **Matriz** (nota 1-5 × peso): Confianza x5, Problema real x5, Valor usuario x5, Efecto dominó x4, Diferenciación x4, Demanda validada x3, Oferta suficiente x3, Timing x3, Escalabilidad x3, Comunidad x3, Monetización ética x2, Desarrollo x2, Riesgo inverso x5 (5 = riesgo controlado). **Score = Σ(nota×peso) / 235 × 100.**
4. **Evidencias** de cada nota (datos de Supabase/GA4, búsquedas, leads, entrevistas). Nota sin evidencia: bajarla o marcarla "pendiente".
5. **Death Line** (condición que rompe la idea) + **mitigación concreta**. Sin mitigación no se aprueba.
6. **Veredicto** por bandas: 90-100 construir ya · 80-89 próximo trimestre · 70-79 validar (prueba manual/prototipo) · 60-69 backlog · <60 descartar o replantear.
- Pregunta obligatoria: ¿esto hace que organizadores y profesionales confíen más en XPEAK? Roadmap: Directorio confiable → Flash manual → XPEAK Guard → Business → IA contextual; no se construye un nivel sin validar el anterior.
- Bugs, seguridad y mantenimiento NO pasan por XDS. Las métricas de las evidencias excluyen admins, cuentas demo y autocontratos.

## INNEGOCIABLE: tarjetas de categoría en home y dashboard (decisión del usuario, 5 oct 2026)
Datos 5 sep–5 oct 2026: el 100% de la demanda real (conversaciones con empresarios, Flash Booking y leads) fue de Música; el resto de categorías tuvo interés pero 0 demanda.
- **Todas las categorías y subcategorías se muestran SIEMPRE** en la home y el dashboard (bento de `Landing.tsx`, `ExplorarView.tsx`, sidebar, `/descubrir`), **aunque tengan 0 perfiles**. Nunca ocultar una tarjeta por falta de perfiles: transmite que XPEAK cubre todos los oficios del mundo de los eventos y da buena imagen. Se propuso ocultar las vacías (y un mínimo de 3, luego de 1) y el usuario lo rechazó.
- Recomendado (no innegociable): que el directorio vacío de una categoría no sea un callejón sin salida (captar lead, ofrecer Flash Booking o roles relacionados).
- EN CUARENTENA (no es regla todavía, revisar ~5 nov 2026): medir las categorías por demanda real (conversaciones empresario→profesional, Flash sin autocontrato, leads). Con 8 señales al mes no da para decidir; mientras tanto NO se usa para quitar ni reordenar categorías.
- **Ningún oficio o categoría nueva sin ficha XDS** del XPEAK Book (Gate de confianza, problema y valor ≥4/5) que pruebe oferta y demanda.
- Interés sin oferta (clics o búsquedas sin resultado) = objetivo de captación, no de tarjeta.

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

## App iOS (Capacitor) — actualizar tras un fix en la web
La app de iOS es un build congelado (snapshot) del código en el momento de compilar. Un fix desplegado en xpeak.es NO llega solo al iPhone — hay que repetir este proceso:
1. `npm run build` (o asegurarse de que `dist/` está actualizado)
2. `npx cap sync ios` — copia el build web al proyecto iOS y sincroniza plugins
3. Subir el **Version** en `ios/App/App.xcodeproj` si es un cambio visible al usuario (Settings → General → Version), y siempre subir el **Build number** (aunque la Version no cambie)
4. `npx cap open ios` → seleccionar destino **"Any iOS Device (arm64)"** → **Product → Archive**
5. En el Organizer: **Distribute App → App Store Connect → Upload**
6. En App Store Connect (appstoreconnect.apple.com → XPEAK → Distribución): esperar a que el build termine de procesarse (10-60 min), añadirlo a la nueva versión, y **Añadir a revisión**
- Certificado de firma: **Apple Distribution**, perfil **"XPEAK App Store Distribution"** (ya generado, en `~/Library/MobileDevice/Provisioning Profiles/`) — si Xcode no lo reconoce, cerrar y reabrir Xcode
- Las actualizaciones (a diferencia del primer envío) suelen revisarse más rápido, pero cuentan con el mismo plazo de hasta 48h
- Bugs de la propia app nativa (permisos, push notifications, splash screen, comportamiento específico de Capacitor) no se arreglan solo con la web — requieren tocar `capacitor.config.ts` o el proyecto `ios/`

## Verificación obligatoria antes de dar un fix por cerrado
- Invocar la skill `verify-flows` tras tocar código de registro, directorio, carrito "Mi evento", perfil público o Flash Booking
- Un `tsc --noEmit` limpio NO es suficiente — reproducir la acción real (clic, rellenar, eliminar) en el navegador antes de decir "arreglado"

## Librerías pesadas — SIEMPRE import() dinámico, nunca estático
`npm run build` corre `scripts/check-bundle-size.mjs` y **falla si algún chunk supera 300 KB** sin estar en la allowlist del script. Motivo real (11 sep 2026): ExcelJS (938 KB) se importaba de forma estática en `EmpresarioView`/`ContractView` — se descargaba en cada visita al panel de organizador aunque nadie exportara nada, y el peso se fue acumulando semana a semana con cada función nueva de exportar. Al añadir cualquier librería pesada (PDF, Excel, gráficos, editor de texto enriquecido...):
- Importarla con `const { default: X } = await import('paquete')` **dentro de la función que la usa**, nunca en el top-level del archivo.
- Si el componente que la usa se abre casi siempre (settings, panel principal), el import dinámico debe estar en el `onClick`/handler, no solo dentro del componente lazy — un componente `lazy()` sigue descargando todo lo que importe en su top-level en cuanto se monta.
- Verificar tras el build: `node scripts/check-bundle-size.mjs` debe decir "OK". Si falla, el mensaje indica el chunk culpable.
