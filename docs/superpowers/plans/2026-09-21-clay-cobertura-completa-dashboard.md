# Claymorphism — cobertura completa del dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar el sistema de tokens claymorphism ya existente (`.clay-card` / `.clay-card-inset` / `.clay-btn-primary`) a los 54 archivos del dashboard identificados en la auditoría, con verificación visual real en simulador iOS tras cada lote — nunca dar un lote por bueno solo con `tsc`/tests en verde.

**Architecture:** Cambios de estilo puro (clases CSS condicionadas a `isNative`), aditivos sobre el JSX existente, sin tocar lógica de negocio, layout, iconos ni comportamiento web. Cada task es un lote de archivos agrupados por prioridad de uso y complejidad; los lotes con estructura especial (imagen de fondo, tablas, tema oscuro fijo) llevan instrucciones propias en vez del patrón genérico.

**Tech Stack:** React 18 + TypeScript + Tailwind CSS + CSS custom properties (mismo stack que Fase 1, sin dependencias nuevas).

**Spec:** `docs/superpowers/specs/2026-09-21-clay-cobertura-completa-dashboard-design.md`

## Global Constraints

- La web (`isNative === false`) debe quedar exactamente igual en cada archivo tocado — el patrón es siempre aditivo, nunca se elimina una clase o estilo existente.
- Patrón estándar para cards/paneles: `className={\`clases-existentes${isNative ? ' clay-card' : ''}\`}`.
- **Modales/Dialog (Radix) quedan fuera de alcance por completo** — no tocar ningún panel de modal en ningún archivo de este plan, aunque el archivo tenga otros contenedores sí candidatos.
- Contenedores exteriores de tabla: clay solo en el wrapper con scroll, nunca en `<tr>`/`<td>`.
- Fondos oscuros fijos intencionales (tooltips, burbujas de chat propio, hero de marca): no tocar, no añadir `.clay-card`.
- Pills/botones `rounded-full` tipo filtro: no tocar.
- Cada task termina con: `npx tsc --noEmit` limpio, `npx vitest run` en verde, `npm run build && npx cap sync ios`, desinstalar+relanzar la app en el simulador (`xcrun simctl uninstall <device> com.xpeak.app` seguido de `xcrun simctl launch <device> com.xpeak.app`), y verificación visual del usuario antes de continuar con la siguiente task.
- Commits atómicos por task, español, sin pie de página de Claude (lo añade el controller).

---

## Task 1: `ExplorarView.tsx` (caso especial — imagen de fondo)

**Files:**
- Modify: `src/components/dashboard/views/ExplorarView.tsx`

**Interfaces:** ninguna — cambio de estilo puro, sin exportar nada nuevo.

- [ ] **Step 1: Leer el archivo completo antes de editar**

Confirmar el estado real del componente `Tarjeta` (líneas ~108-150 según la última lectura) y las constantes `SOMBRA`/`SOMBRA_HOVER` (líneas ~33-44) — el archivo pudo cambiar desde la última vez que se leyó.

- [ ] **Step 2: Importar `isNative`**

```tsx
import { isNative } from '@/lib/capacitor';
```

- [ ] **Step 3: Añadir las constantes de sombra nativa**

Tras las constantes `SOMBRA`/`SOMBRA_HOVER` existentes, añadir:

```tsx
/**
 * Variante nativa (claymorphism): la tarjeta lleva foto de fondo, así que la
 * doble sombra clara/oscura de .clay-card (pensada para superficies planas)
 * no encaja dentro de la imagen — se aplica solo por fuera, como elevación
 * del conjunto, manteniendo el degradado y el filo dorado tal cual.
 */
const SOMBRA_NATIVA = [
  '-6px -6px 14px rgba(255,255,255,0.7)',
  '8px 10px 20px rgba(150,130,90,0.22)',
  '0 4px 24px rgba(212,175,55,0.12)',
].join(', ');

const SOMBRA_NATIVA_HOVER = [
  '-6px -6px 14px rgba(255,255,255,0.75)',
  '10px 14px 28px rgba(150,130,90,0.32)',
  '0 8px 36px rgba(212,175,55,0.42)',
].join(', ');
```

- [ ] **Step 4: Aplicar radio grande y sombra nativa condicional en `Tarjeta`**

En el `<button>` del componente `Tarjeta`, cambiar el `className` y el `style`:

```tsx
className={`group relative w-full overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:scale-[1.015] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 ${isNative ? 'rounded-[28px]' : 'rounded-2xl'}`}
style={{
  aspectRatio: '3 / 2',
  background: '#ffffff',
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: isNative ? SOMBRA_NATIVA : SOMBRA,
}}
onMouseEnter={e => { e.currentTarget.style.boxShadow = isNative ? SOMBRA_NATIVA_HOVER : SOMBRA_HOVER; }}
onMouseLeave={e => { e.currentTarget.style.boxShadow = isNative ? SOMBRA_NATIVA : SOMBRA; }}
```

Y en el `<div>` del filo dorado (el último elemento dentro del botón, con clase `ring-1 ring-inset`), aplicar el mismo radio condicional:

