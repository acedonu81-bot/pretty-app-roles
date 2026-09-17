# Tres features de retorno pre-monetización

Fecha: 2026-09-17

## Contexto

XPEAK va a lanzar con pagos más adelante bajo un modelo freemium-con-corte
(todo gratis hasta que se active el muro de pago). Antes de eso hace falta
construir funcionalidad que genere uso recurrente y dependencia real —
"que duela perderlo cuando se corte" — en vez de que XPEAK sea solo un
directorio donde subes tu foto.

Se identificaron 3 piezas, priorizadas por menor distancia desde lo ya
construido y mayor efecto de retención, validadas contra un análisis de
competencia (Habitissimo, Cronoshare, Wolly, GigSalad, Encore, Cueup,
Fresha, Calendly, Thumbtack): ningún competidor ofrece benchmarking de
mercado por categoría/zona, y solo GigSalad muestra presión de escasez
(aunque solo por oportunidad de reserva concreta, no agregada).

Orden de construcción: **1 → 3 → 4** (numeración heredada de la
conversación; no existe una pieza "2" en este documento — el punto 2
original, garantía de no-presentación con escrow, queda aparcado y fuera
de esta spec).

## Pieza 1 — Señal de escasez

### Objetivo
Mostrar actividad reciente real (sin inventar cifras) a ambos lados del
marketplace para generar presión a actuar, usando datos que ya se
capturan hoy.

### Datos existentes
`profile_business_views` (317 filas ya registradas) — no se conoce su
esquema exacto todavía; antes de implementar, `list_tables(verbose=true)`
o `information_schema.columns` sobre esta tabla para confirmar columnas
reales (se espera algo como `profile_user_id`, `viewer_user_id`,
`created_at`).

### Al profesional (dashboard)
- Tarjeta nueva, visible en el dashboard del profesional (ubicación:
  junto a donde ya vive el resumen de actividad — revisar
  `useActivityFeed` y las vistas existentes del dashboard de
  profesional antes de decidir el punto de montaje exacto).
- Texto: "N organizadores han visto tu perfil esta semana" —
  `count(*)` sobre `profile_business_views` filtrado por
  `profile_user_id = <yo>` y `created_at >= now() - interval '7 days'`.
- Si N = 0, no se muestra alarmismo — copy neutro tipo "Aún sin vistas
  esta semana" o se oculta la tarjeta (decidir en implementación,
  siguiendo el tono de estados vacíos ya establecido en el proyecto).

### Al organizador (ficha pública del profesional)
- Línea discreta en `PublicProfile.tsx`, cerca de donde ya vive
  `AvailabilityCalendar`: "Contactado por N empresarios esta semana" —
  cuenta de `flash_bookings` con `professional_user_id = <ese perfil>`
  y `created_at >= now() - interval '7 days'`, sin mostrar quién.
- Si N = 0, no se muestra la línea (evitar comunicar inactividad de
  forma negativa — ver `feedback_tono_emails_usuarios` en memoria: nunca
  admitir fallos/inactividad de forma que dañe al profesional).

### Fuera de alcance
- Sin tiempo real (no hace falta websocket/realtime); se recalcula al
  cargar la vista.
- Sin tabla nueva.
- Sin desglose por quién vio/contactó (privacidad).

## Pieza 3 — Insight de mercado (posición relativa de tarifa)

### Objetivo
Mostrar al profesional cómo se sitúa su tarifa frente a su categoría y
zona, sin exponer cifras ajenas — solo posición relativa. Ningún
competidor analizado ofrece esto; es la pieza de mayor diferenciación.

### Regla de negocio
- Comparar contra `profiles.hourly_rate` de otros perfiles reales
  (excluir `hourly_rate = 0/null`, excluir emails demo/`@xpeak.es`,
  excluir el propio usuario) con el mismo `category` y `zone` (o
  `region` si `zone` es demasiado granular — confirmar en
  implementación cuál de las dos columnas tiene mejor cobertura real
  hoy).
- **Umbral mínimo: 5 perfiles comparables.** Si hay menos de 5, no se
  muestra el insight — ni un mensaje de "faltan datos" que insinúe
  privacidad rota, simplemente no aparece la tarjeta.
- Cálculo: `avg(hourly_rate)` del grupo comparable, luego
  `(mi_tarifa - media) / media * 100` redondeado, mostrado como texto:
  "Tu tarifa está un X% por [encima/debajo] de la media de tu categoría
  en tu zona."
- Sin rango de precios exacto, sin mencionar cifras ajenas en absoluto
  — solo el porcentaje relativo propio.

### Dónde vive
Nueva tarjeta en el dashboard del profesional, junto a la de señal de
escasez (pieza 1) — even mismo bloque de "cómo te va" si tiene sentido
visualmente, a decidir en implementación.

