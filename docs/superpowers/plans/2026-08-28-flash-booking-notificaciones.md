# Flash Booking: notificaciones push + campanita in-app — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completar el pipeline de Web Push (hoy solo cliente, sin servidor) y enganchar un push real + una campanita in-app a la creación de solicitudes Flash Booking.

**Architecture:** Tabla `push_subscriptions` con RLS por usuario → cliente guarda la suscripción real (hoy se descarta) → nueva edge function `send-push` (Deno + `web-push` vía esm.sh) → se invoca junto al email `booking_received` ya existente → campanita en el topbar reusa los mismos conteos que ya alimentan los badges del sidebar, vía un hook compartido nuevo.

**Tech Stack:** Vite + React + TypeScript, Supabase (Postgres + Edge Functions Deno + RLS), vitest + @testing-library/react, web-push (npm vía esm.sh).

**Spec:** `docs/superpowers/specs/2026-08-28-flash-booking-notificaciones-design.md`

## Global Constraints

- Respuestas del proyecto siempre en español (identificadores de código en inglés/español mixto, igual que el resto del repo).
- No crear archivos .md de documentación fuera de specs/plans salvo que se pida.
- CORS de toda edge function restringido a `https://xpeak.es` (`ALLOWED_ORIGIN`), igual que `send-email`.
- Ningún fallo de push debe romper el flujo que lo dispara — siempre `.catch(console.warn)`, nunca `await` bloqueante ni excepción propagada.
- Clave privada VAPID nunca en el bundle cliente ni en `VITE_*` — solo como secret de Supabase Edge Functions.
- `npx tsc --noEmit` limpio no es suficiente para dar una tarea de UI por cerrada — verificar con `verify-flows` (Chrome DevTools MCP) cuando la tarea toca código de Flash Booking o el dashboard, según CLAUDE.md del proyecto.
- Un solo `vercel --prod --force --yes` al final de todo el plan, no uno por tarea (regla del proyecto: no desplegar más de una vez por sesión salvo emergencia).

---

## Task 1: Migración `push_subscriptions` + RLS

**Files:**
- Create: `supabase/migrations/20260828_push_subscriptions.sql`
- Test: verificación manual vía Supabase SQL editor (no hay test runner de SQL en este repo — el resto de migraciones tampoco lo tiene)

**Interfaces:**
- Produces: tabla `public.push_subscriptions(id uuid, user_id uuid, endpoint text unique, p256dh text, auth text, created_at timestamptz)`, consumida por Task 2 (insert desde cliente) y Task 4 (select/delete desde edge function con service role).

- [ ] **Step 1: Escribir la migración**

```sql
-- Web Push: guarda la suscripción del navegador de cada usuario para que
-- el servidor pueda enviar notificaciones reales (edge function send-push).
-- Antes de esta tabla, pushNotifications.ts obtenía la suscripción del
-- navegador pero solo la logueaba a consola — el toggle "Notificaciones
-- push" de SettingsView prometía avisos de Flash Booking que nunca se
-- enviaban porque no había dónde guardar el endpoint.
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx
  on public.push_subscriptions(user_id);

alter table public.push_subscriptions enable row level security;

create policy "Users manage their own push subscriptions"
  on public.push_subscriptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

- [ ] **Step 2: Aplicar la migración en Supabase**

Run: `supabase db push` (o pegar el SQL en el SQL editor del proyecto `ddrqhwravupjzysriblq` si `db push` no está enlazado en esta máquina)
Expected: tabla `push_subscriptions` visible en el schema `public`, RLS activo (verificar con `select * from pg_policies where tablename = 'push_subscriptions';` → debe devolver 1 fila).

- [ ] **Step 3: Verificar aislamiento RLS con dos usuarios**

En el SQL editor, como usuario A (`set role authenticated; set request.jwt.claims.sub = '<uuid-a>';` o vía el propio dashboard de Supabase con dos sesiones):
1. Insertar una fila con `user_id = <uuid-a>` → debe funcionar.
2. Intentar `select * from push_subscriptions where user_id = '<uuid-b>'` → debe devolver 0 filas (no error, simplemente vacío por RLS).

Expected: un usuario nunca ve ni puede borrar filas de otro.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260828_push_subscriptions.sql
git commit -m "feat: tabla push_subscriptions con RLS para Web Push real"
```