```tsx
<div className={`pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#D4AF37]/25 transition-all duration-300 group-hover:ring-2 group-hover:ring-[#D4AF37] ${isNative ? 'rounded-[28px]' : 'rounded-2xl'}`} />
```

No tocar el resto del componente (imagen, degradado de texto, título, gancho).

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 6: Suite completa**

Run: `npx vitest run`
Expected: todos los tests existentes en verde (este archivo no tiene tests propios, pero la suite no debe romperse).

- [ ] **Step 7: Commit**

```bash
git add src/components/dashboard/views/ExplorarView.tsx
git commit -m "feat: claymorphism en ExplorarView (radio grande + sombra nativa)"
```

- [ ] **Step 8: Build, sync y reinstalación limpia**

```bash
npm run build
npx cap sync ios
xcrun simctl uninstall <device-udid> com.xpeak.app
xcrun simctl launch <device-udid> com.xpeak.app
```

(El UDID del simulador se obtiene con `xcrun simctl list devices | grep -i booted` antes de este paso — puede cambiar entre sesiones.)

- [ ] **Step 9: Verificación visual del usuario**

Detener aquí. El usuario debe abrir la app en el simulador, ir a la pantalla de Inicio/Explorar, y confirmar que las cards tienen el radio grande y la sombra elevada visible, sin que se vea "plano". Solo tras su confirmación explícita se pasa a la Task 2.

---

## Task 2: Directorio + Mensajes

**Files:**
- Modify: `src/components/dashboard/views/DirectoryView.tsx`
- Modify: `src/components/dashboard/views/messages/ConversationList.tsx`
- Modify: `src/components/dashboard/views/messages/ChatWindow.tsx`
- Modify: `src/components/dashboard/views/MessagesView.tsx`

**Interfaces:** ninguna nueva.

- [ ] **Step 1: `DirectoryView.tsx` — completar los 2 contenedores pendientes**

Leer el archivo completo. `isNative` ya está importado (usado en Task 6 de la Fase 1 para pull-to-refresh). Localizar por contenido (no por número de línea, puede haberse desplazado):
- El skeleton de carga: un contenedor `glass-panel p-4 animate-pulse` dentro de un `Array.from({ length: 8 })`.
- El estado vacío: un contenedor `glass-panel p-10` con el mensaje de "no hay profesionales".

En ambos, aplicar el patrón aditivo:
```tsx
className={`glass-panel p-4 animate-pulse${isNative ? ' clay-card' : ''}`}
```
(ajustar el `p-X` exacto al que ya tenga cada uno, sin cambiarlo).

- [ ] **Step 2: `messages/ConversationList.tsx` — no tocar filas individuales**

Leer el archivo completo. Las filas de conversación (el `<div>` con `onClick={() => onSelectConversation(c)}`, borde inferior fino tipo lista) **NO llevan clay** — es un patrón de lista continua, no de cards sueltas; aplicarle sombra doble rompería la continuidad visual. No modificar este archivo salvo que en la lectura aparezca algún contenedor de tipo card real (ej. un empty-state) que sí encaje en el patrón — en ese caso, aplicar el patrón aditivo estándar solo ahí.

- [ ] **Step 3: `messages/ChatWindow.tsx` — panel exterior, no las burbujas**

Leer el archivo completo. Localizar el contenedor exterior del panel de chat (el `<div>` que envuelve toda el área de mensajes, con fondo propio). Aplicar el patrón aditivo estándar solo a ese contenedor exterior. Las burbujas de mensaje individuales (con colores propios de emisor/receptor, normalmente `rounded-xl`/`rounded-2xl` con fondo de color) **no llevan clay** — mantienen su estilo de burbuja de chat tal cual.

- [ ] **Step 4: `MessagesView.tsx` — panel principal**

Leer el archivo completo (ya fue tocado en Task 6 de la Fase 1, `isNative` ya importado). Localizar el contenedor con `rounded-2xl sm:rounded-2xl` + `border: '1px solid rgba(0,0,0,0.08)'` + `background: '#ffffff'` (el panel de 2 columnas lista+chat). Aplicar:

```tsx
className={`flex-1 overflow-hidden relative ${isNative ? 'clay-card' : 'rounded-2xl sm:rounded-2xl'}`}
style={isNative ? undefined : { border: '1px solid rgba(0,0,0,0.08)', background: '#ffffff' }}
```

No modificar el modal de "Nueva conversación" (tema oscuro fijo, fuera de alcance por regla de fondos oscuros intencionales) ni ningún Dialog.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 6: Suite completa**

Run: `npx vitest run`
Expected: en verde (incluye los tests de `MobileBottomNav`/`NativeStackTransition` que dependen indirectamente del dashboard).

- [ ] **Step 7: Commit**

```bash
git add src/components/dashboard/views/DirectoryView.tsx src/components/dashboard/views/messages/ConversationList.tsx src/components/dashboard/views/messages/ChatWindow.tsx src/components/dashboard/views/MessagesView.tsx
git commit -m "feat: claymorphism en Directorio y Mensajes (paneles exteriores)"
```

- [ ] **Step 8: Build, sync, reinstalación limpia** (mismo procedimiento que Task 1, Step 8)

- [ ] **Step 9: Verificación visual del usuario**

Confirmar en simulador: Directorio con skeleton/empty-state elevados si aplica, y el panel de Mensajes con volumen, sin que las burbujas de chat se vean alteradas.

---

## Task 3: Perfil

**Files:**
- Modify: `src/components/dashboard/views/profile/VerificationSection.tsx`
- Modify: `src/components/dashboard/views/profile/MisCondicionesSection.tsx`
- Modify: `src/components/dashboard/views/ProfileView.tsx`

**Interfaces:** ninguna nueva.

- [ ] **Step 1: `profile/VerificationSection.tsx`**

Leer el archivo completo. Importar `isNative` de `@/lib/capacitor` si no está ya. Localizar el contenedor `.glass-panel` (hay 1 según la auditoría) y aplicar el patrón aditivo estándar.

- [ ] **Step 2: `profile/MisCondicionesSection.tsx` — completar migración ya iniciada**

Este archivo YA importa `isNative` y ya tiene `clay-btn-primary` (en un botón) y `clay-card` (en un contenedor) aplicados desde la Fase 1. Leer el archivo completo y buscar el resto de contenedores con `rounded-2xl`/`rounded-xl`/`rounded-lg` que aún no lleven la clase clay condicional — aplicar el patrón aditivo estándar a los que sean cards/paneles reales (no a badges, pills, o botones pequeños tipo toggle).

- [ ] **Step 3: `ProfileView.tsx` — 13 apariciones de `.glass-panel`**

Archivo grande (1266 líneas). Leer completo antes de editar. Localizar cada aparición de `.glass-panel` (la auditoría cuenta 13: completeness, referidos, roles, mis condiciones, verificación, zona de peligro, y otras secciones condicionales por rol) y aplicar el patrón aditivo estándar a cada una:

```tsx
className={`glass-panel p-X${isNative ? ' clay-card' : ''}`}
```

Mantener el `p-X` exacto de cada aparición (varía entre secciones). No tocar la "zona de peligro" (borrar cuenta) de forma distinta al resto — misma regla aditiva, no requiere tratamiento especial pese a ser una acción destructiva, ya que es solo estilo visual.

Importar `isNative` de `@/lib/capacitor` si no está ya (la auditoría indica que no lo tenía).

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 5: Suite completa**

Run: `npx vitest run`
Expected: en verde.

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/views/profile/VerificationSection.tsx src/components/dashboard/views/profile/MisCondicionesSection.tsx src/components/dashboard/views/ProfileView.tsx
git commit -m "feat: claymorphism en Perfil (verificación, condiciones, vista completa)"
```

