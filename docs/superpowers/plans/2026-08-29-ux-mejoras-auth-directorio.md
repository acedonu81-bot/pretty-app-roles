# Mejoras UX: fallback de Turnstile, trust signals en directorio, onboarding por fases — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cerrar la fuga de conversión más severa detectada en la auditoría UX de xpeak.es (29 ago 2026) — Turnstile bloqueado sin salida en `/auth` — y añadir señales de confianza al directorio de profesionales, sin tocar el patrón de swipe con foto/vídeo a pantalla completa que ya funciona bien para descubrimiento tipo nightlife.

**Architecture:** Cambios incrementales sobre componentes existentes (`Auth.tsx`, `TurnstileWidget.tsx`, `SwipeDirectory.tsx`). Ningún cambio de esquema de base de datos. El fix de Turnstile reutiliza el patrón de fallback que ya existe para in-app browsers, generalizándolo al caso de fallo por red/VPN/extensión en navegador normal.

**Tech Stack:** React 18 + TypeScript + Vite, Supabase (auth), Tailwind inline styles (patrón del proyecto, no clases utilitarias nuevas).

**Spec:** No hay spec arquitectural separado — este plan nace directamente de la auditoría UX (benchmark de mercado + navegación en vivo con chrome-devtools MCP) aprobada en conversación el 29 ago 2026. Ver `docs/superpowers/specs/2026-05-19-auth-conversion-design.md` para el contexto de estructura general de `/auth` (no se contradice, es complementario).

## Global Constraints

- Responder siempre en español (código/UI en español, comentarios en español donde ya es la convención del archivo).
- No crear archivos `.md` de documentación salvo que se pida (este plan y su commit son la excepción ya aprobada).
- Colores brand: dorado `#D4AF37`, fondo `#0a0908` — reutilizar el mismo estilo inline ya usado en `Auth.tsx`/`TurnstileWidget.tsx`, no introducir un sistema de estilos nuevo.
- Tras tocar código de registro/auth o del directorio, invocar la skill `verify-flows` (chrome-devtools MCP) antes de dar el fix por cerrado — un `tsc --noEmit` limpio no es suficiente, hay que reproducir el clic/flujo real.
- No mostrar cifras generadas artificialmente en la UI (regla ya validada del proyecto) — el tiempo de respuesta y las reviews en la card del directorio (Tarea 3) deben venir de datos reales de Supabase; si no hay dato real, se omite el elemento, nunca se inventa un número.
- No tocar el formulario de contacto sin registro en el perfil público (`/p/[slug]`, botón "Escríbele ahora") — es la vía de conversión que mejor funciona ahora mismo según la auditoría; ninguna tarea de este plan debe añadirle fricción o exigir registro.
- No rediseñar el swipe del directorio a un grid/lista — el usuario confirmó que hay vídeo al deslizar dentro de la card y no está seguro de qué cambiar ahí; ese punto queda explícitamente fuera de este plan (ver "Fuera de alcance").

---

## Fuera de alcance (explícito)

- Rediseño del patrón de descubrimiento del directorio (swipe → grid/lista) — el usuario pidió dejarlo para el final, en otro plan, tras investigar cómo funciona hoy el gesto de deslizar-para-vídeo en `DirectorioPublico.tsx`/`PublicProfile.tsx`.
- Onboarding de profesional en fases con indicador de progreso — es un cambio grande (nuevo flujo multi-paso) que merece su propio spec/plan; no se incluye aquí para mantener este plan enfocado y entregable de forma independiente.

---

## Task 1: Fallback visible de Google OAuth cuando Turnstile falla

**Contexto para quien implemente:** `TurnstileWidget.tsx` ya tiene un timeout de 8s (`STALL_MS`) que detecta cuando el widget de Cloudflare no responde (red bloqueada, VPN corporativa, adblocker) y muestra un botón "reintentar". Pero reintentar el mismo challenge en el mismo entorno bloqueado casi nunca funciona — el usuario queda en bucle. Ya existe un mensaje de fallback específico para el caso "in-app browser" (Facebook/Instagram webview) en `Auth.tsx:723-738`, con un botón para copiar el enlace y abrirlo en el navegador real. Falta el caso general: navegador normal con Turnstile bloqueado, donde la salida real es "Continuar con Google", que no depende de Turnstile.

**Files:**
- Modify: `src/pages/Auth.tsx:712-738`

