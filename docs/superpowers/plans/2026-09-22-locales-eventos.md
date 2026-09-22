# Rol "Locales para eventos" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir "Locales para eventos" como rol normal de XPEAK (perfil, alta, mensajería, sin comisión — igual que cualquier otro gremio), con 5 campos específicos (aforo, permite pernoctar, precio/hora, precio/evento-noche, distancia desde Madrid), más un listado no-ficha debajo con los locales ya investigados por el usuario que aún no se han registrado.

**Architecture:** Se sigue al pie de la letra el patrón real usado para el rol `tecnico` (añadido el 7 sep 2026): slug BD `local_eventos`, slug público `locales-eventos`, réplica en las mismas ~24 listas hardcodeadas del repo. La vista es un wrapper fino sobre `DirectoryView` genérico (como `TecnicoView.tsx`), con un bloque de filtros/campos propio añadido para los 5 campos que `DirectoryView` no conoce. El listado de "no ficha" reutiliza los arrays de datos ya existentes en `BlogLocalesEventosMadrid.tsx`, extraídos a un archivo compartido, filtrados para excluir los locales vetados. Se descarta la idea previa de "Zona Despedidas" (roles múltiples, banner, panel dedicado) — queda anulada, esto es solo un rol más dentro del explorador normal.

**Tech Stack:** Vite + React 18 + TypeScript + Tailwind + shadcn/ui, Supabase (Postgres + RLS), React Query.

**Spec:** No hay spec separado — este plan es resultado directo de brainstorming en conversación (2026-09-21/22), decisión empresarial confirmada por el usuario: anular Zona Despedidas, lanzar solo "Locales para eventos" como rol normal.

## Global Constraints

- Slug BD del rol: `local_eventos`. Slug público (URLs, sitemap): `locales-eventos`.
- Nombre visible: "Locales para eventos".
- 5 campos nuevos en `profiles`: `venue_capacity` (integer, aforo), `allows_overnight` (boolean, permite pernoctar), `price_per_hour` (numeric, precio por hora — opcional), `price_per_event` (numeric, precio por evento/noche — opcional), `distance_from_madrid_km` (integer, distancia desde Madrid).
- Toda migración de columna nueva DEBE incluir `GRANT SELECT` explícito a los roles `anon`/`authenticated` sobre las columnas nuevas si la tabla usa grants por columna — el bug del 16 sep 2026 (columna nueva sin heredar SELECT, 401 en todo `/p/:id`) no se repite.
- Excluidos permanentemente del listado "no ficha" (pidieron no ser promocionados): Casa Vieja Bar, Trastevere, Terminal 55, B12 Madrid, Black Star. Ya limpiados de `scratch/locales_madrid_guia.md`; deben quedar igual de ausentes en el archivo de datos compartido que crea este plan.
- Sin emojis/iconos decorativos en ninguna superficie nueva (regla fija del proyecto).
- Sin comisión por reserva, mismo modelo de suscripción que el resto de roles — no se toca lógica de pago.
- No hacer deploy a producción salvo que el usuario lo pida explícitamente (commit local sí).

---

## File Structure

**Nuevos:**
- `supabase/migrations/<timestamp>_add_locales_eventos_fields.sql` — 5 columnas nuevas + GRANT.
- `src/data/localesEventosMadrid.ts` — arrays de locales investigados (extraídos de `BlogLocalesEventosMadrid.tsx`), tipados, sin los 5 excluidos.
- `src/components/dashboard/views/LocalEventosView.tsx` — wrapper sobre `DirectoryView`, con bloque de campos extra y el listado "no ficha" debajo.
- `src/components/dashboard/LocalEventosExtraFields.tsx` — inputs de los 5 campos específicos, usados en el formulario de perfil (`ProfileView.tsx`) solo cuando `role === 'local_eventos'`.

**Modificados (patrón `tecnico` → `local_eventos` / `tecnico-sonido` → `locales-eventos`):**
- `src/pages/Auth.tsx` (`KNOWN_ROLES`)
- `src/components/dashboard/MobileBottomNav.tsx` (`dirViews`)
- `scripts/update-sitemap.mjs` (`cats`, `catPri`, `dirSlugs`, `catsByCity`)
- `src/lib/constants.ts` (`ROLE_ES`, tercer mapeo de categoría corta, `ROLE_TAGS`)
- `src/components/OnboardingWizard.tsx` (`ROLES`, `TIPS`)
- `src/pages/DirectorioPublico.tsx` (`ROLE_CONFIG`, `ALL_ROLES`, `RELATED_ROLES`)
- `src/pages/CategoryLanding.tsx` (`CATEGORY_DATA`)
- `src/pages/CityLanding.tsx` (`ROLE_MAP`, `CATEGORIES`, `FACTOR_PRECIO`)
- `src/App.tsx` (rutas `/contratar-locales-eventos` y `/contratar-locales-eventos/:ciudad`)
- `src/pages/OccasionLanding.tsx` (`ROLES_POR_OCASION`)
- `src/pages/Dashboard.tsx` (lazy import, `directoryViews`, `case`, mapa de sinónimos de búsqueda)
- `src/components/dashboard/DashboardSidebar.tsx` (`DIRECTORY_ITEMS`, `DIRECTORY_GROUPS`, `ROLE_LABEL`)
- `src/components/dashboard/GeometricAvatar.tsx` (icono)
- `src/components/dashboard/views/empresario/DiscoverTab.tsx` (filtro)
- `src/pages/Landing.tsx` (`CATEGORY_DEST`, mapeo a roles BD)
- `src/pages/Descubrir.tsx` (`ROLE_ICON`, `ROLE_GROUPS`)
- `src/components/dashboard/views/ExplorarView.tsx` (`GRUPOS`)
- `src/components/dashboard/views/DirectoryView.tsx` (`fetchDirectoryProfiles`: añadir las 5 columnas nuevas al `.select(...)`)
- `scripts/prerender-meta.mjs` (entrada de meta para `/contratar-locales-eventos`)
- `scripts/prerender-content.mjs`
- `scripts/city-inventory.mjs`
- `public/llms.txt`
- `public/.well-known/agent-skills/xpeak-directorio-eventos/SKILL.md`
- `src/pages/BlogLocalesEventosMadrid.tsx` (importar arrays desde el nuevo archivo compartido en vez de duplicarlos)

---

## Task 1: Migración de base de datos

**Files:**
- Create: `supabase/migrations/<timestamp>_add_locales_eventos_fields.sql`

