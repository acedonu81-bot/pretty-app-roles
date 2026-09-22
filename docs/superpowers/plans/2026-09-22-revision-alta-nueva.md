# Revisión de altas nuevas con gate de visibilidad — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un alta nueva queda oculta al público hasta que un admin la aprueba desde el panel viendo la ficha pública real; al aprobar pasa a visible y se avisa por email, al rechazar queda oculta con motivo.

**Architecture:** Gate a nivel de RLS en Postgres (dos policies de SELECT en `profiles` pasan de `true` a exigir `validation_status='approved' OR es el dueño OR es admin`) para no tener que tocar los ~15 sitios de frontend que leen `profiles`. El panel admin gana un flujo de aprobar/rechazar sobre `AdminNewProfileAlert.tsx`, reutilizando la ruta pública `/p/:slug` (que ya acepta un UUID) para mostrar la ficha completa en vez de reconstruir una vista propia. El email `welcome` se actualiza para no prometer visibilidad inmediata.

**Tech Stack:** Supabase (Postgres + RLS + Edge Functions Deno), React + TypeScript + Tailwind, sonner (toast).

**Spec:** `docs/superpowers/specs/2026-09-22-revision-alta-nueva-design.md`

## Global Constraints

- Responder siempre en español (copy de UI y emails en español).
- No crear archivos .md de documentación salvo que se pida (este plan y la spec son la excepción ya solicitada).
- No hacer deploy a producción salvo que se pida explícitamente — solo commits locales.
- Migraciones SQL van en `supabase/migrations/` con timestamp `YYYYMMDDHHmmss_descripcion.sql`, aplicadas con `mcp__claude_ai_Supabase__apply_migration` (o `execute_sql` para verificación de solo lectura).
- No añadir columnas nuevas: se reutiliza `validation_status` (valores existentes: `pending`, `approved`, `rejected`, `awaiting_admin`, `rookie`) y `admin_seen_at`.
- Verificación de UI: no hay RTL/vitest para componentes en este repo — se verifica en el navegador real (chrome-devtools MCP) contra `npm run dev`, no solo con `tsc --noEmit`.

---

## File Structure

- **Modify:** `supabase/migrations/` → nueva migración `20260922120000_gate_visibilidad_perfiles_pending.sql` (RLS + backfill de los 34 `pending` actuales a `approved`).
- **Modify:** `src/components/dashboard/views/admin/AdminNewProfileAlert.tsx` → cambia la fuente de datos de `admin_seen_at IS NULL` a `validation_status = 'pending'`, añade botones Ver ficha / Aprobar / Rechazar.
- **Modify:** `supabase/functions/send-email/index.ts` → texto de la plantilla `welcome` (línea ~203-216); confirma que `admin_rejected` acepta un campo `reason` en el body (nuevo uso, primera vez que se invoca desde código).
- **No se tocan:** `AdminUserManagement.tsx`, `PublicProfile.tsx`, ni ningún componente de directorio/búsqueda — el gate es transparente para ellos gracias al RLS.

---

## Task 1: Migración SQL — gate de RLS + backfill

**Files:**
- Create: `supabase/migrations/20260922120000_gate_visibilidad_perfiles_pending.sql`

**Interfaces:**
- Produces: policies `Anon can view approved profiles` y `Authenticated can view approved or own profiles` en `public.profiles`, reemplazando las dos policies `true` existentes (`Anon can view basic profiles`, `Authenticated users can view profiles`). Cualquier query de frontend que ya lea `profiles` empieza a recibir automáticamente solo filas `approved` (más la propia y, si el caller es admin, todas).

- [ ] **Step 1: Confirmar el estado actual de las policies antes de tocar nada**

Ejecutar con `mcp__claude_ai_Supabase__execute_sql` (project_id `ddrqhwravupjzysriblq`):

```sql
select policyname, cmd, roles, qual from pg_policies
where tablename = 'profiles' and cmd = 'SELECT';
```

