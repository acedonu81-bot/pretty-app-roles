# Feed de Actividad Real — Diseño

## Problema

XPEAK necesita sensación de plataforma viva. La landing ya tiene un componente de "pills" de actividad flotante (`Landing.tsx:928-959`) pero el contenido está **100% hardcodeado y es falso** ("DJ contratado en Madrid", "Catering confirmado en Ibiza"...). El dashboard no tiene ningún elemento equivalente.

## Objetivo

Sustituir el contenido falso por datos reales de altas de perfil, y añadir un widget equivalente en el dashboard. Cero datos inventados — si no hay suficiente actividad real, el bloque no se muestra (sin placeholders falsos).

## Fuente de datos

Tabla `profiles` (ya existente, sin migraciones nuevas):
```
select display_name, role, zone, created_at
from profiles
where display_name is not null
order by created_at desc
limit 20
```

- Ventana primaria: últimas 24h.
- Fallback: si hay menos de 3 filas en 24h, ampliar a 30 días.
- Si tras el fallback sigue habiendo menos de 3 filas: no renderizar el bloque (ni en landing ni en dashboard).
- Refresco: polling cada 60s (no Realtime — frecuencia de altas no lo justifica).

## Hook compartido

`src/hooks/useActivityFeed.ts`

```ts
interface ActivityItem {
  id: string;
  text: string; // "{display_name} ({roleLabel}) se unió desde {zone}"
}

function useActivityFeed(): { items: ActivityItem[]; loading: boolean }
```

- Reutiliza el mapeo de roles a label ya definido en `OnboardingWizard.tsx` (`ROLES`), extraído a `src/lib/roles.ts` si no existe ya un sitio común (evitar duplicar el array).
- Si `zone` es null, omite esa parte del texto ("Marta (DJ) se unió a XPEAK").
- Única fuente de verdad consumida por ambos puntos de montaje.

## Landing (`Landing.tsx:928-959`)

- Se elimina el array hardcodeado de pills.
- Se sustituye por `useActivityFeed()` mapeado a la misma estructura de pills (texto, delay, duration, top alternante entre las dos filas existentes).
- Animación CSS `floatPill` y estilos visuales: sin cambios.
- Si `items.length === 0`, no se renderiza el contenedor de pills (el resto del hero no se ve afectado).

## Dashboard

- Nuevo componente `src/components/dashboard/ActivityFeedWidget.tsx`.
- Variante vertical compacta, mismo lenguaje visual que `OnboardingTour.tsx` (fondo blanco, borde `rgba(212,175,55,0.2)`, texto en `rgba(22,20,18,0.6-0.9)`).
- Lista las últimas ~5 entradas de `useActivityFeed()`, sin animación de scroll (a diferencia del ticker de landing).
- Punto de montaje: dentro del layout principal del dashboard (sidebar o zona superior del contenido), decisión de ubicación exacta se resuelve en el plan de implementación — no afecta el diseño de datos.
- Si `items.length === 0`, no se renderiza el widget.

## Fuera de alcance (explícitamente, para esta iteración)

- Activación Flash Booking, verificaciones, contactos/mensajes como fuentes del feed — quedan para una iteración futura si esta primera versión funciona.
- Ventana previa al dashboard con contrataciones, directos de DJs, blog de cabecera — ideas descartadas para esta iteración, documentadas pero no implementadas.

## Testing

- Verificar manualmente que con 0, 1-2, y 3+ altas reales en Supabase el comportamiento (oculto / fallback 30 días / feed normal) es correcto.
- Verificar que el hook no rompe la build si `zone` o `role` vienen null.