**Interfaces:**
- Consumes: `turnstileStalled` (boolean, ya definido en `Auth.tsx:124`), `isInAppBrowser` (boolean, ya usado en `Auth.tsx:723`), `handleGoogleSignIn` (función ya definida en `Auth.tsx:192`).
- Produces: ningún nuevo estado ni función — solo un bloque JSX condicional adicional.

- [ ] **Step 1: Leer el bloque actual completo para confirmar contexto exacto**

Leer `src/pages/Auth.tsx` líneas 700-740 con el tool Read antes de editar, para copiar el estilo exacto (colores, clases) del bloque de in-app browser ya existente y mantener consistencia visual.

- [ ] **Step 2: Añadir el bloque de fallback para navegador normal**

Insertar inmediatamente después del bloque `{isInAppBrowser && turnstileStalled && (...)}` (que termina en la línea 738), un nuevo bloque hermano que se muestra cuando `turnstileStalled` es true pero el usuario NO está en un in-app browser:

```tsx
                {!isInAppBrowser && turnstileStalled && (
                  <div className="rounded-xl px-4 py-3.5 text-xs leading-relaxed"
                    style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)', color: '#5c4a12' }}>
                    <p className="font-bold mb-1.5">La verificación de seguridad no responde.</p>
                    <p className="mb-2.5">
                      Puede que tu red, VPN o un bloqueador de anuncios esté impidiendo la verificación.
                      Prueba a continuar con Google en su lugar — no depende de esta verificación.
                    </p>
                    <button type="button" onClick={handleGoogleSignIn} disabled={googleLoading}
                      className="w-full py-2.5 rounded-lg font-bold text-xs transition-all hover:scale-[1.01] disabled:opacity-60"
                      style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.4)', color: '#8B6A00' }}>
                      {googleLoading ? 'Conectando…' : 'Continuar con Google'}
                    </button>
                  </div>
                )}
```

- [ ] **Step 3: Verificar tipos**

Run: `cd /Users/danielacedonunez/pretty-app-roles && npx tsc --noEmit`
Expected: sin errores nuevos relacionados con `Auth.tsx`.

- [ ] **Step 4: Verificar en navegador real con chrome-devtools MCP**

Invocar la skill `verify-flows`. Pasos manuales a reproducir en el navegador (viewport móvil):
1. Ir a `/auth`.
2. Bloquear o simular que Turnstile no carga (puede probarse bloqueando `challenges.cloudflare.com` en Network conditions del DevTools, o esperando los 8s de `STALL_MS` si el widget tarda de forma natural).
3. Confirmar que aparece el nuevo mensaje con el botón "Continuar con Google".
4. Pulsar el botón y confirmar que dispara `handleGoogleSignIn` (redirige a Google OAuth) sin errores de consola.
5. Confirmar que el bloque NO aparece si `turnstileStalled` es false (widget funcionando con normalidad) ni cuando `isInAppBrowser` es true (debe seguir viéndose el mensaje de in-app browser, no este nuevo).

Expected: el nuevo bloque solo aparece en el caso correcto y el botón funciona.

- [ ] **Step 5: Commit**

