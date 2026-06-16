# XPEAK con vida — Diseño

## Problema

XPEAK ya tiene un feed de actividad real (altas de perfil) en landing y dashboard (`useActivityFeed`), pero:
- En el dashboard se muestra como lista vertical, lo cual deja hueco vacío y no transmite movimiento continuo.
- En la landing no hay ningún indicador agregado de tamaño/actividad de la plataforma (números reales).
- No hay señal de disponibilidad inmediata (Flash Booking activo ahora) visible para visitantes no registrados.
- El único evento capturado es "alta de perfil". Los contactos reales desde fichas públicas (`PublicContactModal`) no dejan ningún rastro consultable — se pierden en un email.

## Objetivo

Reforzar en landing y dashboard la sensación de que XPEAK es una plataforma viva y con actividad real, usando exclusivamente datos reales de Supabase. Cero contadores falsos, cero "actividad" simulada.

## Alcance (4 piezas)

### A. Ticker horizontal de 2 filas — Dashboard (`ActivityFeedWidget`)

Sustituye la lista vertical actual por un ticker de 2 filas con autoscroll continuo, reutilizando el mismo mecanismo CSS `floatPill` (`translateX` infinito) que ya usan las pills del landing.

- Las fichas (avatar inicial + nombre + badge de rol + ciudad, igual diseño visual que ahora) se reparten alternando fila superior/inferior.
- El movimiento es continuo y no se detiene aunque haya pocos items: si `items.length` es bajo, el array se repite en loop dentro de la pista para no dejar huecos (mismo patrón ya usado en `Landing.tsx` con las 6 pills hardcodeadas, ahora con datos reales y N variable).
- Cuando `useActivityFeed` traiga datos nuevos tras el polling de 60s, el contenido de la pista se actualiza sin reiniciar brúscamente la animación (se sustituye el array fuente; la animación CSS sigue corriendo sobre el DOM re-renderizado).
- Si `items.length === 0` (regla ya existente), el widget no se renderiza.
- Punto verde "nuevo" (<15 min) y badges de rol coloreados: se mantienen igual que en la versión actual.

### B. Barra de estadísticas en vivo — Landing (hero)

Fila de 3 contadores reales bajo el hero:
- **Profesionales activos** — `count` de `profiles` con `role` distinto de `pending`.
- **Disponibles ahora** — `count` de `profiles` con `is_flash_active = true`.
- **Ciudades** — `count` de valores distintos no nulos de `zone` en `profiles`.

Fuente: un nuevo hook `useLiveStats()` que hace 3 queries `count`-only (head request, sin traer filas) a Supabase, con polling cada 60s (mismo intervalo que `useActivityFeed`). Si las 3 cifras son 0 (entorno vacío), no se renderiza la barra.

### C. Ribbon "Disponibles ahora" — Landing

Lista horizontal compacta (no ticker, estática) de hasta 5 profesionales con `is_flash_active = true`, ordenados por `updated_at` descendente. Cada chip: avatar inicial + rol + ciudad — sin nombre completo para evitar exponer datos de contacto a un visitante anónimo no registrado (alineado con el resto de la landing, que ya oculta detalles de contacto hasta que el visitante se registra).

Fuente: nuevo hook `useAvailableNow()`, query a `profiles` filtrando `is_flash_active = true`, límite 5, polling 60s. Si no hay ninguno disponible, el bloque no se renderiza.

### D. Registro de eventos de contacto + feed combinado

**Nueva tabla `contact_events`** (migración Supabase):
```sql
create table contact_events (
  id uuid primary key default gen_random_uuid(),
  professional_role text not null,
  professional_zone text,
  created_at timestamptz not null default now()
);
```
Sin claves foráneas a `profiles` ni a datos del solicitante — es intencionalmente anónima y mínima (solo rol + zona del profesional contactado, para mostrar "se contactó a un DJ en Valencia" sin identificar a nadie).

RLS: insert público permitido (cualquiera puede contactar sin estar autenticado), select público permitido (es la fuente del feed), update/delete deshabilitados para todos excepto rol de servicio.

**Modificación de `PublicContactModal.tsx`**: tras invocar la función `send-email` exitosamente, insertar una fila en `contact_events` con el rol y zona del profesional contactado (ya disponibles como props/datos en el componente vía `professionalUserId` → se necesita pasar también `role` y `zone` como props nuevas desde `PublicProfile.tsx`, que ya los tiene en `sbProfile`).

**Feed combinado**: `useActivityFeed` se extiende para mezclar dos tipos de fila ordenadas por `created_at`:
- Altas de perfil (ya existente): `"{nombre} ({rol}) se unió desde {zona}"`
- Eventos de contacto (nuevo): `"Alguien contactó a un {rol} en {zona}"` (si no hay zona: `"Alguien contactó a un {rol}"`)

El tipo `ActivityItem` gana un campo `kind: 'signup' | 'contact'` para que los consumidores (pills, ticker del dashboard) puedan estilizar diferente si quieren (p.ej. icono distinto), aunque visualmente pueden tratarse igual en esta primera versión. La regla `MIN_ITEMS` y el fallback de ventana (24h → 30 días) se mantienen, aplicados al conjunto combinado.

## Fuera de alcance

- Geolocalización del visitante para personalizar contadores ("cerca de ti").
- Eventos de contacto desde el dashboard (mensajes internos vía `messages`) — esta iteración solo cubre el formulario público anónimo.
- Cualquier animación de "incremento" simulado en los contadores (p.ej. contar hacia arriba con efecto). Los números se muestran directos, sin trucos visuales que sugieran actividad inventada.

## Testing

- Verificar manualmente el ticker con 0, 1-2 y 3+ items reales en Supabase (oculto / fallback 30 días / feed normal — igual que ya se verificó para el feed original).
- Verificar que `contact_events` se inserta correctamente al enviar el formulario público, y que no rompe el flujo si la inserción falla (no debe bloquear el envío del email).
- Verificar que los 3 contadores de `useLiveStats` y el ribbon de `useAvailableNow` no se rendericen si no hay datos suficientes.
- Verificar que el feed combinado ordena correctamente altas y contactos por fecha real.
