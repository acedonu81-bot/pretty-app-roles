# Trayectoria verificada Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que cada profesional enseñe en su ficha los eventos en los que ha trabajado, con confirmación del organizador y sello solo en Premium, y que XPEAK mida cuántos acuerdos se cierran desde la web.

**Architecture:** Tablas nuevas en Supabase con RLS (el profesional solo escribe lo suyo; los estados los cambia el servidor). Dos funciones Edge nuevas siguiendo el patrón de `particular-responder` (enlace firmado HMAC, sin cuenta) y un cron siguiendo el de `review-reminder`. La lógica pura (firma, antifraude, estados) va en `supabase/functions/_shared/trayectoria.ts` con tests Vitest.

**Tech Stack:** React + Vite + TypeScript, Vitest, Supabase (Postgres, RLS, Edge Functions Deno, pg_cron), plantillas de `send-email`.

**Spec:** `docs/superpowers/specs/2026-11-22-trayectoria-verificada-design.md`

## Global Constraints

- Español en todo texto visible. Sin rayas largas (— ni –), sin emojis, sin "bolo/bolos", sin "gratis" ni "sin comisión" como gancho.
- Todo correo sale como XPEAK (remitente oficial), nunca en nombre del profesional.
- Plan Premium = tiers `business`, `premium`, `agency`, `elite` (usar `planDe(tier) === 'business'` de `src/lib/ventajasPlan.ts`; en servidor, la misma lista).
- Con `VITE_COBROS_ACTIVOS` apagado no se ofrece "Pedir confirmación" ni el sello en ninguna pantalla (`cobrosActivos()` de `src/lib/pagos.ts`).
- Los cambios de base de datos van como migración en `supabase/migrations/` que ejecuta Daniel en el SQL Editor; no se aplican por MCP ni se despliega nada sin que Daniel lo pida.
- Antifraude: el correo del organizador no puede ser el del propio profesional; un mismo correo confirma como máximo 5 eventos al mes.
- Los enlaces firmados caducan a los 30 días y usan una clave derivada propia (propósito `xpeak-trayectoria-v1`), distinta de la de `accesoParticular.ts`.
- XDS antes de construir (umbral 75): Task 0 es obligatoria.

## Review Focus

- Un profesional intenta confirmarse a sí mismo con su correo o con un alias `+` de su correo: debe rechazarse.
- El mismo organizador pulsa el botón dos veces, o un antivirus abre el enlace: no duplica ni confirma sin que una persona pulse el botón (confirmar solo por POST).
- Enlace caducado, manipulado o de otro tipo (el de `/acceso` o `/responder`): "El enlace no es válido", sin pistas.
- Un profesional Profesional (no Premium) llama directamente a la función de solicitar confirmación: 403 desde el servidor, no solo botón oculto.
- Un profesional intenta poner `estado = 'confirmado'` por la API al crear o editar su evento: la base de datos lo ignora o lo rechaza.
- La ficha pública no filtra el correo del organizador ni su hash.

---

### Task 0: Ficha XDS y aprobación

**Files:**
- Create: ficha en Notion (no en el repo)

- [ ] **Step 1:** Puntuar la idea con los criterios XDS del libro de Daniel (`reference_xpeak_book_xds`) y mostrar la ficha en el chat.
- [ ] **Step 2:** Si la puntuación es menor de 75, parar y consultar a Daniel antes de seguir. Si es 75 o más, continuar.

### Task 1: Esquema de base de datos

**Files:**
- Create: `supabase/migrations/20261122120000_trayectoria_verificada.sql`

**Interfaces:**
- Produces: tablas `trayectoria_eventos`, `trayectoria_confirmaciones`, `acuerdo_respuestas`; funciones `trayectoria_publica(p_user_id uuid) returns table(id uuid, titulo text, tipo text, fecha date, ciudad text, lugar text, foto_url text, estado text, origen text)` y `acuerdos_comparacion() returns table(conversaciones int, preguntadas int, ambos_si int, solo_uno_si int, ambos_no int, sin_respuesta int)` (solo admin).