---

## Task 2: Cliente guarda la suscripción de verdad

**Files:**
- Modify: `src/lib/pushNotifications.ts`
- Modify: `src/components/dashboard/views/SettingsView.tsx` (pasar `user.id` a `requestPushPermission`)
- Test: `src/lib/pushNotifications.test.ts` (nuevo)

**Interfaces:**
- Consumes: cliente Supabase de `src/integrations/supabase/client.ts` (`import { supabase } from '@/integrations/supabase/client'`), tabla `push_subscriptions` de Task 1.
- Produces: `requestPushPermission(userId: string): Promise<boolean>` (firma cambiada — antes no tenía parámetros), consumida por `SettingsView.tsx`.

- [ ] **Step 1: Escribir el test que falla**

```ts
// src/lib/pushNotifications.test.ts
import { describe, expect, it, vi, beforeEach } from 'vitest';

const upsertMock = vi.fn().mockResolvedValue({ error: null });
const fromMock = vi.fn(() => ({ upsert: upsertMock }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: fromMock },
}));

// Stub mínimo de un PushSubscription real: toJSON() es lo único que
// pushNotifications.ts necesita leer.
const fakeSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
  toJSON: () => ({
    endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
    keys: { p256dh: 'fake-p256dh', auth: 'fake-auth' },
  }),
};

beforeEach(() => {
  upsertMock.mockClear();
  fromMock.mockClear();
  vi.stubGlobal('Notification', {
    requestPermission: vi.fn().mockResolvedValue('granted'),
    permission: 'granted',
  });
  vi.stubGlobal('navigator', {
    serviceWorker: {
      getRegistration: vi.fn().mockResolvedValue(null),
      register: vi.fn().mockResolvedValue({
        pushManager: { subscribe: vi.fn().mockResolvedValue(fakeSubscription) },
      }),
      ready: Promise.resolve(),
    },
  });
  vi.stubEnv('VITE_VAPID_PUBLIC_KEY', 'ZmFrZS12YXBpZC1rZXk'); // base64url válido, contenido irrelevante
});

describe('requestPushPermission', () => {
  it('guarda endpoint y claves de la suscripción real en push_subscriptions', async () => {
    const { requestPushPermission } = await import('./pushNotifications');
    const ok = await requestPushPermission('user-123');

    expect(ok).toBe(true);
    expect(fromMock).toHaveBeenCalledWith('push_subscriptions');
    expect(upsertMock).toHaveBeenCalledWith(
      {
        user_id: 'user-123',
        endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
        p256dh: 'fake-p256dh',
        auth: 'fake-auth',
      },
      { onConflict: 'endpoint' },
    );
  });
});
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `npx vitest run src/lib/pushNotifications.test.ts`
Expected: FAIL — hoy `requestPushPermission` no acepta `userId` ni llama a `supabase.from`, solo hace `console.info`.

- [ ] **Step 3: Implementar el guardado real**

En `src/lib/pushNotifications.ts`, añadir el import y modificar `requestPushPermission`:

```ts
import { supabase } from '@/integrations/supabase/client';
```

```ts
/** Solicita permiso y suscribe al push. Devuelve true si ok. */
export async function requestPushPermission(userId: string): Promise<boolean> {
  if (!('Notification' in window)) return false;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return false;

  // SW + VAPID opcionales — si fallan seguimos con notificaciones locales
  try {
    const reg = await getRegistration();
    if (reg) {
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (vapidKey) {
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });
        const subJson = sub.toJSON();
        await supabase.from('push_subscriptions').upsert({
          user_id: userId,
          endpoint: subJson.endpoint,
          p256dh: subJson.keys!.p256dh!,
          auth: subJson.keys!.auth!,
        }, { onConflict: 'endpoint' });
      }
    }
  } catch {
    // Sin VAPID todavía, o fallo de red — notificaciones locales disponibles
  }

  localStorage.setItem(STORAGE_KEY, 'true');
  return true;
}
```

- [ ] **Step 4: Ejecutar el test y verificar que pasa**

Run: `npx vitest run src/lib/pushNotifications.test.ts`
Expected: PASS

- [ ] **Step 5: Actualizar `revokePushPermission` para borrar la fila**

```ts
/** Revoca el permiso / desactiva suscripción */
export async function revokePushPermission(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
  const reg = await getRegistration();
  if (!reg) return;
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
    await sub.unsubscribe();
  }
}
```

Añadir test correspondiente en el mismo archivo:

```ts
describe('revokePushPermission', () => {
  it('borra la fila por endpoint antes de desuscribir', async () => {
    const deleteEqMock = vi.fn().mockResolvedValue({ error: null });
    const unsubscribeMock = vi.fn().mockResolvedValue(true);
    fromMock.mockReturnValueOnce({ upsert: upsertMock } as any)
      .mockReturnValueOnce({ delete: () => ({ eq: deleteEqMock }) } as any);
    vi.stubGlobal('navigator', {
      serviceWorker: {
        getRegistration: vi.fn().mockResolvedValue({
          pushManager: {
            getSubscription: vi.fn().mockResolvedValue({
              endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
              unsubscribe: unsubscribeMock,
            }),
          },
        }),
      },
    });

    const { revokePushPermission } = await import('./pushNotifications');
    await revokePushPermission();

    expect(deleteEqMock).toHaveBeenCalledWith('endpoint', 'https://fcm.googleapis.com/fcm/send/abc123');
    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
```

Run: `npx vitest run src/lib/pushNotifications.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 6: Actualizar el único caller — `SettingsView.tsx`**

En `src/components/dashboard/views/SettingsView.tsx`, línea 732, cambiar:

```ts
const ok = await requestPushPermission();
```

por:

```ts
if (!user) return;
const ok = await requestPushPermission(user.id);
```

- [ ] **Step 7: Type check**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 8: Commit**

```bash
git add src/lib/pushNotifications.ts src/lib/pushNotifications.test.ts src/components/dashboard/views/SettingsView.tsx
git commit -m "feat: guardar suscripción push real en Supabase (antes solo console.info)"
```

---

## Task 3: Claves VAPID

**Files:**
- No hay archivo de código — configuración de entorno.

**Interfaces:**
- Produces: `VITE_VAPID_PUBLIC_KEY` (Vercel env, production + preview) y `VAPID_PRIVATE_KEY` (Supabase Edge Functions secret), consumidos por Task 2 (ya integrado) y Task 4.

- [ ] **Step 1: Generar el par de claves**

Run: `npx web-push generate-vapid-keys`
Expected: output con `Public Key:` y `Private Key:` (cadenas base64url).

- [ ] **Step 2: Configurar la pública en Vercel**

Run: `vercel env add VITE_VAPID_PUBLIC_KEY production` (pegar el valor cuando lo pida), repetir con `preview`.
Expected: `vercel env ls` muestra `VITE_VAPID_PUBLIC_KEY` en ambos entornos.

- [ ] **Step 3: Configurar la privada como secret de Supabase**

Run: `supabase secrets set VAPID_PRIVATE_KEY=<valor-generado>` (proyecto `ddrqhwravupjzysriblq`)
Expected: `supabase secrets list` muestra `VAPID_PRIVATE_KEY` (el valor no se lista, solo el nombre).

- [ ] **Step 4: Confirmar que no hay commit accidental de la clave privada**

Run: `git grep -n "VAPID_PRIVATE_KEY" -- '*.ts' '*.tsx' '*.env*'`
Expected: 0 resultados con un valor real — solo referencias a `Deno.env.get('VAPID_PRIVATE_KEY')` en código (Task 4), nunca el valor en sí.

No hay commit en esta tarea — es configuración de entorno pura, nada que versionar.

---

## Task 4: Edge function `send-push`

**Files:**
- Create: `supabase/functions/send-push/index.ts`

**Interfaces:**
- Consumes: tabla `push_subscriptions` (Task 1), secrets `VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY` (Task 3 — nota: la función también necesita la pública como secret propio, ver Step 1), `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` (ya existen como secrets del proyecto, usados por `send-email`).
- Produces: endpoint HTTP invocable como `supabase.functions.invoke('send-push', { body: { user_id, title, body, url?, tag? } })`, consumido por Task 5.

- [ ] **Step 1: Añadir la pública también como secret de la función**

La función necesita `VAPID_PUBLIC_KEY` además de la privada (la librería `web-push` exige ambas en `setVapidDetails`). Es la misma cadena que `VITE_VAPID_PUBLIC_KEY` de Task 3.

Run: `supabase secrets set VAPID_PUBLIC_KEY=<mismo-valor-que-VITE_VAPID_PUBLIC_KEY>`

- [ ] **Step 2: Escribir la función**

```ts
// supabase/functions/send-push/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import webpush from 'https://esm.sh/web-push@3';

const ALLOWED_ORIGIN = 'https://xpeak.es';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushPayload {
  user_id: string;
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { user_id, title, body, url, tag } = (await req.json()) as PushPayload;
    if (!user_id || !title || !body) {
      return new Response(JSON.stringify({ error: 'Missing user_id, title or body' }), { status: 400, headers: corsHeaders });
    }

    const vapidPublic = Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidPrivate = Deno.env.get('VAPID_PRIVATE_KEY');
    if (!vapidPublic || !vapidPrivate) {
      return new Response(JSON.stringify({ error: 'VAPID not configured' }), { status: 500, headers: corsHeaders });
    }
    webpush.setVapidDetails('mailto:info@xpeak.site', vapidPublic, vapidPrivate);

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: subs, error: subsError } = await adminClient
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .eq('user_id', user_id);

    if (subsError) {
      return new Response(JSON.stringify({ error: subsError.message }), { status: 500, headers: corsHeaders });
    }
    if (!subs || subs.length === 0) {
      // No es un error: el usuario simplemente no tiene push activado.
      return new Response(JSON.stringify({ sent: 0 }), { status: 200, headers: corsHeaders });
    }

    const payload = JSON.stringify({ title, body, url, tag });
    let sent = 0;

    await Promise.all(subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
        );
        sent++;
      } catch (err: any) {
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          // Suscripción expirada/revocada por el navegador — limpieza incremental.
          await adminClient.from('push_subscriptions').delete().eq('id', sub.id);
        }
      }
    }));

    return new Response(JSON.stringify({ sent }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});
```

- [ ] **Step 3: Desplegar la función a Supabase**

Run: `supabase functions deploy send-push`
Expected: `Deployed Function send-push` en el output.

- [ ] **Step 4: Verificar caso "sin suscripciones" (no debe dar error)**

Run:
```bash
curl -sS -X POST 'https://ddrqhwravupjzysriblq.supabase.co/functions/v1/send-push' \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"00000000-0000-0000-0000-000000000000","title":"Test","body":"Test body"}'
```
Expected: `{"sent":0}` con status 200.

- [ ] **Step 5: Verificar caso con suscripción real**

Requiere un `user_id` con fila en `push_subscriptions` (creada activando el toggle de Task 2 en un navegador real, con VAPID ya configurado). Repetir el `curl` con ese `user_id`.
Expected: `{"sent":1}` y una notificación real llega al navegador que activó el push.

- [ ] **Step 6: Commit**

```bash
git add supabase/functions/send-push/index.ts
git commit -m "feat: edge function send-push (Web Push real vía VAPID)"
```

---

## Task 5: Enganche en Flash Booking

**Files:**
- Modify: `src/components/dashboard/FlashBookingRequestModal.tsx:76-80`

**Interfaces:**
- Consumes: edge function `send-push` de Task 4, variable `professionalUserId` y `form` ya presentes en el componente (líneas 61, 40-59).

- [ ] **Step 1: Añadir el invoke junto al bloque de `booking_received`**

En `src/components/dashboard/FlashBookingRequestModal.tsx`, tras el bloque existente (líneas 75-80):

```ts
    // Notificación al profesional
    if (professionalUserId) {
      supabase.functions.invoke('send-email', {
        body: { type: 'booking_received', data: { ...payload, professional_user_id: professionalUserId } },
      }).catch((err: unknown) => console.warn('[FlashBooking] professional email failed:', err));

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

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Verificación manual con `verify-flows`**

Invocar la skill `verify-flows` (Chrome DevTools MCP) reproduciendo el flujo real: crear una solicitud Flash Booking desde un perfil de prueba con `professionalUserId` válido. Confirmar en el Network tab que se dispara la llamada a `send-push` junto a `send-email`, y que no rompe el `toast.success` existente ni el cierre del modal.

Expected: la solicitud se crea igual que antes (comportamiento visible sin cambios), más una llamada de red adicional a `send-push` que no bloquea ni retrasa el flujo (es fire-and-forget, igual que los emails).

- [ ] **Step 4: Commit**

```bash
git add src/components/dashboard/FlashBookingRequestModal.tsx
git commit -m "feat: disparar push real al crear una solicitud Flash Booking"
```

---

## Task 6: Hook compartido `useDashboardBadges`

**Files:**
- Create: `src/hooks/useDashboardBadges.ts`
- Modify: `src/components/dashboard/DashboardSidebar.tsx:237-309` (sustituir por el hook)
- Test: `src/hooks/useDashboardBadges.test.ts` (nuevo)

**Interfaces:**
- Produces: `useDashboardBadges(userId: string | undefined, isEmpresario: boolean): { flashBadge: number; msgBadge: number }`, consumido por `DashboardSidebar.tsx` (Step 3) y por `NotificationBell` (Task 7).

Lógica real ya leída en el código (`DashboardSidebar.tsx:237-309`), no inventada:
- `flashBadge`: `count('exact', head: true)` sobre `flash_bookings` filtrando `professional_user_id = uid` y `status = 'pending'`. Se salta por completo si `isEmpresario` (los empresarios no tienen badge de Flash Booking).
- `msgBadge`: dos pasos — primero `conversations` filtrando `participant_a.eq.uid OR participant_b.eq.uid` (máx 30), luego `messages` con `count('exact', head: true)` filtrando `conversation_id IN (ids)`, `sender_id != uid`, `read = false`. Si no hay conversaciones, `msgBadge = 0` sin la segunda query.
- Ambos badges se refrescan también vía Supabase Realtime: canal `sidebar_flash_bookings` (INSERT/UPDATE en `flash_bookings` filtrado por `professional_user_id`) y canal `sidebar_msgs` (INSERT/UPDATE en `messages`, sin filtro server-side — el filtro real ocurre al releer `refreshMsgBadge`).

- [ ] **Step 1: Escribir el test que falla**

```ts
// src/hooks/useDashboardBadges.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const channelMock = { on: vi.fn().mockReturnThis(), subscribe: vi.fn().mockReturnThis() };

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === 'flash_bookings') {
        return { select: () => ({ eq: () => ({ eq: () => Promise.resolve({ count: 3 }) }) }) };
      }
      if (table === 'conversations') {
        return { select: () => ({ or: () => ({ limit: () => Promise.resolve({ data: [{ id: 'c1' }, { id: 'c2' }] }) }) }) };
      }
      if (table === 'messages') {
        return { select: () => ({ in: () => ({ neq: () => ({ eq: () => Promise.resolve({ count: 5 }) }) }) }) };
      }
      throw new Error(`unexpected table: ${table}`);
    }),
    channel: vi.fn(() => channelMock),
    removeChannel: vi.fn(),
  },
}));

