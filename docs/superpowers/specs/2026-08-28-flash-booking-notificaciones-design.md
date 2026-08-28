# Flash Booking: notificaciones push + campanita in-app

Fecha: 2026-08-28

## Problema

Cuando un empresario crea una solicitud de Flash Booking, el profesional
recibe un email (`booking_received`, funcionando correctamente vía
`FlashBookingRequestModal.tsx`). Un solo email puede no leerse a tiempo —
las ofertas Flash Booking son sensibles al tiempo (evento próximo, otros
profesionales pueden aceptar antes).

Además, `SettingsView.tsx` ya tiene un toggle "Notificaciones push" que
promete *"te avisaremos cuando lleguen mensajes o bookings"* y activa
permiso + Service Worker (`src/lib/pushNotifications.ts`, `public/sw.js`),
pero la promesa es falsa hoy: la suscripción del navegador solo se
`console.info`, nunca se guarda; no hay claves VAPID configuradas; no existe
ningún endpoint de servidor que envíe un push. El toggle enciende una
funcionalidad que no existe.

## Objetivo

1. Completar el pipeline de Web Push de extremo a extremo: guardar
   suscripciones, disparar push real desde el servidor.
2. Enganchar ese push a la creación de una solicitud Flash Booking, junto
   al email ya existente.
3. Añadir una campanita in-app en el topbar del dashboard como red de
   seguridad — visible sin pedir permisos, funciona igual en iOS sin PWA
   instalada (limitación conocida y aceptada de Web Push).

Fuera de alcance: historial de notificaciones leídas/no leídas, tabla
`notifications` genérica, notificaciones para eventos distintos a Flash
Booking (mensajes ya tiene su propio badge y no se toca).

## Diseño

### 1. Tabla `push_subscriptions`

```sql
create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);
create index on push_subscriptions(user_id);
```

RLS: el usuario solo puede insertar/leer/borrar sus propias filas
(`user_id = auth.uid()`). Sin policy de service_role explícita — la edge
function usa `SUPABASE_SERVICE_ROLE_KEY` y la bypassea, igual que ya hace
`send-email`.

`endpoint` es `unique`: si el navegador rota el endpoint (pasa
ocasionalmente), el `upsert` en el paso 2 lo reemplaza limpio sin
duplicados huérfanos.

### 2. Cliente: guardar la suscripción de verdad

En `src/lib/pushNotifications.ts`, dentro de `requestPushPermission()`,
tras `reg.pushManager.subscribe(...)`, sustituir el `console.info` por un
`upsert` a `push_subscriptions` vía el cliente Supabase ya usado en el
resto de la app (`src/integrations/supabase/client.ts`):

```ts
const subJson = sub.toJSON();
await supabase.from('push_subscriptions').upsert({
  user_id: user.id,
  endpoint: subJson.endpoint,
  p256dh: subJson.keys.p256dh,
  auth: subJson.keys.auth,
}, { onConflict: 'endpoint' });
```

Requiere el `user_id` de la sesión activa — `requestPushPermission()` pasa
a aceptar `userId: string` como parámetro (lo tiene quien la llama,
`SettingsView.tsx`, vía `useAuth`).

`revokePushPermission()` borra la fila por `endpoint` antes de
`sub.unsubscribe()`, para no dejar suscripciones muertas en la tabla.

### 3. Claves VAPID

Generadas una vez con la librería `web-push` (`npx web-push generate-vapid-keys`).
Pública en `VITE_VAPID_PUBLIC_KEY` (Vercel env, production + preview, ya es
el nombre que el código actual espera). Privada como secret de Supabase
Edge Functions (`supabase secrets set VAPID_PRIVATE_KEY=...`), nunca en el
bundle cliente.

### 4. Edge function `send-push`

Nueva función paralela a `send-email`, mismo patrón de auth/CORS e import
vía `esm.sh` (Deno, no npm — igual que `send-email` importa `denomailer` y
`@supabase/supabase-js` desde `https://esm.sh/...`):

```ts
import webpush from 'https://esm.sh/web-push@3';
webpush.setVapidDetails('mailto:info@xpeak.site', VAPID_PUBLIC, VAPID_PRIVATE);
```

Recibe:

```ts
{ user_id: string, title: string, body: string, url?: string, tag?: string }
```

Carga todas las filas de `push_subscriptions` para ese `user_id` (puede
haber más de un dispositivo), llama a `webpush.sendNotification(sub,
JSON.stringify(payload))` por cada una. Si una suscripción devuelve 404/410
(expirada), se borra de la tabla en el mismo request — limpieza
incremental sin cron aparte.

Fallos de push no deben bloquear ni afectar al flujo que la llama —incidencia
solo un `console.warn`, mismo patrón que ya usan los tres `supabase.functions.invoke('send-email', ...)`
en `FlashBookingRequestModal.tsx`.

### 5. Enganche en Flash Booking

En `FlashBookingRequestModal.tsx`, junto al bloque de `booking_received`
(líneas 76-80), añadir un cuarto `invoke`:

```ts
if (professionalUserId) {
  supabase.functions.invoke('send-push', {
    body: {
      user_id: professionalUserId,
      title: 'Nueva solicitud Flash Booking',
      body: `${form.name} quiere contratarte para el ${form.date}`,
      url: '/dashboard?view=flashbooking&tab=solicitudes',
    },
  }).catch((err: unknown) => console.warn('[FlashBooking] push failed:', err));
}
```

Va en paralelo al email, no lo sustituye — si el profesional no tiene
push activo, la función simplemente no encuentra suscripciones y no envía
nada (no es un error).

### 6. Campanita in-app (`NotificationBell`)

Nuevo componente en `DashboardTopbar.tsx`. Reusa los mismos conteos que ya
calcula `DashboardSidebar.tsx` (`flashBadge`, `msgBadge`) — se extrae esa
lógica de conteo a un hook compartido `useDashboardBadges()` para no
duplicar la query entre sidebar y campanita (ambos ya viven bajo
`src/hooks/` con el mismo patrón que `useTodaysRequestsCount`).

- Icono campana + badge numérico = `flashBadge + msgBadge`.
- Al hacer clic, dropdown simple con dos secciones ("Flash Booking
  pendientes", "Mensajes sin leer"), cada fila navega a la vista
  correspondiente vía `onViewChange`.
- Sin estado de leído/no leído propio — es un espejo en tiempo real de lo
  pendiente, igual que el badge del sidebar. Cuando el conteo baja (porque
  el usuario atendió la solicitud), la campanita baja sola.

### Testing

- `push_subscriptions`: probar RLS con dos usuarios distintos (uno no debe
  poder leer/borrar suscripciones del otro).
- `pushNotifications.ts`: test unitario del payload de `upsert` (mock del
  cliente Supabase), sin depender de un Service Worker real en jsdom.
- `send-push`: probar con suscripción válida (200), suscripción expirada
  (limpia la fila), y `user_id` sin suscripciones (no error, 0 envíos).
- Verificación manual con `verify-flows`: crear una solicitud Flash Booking
  real con un usuario de prueba con push activado, confirmar notificación
  del navegador.
- Campanita: `useDashboardBadges` ya cubierto indirectamente por los tests
  existentes de conteo si los hay; si no, test del hook con mocks de
  Supabase para flash_bookings pendientes + mensajes no leídos.