- [ ] **Step 1:** Escribir la migración. `trayectoria_eventos(id, user_id, titulo, tipo, fecha, ciudad, lugar, foto_url, origen check in ('declarado','contrato'), contract_id, estado check in ('declarado','pendiente','confirmado'), confirmado_at, created_at)`. RLS: el dueño hace SELECT/INSERT/UPDATE/DELETE de lo suyo; un trigger BEFORE INSERT OR UPDATE (patrón de `trg_proteger_campos_al_crear_perfil`) fuerza `estado='declarado'`, `origen='declarado'` y `confirmado_at=null` salvo que `session_user` sea `postgres` o `service_role`. Lectura pública solo por `trayectoria_publica`.
- [ ] **Step 2:** `trayectoria_confirmaciones(id, evento_id, email_hash, enviado_at, confirmado_at)` sin ninguna política (solo `service_role`). `acuerdo_respuestas(conversation_id, user_id, respuesta check in ('si','no'), evento_id null, created_at, primary key (conversation_id, user_id))`, con RLS que deja a cada usuario ver solo la suya.
- [ ] **Step 3:** Entregar el SQL a Daniel para el SQL Editor. Verificar después con una transacción deshecha por MCP: usuario normal intenta insertar `estado='confirmado'` y queda `declarado`; `trayectoria_publica` no devuelve columnas de correo.

### Task 2: Lógica pura de firma y antifraude

**Files:**
- Create: `supabase/functions/_shared/trayectoria.ts`
- Test: `supabase/functions/_shared/trayectoria.test.ts`

**Interfaces:**
- Produces:
  - `normalizarEmail(e: string): string` (minúsculas, quita `+alias` y puntos de Gmail)
  - `esCorreoPropio(organizador: string, propios: string[]): boolean`
  - `puedeConfirmarMas(confirmadosEsteMes: number): boolean` (máximo 5)
  - `firmarConfirmacion(eventoId: string, confirmacionId: string): Promise<string>` → URL `https://xpeak.es/confirmar-evento?t=...`
  - `leerConfirmacion(t: string): Promise<{ e: string; c: string } | null>` (null si firma mala, caducada a 30 días o de otro propósito)

- [ ] **Step 1: Write the failing tests** (`trayectoria.test.ts`, entorno `node`, clave de servicio simulada con `Deno.env` stub como en `stripePlanes.test.ts`/`decidirCheckout.test.ts`): `normalizarEmail('Ana.Perez+x@gmail.com')` es `'anaperez@gmail.com'`; `esCorreoPropio('ana+boda@gmail.com', ['ana@gmail.com'])` es `true`; `puedeConfirmarMas(4)` es `true` y `puedeConfirmarMas(5)` es `false`; un token firmado se lee de vuelta; un token con un carácter cambiado devuelve `null`; un token creado por `firmarAcceso` devuelve `null`; un token con `iat` de hace 31 días devuelve `null`.
- [ ] **Step 2:** Ejecutar `npx vitest run supabase/functions/_shared/trayectoria.test.ts`. Esperado: falla por funciones no definidas.
- [ ] **Step 3:** Implementar `trayectoria.ts` copiando el esquema HMAC de `accesoParticular.ts` con el propósito propio y la caducidad de 30 días.
- [ ] **Step 4:** Repetir el comando. Esperado: todo en verde.
- [ ] **Step 5:** Commit `feat(trayectoria): firma de confirmaciones y antifraude`.

### Task 3: Funciones Edge de solicitar y confirmar

**Files:**
- Create: `supabase/functions/trayectoria-solicitar/index.ts`, `supabase/functions/trayectoria-confirmar/index.ts`
- Modify: `supabase/functions/send-email/index.ts` (plantilla `confirmar_evento`, junto a `pedir_valoracion` en la línea ~845)
- Test: `supabase/functions/_shared/trayectoria.test.ts` (añadir casos de decisión)

**Interfaces:**
- Consumes: Task 2 (`firmarConfirmacion`, `leerConfirmacion`, `esCorreoPropio`, `puedeConfirmarMas`, `normalizarEmail`).
- Produces: POST `trayectoria-solicitar` con JWT del profesional `{ evento_id, email_organizador }` → `{ ok: true }`, error 403 `no_premium`, 400 `correo_propio`, 429 `limite_correo`. POST público `trayectoria-confirmar` con `{ t, accion: 'ver' }` → datos del evento y del profesional, y `{ t, accion: 'confirmar' }` → marca `confirmado` y guarda `confirmado_at`; confirma una sola vez.

