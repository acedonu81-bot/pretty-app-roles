# "Una sala de Madrid ha visto tu perfil" — Diseño

## Problema

XPEAK ya rastrea visitas a perfiles públicos (`profiles.score`, incrementado en cada vista en `PublicProfile.tsx`), pero ese contador no tiene contexto: no sabe quién visitó, ni cuándo fue la última vez, ni si quien visitó era alguien relevante (una sala/empresa) o tráfico genérico. No hay ninguna señal de prestigio social tipo "alguien de la industria ha visto tu perfil", que sí existe en plataformas comparables (Vynstage: "Universal Music ha visto tu perfil").

## Objetivo

Mostrar al profesional, de forma discreta en su dashboard, cuándo una empresa/sala logueada ha visto su perfil público recientemente — usando solo datos reales, sin inventar actividad, y sin exponer la identidad de quién contrató ni del visitante.

## Captura de datos

**Nueva tabla `profile_business_views`:**
```sql
create table profile_business_views (
  id uuid primary key default gen_random_uuid(),
  viewed_user_id uuid not null,
  viewer_zone text,
  created_at timestamptz not null default now()
);
```

- Sin guardar el `user_id` del visitante, nombre de empresa, ni cualquier otro dato identificable — solo la zona, igual de anónimo que `contact_events`.
- Sin foreign key a `profiles` (mismo patrón ya usado en `contact_events`, evita acoplar la tabla de señales a la tabla principal).

**Inserción (en `PublicProfile.tsx`):**
- Junto al bloque existente que incrementa `score` al cargar un perfil (`PublicProfile.tsx:297-301`), se añade una inserción condicional:
  - Solo si hay un usuario autenticado (`authUser` ya disponible en el componente).
  - Solo si el perfil del usuario autenticado tiene `role === 'empresario'` (requiere una consulta ligera a `profiles` filtrando por `user_id = authUser.id`, ya que `PublicProfile.tsx` no tiene hoy acceso al rol del visitante, solo al `authUser` de auth).
  - Solo si `authUser.id !== data.user_id` (no contar como visita el que el propio profesional vea su perfil).
  - Si no se cumplen las tres condiciones, no se inserta nada — no hay rastro de visitas anónimas, de DJs viendo a otros DJs, etc. en esta tabla.

## Visualización (dashboard)

- Una línea de texto compacta, sin caja ni icono, con la misma tipografía/color que el resto de texto secundario del dashboard (igual de discreta que una nota al pie).
- Se coloca inmediatamente debajo del `ActivityFeedWidget` (el ticker de Actividad Reciente), como hermano en el layout del dashboard.
- Texto: `Una sala de {zona} ha visto tu perfil · hace {tiempo relativo}` (mismo formato de tiempo relativo ya usado en `ActivityFeedWidget`: "hace N min" / "hace Nh" / "hace Nd"). Si `viewer_zone` es null: `Una sala ha visto tu perfil · hace {tiempo}`.
- Fuente: nuevo hook `useRecentBusinessView()` que consulta la fila más reciente de `profile_business_views` para `viewed_user_id = profile del usuario logueado actual`, dentro de una ventana de 7 días.
- Si no hay ninguna fila dentro de esa ventana, no se renderiza nada (sin placeholder, sin hueco en el layout).
- Sin polling — se carga una vez al montar el dashboard (esta señal no necesita refrescarse cada 60s como el feed de actividad; es informativa, no un ticker en vivo).

## Fuera de alcance

- Mostrar múltiples visitantes o un historial.
- Deduplicar visitas repetidas de la misma sala (cada vista cuenta, aunque sea la misma empresa varias veces).
- Notificaciones push/email cuando ocurre una visita.
- Mostrar esta señal en `ProfileView.tsx` / estadísticas (se descartó a favor de la línea compacta en el dashboard principal).

## Testing

- Verificar que la inserción solo ocurre cuando el visitante autenticado tiene `role = 'empresario'` y no es el propio dueño del perfil.
- Verificar que la línea no aparece si no hay visitas de empresario en los últimos 7 días.
- Verificar que el texto omite correctamente la zona cuando `viewer_zone` es null.