**Interfaces:**
- Produces: columnas `profiles.venue_capacity` (integer, nullable), `profiles.allows_overnight` (boolean, nullable), `profiles.price_per_hour` (numeric, nullable), `profiles.price_per_event` (numeric, nullable), `profiles.distance_from_madrid_km` (integer, nullable) — consumidas por Task 3 (`fetchDirectoryProfiles`) y Task 6 (formulario de perfil).

- [ ] **Step 1: Comprobar si `profiles` usa grants por columna (no solo por tabla)**

Ejecutar contra el proyecto Supabase (`ddrqhwravupjzysriblq`):

```sql
select grantee, table_name, column_name, privilege_type
from information_schema.column_privileges
where table_schema = 'public' and table_name = 'profiles' and privilege_type = 'SELECT'
order by grantee, column_name
limit 20;
```

Si aparecen filas (grants por columna existen), el Step 3 de abajo es obligatorio, no opcional. Si la tabla solo tiene grant a nivel de tabla completa, el Step 3 sigue sin sobrar (no hace daño) pero es menos crítico.

- [ ] **Step 2: Escribir la migración**

```sql
-- Campos específicos del rol "Locales para eventos" (local_eventos).
-- aforo, si permite pernoctar, precio por hora Y por evento/noche (muchos
-- locales cobran por horas, no solo tarifa plana por noche), y distancia
-- desde Madrid — dato relevante porque varias fincas de despedida están
-- fuera de la ciudad.
alter table public.profiles
  add column if not exists venue_capacity integer,
  add column if not exists allows_overnight boolean,
  add column if not exists price_per_hour numeric,
  add column if not exists price_per_event numeric,
  add column if not exists distance_from_madrid_km integer;

comment on column public.profiles.venue_capacity is 'Aforo/capacidad de personas, rol local_eventos';
comment on column public.profiles.allows_overnight is 'Si el local permite pernoctar, rol local_eventos';
comment on column public.profiles.price_per_hour is 'Precio por hora, rol local_eventos (opcional, alternativo a price_per_event)';
comment on column public.profiles.price_per_event is 'Precio por evento/noche, rol local_eventos (opcional, alternativo a price_per_hour)';
comment on column public.profiles.distance_from_madrid_km is 'Distancia en km desde Madrid, rol local_eventos';
```

- [ ] **Step 3: GRANT explícito (obligatorio si Step 1 mostró grants por columna)**

```sql
grant select (venue_capacity, allows_overnight, price_per_hour, price_per_event, distance_from_madrid_km)
  on public.profiles to anon, authenticated;
```

- [ ] **Step 4: Aplicar la migración**

Usar la herramienta de Supabase MCP `apply_migration` (no `execute_sql`, es DDL) contra el proyecto `ddrqhwravupjzysriblq`, con el contenido de Steps 2+3 combinado.

- [ ] **Step 5: Verificar que las columnas son legibles como `anon`**

```sql
select venue_capacity, allows_overnight, price_per_hour, price_per_event, distance_from_madrid_km
from public.profiles
limit 1;
```

Ejecutar esta consulta impersonando `anon` (o simplemente confirmar que el GRANT del Step 3 se aplicó sin error) — el fallo silencioso de este chequeo es exactamente el bug del 16 sep.

- [ ] **Step 6: Commit**

```bash
cd /Users/danielacedonunez/pretty-app-roles
git add supabase/migrations/
git commit -m "feat(db): añadir campos de local_eventos a profiles (aforo, pernocta, precio, distancia)"
```

---

## Task 2: Archivo de datos compartido — locales investigados sin ficha

**Files:**
- Create: `src/data/localesEventosMadrid.ts`
- Modify: `src/pages/BlogLocalesEventosMadrid.tsx` (sustituir arrays locales por import)

**Interfaces:**
- Produces: `interface LocalInvestigado { nombre: string; zona: string; tipo: string; web?: string; foto: string; fotoReal: boolean; categoria: 'emblematico' | 'sala' | 'bar' | 'terraza' | 'huertas-latina' | 'finca'; }` y los arrays `EMBLEMATICOS`, `SALAS`, `BARES`, `TERRAZAS`, `HUERTAS_LATINA`, `FINCAS: LocalInvestigado[]`, más `TODOS_LOS_LOCALES_INVESTIGADOS: LocalInvestigado[]` (concatenación de los 6). Consumido por Task 4 (`LocalEventosView.tsx`) y por `BlogLocalesEventosMadrid.tsx` (ya existente).
- Consumes: nada (datos estáticos).

- [ ] **Step 1: Leer el archivo fuente completo antes de tocar nada**

```bash
cd /Users/danielacedonunez/pretty-app-roles
sed -n '1,50p' src/pages/BlogLocalesEventosMadrid.tsx
```

Confirmar la `interface Local` exacta (declarada antes de la línea 52, no capturada en la lectura previa) y los 6 arrays (`emblematicos`, `salas`, `bares`, `terrazas`, `huertasLatina`, `fincas`) tal como están hoy.

- [ ] **Step 2: Crear el archivo de datos compartido**

Mover los 6 arrays (contenido exacto ya verificado — 33 locales, sin Casa Vieja Bar/Trastevere/Terminal 55/B12 Madrid/Black Star, que ya no están presentes) a `src/data/localesEventosMadrid.ts`:

