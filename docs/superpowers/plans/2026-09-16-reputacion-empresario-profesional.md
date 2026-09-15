# Reputación de un vistazo: tiempo de respuesta + preguntas estructuradas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar a un empresario que entra al perfil público de un profesional una foto rápida y fiable de cómo es contratarlo: un chip "Responde en X" calculado sobre mensajería real, y un resumen de 3 preguntas sí/no (puntualidad, cumplimiento de lo acordado, recontratación) agregado sobre las reseñas aprobadas.

**Architecture:** Dos piezas independientes que comparten el mismo perfil público como superficie de salida. (1) Una columna cacheada `profiles.response_bucket`, recalculada por un cron diario (edge function + `pg_cron`, mismo patrón que `review-reminder`) que agrega tiempos de primera respuesta sobre `conversations`/`messages`. (2) Tres columnas booleanas nuevas en `reviews`, rellenadas por el `ReviewModal` existente y agregadas como porcentaje en `ReviewsSection` de `PublicProfile.tsx`. Una tercera pieza cierra el hueco de reseñas antiguas sin estas columnas: un mini-formulario de "completa tu valoración" en `HistorialTab.tsx` más un email de aviso que excluye explícitamente a las cuentas demo.

**Tech Stack:** Vite + React + TypeScript, Supabase (Postgres + RLS + pg_cron + Edge Functions Deno), Vitest.

**Spec:** `docs/superpowers/specs/2026-09-16-reputacion-empresario-profesional-design.md`

## Global Constraints

- Mediana (no media) para el tiempo de respuesta — evita que un pico nocturno aislado distorsione el bucket.
- El indicador de tiempo de respuesta se muestra con mínimo **1** conversación respondida — sin umbral de 3.
- Solo cuentan conversaciones donde el **empresario escribió primero**; si el profesional escribe primero, esa conversación no entra en el cálculo.
- Las 3 preguntas del `ReviewModal` son **obligatorias** para poder enviar la reseña.
- El % agregado de cada pregunta se calcula solo sobre reseñas `approved = true` con esa columna **no nula** — cada pregunta tiene su propio denominador independiente.
- La migración de backfill debe recalcular `response_bucket` sobre el histórico completo de `messages`/`conversations`, no solo datos futuros.
- El email de "completa tu valoración" **nunca** se envía a `demo.organizador@xpeak.es`, `demo.profesional@xpeak.es`, ni a ninguna cuenta cuyo email termine en un patrón de cuenta interna de prueba equivalente.
- No se toca `ProfileCard.tsx` (ficha apilada del dashboard) en este plan — solo `PublicProfile.tsx`.
- No se toca el chip de rating de estrellas ya existente en `PublicProfile.tsx` (commit del 16 sep 2026).

---

## Task 1: Migración SQL — columnas nuevas en `profiles` y `reviews`

**Files:**
- Create: `supabase/migrations/20260916100000_response_bucket_y_preguntas_review.sql`

**Interfaces:**
- Produces: columna `profiles.response_bucket` (`text`, nullable, check constraint con los 5 valores de bucket); columnas `reviews.llego_puntual`, `reviews.cumplio_acordado`, `reviews.volveria_contratar` (todas `boolean`, nullable).

- [ ] **Step 1: Escribir la migración**

```sql
-- Indicador "Responde en X" (estilo Wallapop) — mediana del tiempo que
-- tarda el profesional en responder al primer mensaje de un empresario en
-- cada conversación, recalculada por el cron xpeak-response-bucket
-- (supabase/functions/response-bucket-recalc). Null = sin conversaciones
-- elegibles todavía, no se muestra el chip.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS response_bucket text
    CHECK (response_bucket IN ('minutos','menos_1h','unas_horas','1_dia','mas_1_dia'));

COMMENT ON COLUMN public.profiles.response_bucket IS
  'Bucket de velocidad de respuesta del profesional, calculado por el cron diario xpeak-response-bucket sobre conversations/messages. Null si aún no tiene conversaciones elegibles (empresario escribió primero y el profesional respondió).';

-- Preguntas estructuradas de la reseña (empresario -> profesional).
-- Obligatorias en el formulario (ReviewModal, HistorialTab.tsx) para
-- reseñas nuevas; null en reseñas anteriores a este cambio, que se
-- completan por separado (ver Task 6).
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS llego_puntual boolean,
  ADD COLUMN IF NOT EXISTS cumplio_acordado boolean,
  ADD COLUMN IF NOT EXISTS volveria_contratar boolean;

COMMENT ON COLUMN public.reviews.llego_puntual IS '¿El profesional llegó puntual al evento? Null en reseñas anteriores al 16 sep 2026.';
COMMENT ON COLUMN public.reviews.cumplio_acordado IS '¿El profesional cumplió con lo acordado? Null en reseñas anteriores al 16 sep 2026.';
COMMENT ON COLUMN public.reviews.volveria_contratar IS '¿El empresario volvería a contratarlo/a? Null en reseñas anteriores al 16 sep 2026.';
```

- [ ] **Step 2: Aplicar la migración**

Run: `npx supabase db push` (o el mecanismo habitual de XPEAK para aplicar migraciones al proyecto `ddrqhwravupjzysriblq` — confirmar con el usuario antes de aplicar a producción).

Expected: sin errores; `profiles` tiene `response_bucket`, `reviews` tiene las 3 columnas nuevas.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260916100000_response_bucket_y_preguntas_review.sql
git commit -m "$(cat <<'EOF'
Columnas para indicador de respuesta y preguntas estructuradas de reseña