- [ ] **Step 1: Write the failing tests:** extraer `decidirSolicitud(ctx): 'ok' | 'no_premium' | 'correo_propio' | 'limite_correo'` a `trayectoria.ts` y probar los cuatro resultados, incluido que un tier `business` pase y uno `free` o `starter` dé `no_premium`.
- [ ] **Step 2:** Ejecutar el test. Esperado: falla.
- [ ] **Step 3:** Implementar `decidirSolicitud` y las dos funciones: `solicitar` valida con `decidirSolicitud`, guarda `email_hash` (hash del correo normalizado), pone el evento en `pendiente` y envía la plantilla `confirmar_evento` con `firmarConfirmacion`; `confirmar` solo cambia estado en la acción `confirmar` por POST (la acción `ver` no cambia nada). Registrar `analytics_events` con `evento_confirmado_por_organizador`.
- [ ] **Step 4:** Test en verde. Texto de la plantilla: título "Confirma el evento", cuerpo con nombre del profesional, nombre y fecha del evento, botón "Sí, trabajó en mi evento".
- [ ] **Step 5:** Commit `feat(trayectoria): solicitar y confirmar eventos desde el correo`.

### Task 4: Página pública /confirmar-evento

**Files:**
- Create: `src/pages/ConfirmarEvento.tsx`, `src/pages/ConfirmarEvento.test.tsx`
- Modify: `src/App.tsx` (ruta `/confirmar-evento`, junto a `/responder`, línea ~811)

**Interfaces:**
- Consumes: POST de Task 3.
- Produces: página que lee `t` de la URL, llama a `accion: 'ver'`, muestra "¿Trabajó {nombre} en {evento}?" y un único botón que llama a `accion: 'confirmar'`.

- [ ] **Step 1: Write the failing test** (modelo `Responder` si existe test; si no, Testing Library): sin `t` muestra "El enlace no es válido"; con respuesta `ver` correcta muestra el nombre y el botón; tras pulsar muestra "Gracias, queda confirmado".
- [ ] **Step 2:** Ejecutar `npx vitest run src/pages/ConfirmarEvento.test.tsx`. Esperado: falla.
- [ ] **Step 3:** Implementar la página con la paleta de la web (crema, dorado, Syne e Inter) y la ruta.
- [ ] **Step 4:** Test en verde.
- [ ] **Step 5:** Commit `feat(trayectoria): página de confirmación del organizador`.

### Task 5: Gestión de la trayectoria por el profesional

**Files:**
- Create: `src/components/dashboard/TrayectoriaEditor.tsx`, `src/lib/trayectoria.ts`, `src/lib/trayectoria.test.ts`
- Modify: `src/lib/ventajasPlan.ts` (campo `trayectoriaConfirmada: boolean`, true solo en `business`) y `src/lib/ventajasPlan.test.ts`; `src/components/dashboard/views/ProfileView.tsx` (montar el editor)

**Interfaces:**
- Produces: `listarMisEventos(): Promise<EventoTrayectoria[]>`, `crearEvento(e: NuevoEvento): Promise<void>`, `pedirConfirmacion(eventoId: string, email: string): Promise<void>`; `puedePedirConfirmacion(tier: string | null | undefined, cobros: boolean): boolean` (true solo con Premium y cobros activos).

- [ ] **Step 1: Write the failing tests:** `puedePedirConfirmacion('business', true)` es `true`; `('starter', true)`, `('business', false)` y `('free', true)` son `false`; `ventajasDe('business').trayectoriaConfirmada` es `true` y `ventajasDe('starter').trayectoriaConfirmada` es `false`.
- [ ] **Step 2:** Ejecutar `npx vitest run src/lib/trayectoria.test.ts src/lib/ventajasPlan.test.ts`. Esperado: falla.
- [ ] **Step 3:** Implementar las funciones y el campo. El editor lista eventos con su marca, formulario de alta (título, tipo, fecha, ciudad, lugar, foto opcional) y, si `puedePedirConfirmacion`, un campo de correo con "Pedir confirmación". Sin botón ni texto de Premium con cobros apagados. Añadir a `listaVentajas` de `business`: "Sello de eventos confirmados en tu ficha".
- [ ] **Step 4:** Tests en verde.
- [ ] **Step 5:** Commit `feat(trayectoria): el profesional gestiona sus eventos`.

### Task 6: Sección Trayectoria en la ficha pública y contador en la tarjeta

**Files:**
- Create: `src/components/profile/TrayectoriaSection.tsx`, `src/components/profile/TrayectoriaSection.test.tsx`
- Modify: `src/pages/PublicProfile.tsx` (cargar vía `supabase.rpc('trayectoria_publica', ...)` y montar la sección), `src/components/dashboard/ProfileCard.tsx` (contador "N eventos confirmados" solo si hay ≥1 confirmado y `cobrosActivos()`)

