# Internacionalización ES/EN de la app XPEAK

> **Estado: APARCADA (6 oct 2026).** Los datos de los últimos 90 días no justifican el proyecto. En GA4 hay 17 de 362 usuarios con el navegador en inglés (4,7%), 18 sesiones y 0 conversiones, casi todo rebotes. En Supabase hay 0 mensajes y 0 solicitudes en inglés. No pasa el gate XDS. Mientras tanto se usa la traducción automática del navegador, que funciona porque la web declara `lang="es"` y no bloquea la traducción. Se reabre si llegan conversaciones o solicitudes reales en inglés, o si el tráfico en inglés pasa del ~10% con alguna conversión.

## Contexto y motivación

Hay demanda real de usuarios angloparlantes (zonas turísticas, eventos internacionales) que hoy encuentran toda la app en español sin alternativa. El objetivo es añadir un selector ENG/ESP que traduzca la **aplicación** (todo lo que no es el blog SEO público, que se queda en español).

El proyecto no tiene ninguna infraestructura de i18n hoy: 368 páginas, texto 100% hardcodeado en español directamente en JSX.

## Alcance

**Dentro de esta fase:**
- Auth (login/registro)
- Dashboard completo: las 46 vistas existentes en `src/components/dashboard/views/`, sidebar, navegación, notificaciones in-app, toasts
- Landing pública (`src/pages/Landing.tsx`)
- Perfil público de profesional (`/p/:slug`, `PublicProfile.tsx`)
- Categorías/oficios (catálogo fijo: "DJ", "Camarero", "Fotógrafo"...) — son datos controlados por XPEAK, se tratan como interfaz, no como contenido de usuario
- Contenido escrito por profesionales en su propio perfil (biografía, descripción de servicios) — traducido automáticamente vía API, bajo demanda, con caché

**Fuera de esta fase (explícitamente):**
- Las 350+ páginas de blog SEO (`src/pages/Blog*.tsx`) — se quedan solo en español
- Emails transaccionales (`supabase/functions/send-email`) — no se tocan en esta fase; es un sistema de plantillas HTML server-side independiente del frontend, candidato a una fase futura
- Notificaciones push (`send-push`) — mismo motivo, fuera de alcance
- Metadatos SEO (title/description/OG) de cualquier página — se quedan en español; el `lang="es"` del `<html>` y el `hreflang` no cambian en esta fase

## Arquitectura

Dos sistemas separados, porque resuelven problemas distintos:

### 1. Interfaz estática → `react-i18next`

- Nueva dependencia: `react-i18next` + `i18next` + `i18next-browser-languagedetector`.
- Archivos de traducción: `src/locales/es/common.json` y `src/locales/en/common.json` (estructura por namespace si crece: `auth.json`, `dashboard.json`, etc., para no tener un único archivo gigante).
- Cada componente migra de texto hardcodeado a `t('clave.anidada')` vía el hook `useTranslation()`.
- Detección inicial: `i18next-browser-languagedetector` lee `navigator.language`; si empieza por `en`, arranca en inglés, si no, español. Guarda la elección explícita del usuario en `localStorage` (clave `xpeak_lang`), que tiene prioridad sobre la detección en visitas siguientes.
- El selector ENG/ESP (ver sección Componente) llama a `i18n.changeLanguage()` y persiste en `localStorage`.
- Para usuarios con sesión: la preferencia de idioma también se guarda en `profiles.ui_language` (nueva columna, migración aparte) para que persista entre dispositivos — `localStorage` es el fallback inmediato y la fuente de verdad en el primer render antes de que cargue el perfil.

### 2. Contenido generado por el profesional → traducción automática con caché

Biografías y descripciones de servicio son texto libre escrito por cada profesional — no se puede tener un archivo de traducción estático para esto.

- Nueva tabla `content_translations` (migración): `source_table text, source_id uuid, source_field text, lang text, translated_text text, source_hash text, created_at timestamptz`, clave única `(source_table, source_id, source_field, lang)`.
- Nueva edge function `translate-content`: recibe `{table, id, field, text, lang}`, calcula `source_hash` (hash del texto original), busca en caché por esa clave; si no existe o el hash cambió (el profesional editó su bio), llama a una API de traducción (DeepL API, por calidad superior a Google Translate en pares ES/EN) y guarda el resultado.
- El frontend, al pintar una bio en modo inglés, llama a esta función (o lee directamente de `content_translations` si ya existe vía una vista/join) en vez de mostrar el texto crudo.
- Traducción bajo demanda (lazy) y cacheada — nunca se traduce en el momento de guardar el perfil, solo la primera vez que alguien lo pide en inglés. Evita gastar cuota de API en perfiles que nadie visita en inglés.
- Requiere una `DEEPL_API_KEY` (o equivalente) como secret nuevo en Supabase — pendiente de decidir proveedor y coste con el usuario antes de implementar esta parte.

## Componente: selector ENG/ESP

- Botón/toggle visible en: navbar de Landing, navbar de Auth, topbar del Dashboard (`DashboardTopbar.tsx`) y footer del perfil público.
- Mismo patrón visual en los 4 sitios: texto corto "ES" / "EN", el actual resaltado, clic cambia inmediatamente sin recargar la página (todo el árbol re-renderiza vía el context de `react-i18next`).
- Reutilizar un único componente `LanguageSwitcher.tsx`, no reimplementarlo cada vez.

## Fases de entrega (dentro de este proyecto, no fases separadas de aprobación)

1. **Fundación**: instalar dependencias, estructura de carpetas `locales/`, `LanguageSwitcher.tsx`, detección + persistencia, columna `profiles.ui_language`.
2. **Auth + Landing**: las dos superficies de mayor demanda inmediata (puerta de entrada para alguien angloparlante nuevo). Extraer y traducir todos los strings de `Auth.tsx` y `Landing.tsx`.
3. **Dashboard**: las 46 vistas, sidebar, topbar, notificaciones in-app. El bloque más grande — candidato a dividir en sub-tareas por grupo de vistas (perfil propio, Flash Booking, mensajes, ajustes, admin...) dentro del plan de implementación.
4. **Perfil público + contenido de usuario**: `PublicProfile.tsx` traducido vía i18n para la interfaz alrededor, más el sistema de `content_translations`/`translate-content` para la bio del profesional.

## Requisito previo: Ficha XDS

Es funcionalidad nueva, así que según la regla del proyecto (CLAUDE.md) necesita una Ficha XDS aprobada antes de escribir código: gate de Confianza, Problema real y Valor de usuario ≥4, matriz completa y evidencias. La "demanda real de angloparlantes" tiene que quedar respaldada con datos (idioma de navegador en GA4, leads o conversaciones en inglés, ubicación de los organizadores), no solo con la intuición.

## Decisiones pendientes antes de implementar

- Proveedor de traducción automática (DeepL vs. Google Translate API vs. otro) y su coste — a decidir con el usuario antes de la fase 4.
- Si el Dashboard se traduce de golpe o vista por vista en despliegues incrementales (recomendado: incremental, dado el tamaño).

## Testing

- Cada componente migrado a `t()` se verifica visualmente en ambos idiomas (capturas o `verify-flows` si toca un flujo crítico ya cubierto).
- Verificar que cambiar idioma con sesión activa persiste tras recargar y en otro dispositivo (columna `profiles.ui_language`).
- Verificar que el blog NUNCA cambia de idioma aunque el selector esté en EN (es contenido fuera de alcance, debe quedarse en español siempre).
