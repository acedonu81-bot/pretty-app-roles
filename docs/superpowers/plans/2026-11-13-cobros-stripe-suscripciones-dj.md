# Cobros con Stripe: suscripciones de DJ. Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** dejar preparado (apagado hasta que Daniel lo active) que un DJ pueda pagar un plan (Profesional o Premium, mensual o anual) desde la web con Stripe, y que su perfil cambie de plan solo cuando Stripe confirma el pago.

**Architecture:** Stripe Checkout (página de pago alojada por Stripe) y portal de cliente de Stripe para cambiar de plan, ver facturas o darse de baja. Tres Edge Functions de Supabase: `crear-checkout` y `portal-cliente` (con sesión del usuario) y `stripe-webhook` (sin sesión, valida la firma de Stripe). El webhook es lo único que escribe el plan: guarda la suscripción en una tabla nueva `suscripciones` y copia el plan a `profiles.subscription_tier` de todos los perfiles del usuario con la clave de servicio (el trigger `protect_privileged_fields` ya impide que un usuario se lo cambie a sí mismo y deja pasar al service role). En la app nativa de iOS/Android no se vende nada.

**Tech Stack:** React + Vite + TS, Supabase (Postgres, Edge Functions en Deno), `stripe` npm v17 vía `npm:stripe@17` en Deno, Vitest.

**Spec:** decisiones de esta conversación (13 nov 2026) y memoria `project_xpeak_cobro_particular_499_4nov` (precios, nombres, anual, Black Friday).

## Global Constraints

- Solo se cobra a perfiles con rol `dj` (en `role` o en `roles`). Empresarios y event managers no tienen plan.
- Solo web (escritorio y navegador del móvil). Si `isNative` (src/lib/capacitor.ts) es true: ni precios, ni botones de pago, ni enlaces a la web de pago.
- Interruptor `COBROS_ACTIVOS` (secreto de Supabase y `VITE_COBROS_ACTIVOS`), por defecto `false`: con él apagado no se ven precios ni botones y `crear-checkout` responde 403 `{ error: 'cobros_apagados' }`. Nada de esto se lanza todavía (decisión 13 nov).
- Planes a la venta: Profesional (`starter`) 6,99 €/mes y Premium (`business`) 14,99 €/mes. Agencia FUERA (no se vende ni se muestra; `agency` se queda en el código sin usar).
- Anual = 10 % de descuento: 75,49 € / 161,89 € al año.
- Los precios que ve el usuario son el total con IVA incluido (21 %). En Stripe, precios con `tax_behavior: 'inclusive'` y un Tax Rate manual del 21 % inclusivo. Si se decide cobrar "+IVA", solo cambian los importes de los Price en Stripe y la constante `IVA_INCLUIDO`; el código no cambia.
- Nombres públicos: Esencial (free), Profesional (starter), Premium (business). Los ids del código no cambian.
- Black Friday: código promocional `BLACKFRIDAY26`, -20 % real sobre el precio anual (Profesional 60,39 € el primer año, 5,03 €/mes; Premium 129,51 €, 10,79 €/mes), solo primer pago, válido hasta el 30 nov 2026 23:59 Europe/Madrid.
- Sin periodo de prueba en Stripe en esta fase (se ignora `trialDays`).
- Copy: sin rayas (—/–), sin emojis, sin "gratis" ni "0 comisión" como gancho, sin "bolo".
- Claves: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` y los 4 ids de Price como secretos de Supabase (`STRIPE_PRICE_STARTER_MENSUAL`, `..._ANUAL`, `STRIPE_PRICE_BUSINESS_MENSUAL`, `..._ANUAL`). Nunca en el frontend ni en el repo.
- Despliegue solo cuando Daniel lo pida.

## Review Focus

1. Stripe reenvía el mismo evento (reintentos): no debe duplicar nada ni fallar. Test en Task 2 (`registrarEvento` devuelve false la segunda vez y el webhook responde 200 sin procesar).
2. Eventos que llegan desordenados (un `subscription.updated` viejo después de un `deleted`): debe ganar el más reciente. Test en Task 2 (se descarta si `evento.created` es anterior a `suscripciones.stripe_evento_at`).
3. Pago fallido o tarjeta caducada (`past_due`, `unpaid`): el DJ vuelve a `free` cuando Stripe da la suscripción por cancelada, no antes; en `past_due` conserva el plan. Test en Task 1 (`tierDesdeEstado`).
4. Usuario con varios perfiles (un DJ que además es otro rol): el plan se aplica a todos sus perfiles de la cuenta. Test en Task 2.
5. Usuario que ya tiene suscripción activa y vuelve a pulsar "Contratar": no se crea una segunda suscripción, se le manda al portal. Test en Task 3.

---

## Pasos manuales de Daniel (antes de la Task 5, sin código)

1. Alta de autónomo hecha (NIF disponible).
2. Crear cuenta Stripe (modo test primero), verificar identidad e IBAN.
3. En Stripe (test y luego live): 2 productos (Profesional, Premium), 2 precios cada uno (mensual y anual, `tax_behavior` inclusive), Tax Rate "IVA 21 %" inclusivo, portal de cliente activado (cambio de plan entre los 6 precios, cancelación al final del periodo, facturas visibles), recibos y facturas por email activados, datos fiscales de la cuenta (nombre, NIF, dirección) para que salgan en la factura.
4. Webhook en Stripe apuntando a `https://<proyecto>.supabase.co/functions/v1/stripe-webhook` con los eventos `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.
5. Guardar los secretos de Supabase listados arriba.
6. Crear el cupón -20 % (`duration: once`, `applies_to` los 2 productos) y el código `BLACKFRIDAY26` con `expires_at` 30 nov 2026 23:59 Madrid. La restricción "solo anual" se aplica en Task 3.