### Fuera de alcance
- Sin comparativa entre categorías distintas.
- Sin serie histórica/tendencia — solo el snapshot actual.
- No se muestra al organizador.

## Pieza 4 — Calendario con solicitud directa

### Objetivo
Que el organizador vea la disponibilidad real del profesional en su
ficha pública y pueda solicitar esa fecha concreta en un clic, en vez de
negociar por WhatsApp. Sigue el patrón validado de Fresha (calendario +
reserva), pero **sin auto-confirmación**: el profesional sigue
aprobando manualmente cada solicitud, como ya ocurre hoy en
`SolicitudesTab`.

### Estado actual (confirmado en código)
- `AvailabilityCalendar.tsx` (129 líneas) ya existe, ya se usa en
  `PublicProfile.tsx`, y ya lee `availability.blocked_date` — pero es
  **de solo lectura**: pinta verde/rojo sin ninguna interacción.
- `FlashBookingRequestModal.tsx` ya acepta `professionalName`,
  `professionalRole`, `professionalUserId` y ya inserta en
  `flash_bookings` con `status: 'pending'`, ya envía email + push al
  profesional. El campo `date` del formulario está vacío por defecto.
- `SolicitudesTab` (dentro de `flashbooking/`) ya es donde el
  profesional ve y gestiona las solicitudes entrantes — no se toca.

### Cambios necesarios

**1. Rediseño visual de `AvailabilityCalendar.tsx`** (aprobado con
mockup): mismo fondo claro, pero celdas con color sólido más saturado
(`#2fa561` disponible, `#d94848` ocupado, `#D4AF37` hoy) y sombra
`box-shadow: 0 4-5px 10-12px` en vez del `rgba(...,0.1)` plano actual.
Sin iconos. Aplicar tanto en el calendario del dashboard del
profesional (gestión, ya existe) como en la ficha pública.

**2. Interactividad en modo público**: `AvailabilityCalendar` recibe una
prop nueva (p. ej. `mode: 'edit' | 'view-request'`):
- `edit` (uso actual del profesional en su propio dashboard): clic en
  un día alterna bloqueado/libre, como hoy.
- `view-request` (uso en `PublicProfile.tsx`): clic en un día **libre**
  abre `FlashBookingRequestModal` con `date` precargada a ese día; clic
  en un día **ocupado** no hace nada (o muestra tooltip "no disponible").

**3. `FlashBookingRequestModal`**: añadir prop opcional
`prefilledDate?: string` que inicializa `form.date` — cambio mínimo, no
toca la lógica de envío existente.

**4. Modal explicativo "¿Cómo funciona?"**: componente nuevo,
reutilizado en ambos contextos con copy distinto según rol
(profesional ve "así gestionas tu disponibilidad", organizador ve "así
reservas una fecha"). Se dispara:
- Automáticamente la primera vez, vía flag en `localStorage`
  (`xpeak_calendar_intro_seen_pro` / `..._org`, o clave equivalente
  namespaced por rol).
- Siempre disponible después vía un botón "¿Cómo funciona?" junto al
  calendario (sin icono decorativo adicional, coherente con la
  decisión de "sin emojis/iconos decorativos" ya vigente en el
  proyecto).

### Fuera de alcance (explícitamente descartado en esta ronda)
- Reserva instantánea/auto-confirmada (patrón alternativo descartado
  por el usuario — más riesgo de doble reserva).
- Pago o señal en el momento de solicitar (es la pieza 2, aparcada).
- Sincronización con calendarios externos (Google/Outlook).

## Orden de implementación recomendado

1. Rediseño visual de `AvailabilityCalendar` (aislado, cero riesgo,
   sienta la base visual para todo lo demás).
2. Señal de escasez (pieza 1) — puramente lectura, sin tocar flujos
   existentes.
3. Insight de mercado (pieza 3) — puramente lectura, independiente de
   las otras dos.
4. Interactividad del calendario + modal de solicitud + modal
   explicativo (pieza 4) — la más grande, toca un componente que ya
   está en producción en la ficha pública.

Cada pieza es desplegable de forma independiente; no hay dependencias
entre 1, 3 y 4 salvo que las tres comparten el estilo visual del punto
0.

## Preguntas abiertas para resolver en la fase de plan/implementación

- Esquema exacto de `profile_business_views` (columnas reales) — no
  verificado en esta sesión.
- Si usar `profiles.zone` o `profiles.region` para el agrupado de la
  pieza 3 (cuál tiene mejor cobertura de datos reales hoy).
- Ubicación exacta de montaje de las tarjetas nuevas dentro del
  dashboard del profesional (qué vista/archivo).