```ts
/**
 * Locales de Madrid investigados y verificados manualmente para la guía de
 * "Locales para eventos" — fuente única compartida entre el blog
 * (BlogLocalesEventosMadrid.tsx) y el listado "no ficha" del directorio del
 * rol local_eventos (LocalEventosView.tsx).
 *
 * Excluidos permanentemente a petición propia (no promocionar): Casa Vieja
 * Bar, Trastevere, Terminal 55, B12 Madrid, Black Star.
 */
export interface LocalInvestigado {
  nombre: string;
  zona: string;
  tipo: string;
  web?: string;
  foto: string;
  fotoReal: boolean;
}

const IMG = '/img/locales-madrid/';
const G_DISCO = [IMG + 'generico-discoteca-1.jpg', IMG + 'generico-discoteca-2.jpg', IMG + 'generico-discoteca-3.jpg'];
const G_BAR = [IMG + 'generico-bar-1.jpg', IMG + 'generico-bar-2.jpg'];
const G_ROOFTOP = [IMG + 'generico-rooftop-1.jpg', IMG + 'generico-rooftop-2.jpg'];
const G_FINCA = [IMG + 'generico-finca-1.jpg', IMG + 'generico-finca-2.jpg'];

export const EMBLEMATICOS: LocalInvestigado[] = [
  { nombre: 'Teatro Barceló', zona: 'Centro', tipo: 'Discoteca histórica, hasta 1.200 personas', web: 'https://teatrobarcelo.com', foto: G_DISCO[0], fotoReal: false },
  { nombre: 'Teatro Kapital', zona: 'Atocha', tipo: 'Discoteca de 7 plantas', web: 'https://teatrokapital.com', foto: G_DISCO[1], fotoReal: false },
  { nombre: 'Sala El Sol', zona: 'Gran Vía', tipo: 'Sala de conciertos desde 1979, cuna de la Movida', web: 'https://salaelsol.com', foto: G_DISCO[2], fotoReal: false },
  { nombre: 'Teatro Eslava', zona: 'Sol', tipo: 'Discoteca histórica junto a Puerta del Sol', web: 'https://teatroeslava.com', foto: G_DISCO[0], fotoReal: false },
  { nombre: 'Serrano 41', zona: 'Salamanca', tipo: 'Discoteca con terraza de verano', web: 'https://madridlux.com/es/discoteca/serrano41-madrid', foto: G_DISCO[1], fotoReal: false },
];

export const SALAS: LocalInvestigado[] = [
  { nombre: 'Sala BaoBao', zona: 'Chamberí', tipo: 'Discoteca, aforo 380', web: 'https://baobaomadrid.com', foto: G_DISCO[0], fotoReal: false },
  { nombre: 'Privados Madrid', zona: 'Leganés', tipo: '15 salas privadas', web: 'https://privadosmadrid.com', foto: G_DISCO[0], fotoReal: false },
  { nombre: 'Bodeguita de Enmedio', zona: 'Centro / La Latina', tipo: 'Sala de eventos', web: 'https://bodeguitadeenmedio.es', foto: G_DISCO[0], fotoReal: false },
  { nombre: 'Copérnico The Club', zona: 'Moncloa', tipo: 'Sala / discoteca', web: 'https://salacopernico.es', foto: G_DISCO[1], fotoReal: false },
  { nombre: 'NEXT Clubbing', zona: 'Cuzco', tipo: 'Club de música electrónica', web: 'https://nextclubbing.com', foto: G_DISCO[2], fotoReal: false },
  { nombre: 'Cristo Social Club', zona: 'Salamanca', tipo: 'Espacio elegante para eventos', web: 'https://xceed.me/es/madrid/venue/cristo-social-club', foto: G_DISCO[0], fotoReal: false },
  { nombre: 'Calle 365', zona: 'Las Letras', tipo: 'Speakeasy inmersivo', web: 'https://www.instagram.com/calle_365', foto: G_DISCO[1], fotoReal: false },
  { nombre: 'Costa Breve', zona: 'Las Letras', tipo: 'Eventos privados', web: 'https://grupocostabreve.com', foto: G_DISCO[2], fotoReal: false },
  { nombre: 'Malavita Night Bar', zona: 'Chamberí', tipo: 'Cumpleaños y fiestas privadas', web: 'https://malavitanightbar.com', foto: G_DISCO[0], fotoReal: false },
  { nombre: 'Sala Kubik', zona: 'Puerta de Toledo', tipo: 'Espacio multifuncional, aforo 120', web: 'https://www.instagram.com/salakubikmadrid', foto: G_DISCO[1], fotoReal: false },
];

export const BARES: LocalInvestigado[] = [
  { nombre: 'Pizpireta Bar', zona: 'Centro', tipo: 'Bar de dos plantas', web: 'https://pizpiretabar.com', foto: G_BAR[0], fotoReal: false },
  { nombre: 'Folie', zona: 'Hortaleza', tipo: 'Café espectáculo', web: 'https://foliebar.es', foto: G_BAR[0], fotoReal: false },
  { nombre: 'Marvelous Bar', zona: 'Chamberí', tipo: 'Bar para fiestas privadas', web: 'https://www.marvelousbar.es', foto: G_BAR[1], fotoReal: false },
  { nombre: 'Bar Daily', zona: 'Chamberí', tipo: 'Bar para fiestas y cumpleaños', web: 'https://bardaily.com', foto: G_BAR[0], fotoReal: false },
  { nombre: 'GramaBar', zona: 'Centro', tipo: 'Bar / restaurante con eventos', web: 'https://gramabar.com', foto: G_BAR[1], fotoReal: false },
];

export const TERRAZAS: LocalInvestigado[] = [
  { nombre: 'La Catorce Sky Bar', zona: 'Gran Vía', tipo: 'Rooftop con vistas al centro', web: 'https://lacatorcemadrid.es', foto: G_ROOFTOP[0], fotoReal: false },
  { nombre: 'Doñaluz — The Madrid Rooftop', zona: 'Centro / Montera', tipo: 'Rooftop', web: 'https://donaluzmadrid.com', foto: G_ROOFTOP[0], fotoReal: false },
  { nombre: 'Ella Sky Bar', zona: 'Gran Vía', tipo: 'Rooftop con vistas a Callao', web: 'https://ellaskybar.es', foto: G_ROOFTOP[1], fotoReal: false },
  { nombre: 'Irreverente Madrid', zona: 'Chamberí', tipo: 'Club + rooftop', web: 'https://irreverentemadrid.es', foto: G_ROOFTOP[0], fotoReal: false },
  { nombre: 'La Azotea Caribú', zona: 'Salamanca', tipo: 'Rooftop de 460m²', foto: G_ROOFTOP[1], fotoReal: false },
  { nombre: 'La Guarida Creativa', zona: 'Móstoles / zona sur', tipo: 'Terraza chill-out', web: 'https://laguaridacreativa.es', foto: G_ROOFTOP[0], fotoReal: false },
  { nombre: 'Areia Chill Out', zona: 'Chueca', tipo: 'Bar chill-out', web: 'https://www.areiachillout.com', foto: G_ROOFTOP[1], fotoReal: false },
  { nombre: 'Lobsterie', zona: 'Chueca', tipo: 'Bar con eventos privados', web: 'https://lobsterie.com', foto: G_ROOFTOP[0], fotoReal: false },
];

export const HUERTAS_LATINA: LocalInvestigado[] = [
  { nombre: 'Café Central', zona: 'Huertas', tipo: 'Sala de conciertos y jazz histórica', web: 'https://www.cafecentralmadrid.com', foto: G_BAR[0], fotoReal: false },
  { nombre: 'Tablao Flamenco 1911', zona: 'Huertas / Plaza Santa Ana', tipo: 'Tablao flamenco desde 1911', web: 'https://tablaoflamenco1911.com', foto: G_BAR[1], fotoReal: false },
  { nombre: 'ContraClub', zona: 'La Latina', tipo: 'Sala de conciertos y eventos', web: 'https://contraclub.es', foto: G_DISCO[0], fotoReal: false },
];

export const FINCAS: LocalInvestigado[] = [
  { nombre: 'Finca Valaurea', zona: 'Colmenar de Oreja (Madrid)', tipo: 'Finca para bodas y celebraciones', web: 'https://fincavalaurea.es', foto: G_FINCA[0], fotoReal: false },
  { nombre: 'Finca El Destino', zona: 'El Berrueco (Madrid)', tipo: 'Finca con piscina, sierra norte', web: 'https://fincaeldestino.com', foto: G_FINCA[0], fotoReal: false },
  { nombre: 'Antigua Fábrica de Harinas', zona: 'Torremocha de Jarama (Madrid)', tipo: 'Finca para eventos al aire libre', web: 'https://antiguafabricadeharinas.com', foto: G_FINCA[1], fotoReal: false },
  { nombre: 'Finca Los Tablares', zona: 'Colmenar de Oreja (Madrid)', tipo: 'Finca de 2 hectáreas', web: 'https://fincalostablares.com', foto: G_FINCA[0], fotoReal: false },
  { nombre: 'Poblado Medieval', zona: 'Puente del Congosto (a 1h de Madrid)', tipo: 'Complejo para despedidas con alojamiento', web: 'https://www.pobladomedieval.es', foto: G_FINCA[1], fotoReal: false },
];

export const TODOS_LOS_LOCALES_INVESTIGADOS: LocalInvestigado[] = [
  ...EMBLEMATICOS, ...SALAS, ...BARES, ...TERRAZAS, ...HUERTAS_LATINA, ...FINCAS,
];
```