Prepara el esquema para el chip "Responde en X" (profiles.response_bucket)
y las 3 preguntas sí/no del formulario de valoración
(reviews.llego_puntual, cumplio_acordado, volveria_contratar).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Edge function que calcula `response_bucket`

**Files:**
- Create: `supabase/functions/response-bucket-recalc/index.ts`

**Interfaces:**
- Consumes: `profiles.response_bucket` (Task 1), tablas `conversations` (`id`, `participant_a`, `participant_b`) y `messages` (`id`, `conversation_id`, `sender_id`, `created_at`).
- Produces: función HTTP invocable por `net.http_post` que actualiza `profiles.response_bucket` para todos los profesionales con conversaciones elegibles; responde `{ updated: number }`.

- [ ] **Step 1: Escribir la edge function**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Calcula la mediana del tiempo de primera respuesta de cada profesional a
// conversaciones que ARRANCÓ el otro participante (el empresario), y la
// clasifica en un bucket estilo Wallapop. Corre 1 vez al día vía pg_cron
// (xpeak-response-bucket) y también sirve de backfill retroactivo: al no
// filtrar por fecha, cada ejecución recalcula sobre TODO el histórico de
// conversations/messages, no solo mensajes nuevos.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function bucketFor(medianMinutes: number): string {
  if (medianMinutes < 15) return 'minutos';
  if (medianMinutes < 60) return 'menos_1h';
  if (medianMinutes < 360) return 'unas_horas';
  if (medianMinutes < 1440) return '1_dia';
  return 'mas_1_dia';
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const admin = createClient(supabaseUrl, serviceKey);

  const { data: conversations, error: convError } = await admin
    .from('conversations')
    .select('id, participant_a, participant_b');

  if (convError) {
    console.error('[response-bucket-recalc] conversations fetch error', convError);
    return new Response(JSON.stringify({ error: convError.message }), { status: 500, headers: corsHeaders });
  }

  if (!conversations?.length) {
    return new Response(JSON.stringify({ updated: 0, message: 'No conversations' }), { headers: corsHeaders });
  }

  // response times (minutos) por profesional (user_id) -> lista de tiempos
  const responseTimesByUser = new Map<string, number[]>();

  for (const conv of conversations) {
    const { data: msgs, error: msgsError } = await admin
      .from('messages')
      .select('sender_id, created_at')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: true });

    if (msgsError || !msgs?.length) continue;

    const first = msgs[0];
    const asker = first.sender_id as string;
    const responder = asker === conv.participant_a ? conv.participant_b : conv.participant_a;
    if (!responder || responder === asker) continue;

    const firstResponse = msgs.find((m) => m.sender_id === responder);
    if (!firstResponse) continue;

    const minutes = (new Date(firstResponse.created_at as string).getTime() - new Date(first.created_at as string).getTime()) / 60000;
    if (minutes < 0) continue;

    const list = responseTimesByUser.get(responder) ?? [];
    list.push(minutes);
    responseTimesByUser.set(responder, list);
  }

  let updated = 0;
  for (const [userId, times] of responseTimesByUser.entries()) {
    const bucket = bucketFor(median(times));
    const { error: updateError } = await admin
      .from('profiles')
      .update({ response_bucket: bucket })
      .eq('user_id', userId);
    if (updateError) {
      console.error('[response-bucket-recalc] update error for', userId, updateError);
      continue;
    }
    updated++;
  }

  return new Response(JSON.stringify({ updated, professionals: responseTimesByUser.size }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
```

- [ ] **Step 2: Desplegar la función**

Run: `npx supabase functions deploy response-bucket-recalc --project-ref ddrqhwravupjzysriblq` (confirmar con el usuario antes de desplegar).

Expected: despliegue sin errores.

- [ ] **Step 3: Invocarla manualmente una vez para el backfill retroactivo**

Run: `curl -X POST "https://ddrqhwravupjzysriblq.supabase.co/functions/v1/response-bucket-recalc" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"`

Expected: respuesta JSON `{ "updated": N, "professionals": N }` con N >= 0. Verificar en Supabase que algunos `profiles.response_bucket` quedaron rellenos si hay conversaciones reales elegibles.

- [ ] **Step 4: Commit**

```bash
git add supabase/functions/response-bucket-recalc/index.ts
git commit -m "$(cat <<'EOF'
Edge function que calcula el bucket de tiempo de respuesta por profesional

Mediana del tiempo hasta la primera respuesta en conversaciones que
arrancó el empresario, clasificada en 5 buckets estilo Wallapop. Sirve
tanto de cron diario como de backfill retroactivo sobre el histórico.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Cron diario que invoca la edge function

**Files:**
- Create: `supabase/migrations/20260916100100_cron_response_bucket.sql`

**Interfaces:**
- Consumes: edge function `response-bucket-recalc` (Task 2).
- Produces: job `pg_cron` llamado `xpeak-response-bucket` que corre a diario.

- [ ] **Step 1: Escribir la migración del cron**

```sql
-- Cron diario que recalcula profiles.response_bucket para todos los
-- profesionales con conversaciones elegibles. Mismo patrón que
-- xpeak-review-reminder (net.http_post a una edge function).
SELECT cron.schedule(
  'xpeak-response-bucket',
  '30 3 * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/response-bucket-recalc',
    headers := '{"Authorization":"Bearer ' || current_setting('app.service_role_key') || '","Content-Type":"application/json"}'::jsonb,
    body := '{}'::jsonb);
  $$
);
```

- [ ] **Step 2: Aplicar la migración**

Run: `npx supabase db push` (confirmar con el usuario antes de aplicar a producción).

Expected: `SELECT * FROM cron.job WHERE jobname = 'xpeak-response-bucket';` devuelve 1 fila.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260916100100_cron_response_bucket.sql
git commit -m "$(cat <<'EOF'
Cron diario para recalcular el indicador de tiempo de respuesta

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Chip "Responde en X" en el perfil público

**Files:**
- Modify: `src/pages/PublicProfile.tsx`
- Test: `src/pages/PublicProfile.responseBucket.test.ts`

**Interfaces:**
- Consumes: `profiles.response_bucket` (Task 1), ya disponible en `sbProfile` (el mismo objeto que trae `display_name`, cargado en el `useEffect` que también llena `seoReviews` — ver `PublicProfile.tsx:480-486`).
- Produces: función pura exportada `responseBucketLabel(bucket: string | null): string | null`, usada dentro del componente para renderizar el chip.

- [ ] **Step 1: Escribir el test de la función de etiqueta**

```typescript
import { describe, it, expect } from 'vitest';
import { responseBucketLabel } from './PublicProfile';

describe('responseBucketLabel', () => {
  it('returns null when there is no bucket', () => {
    expect(responseBucketLabel(null)).toBeNull();
  });

  it('maps each bucket to its Spanish label', () => {
    expect(responseBucketLabel('minutos')).toBe('Responde en minutos');
    expect(responseBucketLabel('menos_1h')).toBe('Responde en menos de 1 hora');
    expect(responseBucketLabel('unas_horas')).toBe('Responde en unas horas');
    expect(responseBucketLabel('1_dia')).toBe('Responde en 1 día');
    expect(responseBucketLabel('mas_1_dia')).toBe('Suele tardar en responder');
  });

  it('returns null for an unrecognized bucket', () => {
    expect(responseBucketLabel('bucket_invalido')).toBeNull();
  });
});
```

- [ ] **Step 2: Ejecutar el test para verificar que falla**

Run: `npx vitest run src/pages/PublicProfile.responseBucket.test.ts`
Expected: FAIL — `responseBucketLabel` no existe o no está exportada.

- [ ] **Step 3: Añadir la función y el estado de `response_bucket`**

En `src/pages/PublicProfile.tsx`, exportar la función helper junto al resto de utilidades del archivo (cerca de `StarRating`, antes del componente `PublicProfile`):

```typescript
export function responseBucketLabel(bucket: string | null): string | null {
  switch (bucket) {
    case 'minutos': return 'Responde en minutos';
    case 'menos_1h': return 'Responde en menos de 1 hora';
    case 'unas_horas': return 'Responde en unas horas';
    case '1_dia': return 'Responde en 1 día';
    case 'mas_1_dia': return 'Suele tardar en responder';
    default: return null;
  }
}
```

En el tipo `SupabaseProfile` (donde ya viven `display_name`, `user_id`, etc.), añadir el campo:

```typescript
response_bucket: string | null;
```

En el `.select(...)` que carga `sbProfile` (la query que ya trae `display_name` y demás campos usados en la cabecera), añadir `response_bucket` a la lista de columnas seleccionadas.

- [ ] **Step 4: Renderizar el chip en la fila de tags**

En el bloque de tags de la cabecera (`src/pages/PublicProfile.tsx`, justo después del chip de rating añadido el 16 sep 2026 y antes de `{profile.isVerified && (...)}`):

```tsx
{responseBucketLabel(sbProfile?.response_bucket ?? null) && (
  <span className="flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full"
    style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
    ⚡ {responseBucketLabel(sbProfile?.response_bucket ?? null)}
  </span>
)}
```

- [ ] **Step 5: Ejecutar el test para verificar que pasa**

Run: `npx vitest run src/pages/PublicProfile.responseBucket.test.ts`
Expected: PASS.

- [ ] **Step 6: Type check**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 7: Commit**

```bash
git add src/pages/PublicProfile.tsx src/pages/PublicProfile.responseBucket.test.ts
git commit -m "$(cat <<'EOF'
Chip "Responde en X" en la cabecera del perfil público

Muestra el bucket de velocidad de respuesta ya calculado por el cron
diario (profiles.response_bucket), mismo estilo que el resto de tags de
la cabecera. No se muestra si el profesional aún no tiene el dato.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Preguntas Sí/No en `ReviewModal`

**Files:**
- Modify: `src/components/dashboard/views/empresario/HistorialTab.tsx`
- Test: `src/components/dashboard/views/empresario/reviewQuestions.test.ts`

**Interfaces:**
- Consumes: `reviews.llego_puntual`, `reviews.cumplio_acordado`, `reviews.volveria_contratar` (Task 1).
- Produces: función pura exportada `canSubmitReview(rating: number, comment: string, llegoPuntual: boolean | null, cumplioAcordado: boolean | null, volveriaContratar: boolean | null): boolean`, usada por el botón de envío del `ReviewModal`.

- [ ] **Step 1: Escribir el test de la validación**

```typescript
import { describe, it, expect } from 'vitest';
import { canSubmitReview } from './HistorialTab';

describe('canSubmitReview', () => {
  it('requires all three answers to be non-null', () => {
    expect(canSubmitReview(5, 'Buen trabajo', null, true, true)).toBe(false);
    expect(canSubmitReview(5, 'Buen trabajo', true, null, true)).toBe(false);
    expect(canSubmitReview(5, 'Buen trabajo', true, true, null)).toBe(false);
  });

  it('requires rating >= 1 and comment >= 5 chars, same as before', () => {
    expect(canSubmitReview(0, 'Buen trabajo', true, true, true)).toBe(false);
    expect(canSubmitReview(5, 'abc', true, true, true)).toBe(false);
  });

  it('passes when rating, comment and all three answers are present', () => {
    expect(canSubmitReview(5, 'Buen trabajo', true, false, true)).toBe(true);
  });
});
```

- [ ] **Step 2: Ejecutar el test para verificar que falla**

Run: `npx vitest run src/components/dashboard/views/empresario/reviewQuestions.test.ts`
Expected: FAIL — `canSubmitReview` no existe o no está exportada.

- [ ] **Step 3: Añadir la función de validación**

En `src/components/dashboard/views/empresario/HistorialTab.tsx`, junto al resto de helpers del archivo (fuera del componente `ReviewModal`, para que sea testeable de forma aislada):

```typescript
export function canSubmitReview(
  rating: number,
  comment: string,
  llegoPuntual: boolean | null,
  cumplioAcordado: boolean | null,
  volveriaContratar: boolean | null,
): boolean {
  if (rating < 1) return false;
  if (comment.trim().length < 5) return false;
  if (llegoPuntual === null || cumplioAcordado === null || volveriaContratar === null) return false;
  return true;
}
```

- [ ] **Step 4: Ejecutar el test para verificar que pasa**

Run: `npx vitest run src/components/dashboard/views/empresario/reviewQuestions.test.ts`
Expected: PASS.

- [ ] **Step 5: Añadir el toggle Sí/No reutilizable dentro de `ReviewModal`**

En `src/components/dashboard/views/empresario/HistorialTab.tsx`, dentro de la función `ReviewModal` (mismo archivo, antes del `return`), añadir un pequeño subcomponente local:

```tsx
function YesNoToggle({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="mb-3">
      <p className="text-xs font-bold mb-1.5" style={{ color: '#333' }}>{label}</p>
      <div className="flex gap-2">
        <button type="button" onClick={() => onChange(true)}
          className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
          style={{
            background: value === true ? 'linear-gradient(90deg,#D4AF37,#B8941E)' : 'rgba(0,0,0,0.04)',
            color: value === true ? '#000' : '#666',
            border: value === true ? 'none' : '1px solid rgba(0,0,0,0.08)',
          }}>
          Sí
        </button>
        <button type="button" onClick={() => onChange(false)}
          className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
          style={{
            background: value === false ? 'linear-gradient(90deg,#D4AF37,#B8941E)' : 'rgba(0,0,0,0.04)',
            color: value === false ? '#000' : '#666',
            border: value === false ? 'none' : '1px solid rgba(0,0,0,0.08)',
          }}>
          No
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Añadir el estado y renderizar los 3 toggles**

En `ReviewModal`, junto al `useState` de `rating` y `comment` existentes:

```typescript
const [llegoPuntual, setLlegoPuntual] = useState<boolean | null>(null);
const [cumplioAcordado, setCumplioAcordado] = useState<boolean | null>(null);
const [volveriaContratar, setVolveriaContratar] = useState<boolean | null>(null);
```

Entre el bloque de estrellas y el `<textarea>` del comentario, insertar:

```tsx
<YesNoToggle label="¿Llegó puntual al evento?" value={llegoPuntual} onChange={setLlegoPuntual} />
<YesNoToggle label="¿Cumplió con lo acordado?" value={cumplioAcordado} onChange={setCumplioAcordado} />
<YesNoToggle label="¿Volverías a contratarlo/a?" value={volveriaContratar} onChange={setVolveriaContratar} />
```

- [ ] **Step 7: Usar `canSubmitReview` en `submit()` y añadir las columnas al insert**

Reemplazar la validación actual al inicio de `submit()`:

```typescript
const submit = async () => {
  if (!booking.professional_user_id) return;
  if (!canSubmitReview(rating, comment, llegoPuntual, cumplioAcordado, volveriaContratar)) {
    if (comment.trim().length < 5) { toast.error('Escribe un comentario breve (mín. 5 caracteres).'); return; }
    toast.error('Responde las 3 preguntas antes de enviar tu valoración.');
    return;
  }
  setSaving(true);
  // ...
```

Y añadir los 3 campos al `.insert(...)` que ya crea la fila de `reviews`:

```typescript
const { error } = await supabase.from('reviews').insert({
  reviewed_user_id: booking.professional_user_id,
  reviewer_id: reviewerId || null,
  reviewer_name: reviewerProfile?.display_name || 'Organizador',
  reviewer_role: 'Organizador',
  event_type: booking.professional_role || null,
  rating,
  comment: comment.trim().slice(0, 500),
  llego_puntual: llegoPuntual,
  cumplio_acordado: cumplioAcordado,
  volveria_contratar: volveriaContratar,
  approved: false,
} as any);
```

- [ ] **Step 8: Type check**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 9: Commit**

```bash
git add src/components/dashboard/views/empresario/HistorialTab.tsx src/components/dashboard/views/empresario/reviewQuestions.test.ts
git commit -m "$(cat <<'EOF'
3 preguntas sí/no obligatorias en el formulario de valoración

Puntualidad, cumplimiento de lo acordado y recontratación, junto a las
estrellas y el comentario ya existentes en ReviewModal. Se guardan en
reviews.llego_puntual / cumplio_acordado / volveria_contratar.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Resumen de porcentajes en `ReviewsSection`

**Files:**
- Modify: `src/pages/PublicProfile.tsx`
- Test: `src/pages/PublicProfile.reviewStats.test.ts`

**Interfaces:**
- Consumes: array `reviews` ya cargado dentro de `ReviewsSection` (Task 5 columnas incluidas vía el `.select(...)` existente).
- Produces: función pura exportada `reviewQuestionStats(reviews: { llego_puntual: boolean | null; cumplio_acordado: boolean | null; volveria_contratar: boolean | null }[]): { label: string; percent: number }[]`, usada para renderizar la línea de resumen.

- [ ] **Step 1: Escribir el test de agregación**

```typescript
import { describe, it, expect } from 'vitest';
import { reviewQuestionStats } from './PublicProfile';

describe('reviewQuestionStats', () => {
  it('returns an empty array when there are no reviews', () => {
    expect(reviewQuestionStats([])).toEqual([]);
  });

  it('excludes reviews with null answers from that question\'s denominator', () => {
    const reviews = [
      { llego_puntual: true, cumplio_acordado: true, volveria_contratar: true },
      { llego_puntual: null, cumplio_acordado: null, volveria_contratar: null },
    ];
    expect(reviewQuestionStats(reviews)).toEqual([
      { label: 'dice que llegó puntual', percent: 100 },
      { label: 'cumplió lo acordado', percent: 100 },
      { label: 'repetiría', percent: 100 },
    ]);
  });

  it('omits a question entirely if every review has it null', () => {
    const reviews = [{ llego_puntual: null, cumplio_acordado: true, volveria_contratar: true }];
    const stats = reviewQuestionStats(reviews);
    expect(stats.find((s) => s.label.includes('puntual'))).toBeUndefined();
    expect(stats).toHaveLength(2);
  });

  it('computes a mixed percentage', () => {
    const reviews = [
      { llego_puntual: true, cumplio_acordado: true, volveria_contratar: true },
      { llego_puntual: false, cumplio_acordado: true, volveria_contratar: true },
    ];
    expect(reviewQuestionStats(reviews)[0]).toEqual({ label: 'dice que llegó puntual', percent: 50 });
  });
});
```

- [ ] **Step 2: Ejecutar el test para verificar que falla**

Run: `npx vitest run src/pages/PublicProfile.reviewStats.test.ts`
Expected: FAIL — `reviewQuestionStats` no existe o no está exportada.

- [ ] **Step 3: Implementar la función**

En `src/pages/PublicProfile.tsx`, junto a `responseBucketLabel` (Task 4):

```typescript
export function reviewQuestionStats(
  reviews: { llego_puntual: boolean | null; cumplio_acordado: boolean | null; volveria_contratar: boolean | null }[],
): { label: string; percent: number }[] {
  const questions: { key: 'llego_puntual' | 'cumplio_acordado' | 'volveria_contratar'; label: string }[] = [
    { key: 'llego_puntual', label: 'dice que llegó puntual' },
    { key: 'cumplio_acordado', label: 'cumplió lo acordado' },
    { key: 'volveria_contratar', label: 'repetiría' },
  ];

  const stats: { label: string; percent: number }[] = [];
  for (const q of questions) {
    const answered = reviews.filter((r) => r[q.key] !== null);
    if (answered.length === 0) continue;
    const yes = answered.filter((r) => r[q.key] === true).length;
    stats.push({ label: q.label, percent: Math.round((yes / answered.length) * 100) });
  }
  return stats;
}
```

- [ ] **Step 4: Ejecutar el test para verificar que pasa**

Run: `npx vitest run src/pages/PublicProfile.reviewStats.test.ts`
Expected: PASS.

- [ ] **Step 5: Actualizar el tipo `Review` y el `.select(...)` de `ReviewsSection`**

En el tipo `Review` (cerca de la línea 26 de `PublicProfile.tsx`), añadir:

```typescript
llego_puntual: boolean | null;
cumplio_acordado: boolean | null;
volveria_contratar: boolean | null;
```

En el `.select(...)` dentro de `ReviewsSection` (línea ~126) que ya trae `id, reviewer_name, reviewer_role, event_type, rating, comment, created_at, approved`, añadir las 3 columnas nuevas a la lista.

- [ ] **Step 6: Renderizar la línea de resumen**

En `ReviewsSection`, justo antes del bloque `{/* Reviews list */}` (línea ~262), insertar:

```tsx
{reviews.length > 0 && reviewQuestionStats(reviews).length > 0 && (
  <p className="text-xs mb-3" style={{ color: '#666' }}>
    {reviewQuestionStats(reviews).map((s) => `${s.percent}% ${s.label}`).join(' · ')}
  </p>
)}
```

- [ ] **Step 7: Type check**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 8: Commit**

```bash
git add src/pages/PublicProfile.tsx src/pages/PublicProfile.reviewStats.test.ts
git commit -m "$(cat <<'EOF'
Resumen de puntualidad/cumplimiento/recontratación en el perfil público

Línea de porcentajes agregados sobre las reseñas aprobadas, calculados
solo sobre respuestas no nulas por pregunta (denominadores independientes),
encima de la lista de reseñas individuales en ReviewsSection.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Completar reseñas antiguas — UI en `HistorialTab.tsx`

**Files:**
- Modify: `src/components/dashboard/views/empresario/HistorialTab.tsx`
- Test: `src/components/dashboard/views/empresario/incompleteReviews.test.ts`

**Interfaces:**
- Consumes: `ownReviews`/reseñas propias ya cargadas por el empresario en `HistorialTab.tsx` (query existente sobre `reviews` con `reviewer_id = user.id`).
- Produces: función pura exportada `isReviewIncomplete(review: { llego_puntual: boolean | null; cumplio_acordado: boolean | null; volveria_contratar: boolean | null }): boolean`; componente `CompleteReviewModal` que hace `UPDATE` sobre una fila existente de `reviews`.

- [ ] **Step 1: Escribir el test de detección**

```typescript
import { describe, it, expect } from 'vitest';
import { isReviewIncomplete } from './HistorialTab';

describe('isReviewIncomplete', () => {
  it('is incomplete if any of the three answers is null', () => {
    expect(isReviewIncomplete({ llego_puntual: null, cumplio_acordado: true, volveria_contratar: true })).toBe(true);
  });

  it('is complete when all three answers are present', () => {
    expect(isReviewIncomplete({ llego_puntual: true, cumplio_acordado: false, volveria_contratar: true })).toBe(false);
  });
});
```

- [ ] **Step 2: Ejecutar el test para verificar que falla**

Run: `npx vitest run src/components/dashboard/views/empresario/incompleteReviews.test.ts`
Expected: FAIL — `isReviewIncomplete` no existe o no está exportada.

- [ ] **Step 3: Implementar la función**

En `src/components/dashboard/views/empresario/HistorialTab.tsx`, junto a `canSubmitReview` (Task 5):

```typescript
export function isReviewIncomplete(review: {
  llego_puntual: boolean | null;
  cumplio_acordado: boolean | null;
  volveria_contratar: boolean | null;
}): boolean {
  return review.llego_puntual === null || review.cumplio_acordado === null || review.volveria_contratar === null;
}
```

- [ ] **Step 4: Ejecutar el test para verificar que pasa**

Run: `npx vitest run src/components/dashboard/views/empresario/incompleteReviews.test.ts`
Expected: PASS.

- [ ] **Step 5: Ampliar la query de `ownReviews` para incluir `id` y las 3 columnas**

En `HistorialTab.tsx`, la query que carga `ownReviews` (línea ~114) selecciona hoy `rating, comment, reviewer_name, created_at`. Cambiar a:

```typescript
const { data: own } = await supabase
  .from('reviews')
  .select('id, rating, comment, reviewer_name, created_at, llego_puntual, cumplio_acordado, volveria_contratar, reviewed_user_id')
  .eq('reviewer_id', user.id)
  .eq('approved', true);
setOwnReviews(own ?? []);
```

Actualizar el tipo del `useState<{...}[]>` de `ownReviews` (línea ~48) para incluir los campos nuevos: `id: string`, `llego_puntual: boolean | null`, `cumplio_acordado: boolean | null`, `volveria_contratar: boolean | null`, `reviewed_user_id: string`.

- [ ] **Step 6: Añadir `CompleteReviewModal` (reutiliza `YesNoToggle` de Task 5)**

En `HistorialTab.tsx`, nuevo componente al mismo nivel que `ReviewModal`:

```tsx
function CompleteReviewModal({ review, onClose, onDone }: {
  review: { id: string; reviewed_user_id: string };
  onClose: () => void;
  onDone: () => void;
}) {
  const [llegoPuntual, setLlegoPuntual] = useState<boolean | null>(null);
  const [cumplioAcordado, setCumplioAcordado] = useState<boolean | null>(null);
  const [volveriaContratar, setVolveriaContratar] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (llegoPuntual === null || cumplioAcordado === null || volveriaContratar === null) {
      toast.error('Responde las 3 preguntas antes de enviar.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('reviews')
      .update({ llego_puntual: llegoPuntual, cumplio_acordado: cumplioAcordado, volveria_contratar: volveriaContratar })
      .eq('id', review.id);
    setSaving(false);
    if (error) { toast.error('No se pudo guardar. Inténtalo de nuevo.'); return; }
    toast.success('¡Gracias por completar tu valoración!');
    onDone();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl p-5" style={{ background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-black" style={{ color: '#111' }}>Completa tu valoración</p>
          <button onClick={onClose} aria-label="Cerrar" className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.05)' }}>
            <XCircle size={16} color="#666" />
          </button>
        </div>
        <YesNoToggle label="¿Llegó puntual al evento?" value={llegoPuntual} onChange={setLlegoPuntual} />
        <YesNoToggle label="¿Cumplió con lo acordado?" value={cumplioAcordado} onChange={setCumplioAcordado} />
        <YesNoToggle label="¿Volverías a contratarlo/a?" value={volveriaContratar} onChange={setVolveriaContratar} />
        <button onClick={submit} disabled={saving}
          className="w-full py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105 disabled:opacity-50 mt-2"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          {saving ? 'Enviando…' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Renderizar el botón "Completa tu valoración" junto a cada reseña incompleta**

En el bloque que renderiza `ownReviews.map(...)` (línea ~676), dentro de cada tarjeta de reseña, añadir tras el comentario:

```tsx
{isReviewIncomplete(r) && (
  <button onClick={() => setCompletingReview(r)}
    className="mt-2 px-2.5 py-1 rounded-lg text-[0.7rem] font-bold"
    style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#8A6D0F' }}>
    Completa tu valoración
  </button>
)}
```

Añadir el estado `const [completingReview, setCompletingReview] = useState<typeof ownReviews[number] | null>(null);` junto a los demás `useState` del componente principal, y renderizar el modal al final del componente, junto al `{reviewing && <ReviewModal .../>}` existente:

```tsx
{completingReview && (
  <CompleteReviewModal
    review={completingReview}
    onClose={() => setCompletingReview(null)}
    onDone={() => {
      setOwnReviews(prev => prev.map(r => r.id === completingReview.id
        ? { ...r, llego_puntual: true, cumplio_acordado: true, volveria_contratar: true }
        : r));
      setCompletingReview(null);
    }}
  />
)}
```

Nota: el `onDone` de arriba fuerza `true` como placeholder visual local tras guardar — es aceptable porque la fila real ya se actualizó en la base de datos vía `submit()`; para reflejar los valores exactos elegidos, `CompleteReviewModal` puede llamar a `onDone` pasándole los 3 valores en vez de no pasar nada. Ajustar la firma de `onDone` a `(answers: { llego_puntual: boolean; cumplio_acordado: boolean; volveria_contratar: boolean }) => void` y el `setOwnReviews` para usar esos valores reales en vez de `true` fijo.

- [ ] **Step 8: Type check**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 9: Commit**

```bash
git add src/components/dashboard/views/empresario/HistorialTab.tsx src/components/dashboard/views/empresario/incompleteReviews.test.ts
git commit -m "$(cat <<'EOF'
Flujo para completar reseñas antiguas sin las 3 preguntas nuevas

El empresario ve un botón "Completa tu valoración" junto a cualquier
reseña propia con llego_puntual/cumplio_acordado/volveria_contratar en
null, y puede rellenarlas sin repetir estrellas ni comentario.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Email de aviso para completar reseñas antiguas (con exclusión de cuentas demo)

**Files:**
- Create: `supabase/functions/complete-review-reminder/index.ts`
- Create: `supabase/migrations/20260916100200_cron_complete_review_reminder.sql`
- Test: `supabase/functions/complete-review-reminder/isDemoAccount.test.ts`

**Interfaces:**
- Consumes: `reviews` con columnas nuevas (Task 1), tabla `email_logs` (ya usada por `review-reminder`, ver `supabase/functions/review-reminder/index.ts:74-108`), edge function `send-email` existente.
- Produces: función pura `isDemoAccount(email: string): boolean`, exportada para test; edge function invocable por cron que envía como máximo 1 email por reseña incompleta (deduplicado vía `email_logs`, mismo patrón que `review-reminder`).

- [ ] **Step 1: Escribir el test de `isDemoAccount`**

Como las edge functions de Supabase corren en Deno y no pasan por el pipeline de Vitest del frontend, esta función pura se testea copiándola a un archivo TypeScript plano importable por Vitest (mismo directorio que la función, sin dependencias de Deno):

```typescript
import { describe, it, expect } from 'vitest';
import { isDemoAccount } from './isDemoAccount';

describe('isDemoAccount', () => {
  it('flags the known Apple review demo accounts', () => {
    expect(isDemoAccount('demo.organizador@xpeak.es')).toBe(true);
    expect(isDemoAccount('demo.profesional@xpeak.es')).toBe(true);
  });

  it('flags any email starting with demo. on the xpeak.es domain', () => {
    expect(isDemoAccount('demo.otro@xpeak.es')).toBe(true);
  });

  it('does not flag a real user email', () => {
    expect(isDemoAccount('gonzalo.dj@gmail.com')).toBe(false);
    expect(isDemoAccount('organizador.real@xpeak.es')).toBe(false);
  });
});
```

- [ ] **Step 2: Ejecutar el test para verificar que falla**

Run: `npx vitest run supabase/functions/complete-review-reminder/isDemoAccount.test.ts`
Expected: FAIL — el módulo `./isDemoAccount` no existe.

- [ ] **Step 3: Implementar `isDemoAccount` como módulo compartido**

Create: `supabase/functions/complete-review-reminder/isDemoAccount.ts`

```typescript
// Cuentas de autocontrato/demo para la revisión de Apple (ver memoria del
// proyecto: demo.organizador@ / demo.profesional@xpeak.es generan
// actividad fake, no clientes reales) — nunca deben recibir emails
// automáticos de producto como este recordatorio.
export function isDemoAccount(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return normalized.startsWith('demo.') && normalized.endsWith('@xpeak.es');
}
```

- [ ] **Step 4: Ejecutar el test para verificar que pasa**

Run: `npx vitest run supabase/functions/complete-review-reminder/isDemoAccount.test.ts`
Expected: PASS.

- [ ] **Step 5: Escribir la edge function**

Create: `supabase/functions/complete-review-reminder/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { isDemoAccount } from './isDemoAccount.ts';

// Recordatorio para empresarios con reseñas anteriores al 16 sep 2026 que
// no tienen las 3 preguntas nuevas (llego_puntual / cumplio_acordado /
// volveria_contratar en null). Mismo patrón de deduplicación por
// email_logs que review-reminder. Nunca se envía a cuentas demo
// (demo.*@xpeak.es) — ver isDemoAccount.ts.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const admin = createClient(supabaseUrl, serviceKey);

  const { data: incomplete, error: fetchError } = await admin
    .from('reviews')
    .select('id, reviewer_id, reviewed_user_id')
    .eq('approved', true)
    .or('llego_puntual.is.null,cumplio_acordado.is.null,volveria_contratar.is.null')
    .not('reviewer_id', 'is', null);

  if (fetchError) {
    console.error('[complete-review-reminder] fetch error', fetchError);
    return new Response(JSON.stringify({ error: fetchError.message }), { status: 500, headers: corsHeaders });
  }

  if (!incomplete?.length) {
    return new Response(JSON.stringify({ sent: 0, message: 'No incomplete reviews' }), { headers: corsHeaders });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const r of incomplete) {
    const logKey = `complete_review_reminder_${r.id}`;
    const { data: existingLog } = await admin
      .from('email_logs' as any)
      .select('id')
      .eq('user_id', r.reviewer_id)
      .eq('type', logKey)
      .maybeSingle();
    if (existingLog) continue;

    const { data: userData, error: userError } = await admin.auth.admin.getUserById(r.reviewer_id as string);
    if (userError || !userData?.user?.email) continue;
    if (isDemoAccount(userData.user.email)) continue;

    const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}` },
      body: JSON.stringify({
        type: 'completar_valoracion',
        data: { email: userData.user.email, ref: r.reviewed_user_id },
      }),
    });

    if (!res.ok) {
      console.error('[complete-review-reminder] send failed for', r.reviewer_id, await res.text());
      errors.push(r.reviewer_id as string);
      continue;
    }

    await admin.from('email_logs' as any).insert({
      user_id: r.reviewer_id,
      type: logKey,
      sent_at: new Date().toISOString(),
    }).catch(() => { /* non-critical */ });

    sent++;
  }

  return new Response(JSON.stringify({ sent, errors: errors.length, checked: incomplete.length }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
```

- [ ] **Step 6: Confirmar que la plantilla de email existe o crearla**

Run: `grep -n "completar_valoracion\|pedir_valoracion" supabase/functions/send-email/index.ts`
Expected: si `pedir_valoracion` existe pero `completar_valoracion` no, añadir una plantilla nueva en `send-email/index.ts` siguiendo el mismo formato que `pedir_valoracion` (mismo archivo, buscar el `switch`/objeto de plantillas), con asunto "Termina tu valoración en XPEAK" y cuerpo pidiendo completar las 3 preguntas, enlazando a `https://xpeak.es/p/:slug` del profesional (usando `data.ref` como `reviewed_user_id` para resolver el slug o enlazar directo por id si el perfil público lo admite).

- [ ] **Step 7: Desplegar la función**

Run: `npx supabase functions deploy complete-review-reminder --project-ref ddrqhwravupjzysriblq` (confirmar con el usuario antes de desplegar).

Expected: despliegue sin errores.

- [ ] **Step 8: Cron diario**

Create: `supabase/migrations/20260916100200_cron_complete_review_reminder.sql`

```sql
-- Cron diario: recuerda a empresarios con reseñas aprobadas anteriores al
-- 16 sep 2026 (sin las 3 preguntas nuevas) que pueden completarlas.
-- Nunca alcanza a cuentas demo (ver isDemoAccount.ts en la función).
SELECT cron.schedule(
  'xpeak-complete-review-reminder',
  '0 11 * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/complete-review-reminder',
    headers := '{"Authorization":"Bearer ' || current_setting('app.service_role_key') || '","Content-Type":"application/json"}'::jsonb,
    body := '{}'::jsonb);
  $$
);
```

Run: `npx supabase db push` (confirmar con el usuario antes de aplicar a producción).

Expected: `SELECT * FROM cron.job WHERE jobname = 'xpeak-complete-review-reminder';` devuelve 1 fila.

- [ ] **Step 9: Commit**

```bash
git add supabase/functions/complete-review-reminder supabase/migrations/20260916100200_cron_complete_review_reminder.sql
git commit -m "$(cat <<'EOF'
Recordatorio por email para completar reseñas antiguas

Avisa a empresarios con reseñas aprobadas sin las 3 preguntas nuevas,
deduplicado por email_logs igual que review-reminder. Excluye
explícitamente las cuentas demo.*@xpeak.es de Apple review.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Verificación end-to-end en navegador

**Files:** ninguno (solo verificación manual/automatizada con Chrome DevTools MCP).

**Interfaces:**
- Consumes: todo lo construido en Tasks 1-8.

- [ ] **Step 1: Arrancar el dev server**

Run: `npm run dev` (o confirmar que ya está corriendo en background).

- [ ] **Step 2: Verificar el chip de tiempo de respuesta**

Navegar a un perfil público (`/p/:slug`) de un profesional cuyo `profiles.response_bucket` se haya rellenado en el Step 3 de Task 2. Confirmar visualmente que el chip "⚡ Responde en X" aparece en la fila de tags, junto al chip de rating.

- [ ] **Step 3: Verificar el formulario de reseña con las 3 preguntas**

Como usuario empresario con un booking `confirmed`/`completed`, abrir `HistorialTab.tsx`, pulsar "Valorar", confirmar que el botón de envío está deshabilitado o muestra error hasta responder las 3 preguntas, y que tras enviar la reseña queda en `reviews` con los 3 campos rellenos (verificar con `execute_sql` sobre el proyecto de Supabase).

- [ ] **Step 4: Verificar el resumen de porcentajes**

Con al menos una reseña aprobada (`approved = true`) con las 3 respuestas, recargar el perfil público del profesional reseñado y confirmar que aparece la línea "X% dice que llegó puntual · X% cumplió lo acordado · X% repetiría" encima de la lista de reseñas.

- [ ] **Step 5: Verificar el flujo de completar reseña antigua**

Con la reseña de prueba existente en producción (`reviewer_id` = Gonzalo DJ, ver Task de investigación previa) o una reseña de prueba creada localmente con las 3 columnas en `null`, confirmar que el botón "Completa tu valoración" aparece en `HistorialTab.tsx` y que al rellenarlo y enviar, la fila en `reviews` queda con los 3 campos actualizados.

- [ ] **Step 6: Ejecutar toda la suite de tests**

Run: `npm test`
Expected: todos los tests pasan, incluidos los nuevos de Tasks 4-8.

- [ ] **Step 7: Type check final**

Run: `npx tsc --noEmit`
Expected: sin errores.