```bash
cd /Users/danielacedonunez/pretty-app-roles
git add src/pages/Auth.tsx
git commit -m "fix: ofrecer Google OAuth como salida cuando Turnstile se bloquea

La auditoría UX del 29 ago confirmó el bug en vivo: con Turnstile
bloqueado (red/VPN/adblocker), el botón de submit quedaba en
'Verificando seguridad...' para siempre sin ninguna pista de que
'Continuar con Google' ya funciona y no depende de Turnstile. Se
generaliza el fallback que ya existía solo para in-app browsers.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 2: Mover el botón de Google más cerca del punto de fallo (reordenar jerarquía visual)

**Contexto para quien implemente:** Aunque el botón de Google ya existe arriba del formulario (`Auth.tsx:586-606`), un usuario que llega hasta el final del formulario y ve fallar Turnstile ya pasó de largo ese botón sin motivo para volver a mirarlo. La Task 1 añade un mensaje con un botón de Google duplicado justo en el punto de fallo — eso ya resuelve el caso urgente. Esta tarea es un refuerzo menor: añadir un ancla de scroll suave para que, si el usuario pulsa el botón de Google del mensaje de fallback, el foco visual quede claro (evita que parezca que "no pasó nada" si el submit de Google tarda en redirigir).

**Files:**
- Modify: `src/pages/Auth.tsx` (bloque añadido en Task 1)

**Interfaces:**
- Consumes: el bloque de fallback de Task 1 y `googleLoading` (ya existente).
- Produces: nada nuevo expuesto a otras tareas.

- [ ] **Step 1: Confirmar que el estado `googleLoading` ya da feedback visual suficiente**

Leer `src/pages/Auth.tsx` líneas 592-606 (el botón de Google original) para confirmar que ya muestra un spinner/texto "Conectando..." cuando `googleLoading` es true — el mismo patrón ya se reutilizó en el botón de Task 1 (`{googleLoading ? 'Conectando…' : 'Continuar con Google'}`).

Si el patrón ya es consistente (debería serlo, ya que Task 1 lo copió), esta tarea no requiere cambios de código adicionales — el feedback visual ya es correcto. Confirmar esto explícitamente antes de escribir código nuevo, para no duplicar lógica sin necesidad (YAGNI).

- [ ] **Step 2: Verificar visualmente el estado de carga en el botón del fallback**

Invocar `verify-flows` o reutilizar la sesión de verificación de Task 1 Step 4: al pulsar el botón "Continuar con Google" del mensaje de fallback, confirmar que el texto cambia a "Conectando…" antes de la redirección, igual que el botón original de arriba.

Expected: mismo comportamiento visual que el botón de Google ya existente, sin código adicional necesario.

- [ ] **Step 3: Si el Step 1 confirma que no hace falta código, saltar a documentar la decisión**

No hay commit en esta tarea si no hubo cambio de código — anotar en el mensaje del PR/resumen final que Task 2 se resolvió como verificación, no como implementación (YAGNI: el feedback visual ya existía por reutilizar el patrón de Task 1).

---

## Task 3: Trust signals en la card del directorio (reviews + tiempo de respuesta)

**Contexto para quien implemente:** La auditoría en vivo confirmó que las cards del swipe (`SwipeDirectory.tsx`) muestran nombre, ciudad, precio, disponibilidad y verificado — pero no reviews agregadas ni tiempo de respuesta, que solo aparecen (o no) al entrar al perfil completo. El benchmark de mercado (Thumbtack, Fiverr) confirma que estas dos señales, mostradas ya en la card, aceleran la decisión de contacto. Esta tarea NO inventa datos: si un profesional no tiene reviews o no hay dato de tiempo de respuesta, esos elementos se omiten (regla de "no inventar cifras" del proyecto).

**Files:**
- Modify: `src/components/SwipeDirectory.tsx`
- Test manual: no hay suite de tests automatizados para este componente (confirmar con `find src -iname "*SwipeDirectory*test*"` antes de asumir que no existen); si no existen, la verificación es manual vía `verify-flows`.

**Interfaces:**
- Consumes: el tipo de perfil que ya usa `SwipeDirectory.tsx` (línea 17 en adelante, incluye `photo_url`). Necesita confirmarse si el tipo ya incluye campos de reviews/rating/tiempo de respuesta agregados, o si hay que sumarlos a la query que alimenta el componente.
- Produces: ningún nuevo export — cambio interno de renderizado de card.

- [ ] **Step 1: Inspeccionar el tipo de perfil y la query que alimenta `SwipeDirectory.tsx`**

Leer `src/components/SwipeDirectory.tsx` completo (no solo el fragmento ya visto) para ver la interfaz/tipo del perfil (busca `interface` o `type` cerca de la línea 17) y de dónde vienen los datos (prop recibida o fetch propio). Confirmar si ya hay `avg_rating`, `review_count`, `avg_response_time_minutes` o similar disponible en la fuente de datos (revisar `src/integrations/supabase/types.ts` para la tabla `profiles` o `reviews`).

- [ ] **Step 2: Si faltan los campos agregados, decidir la fuente antes de escribir código**

Si `avg_rating`/`review_count` no están precalculados en ninguna vista/columna, NO calcularlos client-side sobre todas las reviews (ineficiente y no es el patrón del proyecto — ya existe `20260713150000_reviews_perf_index.sql`, un índice pensado para queries de reviews aprobadas ordenadas). Buscar si ya existe una vista o columna agregada (`grep -rn "avg_rating\|review_count\|response_time" src/ supabase/migrations/`). Si no existe ninguna, esta tarea se reduce a mostrar SOLO lo que ya está disponible sin agregación (p. ej., si `PublicProfile.tsx` ya calcula esto para el perfil completo, reutilizar la misma lógica/query, no inventar una nueva).

- [ ] **Step 3: Añadir el elemento visual a la card, condicionado a que el dato exista**

Ejemplo de patrón (ajustar nombres exactos de campo según lo encontrado en Step 1-2):

```tsx
{p.review_count && p.review_count > 0 && (
  <div className="flex items-center gap-1 text-xs font-bold" style={{ color: '#D4AF37' }}>
    <Star size={12} fill="#D4AF37" />
    {p.avg_rating?.toFixed(1)} · {p.review_count} {p.review_count === 1 ? 'valoración' : 'valoraciones'}
  </div>
)}
{p.avg_response_time_minutes != null && (
  <div className="text-[0.7rem]" style={{ color: 'rgba(255,255,255,0.75)' }}>
    Suele responder en {p.avg_response_time_minutes < 60
      ? `${p.avg_response_time_minutes} min`
      : `${Math.round(p.avg_response_time_minutes / 60)}h`}
  </div>
)}
```

Colocar este bloque en la zona de la card donde ya viven precio/disponibilidad (buscar el JSX correspondiente tras leer el archivo completo en Step 1), manteniendo el mismo sistema de estilo inline que el resto del componente.

- [ ] **Step 4: Verificar tipos**

Run: `cd /Users/danielacedonunez/pretty-app-roles && npx tsc --noEmit`
Expected: sin errores nuevos.

- [ ] **Step 5: Verificar en navegador real con chrome-devtools MCP**

Invocar `verify-flows`. Navegar a `/directorio/dj` (o categoría con datos reales) en viewport móvil, confirmar:
1. Las cards con reviews reales muestran el rating y conteo.
2. Las cards sin reviews NO muestran ningún elemento de rating (ni un "0" ni un placeholder vacío).
3. No hay regresión visual sobre el resto de la card (foto a pantalla completa sigue siendo el elemento dominante).

Expected: elementos de trust visibles solo cuando hay dato real, sin romper el layout existente.

- [ ] **Step 6: Commit**

```bash
cd /Users/danielacedonunez/pretty-app-roles
git add src/components/SwipeDirectory.tsx
git commit -m "feat: mostrar reviews y tiempo de respuesta en la card del directorio

