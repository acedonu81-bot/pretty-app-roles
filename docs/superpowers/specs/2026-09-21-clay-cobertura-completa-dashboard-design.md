# Claymorphism — cobertura completa del dashboard nativo

## Contexto

La Fase 1 de "app nativa en condiciones" construyó el sistema de tokens claymorphism (`body.is-native-app .clay-card` / `.clay-card-inset` / `.clay-btn-primary` en `src/index.css`, espejo en `src/design/clayTokens.ts`) y lo aplicó a solo 5 componentes elegidos por criterio de un revisor durante la Task 8, dejando el resto del dashboard (~54 archivos con superficies propias) sin tocar. Al verificar en el simulador iOS real, esto se notó de inmediato: la pantalla de inicio (Explorar) y la mayoría de vistas se ven planas, "como en escritorio", mientras que solo el tab bar y 5 componentes puntuales tienen volumen.

Esta fase completa esa cobertura: aplicar el sistema clay ya existente a las superficies restantes del dashboard, con verificación visual real en simulador tras cada lote — no dar ningún lote por cerrado solo con `tsc`/tests en verde, como ya se advirtió que no es suficiente para juzgar resultado visual.

## Objetivo

Que cualquier pantalla del dashboard nativo, no solo el tab bar y las 5 ya tratadas, tenga el volumen/sombras dobles/radios grandes del sistema clay, sin romper el layout, sin mover iconos, sin tocar el comportamiento web (`isNative === false` intacto en todo momento).

## Alcance

**54 archivos**, agrupados en las siguientes categorías (mapa completo obtenido por auditoría de código, no estimado):

### Vistas top-level de `src/components/dashboard/views/` (19 archivos con JSX propio)
`DirectoryView.tsx` (ya parcialmente tratado en Task 6, completar 2 contenedores), `ExplorarView.tsx` (caso especial, ver más abajo), `AgencyView.tsx`, `CalendarView.tsx`, `ContractView.tsx`, `EmpresarioView.tsx`, `EscenarioVirtualView.tsx` (caso especial), `FichaView.tsx`, `MessagesView.tsx` (panel principal, el modal queda fuera por regla de modales), `ProfileView.tsx`, `ResourcesView.tsx`, `SettingsView.tsx` (vía su wrapper interno `Section`), `StatsView.tsx`, `MapaView.tsx`, `TopWeekendView.tsx`, `AdminView.tsx` (shell de tabs, sin candidatos propios), `EmpresarioView.tsx`, `FlashBookingWallView.tsx` (shell, sin candidatos propios), `SubscriptionView.tsx`.

Los 22 archivos wrapper puros de `DirectoryView` (`DJView.tsx`, `StaffView.tsx`, etc.) no requieren cambio propio — heredan automáticamente de `DirectoryView.tsx`.

### Subcarpetas con UI propia (35 archivos)
- `messages/`: `ChatWindow.tsx` (burbujas propias quedan fuera, panel exterior sí), `ConversationList.tsx`.
- `profile/`: `MisCondicionesSection.tsx` (completar migración ya iniciada), `VerificationSection.tsx`.
- `flashbooking/`: `DemandaTab.tsx`, `OfertaTab.tsx`, `SolicitudesTab.tsx`, `EventRequestsSection.tsx` (1086 líneas, lote propio por tamaño/riesgo).
- `empresario/`: `BenchmarkTab.tsx`, `MediaTab.tsx`, `StatsTab.tsx`, `FlashTab.tsx`, `DiscoverTab.tsx`, `GastosTab.tsx` (tabla), `HistorialTab.tsx` (959 líneas, tabla + modal, lote propio).
- `admin/`: 19 archivos, agrupados en 3 lotes por complejidad (alertas simples, medios, complejos con tabla/dark-fijo/modal).

### Excluidos explícitamente
- `empresario/DarkTooltip.tsx` — tema oscuro intencional.
- Burbujas de chat propio dentro de `ChatWindow.tsx` — solo el panel contenedor exterior lleva clay, no cada burbuja.
- `subscription/roleFeatures.tsx` — archivo de datos, sin JSX de contenedores.
- Todos los `.test.ts`/`.test.tsx`.
- **Todos los Dialog/Modal (Radix)** — fuera de alcance de esta fase por decisión del usuario; ya tienen su propio panel de shadcn/Radix, se revisan en una fase posterior si se decide.
- Pills/botones tipo filtro (`rounded-full`) — el radio grande rompería la forma de pill.
- Hero de `ResourcesView.tsx` (fondo oscuro con glow intencional, lenguaje visual propio de marca) — se deja fuera salvo que se pida explícitamente.

## Reglas de aplicación por tipo de superficie

1. **Cards/paneles de contenido normales** (`.glass-panel`, o contenedores con `rounded-* + border + fondo sólido`): patrón aditivo estándar, exactamente como en los 5 componentes de referencia ya aprobados —
   ```tsx
   className={`clases-tailwind-existentes${isNative ? ' clay-card' : ''}`}
   ```
   Sin eliminar ninguna clase existente, sin tocar layout/iconos/posiciones — solo se añade la clase clay al final.

2. **Contenedores exteriores de tablas** (`AdminEmergentes.tsx`, `AdminPromoCodes.tsx`, `AdminUserManagement.tsx`, `HistorialTab.tsx`, `GastosTab.tsx`, `ContractView.tsx`): clay solo en el wrapper exterior con scroll de la tabla, nunca en `<tr>`/`<td>` individuales.