---

### Task 1: Lógica pura de planes y estados

**Files:**
- Create: `supabase/functions/_shared/stripePlanes.ts`
- Test: `supabase/functions/_shared/stripePlanes.test.ts`
- Modify: `src/lib/subscriptions.ts` (precios 6,99 / 14,99 / 44,99, `ANNUAL_DISCOUNT = 0.10`, nombres públicos, nueva constante `IVA_INCLUIDO = true`, nuevo `PRECIOS_ANUALES`)

**Interfaces:**
- Produces:
  - `type PlanPago = 'starter' | 'business'`
  - `type Ciclo = 'mensual' | 'anual'`
  - `priceIdDe(plan: PlanPago, ciclo: Ciclo, env: Record<string,string|undefined>): string` (lanza si falta el secreto)
  - `planDesdePriceId(priceId: string, env): { plan: PlanPago; ciclo: Ciclo } | null`
  - `tierDesdeEstado(estado: string, plan: PlanPago): 'free' | PlanPago`
  - `esDj(perfil: { role: string | null; roles: string[] | null }): boolean`
  - En `src/lib/subscriptions.ts`: `PRECIOS_ANUALES: Record<'starter'|'business', number>` = `{ starter: 75.49, business: 161.89 }`

El archivo de `_shared` no puede importar nada de Deno ni de npm (lo usan Vitest y Deno).

- [ ] **Step 1: Tests que fallan**

```ts
const env = { STRIPE_PRICE_STARTER_MENSUAL: 'p_sm', STRIPE_PRICE_STARTER_ANUAL: 'p_sa',
  STRIPE_PRICE_BUSINESS_MENSUAL: 'p_bm', STRIPE_PRICE_BUSINESS_ANUAL: 'p_ba' };
it('ida y vuelta price', () => {
  expect(priceIdDe('business', 'anual', env)).toBe('p_ba');
  expect(planDesdePriceId('p_sm', env)).toEqual({ plan: 'starter', ciclo: 'mensual' });
  expect(planDesdePriceId('desconocido', env)).toBeNull();
});
it('falta secreto', () => expect(() => priceIdDe('business', 'mensual', {})).toThrow());
it('estados', () => {
  for (const e of ['active', 'trialing', 'past_due']) expect(tierDesdeEstado(e, 'business')).toBe('business');
  for (const e of ['canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused']) expect(tierDesdeEstado(e, 'business')).toBe('free');
});
it('esDj', () => {
  expect(esDj({ role: 'dj', roles: null })).toBe(true);
  expect(esDj({ role: 'camarero', roles: ['camarero', 'dj'] })).toBe(true);
  expect(esDj({ role: 'empresario', roles: [] })).toBe(false);
});
it('precios web', () => {
  expect(subscriptionPlans.find(p => p.id === 'starter')!.monthlyPrice).toBe(6.99);
  expect(PRECIOS_ANUALES).toEqual({ starter: 75.49, business: 161.89 });
});
```