El benchmark de mercado (Thumbtack, Fiverr) confirma que estas señales
de confianza, vistas ya en la card, aceleran la decisión de contacto
sin necesidad de entrar al perfil completo. Solo se muestran cuando
hay dato real — sin reviews o sin tiempo de respuesta calculado, el
elemento se omite en vez de mostrar un placeholder o un cero.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 4: Quitar la obligatoriedad del tutorial modal en el primer uso del swipe

**Contexto para quien implemente:** La auditoría confirmó que el directorio muestra un modal "ASÍ FUNCIONA" que bloquea el primer perfil hasta pulsar "Entendido" — fricción añadida en el primer contacto del usuario con el producto. El objetivo NO es eliminar el tutorial (puede seguir siendo útil para quien no entienda el gesto de swipe), sino dejar de bloquear la interacción: debe poder cerrarse con un tap fuera o quedar como overlay descartable sin impedir ver la card de debajo.

**Files:**
- Modify: `src/components/SwipeDirectory.tsx` (o el componente del modal si está separado — confirmar en Step 1)

**Interfaces:**
- Consumes: el estado que controla la visibilidad del modal (nombre exacto a confirmar en Step 1, ej. `showTutorial`/`hasSeenTutorial`).
- Produces: nada nuevo.

- [ ] **Step 1: Localizar el modal de tutorial y su lógica de bloqueo**

```bash
grep -n "ASÍ FUNCIONA\|Entendido\|tutorial\|Tutorial" src/components/SwipeDirectory.tsx
```

Leer el bloque encontrado completo para entender: (a) qué estado controla si se muestra, (b) si hay algún `pointer-events: none` o similar en la card de debajo mientras el modal está abierto, (c) si el estado persiste en localStorage (para no volver a mostrarse en visitas siguientes) o se resetea cada vez.

- [ ] **Step 2: Permitir cerrar el modal sin bloquear la card de debajo**

Basado en lo encontrado en Step 1, modificar para que: el modal se pueda cerrar tocando fuera de él (backdrop clickable) además del botón "Entendido" explícito, y que la card del primer perfil ya sea visible/parcialmente interactuable detrás del modal (no una pantalla opaca completa) para comunicar visualmente que hay contenido esperando.