describe('useDashboardBadges', () => {
  beforeEach(() => { channelMock.on.mockClear(); channelMock.subscribe.mockClear(); });

  it('devuelve flashBadge y msgBadge para un profesional', async () => {
    const { useDashboardBadges } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges('user-123', false));

    await waitFor(() => expect(result.current.flashBadge).toBe(3));
    await waitFor(() => expect(result.current.msgBadge).toBe(5));
  });

  it('no consulta flash_bookings cuando isEmpresario es true', async () => {
    const { useDashboardBadges } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges('user-123', true));

    await waitFor(() => expect(result.current.msgBadge).toBe(5));
    expect(result.current.flashBadge).toBe(0);
  });

  it('devuelve 0 sin userId, sin lanzar', async () => {
    const { useDashboardBadges } = await import('./useDashboardBadges');
    const { result } = renderHook(() => useDashboardBadges(undefined, false));
    expect(result.current).toEqual({ flashBadge: 0, msgBadge: 0 });
  });
});
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `npx vitest run src/hooks/useDashboardBadges.test.ts`
Expected: FAIL — el hook no existe todavía.

- [ ] **Step 3: Extraer el hook moviendo la lógica exacta del sidebar**

Crear `src/hooks/useDashboardBadges.ts`:

```ts
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useDashboardBadges(userId: string | undefined, isEmpresario: boolean) {
  const [flashBadge, setFlashBadge] = useState(0);
  const [msgBadge, setMsgBadge] = useState(0);

  const refreshFlashBadge = async (uid: string) => {
    const { count } = await supabase.from('flash_bookings' as any)
      .select('id', { count: 'exact', head: true })
      .eq('professional_user_id', uid)
      .eq('status', 'pending');
    setFlashBadge(count ?? 0);
  };

  useEffect(() => {
    if (!userId || isEmpresario) return;
    refreshFlashBadge(userId);
    const channel = supabase
      .channel('sidebar_flash_bookings')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'flash_bookings', filter: `professional_user_id=eq.${userId}` }, () => {
        refreshFlashBadge(userId);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'flash_bookings', filter: `professional_user_id=eq.${userId}` }, () => {
        refreshFlashBadge(userId);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId, isEmpresario]);

  const refreshMsgBadge = async (uid: string) => {
    const { data } = await supabase.from('conversations')
      .select('id')
      .or(`participant_a.eq.${uid},participant_b.eq.${uid}`)
      .limit(30);
    if (!data || data.length === 0) { setMsgBadge(0); return; }
    const ids = data.map((c: { id: string }) => c.id);
    const { count } = await supabase.from('messages')
      .select('id', { count: 'exact', head: true })
      .in('conversation_id', ids)
      .neq('sender_id', uid)
      .eq('read', false);
    setMsgBadge(count ?? 0);
  };

  useEffect(() => {
    if (!userId) return;
    refreshMsgBadge(userId);
    const channel = supabase
      .channel('badges_msgs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        refreshMsgBadge(userId);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, () => {
        refreshMsgBadge(userId);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  return { flashBadge, msgBadge };
}
```