- [ ] **Step 2b: Verificar el recuento**

```bash
node -e "
const { TODOS_LOS_LOCALES_INVESTIGADOS } = require('./src/data/localesEventosMadrid.ts');
" 2>&1 || true
```

(Este `node -e` fallará por ser TS — en su lugar, contar manualmente las entradas de los 6 arrays en el archivo recién creado y confirmar que suman 33. Si no suman 33, releer `scratch/locales_madrid_guia.md` y corregir antes de continuar.)

- [ ] **Step 3: Actualizar `BlogLocalesEventosMadrid.tsx` para importar en vez de duplicar**

Sustituir las declaraciones locales de `emblematicos`, `salas`, `bares`, `terrazas`, `huertasLatina`, `fincas` (líneas 52-104 del archivo original) por:

```ts
import { EMBLEMATICOS as emblematicos, SALAS as salas, BARES as bares, TERRAZAS as terrazas, HUERTAS_LATINA as huertasLatina, FINCAS as fincas } from '@/data/localesEventosMadrid';
```

Eliminar también las constantes `IMG`, `G_DISCO`, `G_BAR`, `G_ROOFTOP`, `G_FINCA` de `BlogLocalesEventosMadrid.tsx` si ya no se usan en ningún otro sitio del archivo (comprobar con grep antes de borrar).

- [ ] **Step 4: Verificar que el blog sigue compilando**

```bash
cd /Users/danielacedonunez/pretty-app-roles
npx tsc --noEmit
```

Expected: sin errores relacionados con `BlogLocalesEventosMadrid.tsx` ni `localesEventosMadrid.ts`.

- [ ] **Step 5: Commit**

```bash
git add src/data/localesEventosMadrid.ts src/pages/BlogLocalesEventosMadrid.tsx
git commit -m "refactor: extraer locales investigados a archivo de datos compartido"
```

---

## Task 3: Registrar el rol en las listas base (Auth, nav, sitemap, constants)

**Files:**
- Modify: `src/pages/Auth.tsx`
- Modify: `src/components/dashboard/MobileBottomNav.tsx`
- Modify: `scripts/update-sitemap.mjs`
- Modify: `src/lib/constants.ts`

**Interfaces:**
- Consumes: nada nuevo.
- Produces: el rol `local_eventos` reconocido por el flujo de alta, la navegación móvil, el sitemap, y `ROLE_ES['local_eventos'] === 'Locales para eventos'` — consumido por prácticamente todas las tareas siguientes.

- [ ] **Step 1: `src/pages/Auth.tsx` — añadir a `KNOWN_ROLES`**

Localizar la línea (patrón confirmado, línea ~398):
```ts
const KNOWN_ROLES = ['dj', 'grupo-musical', 'media', 'makeup', 'peluqueria', 'staff', 'azafata', 'promotor', 'empresario', 'catering', 'mago', 'humorista', 'animador', 'bailarin', 'speaker', 'vestuario', 'photo-booth', 'tecnico'];
```
Cambiar a:
```ts
const KNOWN_ROLES = ['dj', 'grupo-musical', 'media', 'makeup', 'peluqueria', 'staff', 'azafata', 'promotor', 'empresario', 'catering', 'mago', 'humorista', 'animador', 'bailarin', 'speaker', 'vestuario', 'photo-booth', 'tecnico', 'local_eventos'];
```

- [ ] **Step 2: `src/components/dashboard/MobileBottomNav.tsx` — añadir a `dirViews`**

Localizar (línea ~20):
```ts
const dirViews = new Set(['dj','staff','azafata','makeup','peluqueria','media','vestuario','design','promotor','event_manager','empresario','catering','mago','bailarin','humorista','monologo','animador','speaker','ambassador','photo-booth','grupo-musical','tecnico']);
```
Añadir `'local_eventos'` al final del set.

- [ ] **Step 3: `scripts/update-sitemap.mjs` — añadir a las 4 listas**

Localizar `cats` (línea ~154): añadir `'locales-eventos'`.
Localizar `catPri` (línea ~155): añadir `'locales-eventos': '0.8'` (mismo peso que `tecnico-sonido`, categoría de contratación directa).
Localizar `dirSlugs` (línea ~162): añadir `'locales-eventos'`.
Localizar `catsByCity` (línea ~222): añadir `'locales-eventos'`.

- [ ] **Step 4: `src/lib/constants.ts` — `ROLE_ES` y mapeo corto**

Localizar `ROLE_ES` (cerca de línea 26), añadir:
```ts
  local_eventos: 'Locales para eventos',
```

Antes de tocar la línea ~73 (segundo mapeo, `tecnico: 'montaje'`), leer el bloque completo alrededor para entender qué objeto es (probablemente una categoría corta usada en otro sitio) y replicar el mismo patrón con una clave corta razonable, p.ej. `local_eventos: 'locales'`.