- [ ] **Step 7: Build, sync, reinstalación limpia**

- [ ] **Step 8: Verificación visual del usuario**

Confirmar en simulador: entrar a Perfil, revisar varias secciones (completeness, roles, mis condiciones, verificación) con volumen visible.

---

## Task 4: Flash Booking — tabs principales

**Files:**
- Modify: `src/components/dashboard/views/flashbooking/DemandaTab.tsx`
- Modify: `src/components/dashboard/views/flashbooking/OfertaTab.tsx`
- Modify: `src/components/dashboard/views/flashbooking/SolicitudesTab.tsx`

**Interfaces:** ninguna nueva.

- [ ] **Step 1: `flashbooking/DemandaTab.tsx`**

Leer el archivo completo. Importar `isNative`. Localizar el contenedor `.glass-panel` (1 según auditoría) y las cards con `rounded-full/lg/xl` que sean paneles de contenido real (no pills de filtro ni badges). Aplicar el patrón aditivo estándar a cada card real identificada.

- [ ] **Step 2: `flashbooking/OfertaTab.tsx`**

Leer el archivo completo. Importar `isNative`. Localizar los 3 `.glass-panel` de la auditoría y aplicar el patrón aditivo estándar. El Dialog/Modal de este archivo queda fuera de alcance (regla global).

- [ ] **Step 3: `flashbooking/SolicitudesTab.tsx`**

Leer el archivo completo. Importar `isNative`. No tiene `.glass-panel` según la auditoría — localizar los contenedores `rounded-lg/2xl` que actúen como card de contenido (cada solicitud listada, probablemente) y aplicar el patrón aditivo estándar. El Dialog/Modal queda fuera de alcance.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 5: Suite completa**