Nota: el canal se renombra de `sidebar_msgs` a `badges_msgs` porque ahora lo comparten sidebar y campanita — dos suscripciones activas al mismo nombre de canal Supabase Realtime en el mismo cliente son redundantes pero no rompen nada; el rename es solo higiene, no funcional.

- [ ] **Step 4: Ejecutar el test y verificar que pasa**

Run: `npx vitest run src/hooks/useDashboardBadges.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Sustituir el bloque en `DashboardSidebar.tsx`**

Borrar líneas 237-238 (`useState` de `flashBadge`/`msgBadge`) y 258-309 (`refreshFlashBadge`, ambos `useEffect`, `refreshMsgBadge`), sustituir por:

```ts
const { flashBadge, msgBadge } = useDashboardBadges(user?.id, isEmpresario);
```

Añadir el import: `import { useDashboardBadges } from '@/hooks/useDashboardBadges';`

- [ ] **Step 6: Type check**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 7: Verificación manual — el sidebar no debe cambiar de comportamiento**

Invocar `verify-flows`: cargar el dashboard con un usuario que tenga al menos una solicitud Flash Booking pendiente, confirmar que el badge del sidebar muestra el mismo número que antes de la extracción, y que sigue actualizándose en vivo (crear una solicitud nueva desde otra pestaña/cuenta y ver si el número sube sin recargar).

- [ ] **Step 8: Commit**

```bash
git add src/hooks/useDashboardBadges.ts src/hooks/useDashboardBadges.test.ts src/components/dashboard/DashboardSidebar.tsx
git commit -m "refactor: extraer useDashboardBadges del sidebar para reusar en la campanita"
```

---

## Task 7: Campanita in-app (`NotificationBell`)

**Files:**
- Create: `src/components/dashboard/NotificationBell.tsx`
- Modify: `src/components/dashboard/DashboardTopbar.tsx`

**Interfaces:**
- Consumes: `useDashboardBadges(userId: string | undefined, isEmpresario: boolean)` de Task 6 — misma firma de dos argumentos, `NotificationBell` no puede llamarlo con uno solo.
- Produces: componente `<NotificationBell userId={string | undefined} isEmpresario={boolean} onViewChange={(view: string) => void} />`, montado en `DashboardTopbar.tsx`.

- [ ] **Step 1: Leer `DashboardTopbar.tsx` para conocer sus props reales**

Antes de escribir el componente, leer `src/components/dashboard/DashboardTopbar.tsx` completo para saber qué prop lleva ya `onViewChange` (o equivalente) y el `userId`/`currentUser`/`isEmpresario` disponibles ahí, y encajar `NotificationBell` con las mismas.

- [ ] **Step 2: Escribir el componente**

```tsx
// src/components/dashboard/NotificationBell.tsx
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useDashboardBadges } from '@/hooks/useDashboardBadges';