Localizar `ROLE_TAGS` (línea ~157), añadir una entrada nueva con las especialidades relevantes:
```ts
    local_eventos: { label: 'Tipo de espacio', tags: ['Discoteca', 'Sala de fiestas', 'Bar de eventos', 'Rooftop / terraza', 'Finca', 'Casa rural', 'Salón de bodas', 'Espacio diáfano', 'Permite pernoctar', 'Zona chill-out', 'Barra libre incluida', 'Catering propio', 'DJ booth', 'Parking privado', 'Acceso adaptado'] },
```

- [ ] **Step 5: Verificar compilación**

```bash
cd /Users/danielacedonunez/pretty-app-roles
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/Auth.tsx src/components/dashboard/MobileBottomNav.tsx scripts/update-sitemap.mjs src/lib/constants.ts
git commit -m "feat: registrar rol local_eventos en alta, nav móvil, sitemap y constants"
```

---

## Task 4: Vista del directorio — `LocalEventosView.tsx` + campos extra + listado sin ficha

**Files:**
- Create: `src/components/dashboard/views/LocalEventosView.tsx`
- Modify: `src/components/dashboard/views/DirectoryView.tsx:69` (añadir columnas al `.select`)

**Interfaces:**
- Consumes: `DirectoryView` (props ya definidas: `role`, `title`, `subtitle`, `onNavigate`, `onMessage`, `searchQuery`, `onViewProfile`); `TODOS_LOS_LOCALES_INVESTIGADOS` de `src/data/localesEventosMadrid.ts` (Task 2).
- Produces: componente `LocalEventosView` con la misma firma de props que `TecnicoView` — consumido por `Dashboard.tsx` (Task 6).

- [ ] **Step 1: Añadir las 5 columnas nuevas al `.select()` de `fetchDirectoryProfiles`**

En `src/components/dashboard/views/DirectoryView.tsx:69`, el `.select(...)` actual termina en `'...experience_level, show_new_badge'`. Añadir al final de la cadena:
```
, venue_capacity, allows_overnight, price_per_hour, price_per_event, distance_from_madrid_km
```

- [ ] **Step 2: Extender el tipo `Profile` con los 5 campos opcionales**

En `src/data/profiles.ts`, añadir al final de la interfaz `Profile` (antes del cierre `}`):
```ts
  venueCapacity?: number | null;
  allowsOvernight?: boolean | null;
  pricePerHour?: number | null;
  pricePerEvent?: number | null;
  distanceFromMadridKm?: number | null;
```

- [ ] **Step 3: Crear `LocalEventosView.tsx`**

```tsx
import { useState } from 'react';
import DirectoryView from './DirectoryView';
import { TODOS_LOS_LOCALES_INVESTIGADOS } from '@/data/localesEventosMadrid';
import type { Profile } from '@/data/profiles';

interface Props {
  onNavigate?: (view: string) => void;
  onMessage?: (userId: string, name: string) => void;
  searchQuery?: string;
  onViewProfile?: (p: Profile) => void;
}

/**
 * Debajo del directorio normal (fichas registradas, contacto directo por
 * XPEAK) va este listado de locales investigados manualmente que aún no se
 * han dado de alta — deliberadamente más ligero que una ficha real: sin
 * mensajería interna, para no fingir una actividad en la plataforma que no
 * existe. Sirve de escaparate para que acaben reclamando su ficha.
 */
function ListadoSinFicha() {
  return (
    <div className="mx-auto w-full max-w-6xl px-3 pb-8 sm:px-4">
      <div className="mt-8 mb-4 flex items-center gap-2">
        <span className="h-4 w-1 flex-shrink-0 rounded-full" style={{ background: 'linear-gradient(180deg,#D4AF37,#B8941E)' }} />
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gold-on-light, #7a6216)' }}>
          Otros locales de Madrid (aún sin ficha en XPEAK)
        </h2>
      </div>
      <p className="mb-4 text-xs" style={{ color: 'rgba(10,9,8,0.55)' }}>
        Locales investigados y verificados por XPEAK. Contacto directo con el local, sin mensajería interna.
      </p>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
        {TODOS_LOS_LOCALES_INVESTIGADOS.map(local => (
          <div
            key={local.nombre}
            className="rounded-xl p-3"
            style={{ background: '#faf9f7', border: '1px solid rgba(10,9,8,0.08)' }}
          >
            <p className="text-xs font-semibold" style={{ color: '#0a0908' }}>{local.nombre}</p>
            <p className="mt-0.5 text-[11px]" style={{ color: 'rgba(10,9,8,0.55)' }}>{local.zona} · {local.tipo}</p>
            {local.web && (
              <a href={local.web} target="_blank" rel="noopener noreferrer nofollow" className="mt-1.5 inline-block text-[11px] font-semibold" style={{ color: '#8a6d1a' }}>
                Ver web →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const LocalEventosView = ({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) => (
  <>
    <DirectoryView
      role="local_eventos"
      title="Locales para eventos"
      subtitle="Discotecas, salas, terrazas y fincas de toda España que ceden su espacio para tu evento."
      wideCards
      onNavigate={onNavigate}
      onMessage={onMessage}
      searchQuery={searchQuery}
      onViewProfile={onViewProfile}
    />
    <ListadoSinFicha />
  </>
);

export default LocalEventosView;
```

- [ ] **Step 4: Verificar compilación**

```bash
cd /Users/danielacedonunez/pretty-app-roles
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/views/LocalEventosView.tsx src/components/dashboard/views/DirectoryView.tsx src/data/profiles.ts
git commit -m "feat: crear LocalEventosView con listado de locales sin ficha"
```

---

## Task 5: Campos extra en el formulario de perfil

**Files:**
- Create: `src/components/dashboard/LocalEventosExtraFields.tsx`
- Modify: `src/components/dashboard/views/ProfileView.tsx` (localizar el punto de inserción antes de escribir el diff — no hay línea confirmada por el informe previo, hace falta lectura directa)

**Interfaces:**
- Consumes: nada externo salvo `role` del perfil actual (ya disponible en `ProfileView`).
- Produces: inputs controlados que escriben en las mismas 5 columnas de Task 1, mediante el mismo mecanismo de guardado que ya usa `ProfileView` para el resto de campos (a determinar leyendo el archivo).

- [ ] **Step 1: Leer `ProfileView.tsx` completo para entender el patrón de guardado de campos existente**