Run: `npx vitest run`
Expected: en verde.

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/views/flashbooking/DemandaTab.tsx src/components/dashboard/views/flashbooking/OfertaTab.tsx src/components/dashboard/views/flashbooking/SolicitudesTab.tsx
git commit -m "feat: claymorphism en Flash Booking (Demanda, Oferta, Solicitudes)"
```

- [ ] **Step 7: Build, sync, reinstalación limpia**

- [ ] **Step 8: Verificación visual del usuario**

Confirmar en simulador: pestañas de Flash Booking con cards elevadas, sin que los Dialog de crear oferta/demanda se vean alterados (deben seguir con su estilo actual).

---

## Task 5: Flash Booking — EventRequestsSection (archivo grande, lote propio)

**Files:**
- Modify: `src/components/dashboard/views/flashbooking/EventRequestsSection.tsx`

**Interfaces:** ninguna nueva.

- [ ] **Step 1: Leer el archivo completo antes de editar**

1086 líneas — el archivo .tsx más grande del alcance de este plan. Leerlo íntegro (puede requerir varias lecturas con `offset`/`limit`) antes de tocar nada, para identificar con precisión: los contenedores de card reales, el Dialog/Modal (fuera de alcance), y cualquier sección con tema oscuro fijo.

- [ ] **Step 2: Importar `isNative`**

```tsx
import { isNative } from '@/lib/capacitor';
```

- [ ] **Step 3: Aplicar el patrón aditivo a los contenedores de card identificados**

Para cada contenedor `rounded-lg`/`rounded-xl` que sea una card de contenido real (una solicitud de evento listada, un resumen, un panel de detalle) — no filas de tabla, no el Dialog, no la sección de tema oscuro fijo si existe — aplicar:

```tsx
className={`clases-existentes${isNative ? ' clay-card' : ''}`}
```

Dado el tamaño del archivo, hacerlo en 2-3 pasadas de lectura+edición en vez de intentar cubrirlo todo de una vez, para reducir el riesgo de perder alguna aparición o editar mal por trabajar de memoria.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 5: Suite completa**

Run: `npx vitest run`
Expected: en verde.

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/views/flashbooking/EventRequestsSection.tsx
git commit -m "feat: claymorphism en EventRequestsSection"
```

- [ ] **Step 7: Build, sync, reinstalación limpia**

- [ ] **Step 8: Verificación visual del usuario**

---

## Task 6: Empresario — tabs pequeños/medios

**Files:**
- Modify: `src/components/dashboard/views/empresario/BenchmarkTab.tsx`
- Modify: `src/components/dashboard/views/empresario/MediaTab.tsx`
- Modify: `src/components/dashboard/views/empresario/StatsTab.tsx`
- Modify: `src/components/dashboard/views/empresario/FlashTab.tsx`
- Modify: `src/components/dashboard/views/empresario/DiscoverTab.tsx`

**Interfaces:** ninguna nueva.

- [ ] **Step 1: `empresario/BenchmarkTab.tsx`**

Leer completo. Importar `isNative`. 2 `.glass-panel` según auditoría — aplicar patrón aditivo estándar a ambos.

- [ ] **Step 2: `empresario/MediaTab.tsx`**

Leer completo. Importar `isNative`. 3 `.glass-panel` según auditoría — aplicar patrón aditivo estándar.

- [ ] **Step 3: `empresario/StatsTab.tsx`**

Leer completo. Importar `isNative`. 3 `.glass-panel` según auditoría — aplicar patrón aditivo estándar. Contiene gráficos `recharts`: el propio gráfico SVG no lleva clay, solo su contenedor `.glass-panel`.

- [ ] **Step 4: `empresario/FlashTab.tsx`**

Leer completo. Importar `isNative`. 3 `.glass-panel` según auditoría — aplicar patrón aditivo estándar.

- [ ] **Step 5: `empresario/DiscoverTab.tsx`**

Leer completo. Importar `isNative`. 1 `.glass-panel` según auditoría, más otros contenedores `rounded-xl/2xl/md` que sean cards reales — aplicar patrón aditivo estándar a los que correspondan.

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 7: Suite completa**

Run: `npx vitest run`
Expected: en verde (incluye `empresario/incompleteReviews.test.ts` y `reviewQuestions.test.ts`, que no deben verse afectados por ser cambios de estilo puro).

- [ ] **Step 8: Commit**

```bash
git add src/components/dashboard/views/empresario/BenchmarkTab.tsx src/components/dashboard/views/empresario/MediaTab.tsx src/components/dashboard/views/empresario/StatsTab.tsx src/components/dashboard/views/empresario/FlashTab.tsx src/components/dashboard/views/empresario/DiscoverTab.tsx
git commit -m "feat: claymorphism en tabs de Empresario (Benchmark, Media, Stats, Flash, Discover)"
```

- [ ] **Step 9: Build, sync, reinstalación limpia**

- [ ] **Step 10: Verificación visual del usuario**

---

## Task 7: Empresario — Gastos e Historial (archivos grandes, lote propio)

**Files:**
- Modify: `src/components/dashboard/views/empresario/GastosTab.tsx`
- Modify: `src/components/dashboard/views/empresario/HistorialTab.tsx`

**Interfaces:** ninguna nueva.

- [ ] **Step 1: `empresario/GastosTab.tsx` — tiene tabla**

Leer completo. Importar `isNative`. Aplicar patrón aditivo estándar a los 3 `.glass-panel` de la auditoría (resúmenes/KPIs). Para la tabla de gastos: aplicar clay solo al contenedor exterior con scroll, nunca a `<tr>`/`<td>`.

- [ ] **Step 2: `empresario/HistorialTab.tsx` — 959 líneas, tabla + Dialog**

Leer el archivo completo (varias pasadas si hace falta por el tamaño). Importar `isNative`. Aplicar patrón aditivo estándar a los contenedores de card real identificados. Para la tabla: clay solo en el wrapper exterior. El Dialog/Modal queda fuera de alcance (regla global) — no tocarlo aunque esté en este mismo archivo.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 4: Suite completa**

