# Señal de escasez, insight de mercado y calendario interactivo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir 3 features de retención pre-monetización en XPEAK: (1) señal de escasez para ambos roles, (2) insight de posición de tarifa de mercado para el profesional, (3) calendario de disponibilidad interactivo con solicitud directa de Flash Booking — todo sobre datos y componentes ya existentes, sin tabla nueva.

**Architecture:** Cuatro tareas independientes y desplegables por separado. La primera rediseña visualmente `AvailabilityCalendar.tsx` (base para las demás). Las tareas 2 y 3 son tarjetas de solo lectura nuevas en `StatsView.tsx`, cada una con su propio hook de datos. La tarea 4 hace interactivo el calendario en la ficha pública y conecta con el modal de Flash Booking ya existente.

**Tech Stack:** React 18 + TypeScript, Supabase (postgres + RLS), Tailwind CSS, Vitest + Testing Library, lucide-react (sin iconos decorativos nuevos por directriz del proyecto).

**Spec:** `docs/superpowers/specs/2026-09-17-monetizacion-retorno-design.md`

## Global Constraints

- Responder siempre en español — todo copy nuevo va en español.
- Sin emojis ni iconos decorativos nuevos (regla vigente del proyecto: `feedback_sin_emojis_decorativos`).
- No usar cifras inventadas: si no hay datos suficientes, ocultar el bloque en vez de mostrar un placeholder o un cero alarmante.
- No exponer identidad de quién vio/contactó — solo agregados.
- Insight de mercado: umbral mínimo de 5 perfiles comparables (`hourly_rate > 0`, agrupado por `category` + `zone`, excluyendo el propio usuario y perfiles demo/`@xpeak.es`). Por debajo del umbral, no se muestra nada.
- Calendario: sin auto-confirmación de reservas — el profesional sigue aprobando manualmente en `SolicitudesTab`, como hoy.
- Librerías pesadas siempre con `import()` dinámico dentro del handler que las usa (no aplica en este plan — no se introduce ninguna librería nueva).
- Tras tocar código de perfil público o Flash Booking, verificar con la skill `verify-flows` antes de dar el fix por cerrado (regla del proyecto en `CLAUDE.md`).

---

## Task 1: Rediseño visual de `AvailabilityCalendar`

**Files:**
- Modify: `src/components/AvailabilityCalendar.tsx`
- Test: no requiere test nuevo — es una tarea puramente de estilos, verificada visualmente (ver Step 4).

**Interfaces:**
- Consumes: nada nuevo — sigue recibiendo `{ userId: string }` como hoy.
- Produces: mismo componente, misma prop pública. Las tareas 4 usarán esta versión rediseñada añadiendo más props (ver Task 4).

- [ ] **Step 1: Sustituir los colores planos por los colores sólidos aprobados**

En `src/components/AvailabilityCalendar.tsx`, dentro del `return` del componente, reemplazar el bloque de estilo inline de cada celda (líneas ~98-111 en la versión actual) por los colores y sombras aprobados en el mockup:

```tsx
{cells.map((cell, i) => {
  const dateStr = cell.current ? `${year}-${String(month + 1).padStart(2,'0')}-${String(cell.day).padStart(2,'0')}` : '';
  const isBlocked = cell.current && blocked.has(dateStr);
  const isToday = dateStr === todayStr;
  const isPast = cell.current && dateStr < todayStr;
  const isAvailable = cell.current && !isBlocked && !isPast;
  return (
    <div key={i}
      className="w-full aspect-square flex items-center justify-center rounded text-[0.65rem] font-bold"
      style={{
        color: !cell.current
          ? 'rgba(22,20,18,0.22)'
          : isBlocked ? '#fff'
          : isPast ? 'rgba(22,20,18,0.35)'
          : isToday ? '#33270a'
          : isAvailable ? '#fff'
          : '#222',
        background: isBlocked
          ? '#d94848'
          : isToday ? '#D4AF37'
          : isAvailable ? '#2fa561'
          : 'transparent',
        boxShadow: isBlocked
          ? '0 4px 10px -3px rgba(196,45,45,0.35)'
          : isToday ? '0 5px 12px -3px rgba(212,175,55,0.45)'
          : isAvailable ? '0 4px 10px -3px rgba(21,140,74,0.4)'
          : 'none',
        textDecoration: isBlocked ? 'line-through' : undefined,
      }}>
      {cell.day}
    </div>
  );
})}
```

