# Reputación de un vistazo: tiempo de respuesta + preguntas estructuradas en reseñas

## Contexto

Hoy el perfil público de un profesional (`src/pages/PublicProfile.tsx`) muestra
un chip de rating agregado (⭐ 4.8 (12), añadido el 16 sep 2026) y, más abajo,
la lista completa de reseñas de empresarios con estrellas + comentario libre
(`ReviewsSection`, tabla `reviews`).

Objetivo: dar a un empresario que entra a ver una ficha una foto rápida y
fiable de cómo es contratar a ese profesional, sin tener que leer reseñas de
texto una por una — al estilo de los indicadores "Responde en X" de Wallapop,
más un desglose de 3 preguntas de sí/no sobre la experiencia de contratación.

Esto añade dos piezas independientes:

1. **Indicador de tiempo de respuesta** — cuánto tarda el profesional en
   contestar el primer mensaje de un empresario, calculado sobre mensajería
   real (`conversations` + `messages`), no autoinformado.
2. **Preguntas estructuradas en la reseña** — 3 preguntas sí/no
   (puntualidad, cumplimiento de lo acordado, recontratación) añadidas al
   formulario de valoración existente (`ReviewModal` en `HistorialTab.tsx`),
   agregadas como porcentaje en el perfil público.

Ambas piezas son transversales a todos los roles: ni `messages`/
`conversations` ni `reviews` filtran por rol de profesional, así que el
indicador y las preguntas aplican igual a un DJ, un mago o un camarero.

## Parte 1 — Indicador "Responde en X"

### Modelo de datos

Nueva columna en `profiles`:

```sql
alter table public.profiles
  add column response_bucket text
    check (response_bucket in ('minutos','menos_1h','unas_horas','1_dia','mas_1_dia'));
```

`null` = sin datos suficientes (nunca ha respondido a un primer contacto de
un empresario) → no se muestra el chip.

### Cálculo

Job diario (pg_cron, mismo mecanismo que `review-reminder` y los crons
existentes en XPEAK) que, para cada profesional:

1. Busca sus conversaciones (`conversations` donde `participant_a` o
   `participant_b` = el profesional).
2. Para cada una, se queda solo si el **primer mensaje** de esa conversación
   lo envió el otro participante (el empresario) — no cuenta cuando el
   profesional escribe primero (p. ej. tras un Flash Booking).
3. Calcula el tiempo entre ese primer mensaje y el primer mensaje posterior
   enviado por el profesional (su primera respuesta real).
4. Saca la **mediana** (no la media, para no dejarse arrastrar por un pico
   nocturno aislado) de esos tiempos sobre todas sus conversaciones
   elegibles.
5. Clasifica la mediana en un bucket:
   - `< 15 min` → `minutos`
   - `< 1 h` → `menos_1h`
   - `< 6 h` → `unas_horas`
   - `< 24 h` → `1_dia`
   - `>= 24 h` → `mas_1_dia`
6. Actualiza `profiles.response_bucket`.

Se muestra con **mínimo 1** conversación respondida — sin umbral de 3, para
dar visibilidad desde el principio dado el volumen aún bajo de la
plataforma.

**Backfill retroactivo**: la migración que crea `response_bucket` incluye
un `UPDATE` inicial que ejecuta la misma lógica sobre todo el histórico ya
existente en `messages`/`conversations`, no solo mensajes futuros. A partir
de ahí, el cron diario mantiene el dato al día.

### UI

En `src/pages/PublicProfile.tsx`, mismo bloque de tags de la cabecera donde
hoy vive el chip de rating (`seoReviews`) y "Verificado por XPEAK". Nuevo
chip, mismo estilo visual, justo después del de rating:

```
⚡ Responde en minutos
```

Etiquetas por bucket:
- `minutos` → "Responde en minutos"
- `menos_1h` → "Responde en menos de 1 hora"
- `unas_horas` → "Responde en unas horas"
- `1_dia` → "Responde en 1 día"
- `mas_1_dia` → "Suele tardar en responder"

