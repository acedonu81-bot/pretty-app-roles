# Flash: precio al apuntarse y cruce con fechas ocupadas, plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que el profesional dé un precio opcional al apuntarse a una oferta Flash y que el organizador vea ese precio y si el profesional está libre ese día.

**Architecture:** Columna nueva `precio` en `event_request_responses`. La disponibilidad se calcula en BD (`availability` solo la lee su dueño por RLS) con una función `SECURITY DEFINER` que devuelve solo `libre`, `ocupado` o `sin_datos`, expuesta por la RPC existente `interesados_en_oferta`. En el cliente, un helper puro decide qué fechas de la oferta chocan con las ocupadas del propio profesional.

**Tech Stack:** React + TypeScript + Vite, Supabase (Postgres, RLS, RPC), Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-22-flash-precio-fechas-design.md`

## Global Constraints

- Precio opcional, nunca obligatorio. Número > 0 y <= 100000, 2 decimales.
- No afirmar disponibilidad si el profesional nunca marcó fechas: devolver `sin_datos` y no mostrar etiqueta.
- No exponer al organizador las fechas ocupadas, solo `libre`/`ocupado`/`sin_datos` para las fechas de SU oferta.
- Copy en español, sin rayas largas (— –), sin "bolo/bolos", sin "gratis" ni "0 comisión" como gancho, sin emojis decorativos.
- No tocar ACEPTO, chat, Stripe ni planes. Sin tablas nuevas.
- Migraciones: archivo en `supabase/migrations/`. NO aplicar a producción ni desplegar sin que Daniel lo pida.
- Tests: `npx vitest run <archivo>`; hay que dejar verde `npx vitest run` y `npx tsc -p tsconfig.app.json --noEmit` al final.

## Review Focus

- Oferta con varias fechas (`event_dates`) y el profesional ocupado solo en una: `ocupado`.
- Oferta sin `event_dates` pero con `event_date`: se usa esa fecha. Sin ninguna fecha: `sin_datos`.
- Profesional con 0 filas en `availability`: `sin_datos`, nunca `libre`.
- Precio vacío, `0`, negativo, con coma decimal (`150,50`) o enorme: se rechaza o normaliza sin romper el apuntarse.
- Un organizador que no es dueño de la oferta no obtiene datos de la RPC (se mantiene la comprobación existente).

---

### Task 1: Migración, columna `precio` y disponibilidad en la RPC

**Files:**
- Create: `supabase/migrations/20261122140000_flash_precio_disponibilidad.sql`
- Create: `supabase/tests/flash_precio_disponibilidad.sql` (script de comprobación que acaba en `ROLLBACK`)

**Interfaces:**
- Produces: columna `event_request_responses.precio numeric(8,2) NULL CHECK (precio IS NULL OR (precio > 0 AND precio <= 100000))`.
- Produces: `public.disponibilidad_para_fechas(p_user uuid, p_fechas date[]) RETURNS text` (`'libre' | 'ocupado' | 'sin_datos'`), `SECURITY DEFINER`, `search_path = public`, `EXECUTE` revocado a `public`/`anon`.
- Produces: `public.interesados_en_oferta(p_request_id uuid)` con dos columnas nuevas al final, `precio numeric` y `disponibilidad text`. Mantiene el orden y la comprobación de dueño/admin actuales (definición leída de producción el 22 nov 2026; no estaba en migraciones, copiarla entera). Como cambia el tipo de retorno hay que `DROP FUNCTION` antes de `CREATE`.

- [ ] **Step 1: Escribir `supabase/tests/flash_precio_disponibilidad.sql`.** En una transacción con datos de prueba (oferta con fechas `{2030-01-10, 2030-01-11}`, profesional A con 0 filas, B con bloqueo el 11, C con bloqueo el 20): afirmar `disponibilidad_para_fechas` = `sin_datos` (A), `ocupado` (B), `libre` (C), `sin_datos` con array vacío; afirmar que insertar `precio = 0` y `precio = -5` falla por CHECK; terminar en `ROLLBACK`.
- [ ] **Step 2: Escribir la migración** con la columna, la función auxiliar (lógica: sin filas en `availability` del usuario → `sin_datos`; alguna fecha en `blocked_date` → `ocupado`; si no, `libre`) y la RPC ampliada. La fecha de la oferta sale de `event_requests.event_dates`, o de `event_date` si el array es nulo o vacío; sin ninguna → `sin_datos`.
- [ ] **Step 3: Verificar sobre un clon, no sobre producción.** Ejecutar el script de tests contra una rama de Supabase o una BD local. Esperado: todas las afirmaciones pasan y el `ROLLBACK` no deja datos. Si no hay rama disponible, dejar el script sin ejecutar y avisar a Daniel; no probar en producción.
- [ ] **Step 4: Comprobar permisos.** Con `get_advisors` (security) revisar que la función nueva no queda ejecutable por `anon`.
- [ ] **Step 5: Commit** (solo si Daniel lo pide): `git add supabase/migrations/20261122140000_flash_precio_disponibilidad.sql supabase/tests/flash_precio_disponibilidad.sql`.

### Task 2: Helper puro de fechas y precio

**Files:**
- Create: `src/lib/ofertaPrecioFechas.ts`
- Test: `src/lib/ofertaPrecioFechas.test.ts`

**Interfaces:**
- Produces: `fechasDeOferta(req: { event_dates: string[] | null; event_date: string | null }): string[]` (ISO `YYYY-MM-DD`; usa `event_dates` si tiene elementos, si no `[event_date]`, si no `[]`).
- Produces: `fechasOcupadasEnOferta(fechasOferta: string[], ocupadas: Iterable<string>): string[]` (intersección, ordenada).
- Produces: `parsePrecio(entrada: string): number | null` (acepta `150`, `150,5`, `150.50`; devuelve `null` si vacío, no numérico, `<= 0` o `> 100000`; redondea a 2 decimales).

- [ ] **Step 1: Tests.** `fechasDeOferta` con array, solo `event_date` y ninguna. `fechasOcupadasEnOferta(['2030-01-10','2030-01-11'], ['2030-01-11','2030-02-01'])` = `['2030-01-11']`. `parsePrecio('150,5')` = `150.5`; `parsePrecio('')`, `'0'`, `'-3'`, `'abc'`, `'100001'` = `null`.
- [ ] **Step 2: Ver los tests fallar:** `npx vitest run src/lib/ofertaPrecioFechas.test.ts`. Esperado: FAIL (módulo no existe).
- [ ] **Step 3: Implementar** las tres funciones como las define Interfaces.
- [ ] **Step 4: Ver pasar:** mismo comando. Esperado: PASS.

### Task 3: Formulario de apuntarse (profesional)

**Files:**
- Modify: `src/components/dashboard/views/flashbooking/EventRequestsSection.tsx` (estado `applyText` junto a línea ~1194, `applyToRequest` línea ~507-525)
- Test: `src/components/dashboard/views/flashbooking/EventRequestsSection.profesional.test.tsx` (ampliar; reutiliza su `tabla()` y la oferta `q1` con fechas 16 y 17 oct)

**Interfaces:**
- Consumes: `fechasDeOferta`, `fechasOcupadasEnOferta`, `parsePrecio` (Task 2).
- Produces: estado `applyPrecio: Record<string, string>`; el `insert` a `event_request_responses` lleva `precio: number | null`; estado `misOcupadas: Set<string>` y `tieneCalendario: boolean` cargados con `supabase.from('availability').select('blocked_date').eq('user_id', user.id)` solo para quien no es empresario.

- [ ] **Step 1: Tests (rojos).** (a) Con el campo "Tu precio (€)" en `150,50`, al pulsar el botón el insert contiene `precio: 150.5`. (b) Sin rellenar, el insert lleva `precio: null`. (c) Con `0`, no se envía y sale `toastError` "El precio tiene que ser mayor que 0". (d) Con `availability` = `[{blocked_date:'2026-10-17'}]` aparece el texto "Tienes ocupado el 17/10" y el botón sigue activo. (e) Con `availability` vacío aparece "Marca tus fechas ocupadas en tu calendario para que el organizador vea que estás libre" con enlace a la vista calendario. (f) El botón dice "Me interesa esta oferta" (sustituye a "Me interesa este bolo").
- [ ] **Step 2: Ver fallar:** `npx vitest run src/components/dashboard/views/flashbooking/EventRequestsSection.profesional.test.tsx`.
- [ ] **Step 3: Implementar.** Input numérico bajo el textarea (placeholder "Tu precio en € (opcional)"), avisos no bloqueantes sobre el botón, `parsePrecio` en `applyToRequest`, y el texto del botón. El aviso (e) reemplaza al "aviso en el panel" del diseño: va donde el profesional decide, y es una decisión del plan (no hay otra superficie de inicio adecuada; `ConsejosPanel` es un recorrido de menú).
- [ ] **Step 4: Ver pasar** el mismo archivo y luego `npx vitest run src/components/dashboard/views/flashbooking`.

### Task 4: Tarjeta de respuesta del organizador

**Files:**
- Modify: `src/components/dashboard/views/flashbooking/EventRequestsSection.tsx` (tipo de `responses` línea ~116, mapeo de la RPC línea ~213-220, tarjeta línea ~1022)
- Test: `src/components/dashboard/views/flashbooking/EventRequestsSection.interesados.test.tsx` (ampliar)

**Interfaces:**
- Consumes: columnas `precio` y `disponibilidad` de `interesados_en_oferta` (Task 1).
- Produces: cada elemento de `responses` gana `precio: number | null` y `disponibilidad: 'libre' | 'ocupado' | 'sin_datos'`.

- [ ] **Step 1: Tests (rojos).** Con una respuesta `precio: 150.5, disponibilidad: 'libre'` se ve "150,50 €" y "Libre ese día". Con `ocupado` se ve "Ocupado ese día" y no "Libre". Con `sin_datos` y `precio: null` no aparece ninguna de las dos etiquetas ni "€".
- [ ] **Step 2: Ver fallar:** `npx vitest run src/components/dashboard/views/flashbooking/EventRequestsSection.interesados.test.tsx`.
- [ ] **Step 3: Implementar** el mapeo con `disponibilidad ?? 'sin_datos'` y la etiqueta junto al nombre; precio formateado con `toLocaleString('es-ES', {style:'currency', currency:'EUR'})`.
- [ ] **Step 4: Ver pasar** y luego la verificación final: `npx vitest run` y `npx tsc -p tsconfig.app.json --noEmit`, ambas en verde.

### Task 5: Verificación en navegador y entrega

- [ ] **Step 1:** Arrancar la app, entrar como profesional con oferta abierta y comprobar a 390 px: campo de precio, aviso de fecha ocupada y aviso de calendario vacío (sin envío real; la migración no está aplicada).
- [ ] **Step 2:** Informar a Daniel de qué queda pendiente: aplicar la migración a producción, desplegar con `deploy-prod.sh` (solo sube HEAD, hace falta commit) y probar un apuntarse real. No hacer nada de esto sin que lo pida.