Run: `npx vitest run`
Expected: en verde.

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/views/empresario/GastosTab.tsx src/components/dashboard/views/empresario/HistorialTab.tsx
git commit -m "feat: claymorphism en Gastos e Historial de Empresario"
```

- [ ] **Step 6: Build, sync, reinstalación limpia**

- [ ] **Step 7: Verificación visual del usuario**

---

## Task 8: Vistas de gestión — Empresario, Agencia, Calendario, Estadísticas, Mapa

**Files:**
- Modify: `src/components/dashboard/views/EmpresarioView.tsx`
- Modify: `src/components/dashboard/views/AgencyView.tsx`
- Modify: `src/components/dashboard/views/CalendarView.tsx`
- Modify: `src/components/dashboard/views/StatsView.tsx`
- Modify: `src/components/dashboard/views/MapaView.tsx`

**Interfaces:** ninguna nueva.

- [ ] **Step 1: `EmpresarioView.tsx`**

Leer completo. Importar `isNative` si no está. Localizar el panel "Contrataciones Privadas" (`.glass-panel`) y las cards de `WhoIsHiringFeed` (patrón `rounded-xl` + `background:'#fff'` + `border`, igual que `ProfileCard`). Aplicar patrón aditivo estándar a ambos. El grueso de la vista vive en subcarpeta `empresario/` (ya tratada en Tasks 6-7), este archivo top-level solo tiene 2-3 contenedores propios.

- [ ] **Step 2: `AgencyView.tsx`**

Leer completo. Importar `isNative`. Aplicar patrón aditivo estándar a los ~8 `.glass-panel` (KPI grid, top performer, profile cards, revenue breakdown). El grid de "empty slot cards" con borde dashed (`border: 1px dashed`) también lleva clay — es un estado vacío legítimo, no una tabla ni un modal.

- [ ] **Step 3: `CalendarView.tsx`**

Leer completo. Importar `isNative`. Aplicar patrón aditivo estándar a los `.glass-panel` (grid calendario contenedor, sidebar próximos eventos, alert prefs). El grid de días del mes en sí (celdas individuales con estados bloqueado/hoy/con-evento) **no lleva clay** — son celdas de grid, no cards. El modal "Añadir evento" queda fuera de alcance (regla global de modales).

- [ ] **Step 4: `StatsView.tsx`**

Leer completo. Importar `isNative` si no está. Aplicar patrón aditivo estándar a los contenedores `.glass-panel` de cards de KPI. El `DonutChart` (SVG custom) no lleva clay en sí mismo, solo su contenedor si lo tiene.

- [ ] **Step 5: `MapaView.tsx`**

Leer completo. Importar `isNative`. Aplicar patrón aditivo estándar al buscador (`.glass-panel p-3`) y a las cards de profesional en grid (`.glass-panel p-4` dentro de cada `<a>`) y al empty state (`.glass-panel p-8`). La lista de ciudades (selector tipo sidebar, `rounded-lg` + pills) **no lleva clay** — es un selector de lista, no cards.

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 7: Suite completa**

Run: `npx vitest run`
Expected: en verde.

- [ ] **Step 8: Commit**

```bash
git add src/components/dashboard/views/EmpresarioView.tsx src/components/dashboard/views/AgencyView.tsx src/components/dashboard/views/CalendarView.tsx src/components/dashboard/views/StatsView.tsx src/components/dashboard/views/MapaView.tsx
git commit -m "feat: claymorphism en EmpresarioView, Agencia, Calendario, Estadísticas, Mapa"
```

- [ ] **Step 9: Build, sync, reinstalación limpia**

- [ ] **Step 10: Verificación visual del usuario**

---

## Task 9: Contratos, Ficha, Escenario Virtual

**Files:**
- Modify: `src/components/dashboard/views/ContractView.tsx`
- Modify: `src/components/dashboard/views/FichaView.tsx`
- Modify: `src/components/dashboard/views/EscenarioVirtualView.tsx`

**Interfaces:** ninguna nueva.

- [ ] **Step 1: `ContractView.tsx` — tabla + cards móvil**

Leer completo (738 líneas). Importar `isNative`. Aplicar patrón aditivo estándar a: quick-start (`.glass-panel p-6`), aviso legal (`.glass-panel p-5`), las 4 legal cards (`.glass-panel p-5`). Para el historial con tabla (desktop) y sus tarjetas de fila equivalentes en móvil: clay solo en el contenedor exterior de la tabla en desktop; las tarjetas de fila en móvil (si son cards reales, no filas de lista continua) sí llevan el patrón aditivo estándar cada una.

- [ ] **Step 2: `FichaView.tsx`**

Leer completo (742 líneas). Importar `isNative`. Aplicar patrón aditivo estándar a los `.glass-panel` (composer de posts, cada post individual, panels de vídeo/música/audio, empty states). Los iframes embebidos (YouTube/Vimeo/SoundCloud) no llevan clay en sí mismos — solo su contenedor `.glass-panel`.

- [ ] **Step 3: `EscenarioVirtualView.tsx` — caso especial, vídeo ambient**

Leer completo (580 líneas). Importar `isNative`. El vídeo de fondo ambiental (`<video autoPlay muted loop>` con opacity baja, absolute) **no lleva clay** — es fondo de toda la vista, no un contenedor de contenido. Aplicar patrón aditivo estándar a los `.glass-panel` que flotan sobre él: reproductor de stream, chat, cards de "en directo" (cuando el rol es empresario), empty state.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 5: Suite completa**

Run: `npx vitest run`
Expected: en verde.

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/views/ContractView.tsx src/components/dashboard/views/FichaView.tsx src/components/dashboard/views/EscenarioVirtualView.tsx
git commit -m "feat: claymorphism en Contratos, Ficha y Escenario Virtual"
```