```bash
cd /Users/danielacedonunez/pretty-app-roles
wc -l src/components/dashboard/views/ProfileView.tsx
grep -n "hourly_rate\|useState\|handleSave\|supabase\n.*update" src/components/dashboard/views/ProfileView.tsx | head -30
```

Identificar cómo se guarda hoy un campo simple como `hourly_rate` (qué estado local, qué función de guardado, qué llamada a Supabase) — replicar exactamente ese patrón para los 5 campos nuevos. No inventar un mecanismo de guardado distinto.

- [ ] **Step 2: Crear `LocalEventosExtraFields.tsx`**

El componente exacto depende del patrón hallado en Step 1 (probablemente recibe `profile`, `onChange` o similar). Estructura base, a adaptar a la convención real:

```tsx
interface Props {
  venueCapacity: number | null;
  allowsOvernight: boolean | null;
  pricePerHour: number | null;
  pricePerEvent: number | null;
  distanceFromMadridKm: number | null;
  onChange: (field: 'venueCapacity' | 'allowsOvernight' | 'pricePerHour' | 'pricePerEvent' | 'distanceFromMadridKm', value: number | boolean | null) => void;
}

const LocalEventosExtraFields = ({ venueCapacity, allowsOvernight, pricePerHour, pricePerEvent, distanceFromMadridKm, onChange }: Props) => (
  <div className="space-y-4">
    <div>
      <label className="text-xs font-semibold" style={{ color: '#0a0908' }}>Aforo (personas)</label>
      <input
        type="number"
        min={0}
        value={venueCapacity ?? ''}
        onChange={e => onChange('venueCapacity', e.target.value === '' ? null : Number(e.target.value))}
        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
      />
    </div>
    <label className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#0a0908' }}>
      <input
        type="checkbox"
        checked={allowsOvernight ?? false}
        onChange={e => onChange('allowsOvernight', e.target.checked)}
      />
      Permite pernoctar
    </label>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-semibold" style={{ color: '#0a0908' }}>Precio por hora (€)</label>
        <input
          type="number"
          min={0}
          value={pricePerHour ?? ''}
          onChange={e => onChange('pricePerHour', e.target.value === '' ? null : Number(e.target.value))}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold" style={{ color: '#0a0908' }}>Precio por evento/noche (€)</label>
        <input
          type="number"
          min={0}
          value={pricePerEvent ?? ''}
          onChange={e => onChange('pricePerEvent', e.target.value === '' ? null : Number(e.target.value))}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>
    </div>
    <div>
      <label className="text-xs font-semibold" style={{ color: '#0a0908' }}>Distancia desde Madrid (km)</label>
      <input
        type="number"
        min={0}
        value={distanceFromMadridKm ?? ''}
        onChange={e => onChange('distanceFromMadridKm', e.target.value === '' ? null : Number(e.target.value))}
        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
      />
    </div>
  </div>
);

export default LocalEventosExtraFields;
```

- [ ] **Step 3: Integrar en `ProfileView.tsx`**

Añadir el estado local para los 5 campos siguiendo el patrón hallado en Step 1, renderizar `<LocalEventosExtraFields ... />` condicionalmente cuando `profile.role === 'local_eventos'` (o `profile.roles?.includes('local_eventos')`), e incluir los 5 campos en el payload de guardado hacia Supabase (mapeando `venueCapacity` → `venue_capacity`, etc., igual que ya hace el resto de campos camelCase→snake_case).

- [ ] **Step 4: Verificar compilación**

```bash
cd /Users/danielacedonunez/pretty-app-roles
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/LocalEventosExtraFields.tsx src/components/dashboard/views/ProfileView.tsx
git commit -m "feat: campos de aforo, pernocta, precio y distancia en el perfil de local_eventos"
```

---

## Task 6: Dashboard, sidebar, avatar, explorador, discover tab

**Files:**
- Modify: `src/pages/Dashboard.tsx`
- Modify: `src/components/dashboard/DashboardSidebar.tsx`
- Modify: `src/components/dashboard/GeometricAvatar.tsx`
- Modify: `src/components/dashboard/views/empresario/DiscoverTab.tsx`
- Modify: `src/components/dashboard/views/ExplorarView.tsx`

**Interfaces:**
- Consumes: `LocalEventosView` (Task 4).
- Produces: el rol navegable desde sidebar, explorador, dashboard y discover tab de empresario.

- [ ] **Step 1: `Dashboard.tsx` — lazy import**

Añadir junto al resto de lazy imports (línea ~51):
```ts
const LocalEventosView = lazy(() => import('@/components/dashboard/views/LocalEventosView'));
```

- [ ] **Step 2: `Dashboard.tsx` — mapa de sinónimos de búsqueda**

Añadir junto a la línea ~252:
```ts
  local_eventos: ['local', 'locales', 'evento', 'eventos', 'finca', 'discoteca', 'sala', 'terraza', 'despedida'],
```

- [ ] **Step 3: `Dashboard.tsx` — `directoryViews`**

Añadir `'local_eventos'` al Set de la línea ~456-465.

- [ ] **Step 4: `Dashboard.tsx` — case del switch**

Añadir junto a la línea ~511:
```tsx
      case 'local_eventos': return <LocalEventosView onNavigate={nav} onMessage={handleMessage} searchQuery={searchQuery} onViewProfile={setSelectedProfile} />;
```

- [ ] **Step 5: `DashboardSidebar.tsx` — `DIRECTORY_ITEMS`, `DIRECTORY_GROUPS`, `ROLE_LABEL`**

`DIRECTORY_ITEMS` (línea ~51), añadir:
```ts
  { id: 'local_eventos', label: 'Locales para eventos' },
```

`DIRECTORY_GROUPS` (línea ~67): añadir como grupo propio o dentro de un grupo existente coherente — dado que "Sala, Barra & Catering" ya existe como grupo en `ExplorarView.tsx`, usar el mismo agrupamiento aquí:
```ts
  { label: 'Sala, Barra & Catering', ids: [...idsExistentes, 'local_eventos'] },
```
(leer el grupo existente exacto antes de editarlo — no asumir el nombre de la variable con los ids actuales).

`ROLE_LABEL` (línea ~70), añadir al objeto:
```ts
local_eventos: 'Locales para eventos',
```

- [ ] **Step 6: `GeometricAvatar.tsx` — icono**

Añadir junto a la línea ~166, reutilizando un icono ya importado y coherente (p.ej. `Building2` de lucide-react si está disponible en el archivo, si no usar el mismo que `tecnico` reutilizó de `design`):
```ts
    local_eventos: Building2,
```
Si `Building2` no está importado en el archivo, añadir el import desde `lucide-react` en la cabecera.