Expected: dos filas, `Anon can view basic profiles` (roles `{anon}`, qual `true`) y `Authenticated users can view profiles` (roles `{authenticated}`, qual `true`).

- [ ] **Step 2: Escribir la migración**

```sql
-- Gate de visibilidad: un perfil pending/rejected/awaiting_admin/rookie deja
-- de ser visible para el público. Solo el dueño de la fila y un admin lo ven
-- mientras no está approved. Ver docs/superpowers/specs/2026-09-22-revision-alta-nueva-design.md

BEGIN;

DROP POLICY IF EXISTS "Anon can view basic profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Anon can view approved profiles" ON public.profiles FOR SELECT TO anon
  USING (validation_status = 'approved');

CREATE POLICY "Authenticated can view approved or own profiles" ON public.profiles FOR SELECT TO authenticated
  USING (
    validation_status = 'approved'
    OR (select auth.uid()) = user_id
    OR has_role((select auth.uid()), 'admin'::text)
  );

-- Backfill: los perfiles pending existentes llevan tiempo visibles sin que
-- nadie los revisara nunca (el campo no bloqueaba nada hasta ahora). El gate
-- nuevo aplica solo hacia adelante, a altas futuras — no se despublican de
-- golpe perfiles que ya funcionaban.
UPDATE public.profiles SET validation_status = 'approved' WHERE validation_status = 'pending';

COMMIT;
```

- [ ] **Step 3: Aplicar la migración**

Usar `mcp__claude_ai_Supabase__apply_migration` con `project_id: ddrqhwravupjzysriblq`, `name: gate_visibilidad_perfiles_pending`, pegando el SQL del Step 2.

- [ ] **Step 4: Verificar el backfill**

```sql
select validation_status, count(*) from public.profiles group by validation_status;
```

Expected: `pending` ya no aparece (o aparece con `count 0`); `approved` subió en ~34 respecto al valor previo (35 → ~69).

- [ ] **Step 5: Verificar que el gate bloquea de verdad para el rol anon**

```sql
set role anon;
select count(*) from public.profiles where validation_status != 'approved';
reset role;
```

Expected: `0` — el rol `anon` no puede ver ninguna fila no aprobada, sin importar cuántas existan realmente.

- [ ] **Step 6: Commit**