No hay código genérico aquí porque depende de la implementación exacta encontrada en Step 1 — el implementador debe escribir el diff real basado en lo que lea, manteniendo el patrón de estado ya existente (no introducir una librería de modales nueva si no la hay ya).

- [ ] **Step 3: Confirmar persistencia — no repetir el tutorial en visitas siguientes**

Si el Step 1 revela que el tutorial ya usa `localStorage` para no repetirse, no tocar esa lógica. Si NO la usa (se muestra siempre), añadir persistencia simple:

```tsx
const [showTutorial, setShowTutorial] = useState(() => {
  try { return localStorage.getItem('xpeak_swipe_tutorial_seen') !== '1'; } catch { return true; }
});

const dismissTutorial = () => {
  setShowTutorial(false);
  try { localStorage.setItem('xpeak_swipe_tutorial_seen', '1'); } catch { /* localStorage bloqueado, se repetirá — aceptable */ }
};
```

Ajustar nombres exactos de estado/función a lo que ya exista en el archivo real (no renombrar variables existentes sin necesidad).

- [ ] **Step 4: Verificar tipos**

Run: `cd /Users/danielacedonunez/pretty-app-roles && npx tsc --noEmit`
Expected: sin errores nuevos.

- [ ] **Step 5: Verificar en navegador real con chrome-devtools MCP**

Invocar `verify-flows`. En una sesión sin `localStorage` previo (o limpiándolo), navegar a `/directorio/dj` en viewport móvil:
1. Confirmar que el modal aparece pero se puede cerrar tocando fuera, sin solo el botón.
2. Confirmar que tras cerrarlo, el swipe funciona con normalidad.
3. Recargar la página y confirmar que el tutorial NO vuelve a aparecer (si se implementó persistencia en Step 3).

Expected: menos fricción en el primer uso, sin perder la opción de que el usuario entienda el gesto si lo necesita.

- [ ] **Step 6: Commit**

```bash
cd /Users/danielacedonunez/pretty-app-roles
git add src/components/SwipeDirectory.tsx
git commit -m "fix: tutorial del swipe ya no bloquea el primer perfil

La auditoría UX detectó fricción innecesaria: el modal 'ASÍ FUNCIONA'
exigía pulsar 'Entendido' antes de poder ver ningún perfil. Ahora se
puede descartar tocando fuera y no vuelve a aparecer en visitas
siguientes.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Self-Review (completado durante la escritura de este plan)

**Spec coverage:** las 4 tareas cubren los puntos 2, 4 (parcial, solo quitar fricción del tutorial + trust signals, sin tocar el formato swipe/foto) del plan aprobado en conversación. El punto 1 (fix causa raíz de Turnstile) se resolvió como Task 1 tras diagnóstico: no había una "causa raíz" distinta que arreglar en Cloudflare — el bloqueo viene del lado del usuario (red/VPN/extensión), así que la única acción correcta es el fallback, no un "arreglo" de configuración. El punto 3 (no tocar el contacto sin registro) está capturado como Global Constraint, no como tarea, porque no requiere ninguna acción — es una regla negativa. Los puntos 5 (onboarding en fases) y 6 (rediseño con vídeo) quedan explícitamente Fuera de alcance por decisión del usuario en conversación.

**Placeholder scan:** Task 3 y Task 4 tienen pasos que dicen "confirmar en el código real antes de escribir el diff" en vez de dar el código exacto de una vez — esto es intencional y no un placeholder prohibido: son componentes que no se leyeron línea por línea durante el brainstorming (a diferencia de `Auth.tsx`/`TurnstileWidget.tsx`, que sí), así que el primer paso de cada una es de lectura obligatoria antes de que el código pueda ser exacto. Cada tarea sí da el código completo de la parte que ya se conoce (Task 3 Step 3, ejemplo de JSX) y dice explícitamente qué investigar antes de adaptarlo — no es "añadir validación apropiada" sin más.

**Type consistency:** Task 1 reutiliza `handleGoogleSignIn`, `googleLoading`, `turnstileStalled`, `isInAppBrowser` — los 4 ya están definidos en `Auth.tsx` (confirmado por lectura directa del archivo), sin inventar nombres nuevos. Task 3 usa nombres de campo (`review_count`, `avg_rating`, `avg_response_time_minutes`) marcados explícitamente como "a confirmar" en el propio Step 1-2 de esa tarea, no como si ya existieran.