- [ ] **Step 2:** `npx vitest run supabase/functions/_shared/stripePlanes.test.ts`: FAIL (módulo no existe).
- [ ] **Step 3:** Implementar. Ajustar `getPlanPricing` para que el anual muestre `PRECIOS_ANUALES[plan] / 12` redondeado a 2 decimales y el helper "Facturado X €/año" con el importe exacto de `PRECIOS_ANUALES`. Quitar `BIRTHDAY_DISCOUNT` del cálculo anual (no está decidido; se deja la constante sin usar). Revisar con `npx vitest run` que no se rompe ningún test existente que use estos precios.
- [ ] **Step 4:** Tests en verde.
- [ ] **Step 5:** Commit `feat(cobros): lógica de planes Stripe y precios decididos`.

### Task 2: Tablas y webhook de Stripe

**Files:**
- Create: `supabase/migrations/20261116100000_suscripciones_stripe.sql`
- Create: `supabase/functions/stripe-webhook/index.ts`
- Create: `supabase/functions/_shared/procesarEventoStripe.ts` (lógica sin red, recibe un cliente de base de datos inyectado)
- Test: `supabase/functions/_shared/procesarEventoStripe.test.ts`
- Modify: `supabase/config.toml` (`[functions.stripe-webhook] verify_jwt = false`, con comentario: la firma de Stripe es lo que da paso)

**Interfaces:**
- Consumes: `planDesdePriceId`, `tierDesdeEstado` (Task 1).
- Produces:
  - Tabla `public.suscripciones` (una fila por usuario): `user_id uuid pk references auth.users on delete cascade`, `stripe_customer_id text unique not null`, `stripe_subscription_id text unique`, `plan text check (plan in ('starter','business'))`, `ciclo text check (ciclo in ('mensual','anual'))`, `estado text`, `periodo_fin timestamptz`, `cancela_al_final boolean default false`, `stripe_evento_at timestamptz`, `updated_at timestamptz default now()`.
  - RLS: `select` solo `auth.uid() = user_id`; admins vía `has_role(auth.uid(),'admin')`; ninguna política de insert/update/delete (solo service role). `GRANT SELECT ON public.suscripciones TO authenticated`.
  - Tabla `public.stripe_eventos (id text pk, tipo text, recibido_at timestamptz default now())`, RLS activada sin políticas.
  - `procesarEventoStripe(evento: EventoStripe, db: DbStripe, env): Promise<'procesado' | 'duplicado' | 'ignorado' | 'viejo'>`
  - `interface DbStripe { registrarEvento(id: string, tipo: string): Promise<boolean>; leerSuscripcion(userId: string): Promise<{ stripe_evento_at: string | null } | null>; userIdDeCustomer(customerId: string): Promise<string | null>; guardarSuscripcion(fila: FilaSuscripcion): Promise<void>; ponerTierEnPerfiles(userId: string, tier: string): Promise<void>; }`
  - `EventoStripe` = `{ id: string; type: string; created: number; data: { object: any } }` (tipo mínimo propio, sin importar el SDK).

