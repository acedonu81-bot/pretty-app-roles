# Diseño — Eje Ocasión × Rol para GEO/AEO (ganar a Gigstarter)

**Fecha:** 2026-08-13
**Objetivo:** Que las IAs (ChatGPT, Perplexity, Google AI Overviews) y Google citen XPEAK para queries del tipo *"contratar DJ para boda sin comisión"*, hoy dominadas por Gigstarter.

---

## Problema (verificado)

Auditoría de citación (13 ago 2026, 8 queries reales): **XPEAK aparece en 0/8**. Gigstarter, Artistealo y DJClub.pro dominan.

Causa raíz verificada — **no es el schema** (el de XPEAK ya es superior; Gigstarter rankea #1 *sin* JSON-LD). La ventaja de Gigstarter es estructural:

- Gigstarter tiene páginas **por OCASIÓN**: `/occasions/boda/contratar-dj`, con H1 "Contratar DJs para tu Boda" y title "Contratar DJ para bodas - Sin comisiones". Calca la query.
- XPEAK solo tiene el eje **rol** (`/contratar-dj`) y **rol × ciudad** (`/contratar-dj/madrid`). **No existe el eje ocasión.**

El nombre "XPEAK" NO es un factor (Gigstarter tampoco tiene nombre descriptivo y rankea #1). No se toca.

## Objetivo concreto

Crear el eje **ocasión × rol** (~40-60 páginas, sin ciudad) que calque las queries comerciales, aprovechando que XPEAK ya tiene el schema (answer box + FAQPage) que Gigstarter no tiene → superarles en la misma query.

## No-objetivos (YAGNI)

- NO añadir ciudad al eje ahora (ocasión × rol × ciudad = miles de páginas, riesgo de thin content). Se evaluará después.
- NO tocar el nombre ni la identidad de marca.
- NO añadir más schema del que ya existe — reutilizar el patrón actual.
- NO refactor no relacionado del motor de landing.

---

## Arquitectura

Reutiliza el motor existente `CityLanding.tsx`, que ya:
- Detecta el rol desde el pathname (`/contratar-dj/... → 'dj'`).
- Toma un segundo parámetro (hoy `:ciudad`) para condicionar `desc/intro/faqs`.
- Genera H1, meta, breadcrumb y JSON-LD (FAQPage, BreadcrumbList) por combinación.
- Se prerenderiza vía `prerender-content.mjs` + `prerender-meta.mjs`.

### Enfoque elegido: nuevo componente `OccasionLanding.tsx` (no reusar CityLanding)

Se evaluaron 3 enfoques:

1. **Reutilizar CityLanding con el param como "ocasión"** — rechazado: CityLanding está fuertemente acoplado a lógica de ciudad (venues, `useCityProfessionals` con `ilike city`, precios por ciudad). Forzar ocasión ahí ensucia ambos.
2. **Componente nuevo `OccasionLanding.tsx` dedicado** — ELEGIDO. Mismo patrón visual y de schema que CityLanding, pero con su propia fuente de datos `OCCASIONS` y consulta de profesionales por rol (sin filtro de ciudad). Boundary limpio: una unidad = un propósito.
3. **Páginas estáticas .tsx una a una** — rechazado: 40-60 archivos duplicados, inmantenible.

### Fuente de datos

Nuevo objeto `OCCASIONS: Record<string, OccasionInfo>` en `src/pages/OccasionLanding.tsx`:

```
boda:       { label: 'Boda', slug: 'boda', priceHint..., intro(cat), faqs(cat, precio) }
cumpleanos: { label: 'Cumpleaños', slug: 'cumpleanos', ... }
empresa:    { label: 'Evento de Empresa', slug: 'evento-empresa', ... }
comunion:   { label: 'Comunión', slug: 'comunion', ... }
fiesta-privada: { label: 'Fiesta Privada', slug: 'fiesta-privada', ... }
```

Los roles se reutilizan de `CATEGORIES` (ya exportado desde CityLanding): dj, fotografo, catering, camareros, animador, mago, grupo-musical, etc. Se seleccionan los roles relevantes por ocasión (p.ej. "mago" tiene sentido en cumpleaños/comunión, menos en evento de empresa) mediante una lista `ROLES_POR_OCASION` para no generar combinaciones sin sentido comercial.

### Rutas

Patrón: `/contratar-:rol/ocasion/:ocasion` **NO** — colisiona con `/contratar-:rol/:ciudad`.
Patrón elegido: **`/:ocasion/contratar-:rol`** replicando a Gigstarter (`/occasions/boda/contratar-dj`), pero más limpio:

`/boda/contratar-dj`, `/boda/contratar-fotografo`, `/cumpleanos/contratar-mago`, etc.

Se registran en `App.tsx` como rutas explícitas por ocasión apuntando a `OccasionLanding` (igual que hoy `/contratar-dj/:ciudad`). El componente detecta ocasión y rol desde el pathname.

### Contenido por página (calca la query + supera con schema)

- **Title:** `Contratar {Rol} para {Ocasión} sin comisión — XPEAK`
- **H1:** `Contratar {Rol} para {Ocasión} en España`
- **Answer box** ("Respuesta rápida") extraíble — Gigstarter NO lo tiene.
- **FAQPage JSON-LD** con 4-5 preguntas específicas de esa ocasión×rol.
- **Intro** enfocada a la ocasión (no genérica).
- **Lista de profesionales reales** del rol (query Supabase por rol, sin filtro ciudad) + fallback nacional, igual que CityLanding.
- **BreadcrumbList + Organization** heredados del patrón.
- Enlaces internos a las páginas de ciudad del mismo rol y a otras ocasiones (interlinking).

## Prerender

- `prerender-meta.mjs`: añadir las rutas ocasión×rol al listado (o generarlas por bucle desde OCCASIONS × ROLES_POR_OCASION).
- `prerender-content.mjs`: añadir el patrón de ruta ocasión al descubrimiento (hoy expande `/contratar-X/:ciudad`; añadir expansión `/:ocasion/contratar-X`).
- `update-sitemap.mjs`: incluir las nuevas URLs.

## Flujo de datos

1. Build → prerender-meta genera el shell HTML+meta de cada `/{ocasion}/contratar-{rol}`.
2. prerender-content renderiza `OccasionLanding` a HTML real e inyecta JSON-LD.
3. update-sitemap añade las URLs.
4. Deploy Vercel.

## Manejo de errores

- Ocasión o rol no reconocido → `<Navigate>` a la home del rol (`/contratar-{rol}`) o 404 controlado, igual que CityLanding hace hoy con ciudad desconocida.
- Sin profesionales de ese rol en BD → fallback a sugerencias nacionales (patrón existente).

## Testing / Verificación (regla falsable del usuario)

- `npx tsc --noEmit` limpio.
- Build genera N páginas nuevas, 0 fallidas en prerender.
- Verificación por curl (user-agent Googlebot) de 1 página piloto: H1 correcto, FAQPage en crudo, answer box presente.
- Skill `verify-flows` NO aplica (no toca registro/carrito/flash booking) — es contenido de landing.
- **Predicción falsable:** con las páginas boda×rol + escalado desplegadas e indexadas, para ~15 nov 2026 la query "contratar DJ para boda sin comisión" devolverá XPEAK. Métrica: WebSearch cita xpeak.es. Hoy: 0/8.

## Plan de ejecución (fases con checkpoint)

1. **Piloto:** `OccasionLanding.tsx` + datos de `boda` + ruta `/boda/contratar-dj` + prerender. Verificar end-to-end 1 página.
2. **Escalar roles de boda:** boda × {dj, fotografo, catering, camareros, grupo-musical, animador...}.
3. **Escalar ocasiones:** cumpleaños, evento-empresa, comunión, fiesta-privada × sus roles relevantes.
4. **Interlinking + sitemap + deploy.**
5. **Comparativa** "XPEAK vs alternativas" (página aparte, Fase 2C) — opcional, decisión posterior.