**Interfaces:**
- Consumes: `trayectoria_publica` de Task 1.
- Produces: `<TrayectoriaSection eventos={EventoTrayectoria[]} />` con tres marcas: "Declarado", "Confirmado", "Contrato XPEAK".

- [ ] **Step 1: Write the failing test:** una lista con un evento de cada estado muestra las tres etiquetas; la lista vacía no pinta la sección; no aparece ningún texto de correo.
- [ ] **Step 2:** Ejecutar `npx vitest run src/components/profile/TrayectoriaSection.test.tsx`. Esperado: falla.
- [ ] **Step 3:** Implementar, ordenar por fecha descendente, con "Confirmado" y "Contrato XPEAK" destacados en dorado.
- [ ] **Step 4:** Test en verde y revisión visual a 390 px con Playwright.
- [ ] **Step 5:** Commit `feat(trayectoria): sección en la ficha pública`.

### Task 7: Pregunta "¿se cerró el acuerdo?" y medición

**Files:**
- Create: `supabase/functions/acuerdo-cerrado-reminder/index.ts`, `supabase/functions/acuerdo-cerrado-responder/index.ts`, `src/pages/AcuerdoCerrado.tsx`, `supabase/migrations/20261122130000_cron_acuerdo_cerrado.sql`
- Modify: `supabase/functions/send-email/index.ts` (plantilla `acuerdo_cerrado`), `src/App.tsx` (ruta `/acuerdo-cerrado`)
- Test: `supabase/functions/_shared/trayectoria.test.ts`

**Interfaces:**
- Consumes: tabla `acuerdo_respuestas` de Task 1, `esLlamadaInterna` de `_shared/soloInterno.ts`.
- Produces: `conversacionesParaPreguntar(ahora: Date, convs: ConvConEvento[], respondidas: Set<string>): ConvConEvento[]` (pura, en `trayectoria.ts`): devuelve las conversaciones con fecha de evento pasada hace 3 días o más y sin respuesta de ese usuario.

- [ ] **Step 1: Write the failing tests:** una conversación con evento de hace 4 días y sin respuesta entra; una con evento de hace 1 día no; una ya respondida por ese usuario no; el mismo caso con dos usuarios devuelve una fila por usuario.
- [ ] **Step 2:** Ejecutar el test. Esperado: falla.
- [ ] **Step 3:** Implementar `conversacionesParaPreguntar`, el cron (patrón de `review-reminder`, protegido con `esLlamadaInterna`) y la función que guarda la respuesta en `acuerdo_respuestas` con enlace firmado. Si responde Sí, ofrecer "Añadir a tu trayectoria" al profesional (crea el evento como `declarado`).
- [ ] **Step 4:** Test en verde.
- [ ] **Step 5:** Commit `feat(trayectoria): pregunta de acuerdo cerrado`.

### Task 8: Comparación en el panel de administración

**Files:**
- Create: `src/components/dashboard/views/admin/AdminAcuerdos.tsx`, `src/components/dashboard/views/admin/AdminAcuerdos.test.tsx`
- Modify: el contenedor de las vistas de administración existente (donde ya se monta `AdminCharts`)

**Interfaces:**
- Consumes: `acuerdos_comparacion()` de Task 1.
- Produces: tarjeta "Acuerdos cerrados desde XPEAK" con conversaciones preguntadas, ambos Sí, solo uno Sí, ambos No y sin respuesta, más cuántos eventos de las trayectorias vienen de XPEAK y cuántos de fuera.

- [ ] **Step 1: Write the failing test:** con datos simulados pinta las cinco cifras; con valores cero pinta ceros, no vacío.
- [ ] **Step 2:** Ejecutar el test. Esperado: falla.
- [ ] **Step 3:** Implementar la tarjeta, solo visible para admin.
- [ ] **Step 4:** Test en verde y suite completa con `npx vitest run`. Esperado: todo en verde.
- [ ] **Step 5:** Commit `feat(trayectoria): comparación de acuerdos en admin`.

### Cierre

- [ ] Entregar a Daniel: las dos migraciones para el SQL Editor, la lista de funciones a desplegar (`trayectoria-solicitar`, `trayectoria-confirmar`, `acuerdo-cerrado-reminder`, `acuerdo-cerrado-responder`, `send-email`) y recordar que no se despliega nada hasta que lo pida.