- [ ] **Step 7: `DiscoverTab.tsx` — filtro**

Añadir junto a la línea ~143:
```tsx
                { value: 'local_eventos', label: 'Locales para eventos' },
```

- [ ] **Step 8: `ExplorarView.tsx` — `GRUPOS`**

Añadir un item nuevo dentro del grupo `'Sala, Barra & Catering'` (línea ~60-66):
```ts
  {
    titulo: 'Sala, Barra & Catering',
    items: [
      { id: 'staff', view: 'staff', nombre: 'Sala & Barra', gancho: 'Camareros, bartenders y personal de sala' },
      { id: 'catering', view: 'catering', nombre: 'Catering & Chef', gancho: 'Cocina, barra y showcooking' },
      { id: 'local_eventos', view: 'local_eventos', nombre: 'Locales para eventos', gancho: 'Discotecas, salas, terrazas y fincas' },
    ],
  },
```

Nota: requiere una foto en `/images/pexels/roles/local_eventos.jpg` (mismo patrón que el resto de tarjetas, `img(item.id)` en el archivo). Si no existe, la tarjeta mostrará una imagen rota — añadir la descarga de una foto Pexels adecuada (discoteca/sala de eventos) como parte de este step, guardada en esa ruta exacta.

- [ ] **Step 9: Verificar compilación**

```bash
cd /Users/danielacedonunez/pretty-app-roles
npx tsc --noEmit
```

- [ ] **Step 10: Commit**

```bash
git add src/pages/Dashboard.tsx src/components/dashboard/DashboardSidebar.tsx src/components/dashboard/GeometricAvatar.tsx src/components/dashboard/views/empresario/DiscoverTab.tsx src/components/dashboard/views/ExplorarView.tsx
git commit -m "feat: integrar local_eventos en dashboard, sidebar, avatar y explorador"
```

---

## Task 7: SEO público — landing, ciudad, ocasión, directorio público, descubrir

**Files:**
- Modify: `src/pages/DirectorioPublico.tsx`
- Modify: `src/pages/CategoryLanding.tsx`
- Modify: `src/pages/CityLanding.tsx`
- Modify: `src/App.tsx`
- Modify: `src/pages/OccasionLanding.tsx`
- Modify: `src/pages/Landing.tsx`
- Modify: `src/pages/Descubrir.tsx`

**Interfaces:**
- Consumes: nada nuevo del código; sí depende de contenido/copy nuevo (ver Steps).
- Produces: rutas públicas `/directorio/locales-eventos`, `/contratar-locales-eventos`, `/contratar-locales-eventos/:ciudad` indexables.

- [ ] **Step 1: `DirectorioPublico.tsx` — `ROLE_CONFIG`, `ALL_ROLES`, `RELATED_ROLES`**

`ROLE_CONFIG` (línea ~218), añadir siguiendo el bloque completo del patrón `tecnico-sonido` (leer el bloque entero, no solo las 2 líneas ya vistas, antes de clonarlo):
```ts
  'locales-eventos': {
    dbRole: 'local_eventos',
    // resto de campos del bloque, copiando la forma exacta que usa 'tecnico-sonido'
    // (título, descripción, etc. — leer el objeto completo antes de escribir este bloque)
  },
```

`ALL_ROLES` (línea ~246):
```ts
  { slug: 'locales-eventos', label: 'Locales para eventos' },
```

`RELATED_ROLES` (línea ~280):
```ts
  'locales-eventos': ['dj', 'catering', 'staff'],
```

- [ ] **Step 2: `CategoryLanding.tsx` — `CATEGORY_DATA`**

Leer el bloque completo de `'tecnico-sonido'` (a partir de línea ~700, el grep previo solo capturó la apertura) para replicar todos los subcampos (probablemente título SEO, descripción, FAQ, precio medio, etc.). Crear el bloque `'locales-eventos'` con contenido real y específico (no genérico copiado literal) — precios, uso típico y FAQ de un local para eventos son distintos de un técnico de sonido.

- [ ] **Step 3: `CityLanding.tsx` — `ROLE_MAP`, contenido, `FACTOR_PRECIO`**

`ROLE_MAP` (línea ~31):
```ts
  'locales-eventos': ['local_eventos'],
```

Bloque de contenido (línea ~532, leer completo antes de clonar): crear `'locales-eventos': { ... }` con copy propio.

`FACTOR_PRECIO` (línea ~667): definir un factor propio, no reutilizar el de `tecnico-sonido` sin pensarlo — un local se cobra por evento/noche, no por jornada de trabajo de un técnico. Ejemplo de arranque (ajustar tras ver el resto de factores del array para mantener coherencia de escala):
```ts
  'locales-eventos': [1, 1],  // precio ya es el precio final del local, sin escalar por duración
```

- [ ] **Step 4: `App.tsx` — rutas**

Junto a línea ~458:
```tsx
            <Route path="/contratar-locales-eventos" element={<CategoryLanding />} />
```
Junto a línea ~484:
```tsx
            <Route path="/contratar-locales-eventos/:ciudad" element={<CityLanding />} />
```

- [ ] **Step 5: `OccasionLanding.tsx` — `ROLES_POR_OCASION`**

Añadir `'locales-eventos'` a las ocasiones donde tenga sentido — como mínimo `boda` (línea ~193) y una ocasión nueva o existente relevante para despedidas/cumpleaños si existe en el archivo (leer el objeto completo de claves antes de decidir en cuáles insertar).

- [ ] **Step 6: `Landing.tsx` — mapeo a roles BD**

Seguir el patrón de la clave de categoría corta (en `tecnico` era `tecnica`, no `tecnico`) — leer el archivo completo para decidir la clave de categoría apropiada (probablemente reutilizar `staff` o crear una nueva `locales`) y añadir la entrada al mapeo a roles BD:
```ts
  locales: ['local_eventos'],
```
más su entrada correspondiente en `CATEGORY_DEST` si aplica una ruta destino propia.

- [ ] **Step 7: `Descubrir.tsx` — `ROLE_ICON`, `ROLE_GROUPS`**

`ROLE_ICON` (línea ~40):
```ts
  'locales-eventos': Building2,
```
(mismo icono elegido en Task 6 Step 6, importar si no está ya).

`ROLE_GROUPS` (línea ~54): añadir `'locales-eventos'` al grupo `'Sala, Barra & Catering'` si existe como grupo en este archivo, o al grupo más cercano existente.

- [ ] **Step 8: Verificar compilación**