Reglas del procesado:
- `checkout.session.completed`: lee `client_reference_id` (user_id), `customer`, `subscription`; guarda la fila con estado `active` solo si no hay una fila más reciente.
- `customer.subscription.created|updated|deleted`: user_id por `metadata.user_id` de la suscripción o, si falta, `userIdDeCustomer`; plan y ciclo por `items.data[0].price.id`; estado `status` (en `deleted`, `canceled`); `periodo_fin` de `current_period_end` del item; `cancela_al_final` de `cancel_at_period_end`. Luego `ponerTierEnPerfiles(userId, tierDesdeEstado(...))`.
- `invoice.payment_failed`: solo registra (Stripe reintenta y avisa por email); `'ignorado'`.
- Cualquier otro tipo: `'ignorado'`.
- Evento con `created` anterior a `stripe_evento_at` guardado: `'viejo'`, sin tocar nada.
- Price desconocido: lanza error (el webhook devuelve 500 y Stripe reintenta; se ve en logs).

`index.ts`: lee el cuerpo como texto, `stripe.webhooks.constructEventAsync(body, firma, STRIPE_WEBHOOK_SECRET, undefined, Stripe.createSubtleCryptoProvider())`; firma mala, 400. Implementa `DbStripe` con el cliente service role (`ponerTierEnPerfiles` = `update profiles set subscription_tier = $tier where user_id = $userId`). Responde 200 en procesado/duplicado/ignorado/viejo.

- [ ] **Step 1: Tests que fallan** (con un `DbStripe` falso en memoria)
  - `subscription.updated` activo de `p_bm` pone `business` en todos los perfiles del usuario (el falso tiene 2 perfiles con el mismo user_id) y guarda `plan: 'business', ciclo: 'mensual'`.
  - El mismo evento dos veces: la segunda devuelve `'duplicado'` y `guardarSuscripcion` se llama una sola vez.
  - `deleted` con `created = 200` y después `updated` activo con `created = 100`: el segundo devuelve `'viejo'` y el tier final es `free`.
  - `past_due` mantiene `business`; `deleted` pone `free`.
  - Sin `metadata.user_id`, usa `userIdDeCustomer`; si tampoco hay, lanza.
  - Price desconocido lanza.
- [ ] **Step 2:** Ejecutar, FAIL.
- [ ] **Step 3:** Implementar `procesarEventoStripe.ts`, migración e `index.ts`.
- [ ] **Step 4:** Tests en verde. Aplicar la migración en una rama de Supabase o revisarla con Daniel antes de producción (regla: nada de triggers ni tablas en producción sin migración en el repo).
- [ ] **Step 5:** Commit `feat(cobros): webhook de Stripe y tabla suscripciones`.

### Task 3: Crear pago y abrir portal

**Files:**
- Create: `supabase/functions/crear-checkout/index.ts`
- Create: `supabase/functions/portal-cliente/index.ts`
- Create: `supabase/functions/_shared/decidirCheckout.ts`
- Test: `supabase/functions/_shared/decidirCheckout.test.ts`

**Interfaces:**
- Consumes: `priceIdDe`, `esDj` (Task 1); tabla `suscripciones` (Task 2).
- Produces:
  - `decidirCheckout(entrada: { perfiles: { role: string|null; roles: string[]|null }[]; suscripcion: { estado: string | null } | null; plan: string; ciclo: string }): { tipo: 'checkout' } | { tipo: 'portal' } | { tipo: 'error'; codigo: 'no_dj' | 'plan_invalido' }`
  - `POST /crear-checkout` body `{ plan: PlanPago, ciclo: Ciclo }` → `{ url: string }` (Checkout o, si ya tiene suscripción viva, portal). Errores 400 `{ error: 'no_dj' | 'plan_invalido' }`, 401 sin sesión.
  - `POST /portal-cliente` → `{ url: string }`; 404 `{ error: 'sin_suscripcion' }` si no hay fila.