- [ ] **Step 2: Actualizar la leyenda y el contenedor con la sombra más marcada**

Reemplazar el contenedor principal (línea ~50: `<div className="rounded-2xl p-4" style={{ background: '#fafaf8', border: '1px solid rgba(0,0,0,0.06)' }}>`) por:

```tsx
<div className="rounded-2xl p-4" style={{
  background: '#fdfcfa',
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 12px 28px -14px rgba(20,16,8,0.16), 0 3px 8px -2px rgba(20,16,8,0.08)',
}}>
```

Y los puntos de la leyenda (líneas ~114-123) a los mismos colores sólidos:

```tsx
<div className="flex items-center gap-4 mt-3 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
  <div className="flex items-center gap-1.5">
    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#2fa561', boxShadow: '0 2px 5px rgba(21,140,74,0.4)' }} />
    <span className="text-[0.65rem] font-semibold" style={{ color: '#3a3626' }}>Disponible</span>
  </div>
  <div className="flex items-center gap-1.5">
    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#d94848', boxShadow: '0 2px 5px rgba(196,45,45,0.35)' }} />
    <span className="text-[0.65rem] font-semibold" style={{ color: '#3a3626' }}>No disponible</span>
  </div>
</div>
```

- [ ] **Step 3: Verificar que no queda ningún emoji/icono decorativo nuevo**

Run: `grep -n "📅\|Calendar" src/components/AvailabilityCalendar.tsx`
Expected: solo el import `import { Calendar, ... } from 'lucide-react'` y su uso ya existente junto al título "Disponibilidad" (icono funcional preexistente, no se toca — la directriz de "sin iconos" aplicada en este plan es para no añadir iconos NUEVOS, no para retirar el que ya estaba antes de esta tarea).

- [ ] **Step 4: Verificación visual manual**

Run: `npm run dev`

Abrir en el navegador cualquier ficha pública de un profesional con `userId` válido (comprobar una URL de perfil real del directorio) y confirmar visualmente: fondo claro, celdas verde/rojo sólidas con sombra, celda de hoy en dorado — sin iconos añadidos, coherente con el mockup aprobado.

- [ ] **Step 5: Commit**

```bash
git add src/components/AvailabilityCalendar.tsx
git commit -m "$(cat <<'EOF'
Refuerza el contraste visual del calendario de disponibilidad

Colores sólidos con sombra proyectada en vez de rgba planos casi
invisibles, manteniendo el fondo claro. Sienta la base visual para
el calendario interactivo de la ficha pública.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Señal de escasez — hook + tarjetas en `StatsView`

**Files:**
- Create: `src/hooks/useScarcitySignal.ts`
- Create: `src/hooks/useScarcitySignal.test.ts`
- Modify: `src/components/dashboard/views/StatsView.tsx`
- Modify: `src/pages/PublicProfile.tsx`

**Interfaces:**
- Produces: `useScarcitySignal(userId: string | undefined): { weeklyProfileViews: number; weeklyContactRequests: number; loading: boolean }` — hook reutilizado por `StatsView` (lado profesional, propio usuario) y por `PublicProfile` (lado organizador, viendo el perfil de otro).

- [ ] **Step 1: Escribir el hook con test que falla**

Crear `src/hooks/useScarcitySignal.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useScarcitySignal } from './useScarcitySignal';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

