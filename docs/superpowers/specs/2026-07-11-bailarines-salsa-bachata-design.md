# Potenciar bailarines de salsa/bachata en XPEAK

**Fecha:** 2026-07-11
**Estado:** Aprobado (arquitectura general) — implementación por fases

## Contexto

`role: 'bailarin'` ya existe en XPEAK (rutas `/contratar-bailarin`, `/contratar-bailarin/:ciudad`, sidebar, seed data), pero está encuadrado exclusivamente como "show/actuación en evento" (flamenco, breakdance para bodas y corporativos). No hay contenido de blog para este rol, no aparece en Landing.tsx, y no cubre el mercado real de salsa/bachata/kizomba: bailarines que también dan clases particulares, buscan pareja de baile fija, y organizan/asisten a socials y congresos.

## Objetivo

Potenciar el rol de bailarín para capturar ese mercado, sin romper el modelo actual de XPEAK (directorio de profesionales contratables + organizadores que contratan).

## Decisiones de alcance (ya acordadas)

- **Clases particulares**: modelo bailarín profesional → alumno particular (no B2B academia). Se añade como atributo del perfil existente, no como tabla nueva.
- **Buscar pareja de baile**: solo entre bailarines PROFESIONALES ya registrados en XPEAK. No se abre un tipo de cuenta nuevo para aficionados sin perfil profesional — eso queda fuera de alcance explícitamente.
- **Agenda de socials/congresos**: contenido generado por los propios usuarios (bailarines/promotores publican), no mantenido a mano por el equipo. Vive en una sección pública nueva indexable (`/socials`), no solo dentro del dashboard privado.
- **Orden de implementación**: 4 fases secuenciales, cada una verificada (build + type-check + revisión) antes de pasar a la siguiente. No se despliega todo junto sin verificar.

## Arquitectura

Todo se apoya en el `role: 'bailarin'` ya existente en `profiles`. Tres piezas nuevas, cada una lo más aislada posible:

### Fase 1 — Blog SEO + landing (sin cambios de esquema)
Mismo patrón que azafatas/camareros/maquillaje: artículos de blog "precio bailarín + ciudad" con ángulo específico de salsa/bachata/kizomba (hoy el contenido implícito es solo flamenco/breakdance). 5-6 ciudades de partida. Actualiza también `Landing.tsx` para que el rol aparezca donde corresponda (hoy no aparece en ningún sitio de la home).

### Fase 2 — Clases particulares (extensión de `profiles`)
Nuevos campos en `profiles`:
- `offers_classes: boolean`
- `class_styles: text[]` (ej. `['salsa', 'bachata', 'kizomba']`)
- `class_price: numeric` (precio por hora/sesión)

Se muestran como bloque adicional en el perfil público del bailarín, con su propio CTA de contacto ("Contactar para clases"). No requiere tabla nueva ni cambios de RLS — mismo patrón que otros campos opcionales de perfil.

### Fase 3 — Agenda de socials (`/socials`, tabla nueva)
Tabla `dance_socials` (nombre del evento, ciudad, estilo, fecha, sala/dirección, quién publica — `user_id`). RLS siguiendo el patrón ya usado en `flash_bookings`: cualquier usuario con perfil puede publicar (INSERT), cualquiera puede ver (SELECT público). Página pública `/socials` filtrable por ciudad y estilo, indexable en Google (términos de búsqueda reales: "social de bachata Madrid esta semana").

### Fase 4 — Buscar pareja de baile (extensión de `profiles` + vista en directorio existente)
Nuevos campos en `profiles`:
- `seeking_dance_partner: boolean`
- `dance_level: text` (ej. `'principiante' | 'intermedio' | 'avanzado'`)

Nueva vista/filtro dentro del directorio de bailarines ya existente (no una sección aparte): filtro "buscan pareja de baile" por estilo y nivel. El contacto entre bailarines reutiliza el sistema de mensajería ya existente en XPEAK — no se construye chat ni matching automático nuevo.

## Explícitamente fuera de alcance

- Tipo de cuenta nuevo para aficionados sin perfil profesional (se descartó tras discusión — mantiene XPEAK dentro de su modelo actual de "profesional contratable / organizador").
- Matching automático de parejas de baile (algoritmo de compatibilidad) — es contacto manual vía mensajería, como el resto de XPEAK.
- Moderación automatizada de la agenda de socials — queda para una iteración posterior si el volumen lo justifica.

## Riesgos y mitigaciones

- **Contenido generado por usuarios en `/socials` sin moderación previa**: riesgo de spam/contenido inapropiado. Mitigación mínima viable: RLS solo permite publicar a usuarios con perfil (no anónimos), y se puede añadir un botón de reporte en una iteración posterior si hace falta.
- **Migración de esquema fuera de control de versiones**: como ya ha pasado con otras tablas del proyecto (`conversations`, `messages`, `referrals`), toda migración de esta iniciativa debe crearse como archivo versionado en `supabase/migrations/`, no aplicarse solo desde el dashboard de Supabase.

## Orden de implementación

1. Fase 1 (SEO/landing) — menor riesgo, mismo patrón ya dominado.
2. Fase 2 (clases) — extensión simple de perfil.
3. Fase 3 (agenda de socials) — tabla nueva + página pública nueva.
4. Fase 4 (buscar pareja) — depende conceptualmente de fases 1-2 (perfil de bailarín ya enriquecido).

Cada fase se implementa, verifica (`tsc` + `build`) y despliega por separado, con confirmación explícita del usuario antes de cada deploy.