Checkout Session: `mode: 'subscription'`, `customer` (reutiliza `stripe_customer_id` o crea uno con email y `metadata.user_id`, y guarda la fila en `suscripciones` con service role antes de redirigir), `client_reference_id: user.id`, `subscription_data.metadata.user_id`, `line_items: [{ price, quantity: 1 }]` con el Tax Rate inclusivo vía `STRIPE_TAX_RATE_IVA`, `allow_promotion_codes: ciclo === 'anual'` (así `BLACKFRIDAY26` solo se puede usar en anual), `locale: 'es'`, `consent_collection: { terms_of_service: 'required' }`, `billing_address_collection: 'required'`, `tax_id_collection: { enabled: true }` (para que un DJ autónomo pueda poner su NIF en la factura), `success_url: https://xpeak.es/dashboard?pago=ok`, `cancel_url: https://xpeak.es/dashboard?pago=cancelado`. Portal `return_url: https://xpeak.es/dashboard`.

- [ ] **Step 1: Tests que fallan**
  - perfil `empresario` → `{ tipo: 'error', codigo: 'no_dj' }`
  - `plan: 'free'` o `plan: 'agency'` → `plan_invalido`; `ciclo: 'semanal'` → `plan_invalido`
  - DJ sin suscripción → `checkout`; DJ con estado `canceled` → `checkout`
  - DJ con estado `active` o `past_due` → `portal`
- [ ] **Step 2:** Ejecutar, FAIL.
- [ ] **Step 3:** Implementar `decidirCheckout` y las dos funciones (usuario por `supabase.auth.getUser()` con el JWT de la petición; CORS solo para `https://xpeak.es` y `http://localhost:5173`).
- [ ] **Step 4:** Tests en verde. Prueba manual en modo test de Stripe con la tarjeta `4242 4242 4242 4242`: tras pagar, `suscripciones` tiene la fila y `profiles.subscription_tier` cambió; con `stripe trigger customer.subscription.deleted` vuelve a `free`.
- [ ] **Step 5:** Commit `feat(cobros): crear checkout y portal de cliente`.

### Task 4: Pantalla de planes en el panel

**Files:**
- Modify: `src/components/dashboard/views/SubscriptionView.tsx` (se reescribe)
- Create: `src/lib/pagos.ts`
- Modify: `src/components/dashboard/UpgradeModal.tsx` (botón oculto si `isNative`)
- Test: `src/components/dashboard/views/SubscriptionView.test.tsx`

**Interfaces:**
- Consumes: `POST /crear-checkout`, `POST /portal-cliente` (Task 3); `subscriptionPlans`, `PRECIOS_ANUALES`, `IVA_INCLUIDO` (Task 1); `useProfile()`; `isNative`.
- Produces: `iniciarPago(plan: PlanPago, ciclo: Ciclo): Promise<void>` y `abrirPortal(): Promise<void>` en `src/lib/pagos.ts` (llaman con `supabase.functions.invoke` y hacen `window.location.assign(url)`; si falla, toast "No se ha podido abrir el pago. Inténtalo de nuevo en un momento.").

Comportamiento de la vista:
- No DJ: vista actual (lo incluido en la cuenta), sin precios.
- Con `VITE_COBROS_ACTIVOS` distinto de `'true'`: vista actual, sin precios ni botones.
- DJ en web: plan actual con su nombre público; selector Mensual / Anual; 2 tarjetas de pago (más Esencial) con precio y "IVA incluido"; en anual "75,49 € al año" y el equivalente mensual; botón "Elegir Profesional" etc. que llama a `iniciarPago`. Si ya tiene plan de pago: botón "Gestionar mi plan" (`abrirPortal`) y, si `cancela_al_final`, aviso "Tu plan termina el {fecha}". Lee la fila de `suscripciones` del usuario.
- `?pago=ok` en la URL: aviso "Pago recibido. Tu plan se activa en unos segundos." y vuelve a leer el perfil a los 3 s y a los 8 s (el webhook puede tardar).
- DJ en app nativa: solo el nombre del plan actual. Sin precios, sin botones, sin texto sobre dónde pagar.
- Enlace a las condiciones de contratación (Task 5) debajo de las tarjetas.