- [ ] **Step 7: Build, sync, reinstalación limpia**

- [ ] **Step 8: Verificación visual del usuario**

---

## Task 10: Ajustes, Recursos, Suscripción, Top Weekend

**Files:**
- Modify: `src/components/dashboard/views/SettingsView.tsx`
- Modify: `src/components/dashboard/views/ResourcesView.tsx`
- Modify: `src/components/dashboard/views/SubscriptionView.tsx`
- Modify: `src/components/dashboard/views/TopWeekendView.tsx`

**Interfaces:** ninguna nueva.

- [ ] **Step 1: `SettingsView.tsx` — vía wrapper `Section`**

Leer completo (1352 líneas, pero el volumen real de cambio es mucho menor). Localizar el componente interno `Section` (función definida dentro del mismo archivo, ~línea 46 según la auditoría) que ya envuelve `glass-panel p-5 mb-4` — es el único punto de cambio necesario para propagar el patrón a casi todas las secciones (multi-perfil, notificaciones, idioma, privacidad, etc.). Importar `isNative` y aplicar el patrón aditivo estándar dentro de esa función:

```tsx
className={`glass-panel p-5 mb-4${isNative ? ' clay-card' : ''}`}
```

Después de aplicar el cambio en `Section`, leer el resto del archivo para localizar contenedores FUERA de `Section` que también sean cards reales (ej. `ToggleRow` si tiene su propio fondo de card, el bloque de código QR) y aplicarles el mismo patrón si corresponde. No tocar el modal de exit-survey (regla global de modales).

- [ ] **Step 2: `ResourcesView.tsx` — excluye el hero**

Leer completo (395 líneas). Importar `isNative` si no está. El hero con gradiente oscuro fijo (`#1a1208`→`#3d2d15`) **no lleva clay** — es lenguaje visual de marca intencional, fuera de alcance según el spec. Aplicar patrón aditivo estándar a las tarjetas de catálogo de afiliados/guías que aparezcan más abajo en el archivo.

- [ ] **Step 3: `SubscriptionView.tsx`**

Leer completo (40 líneas, archivo simple). Importar `isNative`. Aplicar patrón aditivo estándar al único contenedor `rounded-2xl` con `background: rgba(212,175,55,0.05)`.

- [ ] **Step 4: `TopWeekendView.tsx`**

Leer completo (136 líneas). Importar `isNative` si no está. Aplicar patrón aditivo estándar al único `.glass-panel p-10` (empty state). El resto de la vista delega a `ProfileCard`, ya tratado en Fase 1.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 6: Suite completa**

Run: `npx vitest run`
Expected: en verde.

- [ ] **Step 7: Commit**

```bash
git add src/components/dashboard/views/SettingsView.tsx src/components/dashboard/views/ResourcesView.tsx src/components/dashboard/views/SubscriptionView.tsx src/components/dashboard/views/TopWeekendView.tsx
git commit -m "feat: claymorphism en Ajustes, Recursos, Suscripción, Top Weekend"
```

- [ ] **Step 8: Build, sync, reinstalación limpia**

- [ ] **Step 9: Verificación visual del usuario**

---

## Task 11: Admin — lote 1 (alertas simples)

**Files:**
- Modify: `src/components/dashboard/views/admin/AdminDeletionAlert.tsx`
- Modify: `src/components/dashboard/views/admin/AdminInvisibleProfilesAlert.tsx`
- Modify: `src/components/dashboard/views/admin/AdminNewProfileAlert.tsx`
- Modify: `src/components/dashboard/views/admin/AdminPendingBookingsAlert.tsx`
- Modify: `src/components/dashboard/views/admin/AdminConversations.tsx`
- Modify: `src/components/dashboard/views/admin/AdminFeatureRequests.tsx`
- Modify: `src/components/dashboard/views/admin/AdminCancellations.tsx`

**Interfaces:** ninguna nueva.

- [ ] **Step 1: Los 4 archivos de alerta (`AdminDeletionAlert`, `AdminInvisibleProfilesAlert`, `AdminNewProfileAlert`, `AdminPendingBookingsAlert`)**

Cada uno es una alert card simple (`rounded-2xl/lg`, sin `.glass-panel`, sin `isNative` importado). Para cada archivo: leer completo, importar `isNative`, aplicar el patrón aditivo estándar al contenedor principal de la alerta.

- [ ] **Step 2: `AdminConversations.tsx`**

Leer completo (85 líneas). Importar `isNative`. Aplicar patrón aditivo estándar al contenedor principal (`rounded-xl`, sin `.glass-panel`).

- [ ] **Step 3: `AdminFeatureRequests.tsx`**

Leer completo (122 líneas). Importar `isNative`. Aplicar patrón aditivo estándar a los contenedores `rounded-xl/2xl` que sean cards de feature request individuales.