function mockCounts(viewsCount: number, bookingsCount: number) {
  (supabase.from as any).mockImplementation((table: string) => {
    if (table === 'profile_business_views') {
      const gte = vi.fn().mockResolvedValue({ count: viewsCount, error: null });
      const eq = vi.fn().mockReturnValue({ gte });
      const select = vi.fn().mockReturnValue({ eq });
      return { select };
    }
    if (table === 'flash_bookings') {
      const gte = vi.fn().mockResolvedValue({ count: bookingsCount, error: null });
      const eq = vi.fn().mockReturnValue({ gte });
      const select = vi.fn().mockReturnValue({ eq });
      return { select };
    }
    throw new Error(`unexpected table ${table}`);
  });
}

describe('useScarcitySignal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns weekly view and booking counts for a user', async () => {
    mockCounts(7, 3);

    const { result } = renderHook(() => useScarcitySignal('user-123'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.weeklyProfileViews).toBe(7);
    expect(result.current.weeklyContactRequests).toBe(3);
  });

  it('returns zeros without querying when userId is undefined', async () => {
    const { result } = renderHook(() => useScarcitySignal(undefined));

    expect(result.current.loading).toBe(false);
    expect(result.current.weeklyProfileViews).toBe(0);
    expect(result.current.weeklyContactRequests).toBe(0);
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `npx vitest run src/hooks/useScarcitySignal.test.ts`
Expected: FAIL — `Cannot find module './useScarcitySignal'`

- [ ] **Step 3: Implementar el hook**

Crear `src/hooks/useScarcitySignal.ts`:

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ScarcitySignal {
  weeklyProfileViews: number;
  weeklyContactRequests: number;
  loading: boolean;
}

export const useScarcitySignal = (userId: string | undefined): ScarcitySignal => {
  const [weeklyProfileViews, setWeeklyProfileViews] = useState(0);
  const [weeklyContactRequests, setWeeklyContactRequests] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    Promise.all([
      supabase.from('profile_business_views')
        .select('id', { count: 'exact', head: true })
        .eq('viewed_user_id', userId)
        .gte('created_at', sevenDaysAgo),
      supabase.from('flash_bookings' as any)
        .select('id', { count: 'exact', head: true })
        .eq('professional_user_id', userId)
        .gte('created_at', sevenDaysAgo),
    ]).then(([viewsRes, bookingsRes]) => {
      setWeeklyProfileViews(viewsRes.count ?? 0);
      setWeeklyContactRequests(bookingsRes.count ?? 0);
      setLoading(false);
    });
  }, [userId]);

  return { weeklyProfileViews, weeklyContactRequests, loading };
};
```

- [ ] **Step 4: Ejecutar el test y comprobar que pasa**

Run: `npx vitest run src/hooks/useScarcitySignal.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Añadir la tarjeta al dashboard del profesional en `StatsView.tsx`**

En `src/components/dashboard/views/StatsView.tsx`, añadir el import junto a los existentes (tras la línea `import { useAuth } from '@/hooks/useAuth';`):

```typescript
import { useScarcitySignal } from '@/hooks/useScarcitySignal';
```

Dentro del componente, tras la línea `const { user } = useAuth();`:

```typescript
const scarcity = useScarcitySignal(user?.id);
```

Insertar un nuevo bloque `glass-panel` justo antes del bloque `{/* ── Activity Wheel ── */}` (tras el `</div>` que cierra el grid de KPI Cards):

```tsx
{!scarcity.loading && scarcity.weeklyProfileViews > 0 && (
  <div className="glass-panel p-5 mb-6">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
      <h3 className="text-sm font-bold">Actividad de esta semana</h3>
    </div>
    <p className="text-sm text-muted-foreground">
      <span className="font-bold" style={{ color: '#222' }}>{scarcity.weeklyProfileViews}</span>{' '}
      {scarcity.weeklyProfileViews === 1 ? 'organizador ha visto' : 'organizadores han visto'} tu perfil esta semana
      {scarcity.weeklyContactRequests > 0 && (
        <> y <span className="font-bold" style={{ color: '#222' }}>{scarcity.weeklyContactRequests}</span>{' '}
        {scarcity.weeklyContactRequests === 1 ? 'te ha contactado' : 'te han contactado'} por Flash Booking</>
      )}.
    </p>
  </div>
)}
```

- [ ] **Step 6: Añadir la línea discreta al lado del organizador en `PublicProfile.tsx`**

En `src/pages/PublicProfile.tsx`, añadir el import junto a los existentes:

```typescript
import { useScarcitySignal } from '@/hooks/useScarcitySignal';
```

Dentro del componente principal, cerca de donde se define `sbProfile`, añadir:

```typescript
const scarcity = useScarcitySignal(sbProfile?.user_id);
```

Insertar el texto justo antes del bloque `{/* Availability */}` (línea ~1257 en la versión actual), dentro de su propio `motion.div` con el mismo patrón `fadeUp` que los bloques vecinos:

```tsx
{sbProfile && !scarcity.loading && scarcity.weeklyContactRequests > 0 && (
  <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
    <p className="text-xs" style={{ color: '#8A6D0F' }}>
      Contactado por {scarcity.weeklyContactRequests} {scarcity.weeklyContactRequests === 1 ? 'empresario' : 'empresarios'} esta semana
    </p>
  </motion.div>
)}
```

- [ ] **Step 7: Type-check**

Run: `npx tsc --noEmit`
Expected: sin errores nuevos relacionados con `useScarcitySignal`, `StatsView.tsx` o `PublicProfile.tsx`.

- [ ] **Step 8: Verificación visual manual**

Run: `npm run dev`

Como profesional logueado con vistas/solicitudes reales, abrir el dashboard → pestaña Estadísticas y confirmar que aparece la tarjeta de actividad semanal (o que no aparece si `weeklyProfileViews` es 0, sin mostrar un "0" alarmante). Luego, en modo incógnito o sesión de organizador, abrir la ficha pública de ese mismo profesional y confirmar la línea de contacto (o su ausencia si es 0).

- [ ] **Step 9: Commit**

```bash
git add src/hooks/useScarcitySignal.ts src/hooks/useScarcitySignal.test.ts src/components/dashboard/views/StatsView.tsx src/pages/PublicProfile.tsx
git commit -m "$(cat <<'EOF'
Añade señal de escasez para profesional y organizador

Tarjeta de actividad semanal (vistas + solicitudes Flash Booking)
en el dashboard del profesional, y línea de contacto reciente en
la ficha pública para el organizador — ambas basadas en datos ya
capturados (profile_business_views, flash_bookings), sin tabla
nueva. Se oculta por completo si no hay actividad, sin mostrar
ceros alarmantes.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Insight de mercado — hook + tarjeta en `StatsView`

**Files:**
- Create: `src/hooks/useMarketRateInsight.ts`
- Create: `src/hooks/useMarketRateInsight.test.ts`
- Modify: `src/components/dashboard/views/StatsView.tsx`

**Interfaces:**
- Produces: `useMarketRateInsight(userId: string | undefined): { percentDiff: number | null; loading: boolean }` — `percentDiff` es `null` cuando el propio perfil no tiene `hourly_rate` válido, o cuando hay menos de 5 perfiles comparables (por debajo del umbral no se muestra nada, según la spec).

- [ ] **Step 1: Escribir el hook con test que falla**

Crear `src/hooks/useMarketRateInsight.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMarketRateInsight } from './useMarketRateInsight';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