```bash
cd /Users/danielacedonunez/pretty-app-roles
git add supabase/migrations/20260922120000_gate_visibilidad_perfiles_pending.sql
git commit -m "feat: gate de visibilidad para perfiles pending via RLS

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 2: Plantilla de email `welcome` — avisar revisión pendiente

**Files:**
- Modify: `supabase/functions/send-email/index.ts:203-216`

**Interfaces:**
- Consumes: nada nuevo — sigue recibiendo `d.name`, `d.role` como hoy.
- Produces: nada que otras tasks consuman; es un cambio de copy aislado.

- [ ] **Step 1: Leer el bloque actual para confirmar líneas exactas**

Ya confirmado en la exploración: líneas 203-216 de `supabase/functions/send-email/index.ts`.

```ts
  welcome: (d) => ({
    subject: `Bienvenido a XPEAK, ${esc(d.name)}`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Hola, ${esc(d.name)}</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Tu perfil como <strong style="color:#D4AF37">${esc(rolLegible(d.role))}</strong> ya está activo en XPEAK.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Completa tu información para aparecer en el directorio y empezar a recibir contactos de empresarios de toda España.
      </p>
      ${btn('Completar mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">Cualquier duda, responde a este email.</p>`),
  }),
```

- [ ] **Step 2: Reemplazar el texto para reflejar la revisión pendiente**

```ts
  welcome: (d) => ({
    subject: `Bienvenido a XPEAK, ${esc(d.name)}`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Hola, ${esc(d.name)}</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Tu perfil como <strong style="color:#D4AF37">${esc(rolLegible(d.role))}</strong> se está revisando por nuestra política de verificación. En cuanto lo aprobemos, aparecerás en el directorio y podrás recibir contactos de empresarios de toda España.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Mientras tanto, completa tu información — cuanto más completo esté tu perfil, antes lo revisamos.
      </p>
      ${btn('Completar mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">Cualquier duda, responde a este email.</p>`),
  }),
```

- [ ] **Step 3: Type-check**

Run: `cd /Users/danielacedonunez/pretty-app-roles && npx tsc --noEmit`
Expected: sin errores nuevos relacionados con `send-email/index.ts`.

- [ ] **Step 4: Commit**

```bash
git add supabase/functions/send-email/index.ts
git commit -m "fix: email de bienvenida avisa que el perfil esta en revision

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 3: `admin_rejected` acepta motivo del admin

**Files:**
- Modify: `supabase/functions/send-email/index.ts:798-811`

**Interfaces:**
- Consumes: `d.name`, `d.reason` (nuevo campo, string).
- Produces: la plantilla `admin_rejected` ahora inserta el motivo cuando se le pasa; Task 5 la invoca con `{ user_id, name, reason }`.

- [ ] **Step 1: Confirmar el bloque actual**

```ts
  admin_rejected: (d) => ({
    subject: `Actualización sobre tu perfil XPEAK`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Sobre tu solicitud de validación</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Hola <strong style="color:#0a0908">${esc(d.name)}</strong>, hemos revisado tu perfil y en este momento no cumple los criterios mínimos para aparecer en el directorio.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Puedes completar tu perfil con más información (audio, bio, zona) y volver a solicitar validación cuando esté listo.
      </p>
      ${btn('Mejorar mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">¿Tienes preguntas? Escríbenos a <a href="mailto:info@xpeak.site" style="color:#D4AF37">info@xpeak.site</a></p>`),
  }),
```

- [ ] **Step 2: Insertar el motivo cuando exista, sin romper si viene vacío**

```ts
  admin_rejected: (d) => ({
    subject: `Actualización sobre tu perfil XPEAK`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Sobre tu solicitud de validación</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Hola <strong style="color:#0a0908">${esc(d.name)}</strong>, hemos revisado tu perfil y en este momento no cumple los criterios mínimos para aparecer en el directorio.
      </p>
      ${d.reason ? `<p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px"><strong>Motivo:</strong> ${esc(d.reason)}</p>` : ''}
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Puedes completar tu perfil con más información (audio, bio, zona) y volver a solicitar validación cuando esté listo.
      </p>
      ${btn('Mejorar mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">¿Tienes preguntas? Escríbenos a <a href="mailto:info@xpeak.site" style="color:#D4AF37">info@xpeak.site</a></p>`),
  }),
```

- [ ] **Step 3: Type-check**

Run: `cd /Users/danielacedonunez/pretty-app-roles && npx tsc --noEmit`
Expected: sin errores nuevos.

- [ ] **Step 4: Commit**

```bash
git add supabase/functions/send-email/index.ts
git commit -m "feat: admin_rejected incluye el motivo cuando el admin lo indica

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 4: `AdminNewProfileAlert` — leer de `validation_status='pending'`

**Files:**
- Modify: `src/components/dashboard/views/admin/AdminNewProfileAlert.tsx`

**Interfaces:**
- Consumes: tabla `profiles` vía `supabase.from('profiles')`, columnas `user_id, display_name, role, zone, region, photo_url, created_at, validation_status`.
- Produces: el componente pasa a mostrar únicamente perfiles `validation_status = 'pending'` en vez de `admin_seen_at IS NULL`. Deja intacto el botón "Marcar como visto" (sigue actualizando `admin_seen_at`, usado por otras vistas), pero dentro de cada fila añade los puntos de entrada que Task 5 completará: un link "Ver ficha completa" y placeholders de Aprobar/Rechazar por fila.

- [ ] **Step 1: Cambiar la query del `useEffect`**

En el archivo actual (líneas 32-46), sustituir:

```ts
  useEffect(() => {
    let cancelled = false;
    (supabase.from('profiles') as any)
      .select('user_id, display_name, role, zone, region, photo_url, created_at')
      .is('admin_seen_at', null)
      .eq('is_seed', false)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }: { data: NewProfile[] | null }) => {
        if (!cancelled) setPending(data ?? []);
      });
    return () => { cancelled = true; };
  }, []);
```

por:

```ts
  useEffect(() => {
    let cancelled = false;
    (supabase.from('profiles') as any)
      .select('user_id, display_name, role, zone, region, photo_url, created_at')
      .eq('validation_status', 'pending')
      .eq('is_seed', false)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }: { data: NewProfile[] | null }) => {
        if (!cancelled) setPending(data ?? []);
      });
    return () => { cancelled = true; };
  }, []);
```

Justificación (para el comentario que ya está en el archivo, líneas 6-14): el gate de visibilidad ahora depende de `validation_status`, así que este es el criterio que realmente importa para "necesita revisión" — `admin_seen_at` pasa a ser solo un tracking de lectura, no el gate.

- [ ] **Step 2: Actualizar el comentario de cabecera del archivo**

Reemplazar el comentario de las líneas 6-14 (el que explica el origen del componente) añadiendo una frase sobre el nuevo criterio, sin borrar el contexto histórico:

```tsx
// Aviso de altas nuevas sin revisar, hermano del banner rojo de bajas
// (AdminDeletionAlert). Nace del caso del 2 sep 2026: una profesional se
// registro con el rol equivocado y una ciudad fuera de la lista de filtros, y
// quedo invisible en el directorio sin que nadie se enterara. El email de aviso
// ayuda, pero un correo se pierde; el panel es donde se entra a mirar.
//
// Desde el 22 sep 2026 un alta en validation_status='pending' tambien esta
// oculta al publico via RLS (ver spec docs/superpowers/specs/2026-09-22-revision-alta-nueva-design.md),
// asi que este panel dejo de ser solo un aviso: es donde se aprueba o rechaza,
// y hasta que eso pasa el perfil no es visible para nadie salvo su dueno.
//
// Verde y no rojo porque un alta es una buena noticia — lo que urge no es
// alarmarse, es revisar que el rol y la zona son correctos antes de que pasen
// dias. Por eso se marcan en ambar los datos que suelen venir mal.
```

- [ ] **Step 3: Verificar en el navegador que la lista ahora se basa en pending**

Con `npm run dev` corriendo, entrar al panel admin autenticado como admin y confirmar (via Network tab o chrome-devtools `list_network_requests`) que la query a `profiles` filtra por `validation_status=eq.pending` en vez de `admin_seen_at=is.null`.

- [ ] **Step 4: Commit**

```bash
git add src/components/dashboard/views/admin/AdminNewProfileAlert.tsx
git commit -m "feat: alta nueva se basa en validation_status pending, no solo admin_seen_at

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 5: `AdminNewProfileAlert` — botones Ver ficha / Aprobar / Rechazar

**Files:**
- Modify: `src/components/dashboard/views/admin/AdminNewProfileAlert.tsx`

**Interfaces:**
- Consumes: `supabase.functions.invoke('send-email', { body: { type: 'admin_approved' | 'admin_rejected', data: { user_id, name, role, reason? } } })` (patrón ya usado en `AdminUserManagement.tsx:67-72`); plantillas `admin_approved` (existente, sin cambios) y `admin_rejected` (Task 3, ahora acepta `reason`).
- Produces: cada fila de la lista gana tres acciones. El componente sigue exportando `AdminNewProfileAlert` como default, sin cambiar su firma de props (`{ onOpenUsers?: () => void }`).

- [ ] **Step 1: Añadir `validation_status` al tipo `NewProfile` y al SELECT**

```ts
interface NewProfile {
  user_id: string;
  display_name: string | null;
  role: string | null;
  zone: string | null;
  region: string | null;
  photo_url: string | null;
  created_at: string;
}
```

No requiere cambio — `validation_status` no hace falta en el tipo porque la lista ya viene pre-filtrada por el SELECT (Task 4). Saltar este paso si Task 4 ya está aplicada.

- [ ] **Step 2: Añadir estado local para el motivo de rechazo y la fila en revisión**

Justo debajo de `const [acking, setAcking] = useState(false);`:

```ts
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
```

- [ ] **Step 3: Añadir las funciones `approveProfile` y `rejectProfile`**

Debajo de la función `markSeen` existente:

```ts
  const approveProfile = async (p: NewProfile) => {
    setProcessingId(p.user_id);
    const { error } = await (supabase.from('profiles') as any)
      .update({ validation_status: 'approved' })
      .eq('user_id', p.user_id);
    if (error) { setProcessingId(null); return; }
    setPending(prev => prev.filter(x => x.user_id !== p.user_id));
    setProcessingId(null);
    supabase.functions.invoke('send-email', {
      body: {
        type: 'admin_approved',
        data: { user_id: p.user_id, name: p.display_name, role: p.role },
      },
    }).catch((err: unknown) => console.warn('[AdminNewProfileAlert] approved email failed:', err));
  };

  const rejectProfile = async (p: NewProfile, reason: string) => {
    setProcessingId(p.user_id);
    const { error } = await (supabase.from('profiles') as any)
      .update({ validation_status: 'rejected' })
      .eq('user_id', p.user_id);
    if (error) { setProcessingId(null); return; }
    setPending(prev => prev.filter(x => x.user_id !== p.user_id));
    setProcessingId(null);
    setRejectingId(null);
    setRejectReason('');
    supabase.functions.invoke('send-email', {
      body: {
        type: 'admin_rejected',
        data: { user_id: p.user_id, name: p.display_name, reason },
      },
    }).catch((err: unknown) => console.warn('[AdminNewProfileAlert] rejected email failed:', err));
  };
```

- [ ] **Step 4: Añadir los botones dentro de cada `<li>` de la lista**

El `<li>` actual (líneas 86-101 antes de esta task) muestra datos en línea. Añadir debajo de los `<span>` de datos, dentro del mismo `<li>`, un bloque de acciones y — condicionalmente — el input de motivo de rechazo:

```tsx
                return (
                  <li key={p.user_id} className="text-xs" style={{ color: '#166534' }}>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="font-bold">{p.display_name || 'Sin nombre'}</span>
                      <span>· {roleLabel(p.role)}</span>
                      <span>· {p.zone || 'sin zona'}</span>
                      <span>· {new Date(p.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      {sinZona && (
                        <span className="px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-1" style={{ background: 'rgba(217,119,6,0.14)', color: '#92400e' }}>
                          <AlertTriangle size={10} strokeWidth={3} /> sin comunidad
                        </span>
                      )}
                      {sinFoto && (
                        <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(217,119,6,0.14)', color: '#92400e' }}>sin foto</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <a
                        href={`/p/${p.user_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold underline"
                        style={{ color: '#14532d' }}
                      >
                        Ver ficha completa →
                      </a>
                      <button
                        onClick={() => approveProfile(p)}
                        disabled={processingId === p.user_id}
                        className="px-2 py-1 rounded font-bold disabled:opacity-50"
                        style={{ background: '#16a34a', color: '#fff' }}
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => setRejectingId(rejectingId === p.user_id ? null : p.user_id)}
                        disabled={processingId === p.user_id}
                        className="px-2 py-1 rounded font-bold disabled:opacity-50"
                        style={{ background: '#fff', color: '#b91c1c', border: '1px solid #b91c1c' }}
                      >
                        Rechazar
                      </button>
                    </div>
                    {rejectingId === p.user_id && (
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <input
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          placeholder="Motivo del rechazo (se envía al profesional)"
                          className="nightlife-input text-xs flex-1 min-w-[200px]"
                        />
                        <button
                          onClick={() => rejectProfile(p, rejectReason)}
                          disabled={processingId === p.user_id || !rejectReason.trim()}
                          className="px-2 py-1 rounded font-bold disabled:opacity-50"
                          style={{ background: '#b91c1c', color: '#fff' }}
                        >
                          Confirmar rechazo
                        </button>
                      </div>
                    )}
                  </li>
                );
```

Esto reemplaza el `<li>` completo que hoy va de la línea 87 a 100 (usar el marcador `key={p.user_id}` para localizarlo exacto en el archivo real).

- [ ] **Step 5: Type-check**

Run: `cd /Users/danielacedonunez/pretty-app-roles && npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 6: Verificación manual en navegador (obligatoria — CLAUDE.md exige reproducir la acción real, no solo tsc limpio)**

Con `npm run dev`:
1. Crear o localizar un perfil de prueba con `validation_status='pending'` (se puede forzar con `execute_sql`: `update profiles set validation_status='pending' where user_id='<uuid de prueba>'`).
2. Confirmar en incógnito/anon que ese perfil YA NO aparece en `/directorio` ni en `/p/<slug>` (debe dar 404 o "no encontrado").
3. Entrar al panel admin, ver la fila en el aviso verde, click "Ver ficha completa" → confirma que abre `/p/<user_id>` y SÍ se ve (porque el caller está autenticado como admin).
4. Click "Aprobar" → confirmar que la fila desaparece del aviso y que en incógnito el perfil ya es visible en `/directorio`.
5. Repetir con otro perfil de prueba y "Rechazar" con motivo → confirmar que desaparece del aviso y sigue invisible en incógnito.
6. Revisar logs de la edge function `send-email` (o `email_logs` si existe tabla de dedupe) para confirmar que se intentó el envío.

- [ ] **Step 7: Commit**

```bash
git add src/components/dashboard/views/admin/AdminNewProfileAlert.tsx
git commit -m "feat: aprobar/rechazar altas nuevas desde el panel admin con ficha completa

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 6: Confirmación del icono verde persistente (diagnóstico, no fix de código)

**Files:** ninguno — esta tarea es de verificación, no de código.

- [ ] **Step 1: Pedir al usuario que haga hard-refresh del panel admin**

Cmd+Shift+R (Mac) en la pestaña del panel admin, o abrir en ventana de incógnito nueva.

- [ ] **Step 2: Si el aviso desaparece**

Confirma que era caché de build vieja — no se requiere ninguna acción de código adicional. Las Tasks 1-5 ya cambian la query de origen (`admin_seen_at` → `validation_status`), así que tras el deploy de estos cambios el aviso reflejará el estado real de cualquier forma.

- [ ] **Step 3: Si el aviso persiste tras hard-refresh**

Volver a Phase 1 de systematic-debugging con evidencia nueva: comprobar en `execute_sql` si hay filas con `validation_status='pending'` justo después del backfill de Task 1 (debería haber 0 salvo altas nuevas reales desde entonces), y si las hay, confirmar si corresponden a perfiles que el usuario cree haber revisado. No asumir la misma causa que el diagnóstico original — investigar de cero con los datos de ese momento.

---

## Self-Review

**Spec coverage:**
- Gate de visibilidad vía RLS → Task 1. ✓
- Backfill de los 34 pending → Task 1. ✓
- Panel admin con ficha completa (reutilizando `/p/:slug`) → Task 5. ✓
- Aprobar dispara `admin_approved` → Task 5. ✓
- Rechazar con motivo dispara `admin_rejected` → Tasks 3 y 5. ✓
- `admin_seen_at` se mantiene sin romper otros consumidores → Task 4 explícitamente no lo toca. ✓
- Email `welcome` actualizado → Task 2. ✓
- Diagnóstico del icono verde → Task 6. ✓

**Placeholder scan:** sin TBD ni "similar a la task N" — cada task lleva el código completo a pegar.

**Type consistency:** `NewProfile` no cambia de forma entre tasks; `approveProfile`/`rejectProfile` usan los mismos nombres de campo (`user_id`, `display_name`, `role`) que ya usa `markSeen` y que `AdminUserManagement.tsx` usa para `admin_approved`.