Si `response_bucket` es `null`, no se renderiza el chip (igual que el de
rating cuando no hay reseñas).

## Parte 2 — Preguntas estructuradas en la reseña

### Modelo de datos

Nuevas columnas en `reviews`:

```sql
alter table public.reviews
  add column llego_puntual boolean,
  add column cumplio_acordado boolean,
  add column volveria_contratar boolean;
```

Quedan `null` en filas existentes (hoy solo hay 1 reseña en toda la
plataforma, ver Parte 3).

### `ReviewModal` (`HistorialTab.tsx`)

Debajo de las estrellas y encima del textarea de comentario, 3 toggles
Sí/No, **obligatorios** para poder enviar (igual que ya es obligatorio el
comentario de mínimo 5 caracteres):

- "¿Llegó puntual al evento?"
- "¿Cumplió con lo acordado?"
- "¿Volverías a contratarlo/a?"

El `submit()` de `ReviewModal` valida que las 3 tengan un valor antes de
insertar, y las incluye en el `insert` a `reviews`.

### UI en el perfil público

`ReviewsSection` en `PublicProfile.tsx`. No se toca la cabecera (los chips
de rating y tiempo de respuesta viven ahí, sin cambios). Se añade una línea
de resumen justo encima de la lista de reseñas individuales:

```
100% dice que llegó puntual · 100% cumplió lo acordado · 100% repetiría
```

Calculado solo sobre reseñas aprobadas (`approved = true`) que **no** son
`null` en cada columna — cada porcentaje se calcula independientemente
sobre su propio subconjunto de respuestas válidas, así una reseña antigua
sin estas respuestas no cuenta ni en el numerador ni en el denominador de
ningún porcentaje. Si el subconjunto de una pregunta está vacío, esa parte
de la línea no se muestra (puede que se muestre solo 1 o 2 de las 3
fracciones si aún hay reseñas antiguas sin completar).

## Parte 3 — Completar reseñas antiguas

Hoy solo hay 1 fila en `reviews` en producción, y su `reviewer_id`
corresponde a un profesional (no a un empresario) — no hay ninguna reseña
real de empresario→profesional que necesite este flujo ahora mismo. Se
construye igualmente para futuros casos (p. ej. una migración de datos, o
crecimiento antes de que se generalice el uso de las 3 preguntas).

### Detección

En `HistorialTab.tsx`, donde el empresario ya ve las reseñas propias que ha
dado (dentro de su historial), se identifica cualquier reseña suya
(`reviewer_id = user.id`) con alguna de las 3 columnas nuevas en `null`.

### UI

Junto a esa reseña incompleta, un botón "Completa tu valoración" que abre
un mini-formulario — mismo componente visual que las 3 preguntas del
`ReviewModal`, sin repetir estrellas ni comentario — y hace un `UPDATE` de
esa fila existente en `reviews` con las 3 respuestas.

### Notificación

Se envía un aviso (mismo canal/plantilla que ya usa XPEAK para pedir
reseñas, ver `review-reminder`) invitando a completar la valoración
pendiente. **Regla dura**: nunca se envía a cuentas de autocontrato o demo
(`demo.organizador@xpeak.es`, `demo.profesional@xpeak.es`, ni ninguna
cuenta interna de prueba equivalente) — mismo criterio que ya aplica a los
envíos masivos de email en XPEAK.

## Fuera de alcance

- No se recalculan tiempos de respuesta en tiempo real al visitar un
  perfil — solo vía el cron diario.
- No se pide a los empresarios que revaloren sus 3 respuestas si cambian de
  opinión tras enviarlas; solo se ofrece completar las que faltan.
- No se toca el chip de rating de estrellas ya existente (commit previo del
  16 sep 2026).
- No se añade el indicador de tiempo de respuesta a `ProfileCard.tsx` (la
  ficha apilada del dashboard) en esta fase — solo al perfil público
  individual.