interface NotificationBellProps {
  userId: string | undefined;
  isEmpresario: boolean;
  onViewChange: (view: string) => void;
}

export default function NotificationBell({ userId, isEmpresario, onViewChange }: NotificationBellProps) {
  const { flashBadge, msgBadge } = useDashboardBadges(userId, isEmpresario);
  const [open, setOpen] = useState(false);
  const total = flashBadge + msgBadge;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Notificaciones${total > 0 ? ` (${total} pendientes)` : ''}`}
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center justify-center rounded-full p-2 hover:bg-black/5 transition-colors"
      >
        <Bell size={18} />
        {total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#D4AF37] text-[10px] font-bold text-black">
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border bg-white shadow-lg z-50 overflow-hidden">
          {flashBadge > 0 && (
            <button
              type="button"
              onClick={() => { onViewChange('flashbooking'); setOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm hover:bg-black/5 transition-colors border-b"
            >
              <span>Flash Booking pendientes</span>
              <span className="font-bold text-[#D4AF37]">{flashBadge}</span>
            </button>
          )}
          {msgBadge > 0 && (
            <button
              type="button"
              onClick={() => { onViewChange('messages'); setOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm hover:bg-black/5 transition-colors"
            >
              <span>Mensajes sin leer</span>
              <span className="font-bold text-blue-600">{msgBadge}</span>
            </button>
          )}
          {total === 0 && (
            <p className="px-4 py-3 text-sm text-muted-foreground">Sin novedades por ahora.</p>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Montarlo en `DashboardTopbar.tsx`**

Añadir el import y el componente en la posición del topbar donde ya viven otros iconos de acción (junto a avatar/menú de usuario — confirmar la posición real leyendo el archivo del Step 1), pasando las mismas props (`userId`, `isEmpresario`, `onViewChange`) que el sidebar ya recibe desde `Dashboard.tsx` (`isEmpresario` se calcula en `DashboardSidebar.tsx:236` como `role === 'empresario'` — replicar el mismo cálculo en `Dashboard.tsx` o `DashboardTopbar.tsx` si el rol ya está disponible ahí, no una fuente nueva). Si `DashboardTopbar` no recibe hoy `onViewChange`, añadirlo como prop nueva propagada desde `Dashboard.tsx` igual que ya se hace con `DashboardSidebarInner`.

- [ ] **Step 4: Type check**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 5: Verificación visual con `verify-flows` — desktop y móvil (390px)**

Invocar `verify-flows`: cargar el dashboard, confirmar que la campanita aparece en el topbar, que el badge numérico coincide con el del sidebar, que el dropdown abre/cierra con clic, y que cada fila navega a la vista correcta. Repetir a 390px de viewport (el proyecto ya tiene el hábito de auditar ese ancho) para confirmar que el dropdown no se corta ni desborda la pantalla.

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/NotificationBell.tsx src/components/dashboard/DashboardTopbar.tsx
git commit -m "feat: campanita in-app en el topbar (red de seguridad sin permisos de push)"
```

---

## Task 8: Suite completa + deploy único

**Files:** ninguno nuevo — solo verificación y despliegue.

- [ ] **Step 1: Ejecutar toda la suite de tests**

Run: `npx vitest run`
Expected: todos los tests nuevos de este plan en verde. Si `useRecentBusinessView.test.ts` sigue con sus 2 fallos preexistentes (no relacionados con este plan, confirmados ya en la sesión anterior), no bloquea — pero confirmar que el conteo de fallos no ha subido respecto a antes de este plan.

- [ ] **Step 2: Type check completo**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Build de producción**

Run: `npm run build`
Expected: build completa sin errores (incluye prerender y sitemap, según los scripts del proyecto).

- [ ] **Step 4: Deploy único a producción**

Run: `vercel --prod --force --yes 2>&1 | tail -15`
Expected: `Deployment ... ready.`

- [ ] **Step 5: Verificación end-to-end en producción**

Con un usuario de prueba real en xpeak.es: activar el toggle de notificaciones en Ajustes, confirmar que aparece la fila en `push_subscriptions` (Supabase dashboard), crear una solicitud Flash Booking hacia ese profesional desde otra cuenta, confirmar que llega tanto el email como la notificación push del navegador, y que la campanita del topbar sube su contador.