function mockProfiles(me: { hourly_rate: number; category: string; zone: string } | null, peers: number[]) {
  (supabase.from as any).mockImplementation((table: string) => {
    if (table !== 'profiles') throw new Error(`unexpected table ${table}`);
    const maybeSingle = vi.fn().mockResolvedValue({ data: me, error: null });
    const eqSelf = vi.fn().mockReturnValue({ maybeSingle });
    const selectSelf = vi.fn().mockReturnValue({ eq: eqSelf });

    const gt = vi.fn().mockResolvedValue({
      data: peers.map(hourly_rate => ({ hourly_rate })),
      error: null,
    });
    const neq = vi.fn().mockReturnValue({ gt });
    const eqZone = vi.fn().mockReturnValue({ neq });
    const eqCategory = vi.fn().mockReturnValue({ eq: eqZone });
    const selectPeers = vi.fn().mockReturnValue({ eq: eqCategory });

    let call = 0;
    return {
      select: vi.fn().mockImplementation(() => {
        call += 1;
        return call === 1 ? selectSelf() : selectPeers();
      }),
    };
  });
}

describe('useMarketRateInsight', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when fewer than 5 comparable peers exist', async () => {
    mockProfiles({ hourly_rate: 100, category: 'dj', zone: 'Madrid' }, [80, 90, 110]);

    const { result } = renderHook(() => useMarketRateInsight('user-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.percentDiff).toBeNull();
  });

  it('returns percent difference vs peer average when 5+ peers exist', async () => {
    // peer avg = (80+90+100+110+120)/5 = 100, me = 120 -> +20%
    mockProfiles({ hourly_rate: 120, category: 'dj', zone: 'Madrid' }, [80, 90, 100, 110, 120]);

    const { result } = renderHook(() => useMarketRateInsight('user-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.percentDiff).toBe(20);
  });

  it('returns null when own hourly_rate is missing or zero', async () => {
    mockProfiles({ hourly_rate: 0, category: 'dj', zone: 'Madrid' }, [80, 90, 100, 110, 120]);

    const { result } = renderHook(() => useMarketRateInsight('user-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.percentDiff).toBeNull();
  });
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `npx vitest run src/hooks/useMarketRateInsight.test.ts`
Expected: FAIL — `Cannot find module './useMarketRateInsight'`

- [ ] **Step 3: Implementar el hook**

Crear `src/hooks/useMarketRateInsight.ts`:

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const MIN_COMPARABLE_PEERS = 5;

interface MarketRateInsight {
  percentDiff: number | null;
  loading: boolean;
}

export const useMarketRateInsight = (userId: string | undefined): MarketRateInsight => {
  const [percentDiff, setPercentDiff] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);

    supabase.from('profiles')
      .select('hourly_rate, category, zone')
      .eq('user_id', userId)
      .maybeSingle()
      .then(async ({ data: me }) => {
        const myRate = (me as { hourly_rate?: number } | null)?.hourly_rate;
        const category = (me as { category?: string } | null)?.category;
        const zone = (me as { zone?: string } | null)?.zone;

        if (!myRate || myRate <= 0 || !category || !zone) {
          setPercentDiff(null);
          setLoading(false);
          return;
        }

        const { data: peers } = await supabase.from('profiles')
          .select('hourly_rate')
          .eq('category', category)
          .eq('zone', zone)
          .neq('user_id', userId)
          .gt('hourly_rate', 0);

        const peerRates = (peers ?? []).map((p: { hourly_rate: number }) => p.hourly_rate);

        if (peerRates.length < MIN_COMPARABLE_PEERS) {
          setPercentDiff(null);
          setLoading(false);
          return;
        }

        const avg = peerRates.reduce((sum, r) => sum + r, 0) / peerRates.length;
        setPercentDiff(Math.round(((myRate - avg) / avg) * 100));
        setLoading(false);
      });
  }, [userId]);

  return { percentDiff, loading };
};
```

- [ ] **Step 4: Ejecutar el test y comprobar que pasa**

Run: `npx vitest run src/hooks/useMarketRateInsight.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Añadir la tarjeta al dashboard del profesional en `StatsView.tsx`**

Añadir el import junto al de `useScarcitySignal` (de la Task 2):

```typescript
import { useMarketRateInsight } from '@/hooks/useMarketRateInsight';
```

Tras la línea `const scarcity = useScarcitySignal(user?.id);`:

```typescript
const marketRate = useMarketRateInsight(user?.id);
```

Insertar un nuevo bloque `glass-panel`, justo después del bloque de señal de escasez añadido en la Task 2:

```tsx
{!marketRate.loading && marketRate.percentDiff !== null && (
  <div className="glass-panel p-5 mb-6">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#8A6D0F' }} />
      <h3 className="text-sm font-bold">Tu tarifa frente al mercado</h3>
    </div>
    <p className="text-sm text-muted-foreground">
      Tu tarifa está un <span className="font-bold" style={{ color: marketRate.percentDiff >= 0 ? '#15803d' : '#c0392b' }}>
        {Math.abs(marketRate.percentDiff)}%
      </span>{' '}
      {marketRate.percentDiff >= 0 ? 'por encima' : 'por debajo'} de la media de tu categoría en tu zona.
    </p>
  </div>
)}
```

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit`
Expected: sin errores nuevos.

- [ ] **Step 7: Verificación visual manual**

Run: `npm run dev`

Con un profesional real que tenga `hourly_rate > 0` y al menos 5 perfiles comparables en su `category`+`zone` (hoy la base real tiene pocos casos así — si ninguno cumple el umbral, confirmar en su lugar que la tarjeta NO aparece, que es el comportamiento correcto).

- [ ] **Step 8: Commit**

```bash
git add src/hooks/useMarketRateInsight.ts src/hooks/useMarketRateInsight.test.ts src/components/dashboard/views/StatsView.tsx
git commit -m "$(cat <<'EOF'
Añade insight de posición de tarifa frente al mercado

Compara hourly_rate del profesional contra la media de su categoría
y zona (mínimo 5 perfiles comparables, si no se oculta la tarjeta).
Ningún competidor analizado (Habitissimo, Cronoshare, Wolly,
GigSalad, Encore, Fresha...) ofrece este benchmarking.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Calendario interactivo con solicitud directa + modal explicativo

**Files:**
- Modify: `src/components/AvailabilityCalendar.tsx`
- Modify: `src/components/dashboard/FlashBookingRequestModal.tsx`
- Create: `src/components/CalendarHowItWorksModal.tsx`
- Modify: `src/pages/PublicProfile.tsx`

**Interfaces:**
- Consumes: `AvailabilityCalendar` de Task 1 (misma base visual), `FlashBookingRequestModal` ya existente (ver estructura completa en la spec).
- Produces: `AvailabilityCalendar` gana las props `mode: 'edit' | 'view-request'` (default `'edit'`, preserva el uso actual en el dashboard del profesional sin cambios) y `onRequestDate?: (date: string) => void`. `FlashBookingRequestModal` gana la prop opcional `prefilledDate?: string`. `CalendarHowItWorksModal` exporta `{ audience: 'profesional' | 'organizador'; onClose: () => void }`.

- [ ] **Step 1: Añadir el modo interactivo a `AvailabilityCalendar`**

En `src/components/AvailabilityCalendar.tsx`, cambiar la firma del componente:

```tsx
interface AvailabilityCalendarProps {
  userId: string;
  mode?: 'edit' | 'view-request';
  onRequestDate?: (date: string) => void;
}

const AvailabilityCalendar = ({ userId, mode = 'edit', onRequestDate }: AvailabilityCalendarProps) => {
```

Dentro del `.map` de celdas (ya rediseñado en Task 1), añadir el manejador de clic solo quando `mode === 'view-request'` y la celda está disponible:

```tsx
const isClickable = mode === 'view-request' && isAvailable;
return (
  <div key={i}
    onClick={isClickable ? () => onRequestDate?.(dateStr) : undefined}
    className="w-full aspect-square flex items-center justify-center rounded text-[0.65rem] font-bold"
    style={{
      cursor: isClickable ? 'pointer' : 'default',
      /* ...resto de estilos igual que en Task 1... */
    }}>
    {cell.day}
  </div>
);
```

(El resto del bloque de estilos es exactamente el de Task 1 — solo se añaden `onClick` y `cursor`.)

- [ ] **Step 2: Añadir `prefilledDate` a `FlashBookingRequestModal`**

En `src/components/dashboard/FlashBookingRequestModal.tsx`, modificar la interfaz de props:

```typescript
interface Props {
  professionalName: string;
  professionalRole: string;
  professionalUserId?: string;
  prefilledDate?: string;
  onClose: () => void;
}
```

Y la firma del componente y el estado inicial del formulario:

```tsx
const FlashBookingRequestModal = ({ professionalName, professionalRole, professionalUserId, prefilledDate, onClose }: Props) => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', contact: '', date: prefilledDate ?? '', location: '', exactAddress: '', description: '', price: '', eventType: '', website: '' });
```

- [ ] **Step 3: Type-check tras los cambios de props**

Run: `npx tsc --noEmit`
Expected: sin errores — ambos cambios son props opcionales con default, no rompen ningún uso existente.

- [ ] **Step 4: Crear el modal explicativo**

Crear `src/components/CalendarHowItWorksModal.tsx`:

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  audience: 'profesional' | 'organizador';
  onClose: () => void;
}

const COPY = {
  profesional: {
    title: 'Así funciona tu calendario',
    steps: [
      'Marca en verde los días que tienes libres y en rojo los que ya están ocupados.',
      'Cuando un organizador vea tu ficha, solo podrá solicitar los días que marques en verde.',
      'Cada solicitud llega a tu pestaña "Solicitudes" — tú decides si la aceptas o la rechazas.',
    ],
  },
  organizador: {
    title: 'Así reservas una fecha',
    steps: [
      'Los días en verde están libres; los días en rojo ya están ocupados.',
      'Pulsa un día libre para abrir la solicitud de Flash Booking con esa fecha ya rellenada.',
      'El profesional recibirá tu solicitud y decidirá si la acepta — la fecha no queda confirmada hasta entonces.',
    ],
  },
};

const CalendarHowItWorksModal = ({ audience, onClose }: Props) => {
  const copy = COPY[audience];
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-5"
          style={{ background: '#ffffff', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold" style={{ color: '#111' }}>{copy.title}</p>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5">
              <X size={14} style={{ color: '#222' }} />
            </button>
          </div>
          <ol className="space-y-3">
            {copy.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm" style={{ color: '#333' }}>
                <span className="font-bold flex-shrink-0" style={{ color: '#8A6D0F' }}>{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CalendarHowItWorksModal;
```

- [ ] **Step 5: Conectar todo en `PublicProfile.tsx`**

Añadir los imports junto a los existentes:

```typescript
import FlashBookingRequestModal from '@/components/dashboard/FlashBookingRequestModal';
import CalendarHowItWorksModal from '@/components/CalendarHowItWorksModal';
```

(Verificar primero con `grep -n "FlashBookingRequestModal" src/pages/PublicProfile.tsx` si ya está importado en otro punto del archivo — de ser así, no duplicar el import.)

Dentro del componente, añadir el estado necesario:

```typescript
const [flashBookingDate, setFlashBookingDate] = useState<string | null>(null);
const [showCalendarHelp, setShowCalendarHelp] = useState(false);

useEffect(() => {
  if (!sbProfile) return;
  const seenKey = 'xpeak_calendar_intro_seen_organizador';
  if (!localStorage.getItem(seenKey)) {
    setShowCalendarHelp(true);
    localStorage.setItem(seenKey, '1');
  }
}, [sbProfile]);
```

Reemplazar el bloque `{/* Availability */}` (línea ~1257-1262 en la versión actual) por:

```tsx
{sbProfile && (
  <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
    <div className="flex items-center justify-between mb-1">
      <span />
      <button
        onClick={() => setShowCalendarHelp(true)}
        className="text-xs font-semibold underline"
        style={{ color: '#8A6D0F' }}
      >
        ¿Cómo funciona?
      </button>
    </div>
    <AvailabilityCalendar
      userId={sbProfile.user_id}
      mode="view-request"
      onRequestDate={(date) => setFlashBookingDate(date)}
    />
  </motion.div>
)}

{flashBookingDate && (
  <FlashBookingRequestModal
    professionalName={profile.name}
    professionalRole={profile.role}
    professionalUserId={sbProfile?.user_id}
    prefilledDate={flashBookingDate}
    onClose={() => setFlashBookingDate(null)}
  />
)}

{showCalendarHelp && (
  <CalendarHowItWorksModal audience="organizador" onClose={() => setShowCalendarHelp(false)} />
)}
```

- [ ] **Step 6: Replicar el modal explicativo en el lado del profesional**

Localizar dónde el profesional ve su propio `AvailabilityCalendar` en modo edición (buscar el otro uso, si existe, o el punto del dashboard donde gestiona su disponibilidad):

Run: `grep -rn "AvailabilityCalendar" src/components/dashboard/`

Si existe un punto de montaje en el dashboard del profesional, añadir ahí el mismo patrón de botón "¿Cómo funciona?" + `CalendarHowItWorksModal` con `audience="profesional"` y la clave de `localStorage` `xpeak_calendar_intro_seen_profesional`. Si `AvailabilityCalendar` solo se usa hoy en la ficha pública (`PublicProfile.tsx`), documentar esto como hallazgo y omitir este sub-paso — no inventar un punto de montaje que no existe.

- [ ] **Step 7: Type-check**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 8: Ejecutar la suite de tests completa**

Run: `npm test`
Expected: todos los tests existentes siguen en verde, incluidos los añadidos en Tasks 2 y 3.

- [ ] **Step 9: Verificar el flujo completo en navegador (obligatorio por `CLAUDE.md` — tocar Flash Booking/perfil público exige `verify-flows`)**

Invocar la skill `verify-flows` del proyecto y reproducir el flujo real:
1. Abrir la ficha pública de un profesional con disponibilidad real.
2. Confirmar que aparece el modal "¿Cómo funciona?" la primera vez (o limpiar `localStorage` para forzarlo).
3. Cerrar el modal, pulsar un día verde, confirmar que abre `FlashBookingRequestModal` con la fecha ya rellenada.
4. Enviar la solicitud (con una cuenta de organizador real) y confirmar en Supabase (`flash_bookings`) que se creó con `status = 'pending'` y la fecha correcta.
5. Confirmar que un día rojo NO abre el modal.

- [ ] **Step 10: Commit**

```bash
git add src/components/AvailabilityCalendar.tsx src/components/dashboard/FlashBookingRequestModal.tsx src/components/CalendarHowItWorksModal.tsx src/pages/PublicProfile.tsx
git commit -m "$(cat <<'EOF'
Hace interactivo el calendario público: solicitud directa de fecha

El organizador ve la disponibilidad real del profesional y pulsa un
día libre para abrir Flash Booking con la fecha ya rellenada — sin
auto-confirmación, el profesional sigue aprobando manualmente en
Solicitudes. Incluye modal "¿Cómo funciona?" con copy diferenciado
por rol, mostrado automáticamente la primera vez y accesible después
vía botón.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Post-implementación

Ninguna tarea de este plan requiere deploy a producción para completarse (regla del proyecto: "Deploy solo si se pide"). Al terminar las 4 tareas, preguntar si se despliega a producción antes de ejecutar `npx vercel --prod --yes`.