- [ ] **Step 4: `AdminCancellations.tsx`**

Leer completo (146 líneas). Importar `isNative` si no está. Ya usa `.glass-panel` en 2 sitios — aplicar patrón aditivo estándar a ambos.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 6: Suite completa**

Run: `npx vitest run`
Expected: en verde.

- [ ] **Step 7: Commit**

```bash
git add src/components/dashboard/views/admin/AdminDeletionAlert.tsx src/components/dashboard/views/admin/AdminInvisibleProfilesAlert.tsx src/components/dashboard/views/admin/AdminNewProfileAlert.tsx src/components/dashboard/views/admin/AdminPendingBookingsAlert.tsx src/components/dashboard/views/admin/AdminConversations.tsx src/components/dashboard/views/admin/AdminFeatureRequests.tsx src/components/dashboard/views/admin/AdminCancellations.tsx
git commit -m "feat: claymorphism en Admin — alertas simples"
```

- [ ] **Step 8: Build, sync, reinstalación limpia**

- [ ] **Step 9: Verificación visual del usuario**

---

## Task 12: Admin — lote 2 (medios)

**Files:**
- Modify: `src/components/dashboard/views/admin/AdminMetrics.tsx`
- Modify: `src/components/dashboard/views/admin/AdminCharts.tsx`
- Modify: `src/components/dashboard/views/admin/AdminBusinesses.tsx`
- Modify: `src/components/dashboard/views/admin/AdminReviews.tsx`
- Modify: `src/components/dashboard/views/admin/AdminSaludSistema.tsx`
- Modify: `src/components/dashboard/views/admin/AdminActivity.tsx`
- Modify: `src/components/dashboard/views/admin/AdminAnalytics.tsx`

**Interfaces:** ninguna nueva.

- [ ] **Step 1: `AdminMetrics.tsx`**

Leer completo (167 líneas). Importar `isNative`. Uso consistente de `.glass-panel` (5 veces, grid de métricas) — aplicar patrón aditivo estándar a las 5.

- [ ] **Step 2: `AdminCharts.tsx`**

Leer completo (137 líneas). Importar `isNative`. Aplicar patrón aditivo estándar a los 3 `.glass-panel`. Los gráficos SVG/recharts en sí no llevan clay, solo su contenedor.

- [ ] **Step 3: `AdminBusinesses.tsx`**

Leer completo (248 líneas). Importar `isNative`. Aplicar patrón aditivo estándar a las cards `rounded-2xl` (no a los `rounded-md` que sean botones/badges pequeños).

- [ ] **Step 4: `AdminReviews.tsx`**

Leer completo (264 líneas). Importar `isNative`. Aplicar patrón aditivo estándar al `.glass-panel` existente y a otras cards `rounded-xl` de reseñas individuales que actúen como card real.

- [ ] **Step 5: `AdminSaludSistema.tsx`**

Leer completo (191 líneas). Importar `isNative`. Aplicar patrón aditivo estándar a los contenedores `rounded-lg/xl` que sean paneles de estado del sistema.

- [ ] **Step 6: `AdminActivity.tsx`**

Leer completo (399 líneas). Importar `isNative`. Aplicar patrón aditivo estándar a las cards `rounded-xl` (no a los `rounded-full` que sean badges/avatares). Si hay alguna sección con fondo oscuro fijo detectado en la auditoría, dejarla sin tocar (regla de fondos oscuros intencionales) — confirmar visualmente cuál es antes de decidir.

- [ ] **Step 7: `AdminAnalytics.tsx` — el más grande de este lote**

Leer completo (639 líneas). Importar `isNative`. Usa `recharts`/`ResponsiveContainer` — los gráficos en sí no llevan clay. Aplicar patrón aditivo estándar a los contenedores `rounded-2xl/xl/full` que sean paneles de contenido reales (no a los que envuelvan directamente un gráfico sin padding/fondo propio).

- [ ] **Step 8: Typecheck**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 9: Suite completa**

Run: `npx vitest run`
Expected: en verde.

- [ ] **Step 10: Commit**

```bash
git add src/components/dashboard/views/admin/AdminMetrics.tsx src/components/dashboard/views/admin/AdminCharts.tsx src/components/dashboard/views/admin/AdminBusinesses.tsx src/components/dashboard/views/admin/AdminReviews.tsx src/components/dashboard/views/admin/AdminSaludSistema.tsx src/components/dashboard/views/admin/AdminActivity.tsx src/components/dashboard/views/admin/AdminAnalytics.tsx
git commit -m "feat: claymorphism en Admin — lote medio (métricas, gráficos, negocios, reseñas, salud, actividad, analytics)"
```

- [ ] **Step 11: Build, sync, reinstalación limpia**

- [ ] **Step 12: Verificación visual del usuario**

---

## Task 13: Admin — lote 3 (complejos: tabla + tema oscuro fijo)

**Files:**
- Modify: `src/components/dashboard/views/admin/AdminUserManagement.tsx`
- Modify: `src/components/dashboard/views/admin/AdminPromoCodes.tsx`
- Modify: `src/components/dashboard/views/admin/AdminEmergentes.tsx`
- Modify: `src/components/dashboard/views/admin/AdminHiredContracts.tsx`
- Modify: `src/components/dashboard/views/admin/AdminDeletions.tsx`