- [ ] **Step 1: Tests que fallan**
  - DJ web free: aparecen "Profesional", "6,99", "IVA incluido"; al cambiar a anual aparece "75,49".
  - Pulsar "Elegir Premium" en anual llama a `iniciarPago('business', 'anual')` (mock de `@/lib/pagos`).
  - DJ con `subscription_tier: 'business'`: aparece "Gestionar mi plan" y no "Elegir Premium".
  - `isNative = true` (mock de `@/lib/capacitor`): no aparece ningún "€" ni botón "Elegir".
  - Empresario: no aparece ningún precio.
- [ ] **Step 2:** Ejecutar, FAIL.
- [ ] **Step 3:** Implementar con la paleta y tipografías actuales de la web; comprobar a 390 px.
- [ ] **Step 4:** Tests en verde y `npx vitest run` completo en verde.
- [ ] **Step 5:** Commit `feat(cobros): pantalla de planes con pago por Stripe`.

### Task 5: Condiciones de contratación y aviso legal

**Files:**
- Create: `src/pages/CondicionesSuscripcion.tsx` (ruta `/condiciones-suscripcion`, añadir a router y a `prerender-meta.mjs` como el resto de páginas públicas)
- Modify: `src/pages/AvisoLegal.tsx` (titular: nombre de Daniel, NIF, domicilio de la actividad y email de contacto)
- Test: `src/pages/CondicionesSuscripcion.test.tsx`

Bloqueada hasta tener el NIF del alta. Contenido mínimo de las condiciones: quién vende (titular y NIF), qué incluye cada plan, precios con IVA, renovación automática mensual o anual, cómo cancelar (portal, efecto al final del periodo ya pagado, sin devolución proporcional), derecho de desistimiento de 14 días y renuncia expresa al empezar el servicio en el momento (la casilla de términos del Checkout de Task 3 apunta aquí), cambios de precio con aviso de 30 días, impago (Stripe reintenta; si no se cobra, el plan vuelve a Esencial), contacto. La URL se configura en Stripe como "Terms of service". Que la gestoría la revise antes de pasar Stripe a modo live.

- [ ] **Step 1:** Test que falla: la página muestra el NIF y el texto "14 días".
- [ ] **Step 2:** Ejecutar, FAIL.
- [ ] **Step 3:** Escribir la página y actualizar el aviso legal.
- [ ] **Step 4:** Tests en verde.
- [ ] **Step 5:** Commit `feat(cobros): condiciones de contratación y titular en aviso legal`.

### Task 6: Paso a producción (cuando Daniel lo pida)

- [ ] Prueba completa en modo test: alta mensual, cambio a anual desde el portal, código `BLACKFRIDAY26` aceptado en anual y no ofrecido en mensual, cancelación, pago fallido con la tarjeta `4000 0000 0000 0341`.
- [ ] Repetir los pasos manuales de Stripe en modo live y cambiar los secretos a los de live.
- [ ] Desplegar las 3 funciones y la web.
- [ ] Primer pago real con la tarjeta de Daniel y devolverlo desde Stripe.
- [ ] Commit y anotar en la memoria del proyecto.

## Fuera de este plan (cada una necesita su ficha XDS)

- Lo que incluye cada plan (decidido 13 nov, por construir, ver memoria `project_xpeak_cobros_stripe_plan_13nov`): Instagram, TikTok y web solo visibles con plan de pago (SoundCloud visible para todos; en Esencial "Escríbele por XPEAK"; se ocultan, no se borran); avisos por WhatsApp solo de trabajo (solicitudes de particulares y ofertas de organizadores), nunca el teléfono del DJ; verificación ampliada solo para planes de pago; sorteo entre suscriptores (bases legales); Premium: más visibilidad, prioridad en comunicados, ficha con vídeo de fondo.

- Qué desbloquea cada plan dentro de la app (hoy casi no hay funciones atadas a `subscription_tier`). Sin esto, pagar no cambia casi nada salvo el sello y el podio.
- Cobro de 4,99 € al particular al cerrar un acuerdo (XDS 65,5).
- Instagram y contactos solo con Profesional (13 nov).
- Referidos, packs de streaming (en pausa), periodo de prueba de 15 días.