```bash
cd /Users/danielacedonunez/pretty-app-roles
npx tsc --noEmit
```

- [ ] **Step 9: Commit**

```bash
git add src/pages/DirectorioPublico.tsx src/pages/CategoryLanding.tsx src/pages/CityLanding.tsx src/App.tsx src/pages/OccasionLanding.tsx src/pages/Landing.tsx src/pages/Descubrir.tsx
git commit -m "feat: rutas y contenido SEO público para locales-eventos"
```

---

## Task 8: Scripts de build (sitemap ya cubierto en Task 3) — prerender y city-inventory

**Files:**
- Modify: `scripts/prerender-meta.mjs`
- Modify: `scripts/prerender-content.mjs`
- Modify: `scripts/city-inventory.mjs`
- Modify: `public/llms.txt`
- Modify: `public/.well-known/agent-skills/xpeak-directorio-eventos/SKILL.md`

**Interfaces:**
- Consumes: nada nuevo.
- Produces: meta tags SEO correctos en el build, inventario de ciudad×rol correcto (evita el bug de `ROLE_MAP` desincronizado ya documentado en memoria — este archivo es uno de los 3 sitios donde se copia a mano).

- [ ] **Step 1: `prerender-meta.mjs` — entrada de meta para `/directorio/locales-eventos` y `/contratar-locales-eventos`**

Leer el archivo completo alrededor de la línea ~842 (la entrada de `/directorio/tecnico-sonido` capturada previamente) para confirmar si `/contratar-X` tiene su propia entrada en otro bloque del archivo (el informe de exploración no encontró una explícita para `tecnico-sonido` con ese patrón — puede generarse dinámicamente). Añadir entrada de meta con título/descripción propios de "Locales para eventos":
```js
    path: '/directorio/locales-eventos',
    // title, desc, ogTitle, ogDesc, ogType — mismo formato que el bloque de tecnico-sonido ya presente, contenido propio
```

- [ ] **Step 2: `prerender-content.mjs` y `city-inventory.mjs` — mapeo público→BD**

En ambos archivos, junto a la línea con el patrón `'photo-booth': ['photo-booth'], 'tecnico-sonido': ['tecnico'],`, añadir:
```js
'locales-eventos': ['local_eventos'],
```
**Importante:** este es el mismo patrón `ROLE_MAP` que ya causó el bug documentado en memoria (`reference-consultas-perfiles-desincronizadas` — copiado a mano en `CityLanding.tsx`, `prerender-content.mjs`, `city-inventory.mjs`). Confirmar que los 3 sitios quedan con la entrada `'locales-eventos': ['local_eventos']` idéntica antes de cerrar esta tarea (Task 7 Step 3 ya cubrió `CityLanding.tsx`).

- [ ] **Step 3: `public/llms.txt`**

Junto a la línea ~31, añadir:
```
- [Locales para eventos](https://xpeak.es/contratar-locales-eventos)
```

- [ ] **Step 4: `SKILL.md` del agent-skill**

En `public/.well-known/agent-skills/xpeak-directorio-eventos/SKILL.md`, línea ~29, añadir `locales-eventos` a la lista de valores válidos de `rol`.

- [ ] **Step 5: Verificar que los scripts corren sin error de sintaxis**

```bash
cd /Users/danielacedonunez/pretty-app-roles
node --check scripts/prerender-meta.mjs
node --check scripts/prerender-content.mjs
node --check scripts/city-inventory.mjs
node --check scripts/update-sitemap.mjs
```

Expected: sin salida (sintaxis válida) en los 4 comandos.

- [ ] **Step 6: Commit**

```bash
git add scripts/prerender-meta.mjs scripts/prerender-content.mjs scripts/city-inventory.mjs public/llms.txt public/.well-known/agent-skills/
git commit -m "feat: locales-eventos en scripts de prerender, city-inventory y llms.txt"
```

---

## Task 9: Build completo y verificación end-to-end

**Files:** ninguno nuevo — verificación pura.

**Interfaces:** N/A.

- [ ] **Step 1: Build completo**

```bash
cd /Users/danielacedonunez/pretty-app-roles
npm run build 2>&1 | tail -30
```

Expected: build exitoso, `node scripts/check-bundle-size.mjs` (ejecutado como parte del build) dice "OK".

- [ ] **Step 2: Levantar dev server y verificar el explorador**

```bash
npm run dev
```

Con `chrome-devtools` MCP (skill `verify-flows` si el proyecto la tiene, o navegación manual): entrar al dashboard, ir a "Explorar XPEAK", confirmar que la tarjeta "Locales para eventos" aparece dentro del grupo "Sala, Barra & Catering" con su foto, clicar y confirmar que carga `LocalEventosView` con el directorio (vacío o con el listado de locales sin ficha debajo).

- [ ] **Step 3: Verificar el flujo de alta**

Registrar un usuario de prueba con rol `local_eventos` desde `Auth.tsx`, confirmar que el perfil se crea con `role: 'local_eventos'` (no `'pending'`) y que el formulario de perfil muestra los 5 campos nuevos (Task 5).

- [ ] **Step 4: Verificar las rutas públicas**

Navegar a `/contratar-locales-eventos` y `/directorio/locales-eventos` en local, confirmar que cargan sin error 404 y muestran contenido (no placeholder vacío).

- [ ] **Step 5: Confirmar ausencia de los 5 locales excluidos**

```bash
cd /Users/danielacedonunez/pretty-app-roles
grep -rn "Casa Vieja\|Trastevere\|Terminal 55\|B12 Madrid\|Black Star" src/data/localesEventosMadrid.ts src/pages/BlogLocalesEventosMadrid.tsx
```

Expected: sin coincidencias.

- [ ] **Step 6: Commit final si hubo ajustes durante la verificación**

```bash
git add -A
git commit -m "fix: ajustes tras verificación end-to-end de locales-eventos"
```

(Solo si Steps 2-5 revelaron algo que arreglar; si todo pasó a la primera, no hay nada que commitear aquí.)

---

## Nota sobre Zona Despedidas (descartada)

Este plan sustituye por completo la idea previa de "Zona Despedidas" explorada en brainstorming (roles múltiples: boys/shows, limusinas, barco, disfraces, organizador todo-incluido; banner en landing y dashboard; panel dedicado). Decisión empresarial del usuario (2026-09-22): anular esa idea, lanzar solo este rol único "Locales para eventos" dentro del explorador normal de XPEAK. No crear ninguno de los archivos/rutas mencionados en las fases previas de brainstorming (`/despedidas`, banners degradado vino/dorado, etc.).