**Interfaces:** ninguna nueva.

- [ ] **Step 1: `AdminUserManagement.tsx` — tabla + formulario largo + tema oscuro fijo**

Leer completo (252 líneas). Importar `isNative`. La auditoría detectó tabla + tema oscuro fijo. Antes de tocar nada: identificar visualmente (leyendo el JSX) qué parte es la tabla (clay solo en el contenedor exterior con scroll) y qué parte tiene fondo oscuro fijo intencional (no tocar esa). Aplicar patrón aditivo estándar solo a los contenedores de card reales que queden fuera de esas dos categorías.

- [ ] **Step 2: `AdminPromoCodes.tsx` — tabla + tema oscuro fijo**

Leer completo (237 líneas). Importar `isNative`. Mismo criterio que Step 1: tabla (solo wrapper exterior), tema oscuro fijo sin tocar, resto con patrón aditivo estándar (incluye 1 `.glass-panel` de la auditoría).

- [ ] **Step 3: `AdminEmergentes.tsx` — tabla + tema oscuro fijo**

Leer completo (158 líneas). Importar `isNative`. Mismo criterio.

- [ ] **Step 4: `AdminHiredContracts.tsx` — tema oscuro fijo**

Leer completo (325 líneas). Importar `isNative` si no está. Usa `.glass-panel` (1 vez) — aplicar patrón aditivo estándar ahí. El resto con tema oscuro fijo, sin tocar.

- [ ] **Step 5: `AdminDeletions.tsx` — modal/Dialog anidado**

Leer completo (275 líneas). Importar `isNative`. El Dialog queda completamente fuera de alcance (regla global de modales) — no tocarlo aunque esté en este archivo. Aplicar patrón aditivo estándar al resto de contenedores `rounded-lg/2xl` que sean cards reales fuera del modal.

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 7: Suite completa**

Run: `npx vitest run`
Expected: en verde.

- [ ] **Step 8: Commit**

```bash
git add src/components/dashboard/views/admin/AdminUserManagement.tsx src/components/dashboard/views/admin/AdminPromoCodes.tsx src/components/dashboard/views/admin/AdminEmergentes.tsx src/components/dashboard/views/admin/AdminHiredContracts.tsx src/components/dashboard/views/admin/AdminDeletions.tsx
git commit -m "feat: claymorphism en Admin — lote complejo (tablas y contenido fuera de modal/dark-fijo)"
```

- [ ] **Step 9: Build, sync, reinstalación limpia**

- [ ] **Step 10: Verificación visual del usuario**

Esta es la última task del plan. Tras su confirmación, el plan queda completo.

---

## Self-Review

**Cobertura del spec:**
1. `ExplorarView.tsx` caso especial → Task 1. ✓
2. Directorio + Mensajes → Task 2. ✓
3. Perfil → Task 3. ✓
4. Flash Booking tabs → Tasks 4-5. ✓
5. Empresario → Tasks 6-8 (parte del Step 1 de Task 8). ✓
6. Vistas de gestión (Agencia, Calendario, Stats, Mapa) → Task 8. ✓
7. Contratos, Ficha, Escenario Virtual → Task 9. ✓
8. Ajustes, Recursos, Suscripción, Top Weekend → Task 10. ✓
9. Admin (19 archivos en 3 lotes) → Tasks 11-13. ✓
10. `AdminView.tsx` y `FlashBookingWallView.tsx` (shells sin candidatos propios) → correctamente omitidos, no llevan task propia según el spec.
11. 22 wrappers puros de `DirectoryView` → correctamente omitidos, heredan de `DirectoryView.tsx` (Task 2).
12. Exclusiones (modales, `DarkTooltip`, burbujas de chat, `roleFeatures.tsx`, tests, pills, hero de marca) → repetidas explícitamente en cada task relevante, no solo en Global Constraints.
13. Verificación obligatoria por lote (tsc + tests + build + sync + reinstalación limpia + confirmación visual) → presente como los últimos 3-4 steps de cada una de las 13 tasks, sin excepción.

**Placeholder scan:** sin "TBD"/"TODO". Los pasos que dicen "aplicar patrón aditivo estándar a los contenedores X" en vez de dar el snippet completo lo hacen porque el número exacto y el `className` base de cada contenedor varía por archivo y no se puede fijar sin leer el archivo real primero (algo que cada step ya instruye hacer) — el propio patrón (`className={\`clases-existentes${isNative ? ' clay-card' : ''}\`}`) está dado explícitamente en las Global Constraints y repetido en la Task 1 completa como ejemplo ejecutable. Es la misma naturaleza de instrucción que ya se usó y aprobó en la Task 8 original de la Fase 1.

**Consistencia de tipos:** no aplica — no hay funciones/interfaces nuevas en todo el plan, es cambio de estilo puro. El único identificador reutilizado entre tasks es `isNative` (importado igual en todas: `import { isNative } from '@/lib/capacitor';`) y las clases `clay-card`/`clay-card-inset`/`clay-btn-primary` (ya definidas en Fase 1, sin cambios de nombre en ningún punto de este plan).