3. **Modales/Dialog**: excluidos de esta fase por completo, sin excepción.

4. **Fondos oscuros fijos intencionales**: excluidos — no se toca ese color, no se le añade `.clay-card` (el token asume fondo claro vía `var(--background)` y rompería el contraste).

5. **Casos especiales con estructura propia** (requieren pensar una variante, no aplicar el patrón simple):
   - `ExplorarView.tsx`: cards con imagen de fondo full-bleed + hover controlado por JS inline (`onMouseEnter`/`onMouseLeave` reescribiendo `boxShadow`). La variante correcta: radio de esquina grande (`rounded-[28px]` en nativo) + sombra doble suave aplicada como elevación exterior de la card (no dentro de la imagen), sustituyendo `SOMBRA`/`SOMBRA_HOVER` por una variante nativa cuando `isNative` es true, y dejando `onMouseEnter`/`onMouseLeave` sin efecto real en touch (no se elimina el código, simplemente no se dispara en un dispositivo táctil).
   - `EscenarioVirtualView.tsx`: vídeo ambient de fondo detrás del contenido — el propio vídeo no lleva clay; solo los cards de contenido (reproductor, chat, listado "en directo") que flotan sobre él.
   - `MessagesView.tsx`: panel de 2 columnas (lista + chat) — clay en el panel contenedor exterior; NO en las burbujas de mensaje individuales (colores propios de emisor/receptor).

## Verificación (obligatoria, no negociable tras lo ocurrido hoy)

Cada lote sigue este ciclo, sin excepción:
1. Implementar cambios del lote.
2. `npx tsc --noEmit` + `npx vitest run` en verde.
3. `npm run build && npx cap sync ios`.
4. Desinstalar la app del simulador (`xcrun simctl uninstall <device> com.xpeak.app`) y relanzarla limpia — nunca confiar en que Xcode reinstale sin residuos.
5. El usuario revisa visualmente en el simulador antes de aprobar el siguiente lote. Un `tsc`/test en verde NO es suficiente para dar un lote por bueno — regla ya establecida en `CLAUDE.md` del proyecto y confirmada por el incidente de hoy.

## Lotes de trabajo (orden de prioridad, uso más frecuente primero)

1. `ExplorarView.tsx` (caso especial, ya iniciado hoy — se retoma con este spec como referencia)
2. `DirectoryView.tsx` (completar 2 contenedores pendientes) + `messages/ConversationList.tsx` + `messages/ChatWindow.tsx` (panel exterior) + `MessagesView.tsx` (panel principal)
3. `profile/VerificationSection.tsx` + `profile/MisCondicionesSection.tsx` (completar) + `ProfileView.tsx` (13 apariciones de `.glass-panel`)
4. `flashbooking/DemandaTab.tsx` + `OfertaTab.tsx` + `SolicitudesTab.tsx`
5. `flashbooking/EventRequestsSection.tsx` (lote propio, 1086 líneas)
6. `empresario/BenchmarkTab.tsx` + `MediaTab.tsx` + `StatsTab.tsx` + `FlashTab.tsx` + `DiscoverTab.tsx`
7. `empresario/GastosTab.tsx` + `HistorialTab.tsx` (lote propio, 959 líneas)
8. `EmpresarioView.tsx` + `AgencyView.tsx` + `CalendarView.tsx` + `StatsView.tsx` + `MapaView.tsx`
9. `ContractView.tsx` + `FichaView.tsx` + `EscenarioVirtualView.tsx` (caso especial)
10. `SettingsView.tsx` (vía wrapper `Section`) + `ResourcesView.tsx` (excluye el hero) + `SubscriptionView.tsx` + `TopWeekendView.tsx`
11. `admin/` lote 1 — alertas simples: `AdminDeletionAlert.tsx`, `AdminInvisibleProfilesAlert.tsx`, `AdminNewProfileAlert.tsx`, `AdminPendingBookingsAlert.tsx`, `AdminConversations.tsx`, `AdminFeatureRequests.tsx`, `AdminCancellations.tsx`
12. `admin/` lote 2 — medios: `AdminMetrics.tsx`, `AdminCharts.tsx`, `AdminBusinesses.tsx`, `AdminReviews.tsx`, `AdminSaludSistema.tsx`, `AdminActivity.tsx`, `AdminAnalytics.tsx`
13. `admin/` lote 3 — complejos (tabla/dark-fijo): `AdminUserManagement.tsx`, `AdminPromoCodes.tsx`, `AdminEmergentes.tsx`, `AdminHiredContracts.tsx`, `AdminDeletions.tsx` (modal del propio archivo excluido, el resto del archivo sí)

`AdminView.tsx` y `FlashBookingWallView.tsx` no llevan lote propio — son shells de tabs sin candidatos propios, ya cubiertos indirectamente por el contenido que renderizan.

## Fuera de alcance

- Cualquier Dialog/Modal (Radix) en toda la app.
- Reescritura o rediseño del sistema de tokens clay (`src/index.css`, `src/design/clayTokens.ts`) — se usa el ya existente y aprobado en Fase 1, salvo las 2 variantes puntuales necesarias para `ExplorarView.tsx` (sombra nativa por imagen de fondo).
- Cambios de comportamiento web (`isNative === false`) — cero cambios ahí, en ningún archivo.
- Componentes fuera de `src/components/dashboard/views/` y sus subcarpetas listadas (ej. `DashboardSidebar.tsx`, `DashboardTopbar.tsx` ya se tocaron en Fase 1).
