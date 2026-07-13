---
name: verify-flows
description: Verificar en el navegador real (Chrome DevTools MCP, viewport móvil) los flujos críticos de XPEAK antes de dar por cerrado un cambio que los toca. Usar tras editar código de registro, directorio, carrito "Mi evento", perfil público o Flash Booking — no solo tras pedirlo explícitamente.
---

# Verificar flujos críticos de XPEAK

Esta skill existe porque varias sesiones seguidas encontraron bugs de producción (checkbox falso en registro, presupuesto del carrito sin recalcular, botón "Comparar" que no comparaba) que un `tsc --noEmit` o una lectura de código no detectan — solo aparecen al hacer clic de verdad en el navegador. **Leer el código y que "parezca correcto" no es suficiente para dar un flujo por bueno.**

## Cuándo usarla

Tras editar cualquier archivo que toque uno de estos flujos, antes de decir "arreglado" o hacer commit final:

- `src/pages/Auth.tsx` → flujo de registro
- `src/pages/DirectorioPublico.tsx`, `src/pages/PublicProfile.tsx` → directorio y ficha
- `src/lib/eventCart.ts`, `src/components/EventCart*.tsx` → carrito "Mi evento"
- `src/components/dashboard/FlashBooking*.tsx` → Flash Booking
- Cualquier cambio en `vite.config.ts`, `index.html`, o el pipeline de build

## Cómo hacerlo (Chrome DevTools MCP, viewport móvil real)

1. `mcp__plugin_chrome-devtools-mcp_chrome-devtools__emulate` con `viewport: "390x844x3,mobile,touch"` — la mayoría del tráfico real es móvil (TikTok, Instagram).
2. Navegar a la página en cuestión (local con `vite preview`, o producción tras deploy).
3. **Ejecutar la acción de verdad con clics/rellenado real** (`click`, `fill_form`), no asumir por el código. Ejemplos:
   - Registro: rellenar nombre/email/contraseña, marcar el checkbox, enviar, confirmar que llega al dashboard.
   - Carrito: añadir 2-3 profesionales, abrir el modal, cambiar tipo de evento, **eliminar uno con la papelera**, comprobar que el total y el contador bajan.
   - Directorio: aplicar un filtro de rol/ciudad, comprobar que la lista cambia.
4. Tomar snapshot (`take_snapshot`) tras cada acción y leer los valores reales renderizados (no solo "no dio error").
5. Si algo no cuadra con lo esperado, es un bug real — no lo racionalices como "condición límite rara".

## Checklist por flujo

### Registro (`/auth?mode=register`)
- [ ] Formulario rellena y el botón de submit no queda deshabilitado sin razón visible
- [ ] Checkbox de términos es un `<input type="checkbox">` real (verificar en snapshot que aparece como `checkbox`, no como texto suelto)
- [ ] Tras enviar, llega al dashboard con el onboarding de rol
- [ ] Probar también con user-agent de webview (TikTok/Instagram) si se tocó algo de OAuth — Google bloquea `disallowed_useragent` ahí

### Directorio (`/directorio/:rol`)
- [ ] Filtros de rol y ciudad cambian el listado
- [ ] Las filas con `overflow-x-auto` muestran indicador de scroll (flecha/degradado) si hay contenido cortado
- [ ] Perfiles con `is_seed=true` muestran el badge "Perfil de ejemplo"

### Carrito "Mi evento" (widget flotante + modal)
- [ ] Añadir 2-3 profesionales desde el directorio
- [ ] Abrir el modal, comprobar presupuesto inicial
- [ ] Cambiar tipo de evento, comprobar que el presupuesto recalcula (horas por tipo en `EVENT_HOURS`)
- [ ] **Eliminar un profesional con la papelera dentro del modal** — el contador de "N profesionales" y el presupuesto deben bajar inmediatamente, y el badge del botón flotante también
- [ ] Eliminar hasta vaciar — el modal debe cerrarse solo, no quedar en blanco

### Perfil público (`/p/:id`)
- [ ] Título de pestaña es el nombre del profesional, no el genérico de home
- [ ] Botón "Añadir a mi evento" / "En tu evento" reacciona igual que en el directorio

## Qué hacer si se encuentra un bug

1. No lo arregles a ciegas por intuición del código — reprodúcelo primero con el clic real para confirmar la causa (mira el ejemplo del carrito: el código "parecía" reactivo pero el modal dependía de una prop stale del padre).
2. Arregla, vuelve a correr el mismo checklist en local (`vite preview`) antes de desplegar.
3. Tras el deploy, repite la verificación en producción — no asumas que el deploy salió igual que el build local.
