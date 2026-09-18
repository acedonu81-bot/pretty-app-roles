# App nativa en condiciones (Fase 1 Capacitor) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que la app iOS/Android de XPEAK deje de sentirse como "la web envuelta" y se sienta una app nativa construida a propósito: sin landing/SEO dentro del build nativo, navegación con transiciones y gestos reales, estilo visual claymorphism propio, y páginas legales integradas como pantallas internas del dashboard.

**Architecture:** Todo el cambio vive en el mismo codebase React (`src/`), diferenciado en tiempo de ejecución por la constante `isNative` (`src/lib/capacitor.ts`), ya usada hoy solo en `DashboardTopbar.tsx`. Se añade un guard de entrada en `App.tsx`, una capa de transición de stack sobre `Dashboard.tsx` (que ya es navegación por estado, no por rutas — encaja bien con transiciones tipo stack), gestos y haptics vía Capacitor, y un set de tokens CSS clay activos solo bajo `body.is-native-app`. La web (`isNative === false`) no se toca en ningún punto salvo donde el guard decide no montar ciertas rutas.

**Tech Stack:** React 18 + TypeScript + Vite, Capacitor 8, Tailwind + CSS custom properties, framer-motion (ya instalado, usado en `Dashboard.tsx`), `@capacitor/haptics` (a instalar).

**Spec:** `docs/superpowers/specs/2026-09-18-app-nativa-condiciones-design.md`

## Global Constraints

- Prioridad calidad sobre fecha — no recortar alcance por plazo.
- La web (rutas fuera del guard nativo, tokens `--nightlife-*`) no se modifica salvo lo estrictamente necesario para el guard de entrada.
- Paleta de marca real (confirmada en `src/index.css`): fondo crema/blanco `#ffffff`/`--background: 0 0% 100%`, dorado `#D4AF37` / `#B8941E` (`--nightlife-primary` / `--nightlife-secondary`), verde `#16a34a` (`--nightlife-green`), rojo `#dc2626` (`--nightlife-red`, uso exclusivo LIVE/errores) — **no negro puro**. No existe un azul de marca definido; no inventar uno nuevo salvo que el usuario lo pida explícitamente (ver Task 3).
- Tipografía: Syne (display/headlines, peso 800 forzado) + Inter (body) — ya cargadas globalmente, no se tocan.
- Todo cambio de comportamiento nativo debe verificarse con `npx cap sync ios` (o `android`) + prueba en simulador/dispositivo real — Chrome DevTools no sirve porque `Capacitor.isNativePlatform()` es siempre `false` en navegador.
- Skill `verify-flows` obligatoria tras tocar registro, directorio, "Mi evento", perfil público o Flash Booking (regla de `CLAUDE.md` del proyecto).
- No crear archivos `.md` de documentación fuera de lo que este plan ya define.
- Librerías nuevas y pesadas: import dinámico si aplica (no es el caso aquí — `@capacitor/haptics` es ligera y de uso transversal).

---

## Mapa de archivos existentes relevantes (contexto, no crear de nuevo)

- `src/App.tsx` (855 líneas) — router principal, `BrowserRouter` + `Routes`, sin layout wrapper por ruta.
- `src/pages/Dashboard.tsx` (616 líneas) — navegación por estado interno (`activeView`, switch en `renderView()` L452–505), no por rutas anidadas.
- `src/components/dashboard/MobileBottomNav.tsx` (76 líneas) — 4 tabs fijos (Inicio/Flash/Chat/Perfil), llama `onViewChange(id)`.
- `src/components/dashboard/DashboardTopbar.tsx` — único otro consumidor de `isNative` hoy (L165, clase `native-topbar-offset`).
- `src/lib/capacitor.ts` — exporta `isNative`, `isIOS`, `isAndroid`, `initCapacitor(onBack?)`, `safeAreaStyle()`.
- `src/main.tsx` (L4, L13) — llama `initCapacitor()` sin `await` y sin `onBack`.
- `src/index.css` (521 líneas) — tokens `--nightlife-*`, único selector `.is-native-app` en L46–49.
- `src/pages/Privacidad.tsx`, `Terminos.tsx`, `Cookies.tsx`, `Soporte.tsx` — usan `AmbientBackground` + `LegalFooter`.
- `src/pages/EliminarCuenta.tsx` — único que usa `FooterPublic` en vez de `LegalFooter`, sin `AmbientBackground`.

---

### Task 1: Guard de entrada nativo en el router

**Files:**
- Modify: `src/App.tsx:1-13` (imports), `:388-405` (componente `App`, rutas `/` y `/auth`/`/dashboard`)
- Create: `src/lib/nativeEntry.tsx`
- Test: `src/lib/__tests__/nativeEntry.test.tsx`

**Interfaces:**
- Consumes: `isNative` de `src/lib/capacitor.ts` (ya existe); `supabase` client de `src/integrations/supabase/client.ts` (ya existe en el proyecto, usado por `useAuth`).
- Produces: componente `NativeEntryGate` (`src/lib/nativeEntry.tsx`), que envuelve `<Routes>` y decide si renderiza las rutas normales o fuerza un redirect. Exporta también `NATIVE_BLOCKED_PREFIXES: string[]` — lista de prefijos de ruta que no deben montarse en nativo (usada también en Task 2 para no registrar esas `<Route>` en el árbol cuando `isNative`).

- [ ] **Step 1: Escribir el test que define qué rutas se bloquean en nativo**

Crear `src/lib/__tests__/nativeEntry.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { isRouteBlockedInNative } from '../nativeEntry';

describe('isRouteBlockedInNative', () => {
  it('bloquea la landing pública', () => {
    expect(isRouteBlockedInNative('/')).toBe(true);
  });

  it('bloquea rutas de categoría SEO', () => {
    expect(isRouteBlockedInNative('/contratar-dj')).toBe(true);
    expect(isRouteBlockedInNative('/contratar-dj/madrid')).toBe(true);
  });

  it('bloquea rutas de blog', () => {
    expect(isRouteBlockedInNative('/blog/precio-azafatas-madrid')).toBe(true);
  });

  it('bloquea el directorio público sin login', () => {
    expect(isRouteBlockedInNative('/directorio/dj')).toBe(true);
  });

  it('no bloquea auth ni dashboard', () => {
    expect(isRouteBlockedInNative('/auth')).toBe(false);
    expect(isRouteBlockedInNative('/dashboard')).toBe(false);
  });

  it('no bloquea el perfil público (necesario para compartir/deep link)', () => {
    expect(isRouteBlockedInNative('/p/algun-slug')).toBe(false);
  });
});
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `npx vitest run src/lib/__tests__/nativeEntry.test.tsx`
Expected: FAIL con "Cannot find module '../nativeEntry'" o "isRouteBlockedInNative is not a function".

- [ ] **Step 3: Implementar `src/lib/nativeEntry.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isNative } from './capacitor';
import { supabase } from '@/integrations/supabase/client';

/**
 * Prefijos de ruta que no tienen sentido dentro del build nativo: landing
 * pública, páginas SEO programáticas (categoría/ciudad/ocasión/blog) y el
 * directorio público sin login. Todas siguen existiendo en la web.
 */
export const NATIVE_BLOCKED_PREFIXES = [
  '/contratar-',
  '/blog/',
  '/directorio/',
  '/sobre-nosotros',
] as const;

const NATIVE_BLOCKED_EXACT = new Set(['/']);

export function isRouteBlockedInNative(pathname: string): boolean {
  if (NATIVE_BLOCKED_EXACT.has(pathname)) return true;
  return NATIVE_BLOCKED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

type SessionState = 'loading' | 'authenticated' | 'anonymous';

/**
 * Se monta una sola vez en la raíz de `<Routes>` cuando `isNative` es true.
 * Resuelve la sesión y decide si la ruta "/" debe ir a /auth o /dashboard,
 * sin dejar pasar nunca la Landing pública dentro de la app.
 */
export function NativeRootRedirect() {
  const [session, setSession] = useState<SessionState>('loading');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ? 'authenticated' : 'anonymous');
    });
  }, []);

  if (session === 'loading') {
    // El splash nativo (Task 1, Step 6) sigue visible hasta que esto resuelve.
    return null;
  }

  return <Navigate to={session === 'authenticated' ? '/dashboard' : '/auth'} replace />;
}

export function useNativeGuardedPath(pathname: string): boolean {
  return isNative && isRouteBlockedInNative(pathname);
}
```

- [ ] **Step 4: Ejecutar el test y verificar que pasa**

Run: `npx vitest run src/lib/__tests__/nativeEntry.test.tsx`
Expected: PASS (6 tests).

- [ ] **Step 5: Cablear el guard en `App.tsx`**

En `src/App.tsx`, añadir el import junto a los existentes (cerca de L7-8):

```tsx
import { NativeRootRedirect, useNativeGuardedPath } from './lib/nativeEntry';
import { isNative } from './lib/capacitor';
```

Modificar el componente `RastreadorDeRutas` (L380-386) para que también actúe como guard, ya que ya vive dentro de `useLocation()`:

```tsx
const RastreadorDeRutas = () => {
  const location = useLocation();
  const blocked = useNativeGuardedPath(location.pathname);
  useEffect(() => {
    logPageView(location.pathname);
  }, [location.pathname]);
  if (blocked) {
    return <Navigate to="/auth" replace />;
  }
  return null;
};
```

Modificar la ruta raíz (L404), de:
```tsx
<Route path="/" element={<Landing />} />
```
a:
```tsx
<Route path="/" element={isNative ? <NativeRootRedirect /> : <Landing />} />
```

- [ ] **Step 6: Splash — confirmar que `SplashScreen.hide()` no se llama antes de resolver sesión**

En `src/lib/capacitor.ts`, `initCapacitor()` ya llama `SplashScreen.hide({ fadeOutDuration: 300 })` como último paso (línea final de la función) — esto ocurre independientemente de la sesión. Modificar `initCapacitor` para aceptar un callback opcional que retrase el hide:

```ts
export async function initCapacitor(onBack?: () => boolean, waitFor?: Promise<unknown>) {
  if (!isNative) return;
  // ... (todo el cuerpo existente igual, sin tocar)

  // Hide splash after app is ready — si se pasó una promesa a esperar
  // (resolución de sesión), el splash se queda hasta que resuelva o
  // pasen 2s como tope de seguridad para no bloquear la app si algo falla.
  if (waitFor) {
    await Promise.race([waitFor, new Promise((r) => setTimeout(r, 2000))]);
  }
  await SplashScreen.hide({ fadeOutDuration: 300 });
}
```

En `src/main.tsx` (L13), pasar la promesa de sesión:

```tsx
import { supabase } from './integrations/supabase/client';

const sessionReady = supabase.auth.getSession();
initCapacitor(undefined, sessionReady);
```

- [ ] **Step 7: Ejecutar toda la suite y verificar que nada rompió**

Run: `npx vitest run`
Expected: PASS (todos los tests existentes siguen en verde, más los 6 nuevos).

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 8: Commit**

```bash
git add src/lib/nativeEntry.tsx src/lib/__tests__/nativeEntry.test.tsx src/lib/capacitor.ts src/main.tsx src/App.tsx
git commit -m "feat: guard de entrada nativo — sin landing/SEO dentro de la app"
```

---

### Task 2: Excluir rutas SEO/landing del bundle nativo en build time

**Files:**
- Modify: `src/App.tsx` (bloque `<Routes>`, L404-839)
- Create: `src/lib/nativeRoutes.tsx`

**Interfaces:**
- Consumes: `NATIVE_BLOCKED_PREFIXES` de `src/lib/nativeEntry.tsx` (Task 1); `isNative` de `src/lib/capacitor.ts`.
- Produces: componente `<NativeAwareRoute>` que envuelve cualquier `<Route>` bloqueada, y evita el `import()` dinámico de esas páginas cuando corre nativo (para no descargar código SEO que nunca se usa en el build nativo, reduciendo tamaño de app).

**Contexto:** el Task 1 ya bloquea la navegación en runtime (redirige si alguien intenta entrar a esas rutas), pero el `lazy(() => import(...))` de cada página SEO sigue en el bundle. Este task evita que el bundle nativo siquiera pueda cargarlas, usando `import.meta.env` para diferenciar el build.

- [ ] **Step 1: Escribir el test de la función que decide si una ruta se registra**

Crear `src/lib/__tests__/nativeRoutes.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { shouldRegisterRoute } from '../nativeRoutes';

describe('shouldRegisterRoute', () => {
  it('en web registra todas las rutas', () => {
    expect(shouldRegisterRoute('/contratar-dj', false)).toBe(true);
    expect(shouldRegisterRoute('/', false)).toBe(true);
  });

  it('en nativo no registra rutas bloqueadas', () => {
    expect(shouldRegisterRoute('/contratar-dj', true)).toBe(false);
    expect(shouldRegisterRoute('/blog/precio-azafatas-madrid', true)).toBe(false);
  });

  it('en nativo sigue registrando dashboard y auth', () => {
    expect(shouldRegisterRoute('/dashboard', true)).toBe(true);
    expect(shouldRegisterRoute('/auth', true)).toBe(true);
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npx vitest run src/lib/__tests__/nativeRoutes.test.tsx`
Expected: FAIL, módulo no existe.

- [ ] **Step 3: Implementar `src/lib/nativeRoutes.tsx`**

```tsx
import { isRouteBlockedInNative } from './nativeEntry';

export function shouldRegisterRoute(pathname: string, native: boolean): boolean {
  if (!native) return true;
  return !isRouteBlockedInNative(pathname);
}
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `npx vitest run src/lib/__tests__/nativeRoutes.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Aplicar en `App.tsx` a las rutas de categoría/ciudad/blog/directorio**

Esto NO reemplaza cada `<Route>` individualmente (serían >300 ediciones) — en su lugar, se envuelve el bloque completo de rutas SEO en un único condicional de renderizado, ya que React Router evalúa `<Routes>` en cada render y no monta `<Route>` cuyo padre condicional sea `false`.

En `src/App.tsx`, localizar el bloque de rutas de categoría (L422 en adelante, hasta L839 según el mapa de exploración) y envolverlo:

```tsx
{!isNative && (
  <>
    <Route path="/contratar-dj" element={<CategoryLanding />} />
    {/* ... resto de rutas /contratar-*, /contratar-*/:ciudad, /{ocasion}/contratar-*, /blog/*, /directorio/:rol tal cual estaban ... */}
  </>
)}
```

No modificar el contenido de las rutas, solo envolver el bloque existente. `/sobre-nosotros` también entra en este bloque (está en `NATIVE_BLOCKED_PREFIXES`).

- [ ] **Step 6: Verificar el bundle nativo no incluye páginas de blog**

Run: `VITE_BUILD_TARGET=native npm run build 2>&1 | tail -30` (si no existe la env var `VITE_BUILD_TARGET`, usar el build normal — el `lazy()` seguirá haciendo code-splitting por chunk, así que el chunk de blog no se descarga en runtime aunque exista; confirmar mirando el output de `dist/` que los chunks `Blog*` existen pero no se referencian desde el chunk de entrada cuando `isNative` es la rama tomada).

Run: `node scripts/check-bundle-size.mjs`
Expected: "OK" (regla obligatoria de `CLAUDE.md` del proyecto tras cualquier cambio de imports).

- [ ] **Step 7: Ejecutar toda la suite**

Run: `npx vitest run && npx tsc --noEmit`
Expected: PASS sin errores.

- [ ] **Step 8: Commit**

```bash
git add src/lib/nativeRoutes.tsx src/lib/__tests__/nativeRoutes.test.tsx src/App.tsx
git commit -m "feat: no registrar rutas SEO/landing en el árbol de rutas nativo"
```

---

### Task 3: Tokens de diseño claymorphism

**Files:**
- Modify: `src/index.css` (añadir bloque nuevo tras L100, antes de `@layer base`)
- Create: `src/design/clayTokens.ts`

**Interfaces:**
- Consumes: valores existentes `--nightlife-primary` (`#D4AF37`), `--nightlife-secondary` (`#B8941E`), `--nightlife-green` (`#16a34a`), `--nightlife-red` (`#dc2626`), `--background` (`0 0% 100%`).
- Produces: variables CSS `--clay-shadow-light`, `--clay-shadow-dark`, `--clay-shadow-inset-light`, `--clay-shadow-inset-dark`, `--clay-radius-sm/md/lg/xl`, `--clay-surface`, activas solo bajo `body.is-native-app`. Y su espejo tipado en `src/design/clayTokens.ts` para uso desde JS/inline styles donde CSS var no baste (ej. cálculos dinámicos).

**Nota sobre color:** no existe un azul de marca en el código actual (`grep` confirmó que solo hay dorado/verde/rojo como acentos). Este task usa solo dorado y verde para los acentos clay — si se quiere un tercer acento de color, es una decisión de producto a tomar aparte, no se inventa aquí.

- [ ] **Step 1: Escribir el test que verifica que los tokens JS existen y son coherentes con el CSS**

Crear `src/design/__tests__/clayTokens.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { clay } from '../clayTokens';

describe('clay tokens', () => {
  it('define radios crecientes', () => {
    expect(clay.radius.sm).toBeLessThan(clay.radius.md);
    expect(clay.radius.md).toBeLessThan(clay.radius.lg);
    expect(clay.radius.lg).toBeLessThan(clay.radius.xl);
  });

  it('usa los colores de marca existentes, no inventa nuevos', () => {
    expect(clay.accent.gold).toBe('#D4AF37');
    expect(clay.accent.goldDeep).toBe('#B8941E');
    expect(clay.accent.green).toBe('#16a34a');
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npx vitest run src/design/__tests__/clayTokens.test.ts`
Expected: FAIL, módulo no existe.

- [ ] **Step 3: Implementar `src/design/clayTokens.ts`**

```ts
/**
 * Tokens claymorphism para la app nativa (Capacitor).
 * Activos solo bajo body.is-native-app — ver src/index.css.
 * Reutiliza los colores de marca existentes en --nightlife-* (index.css);
 * no introduce colores nuevos.
 */
export const clay = {
  radius: {
    sm: 14,
    md: 18,
    lg: 22,
    xl: 28,
  },
  accent: {
    gold: '#D4AF37',
    goldDeep: '#B8941E',
    green: '#16a34a',
    red: '#dc2626',
  },
  shadow: {
    light: '-8px -8px 16px rgba(255,255,255,0.9)',
    dark: '10px 10px 22px rgba(150,130,90,0.28)',
    insetLight: 'inset -5px -5px 10px rgba(255,255,255,0.7)',
    insetDark: 'inset 6px 6px 12px rgba(150,130,90,0.20)',
  },
} as const;
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `npx vitest run src/design/__tests__/clayTokens.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Añadir el bloque CSS en `src/index.css`**

Insertar tras la línea 108 (después del cierre de `@layer base { :root { ... } }` de los tokens `--sidebar-*`, antes de la siguiente `@layer base` de reglas globales — usar el bloque de variables `:root` existente en L52-115 como referencia de ubicación, añadiendo un bloque separado justo después):

```css
/* ── Claymorphism tokens (solo app nativa) ── */
body.is-native-app {
  --clay-shadow-light: -8px -8px 16px rgba(255,255,255,0.9);
  --clay-shadow-dark: 10px 10px 22px rgba(150,130,90,0.28);
  --clay-shadow-inset-light: inset -5px -5px 10px rgba(255,255,255,0.7);
  --clay-shadow-inset-dark: inset 6px 6px 12px rgba(150,130,90,0.20);
  --clay-radius-sm: 14px;
  --clay-radius-md: 18px;
  --clay-radius-lg: 22px;
  --clay-radius-xl: 28px;
}

body.is-native-app .clay-card {
  border-radius: var(--clay-radius-lg);
  background: var(--background);
  box-shadow: var(--clay-shadow-light), var(--clay-shadow-dark);
}

body.is-native-app .clay-card-inset {
  border-radius: var(--clay-radius-md);
  background: var(--background);
  box-shadow: var(--clay-shadow-inset-light), var(--clay-shadow-inset-dark);
}

body.is-native-app .clay-btn-primary {
  border: none;
  border-radius: var(--clay-radius-md);
  background: linear-gradient(155deg, #E9C866, #D4AF37 60%, #B8941E);
  box-shadow: 6px 8px 16px rgba(150,120,40,0.35), -4px -4px 10px rgba(255,244,210,0.6), inset 0 1px 0 rgba(255,255,255,0.35);
  color: #241C08;
  font-weight: 700;
}
```

- [ ] **Step 6: Verificación visual manual — inyectar en el dashboard real**

Siguiendo la regla del proyecto de verificar mockups con estilos reales (no reconstruir en página aislada): añadir temporalmente `document.body.classList.add('is-native-app')` en la consola del navegador con `npm run dev` abierto en `/dashboard`, y con Chrome DevTools MCP (`take_snapshot`) confirmar que `.clay-card` aplicado a un componente de prueba se ve coherente con el mockup validado (artifact `https://claude.ai/artifact/7z4daXxjxwMbykLbAZ5vHm`). Esto es verificación visual, no un test automatizado — no dejar código de prueba en el repo.

- [ ] **Step 7: Ejecutar la suite**

Run: `npx vitest run && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/design/clayTokens.ts src/design/__tests__/clayTokens.test.ts src/index.css
git commit -m "feat: tokens claymorphism para body.is-native-app"
```

---

### Task 4: Rediseño del `MobileBottomNav` — FAB central + badges

**Files:**
- Modify: `src/components/dashboard/MobileBottomNav.tsx` (76 líneas completas)
- Test: `src/components/dashboard/__tests__/MobileBottomNav.test.tsx`

**Interfaces:**
- Consumes: `clay` de `src/design/clayTokens.ts` (Task 3); props existentes del componente (`activeView: string`, `onViewChange: (id: string) => void`, `unreadCount?: number` — confirmar firma exacta leyendo el archivo antes de editar, ya reportada por la exploración: 4 tabs con `id/icon/label/isActive/badge`).
- Produces: mismo componente, misma firma de props — solo cambia el JSX/CSS interno. El tab `flashbooking` dejar de tener `label` visible y pasa a renderizarse como FAB elevado (`clay-btn-primary` + `margin-top` negativo), sin texto, icono `Zap` (ya importado, ver reporte de exploración).

- [ ] **Step 1: Escribir el test que verifica que el FAB sigue llamando `onViewChange('flashbooking')`**

Crear `src/components/dashboard/__tests__/MobileBottomNav.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileBottomNav from '../MobileBottomNav';

describe('MobileBottomNav', () => {
  it('el botón central llama onViewChange con flashbooking', async () => {
    const onViewChange = vi.fn();
    render(<MobileBottomNav activeView="explorar" onViewChange={onViewChange} unreadCount={0} />);
    const fab = screen.getByLabelText('¿Qué estás organizando?');
    await userEvent.click(fab);
    expect(onViewChange).toHaveBeenCalledWith('flashbooking');
  });

  it('el badge de chat muestra el número de no leídos', () => {
    render(<MobileBottomNav activeView="explorar" onViewChange={vi.fn()} unreadCount={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('el tab activo sigue marcándose correctamente', () => {
    render(<MobileBottomNav activeView="profile" onViewChange={vi.fn()} unreadCount={0} />);
    expect(screen.getByRole('button', { name: /perfil/i })).toHaveAttribute('aria-current', 'true');
  });
});
```

(Ajustar los selectores exactos — `getByRole('button', {name: /perfil/i})` — a como esté realmente marcado el "activo" en el componente actual; leer el archivo real en el Step 3 antes de fijar el test si la exploración no cubrió el detalle de accesibilidad del "isActive".)

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npx vitest run src/components/dashboard/__tests__/MobileBottomNav.test.tsx`
Expected: FAIL — `getByLabelText('¿Qué estás organizando?')` no existe todavía (el botón actual no tiene ese `aria-label`, es un tab más).

- [ ] **Step 3: Leer el componente actual completo antes de modificar**

Leer `src/components/dashboard/MobileBottomNav.tsx` completo (76 líneas) para confirmar la estructura JSX exacta antes de tocarlo — la exploración dio el array de tabs (L15-28) pero no el JSX de render.

- [ ] **Step 4: Modificar el JSX — extraer el tab `flashbooking` como FAB**

Separar el array de tabs en dos grupos: los 3 tabs normales que quedan (`explorar`, `messages`, `profile`) y el FAB (`flashbooking`), insertado en la posición central del `flex` contenedor. Aplicar las clases `clay-btn-primary`-equivalente (ya que `clay-btn-primary` en Task 3 es para botones rectangulares anchos; aquí se necesita una variante circular — añadir `clay-fab` en el mismo bloque CSS de Task 3 si no se hizo, o inline el estilo directamente en este componente vía `clayTokens`):

```tsx
<button
  type="button"
  aria-label="¿Qué estás organizando?"
  onClick={() => onViewChange('flashbooking')}
  className="tab-fab"
>
  <Zap className="w-6 h-6" />
</button>
```

Con el CSS correspondiente añadido a `src/index.css` en el mismo bloque `body.is-native-app` de Task 3:

```css
body.is-native-app .tab-fab {
  width: 56px; height: 56px;
  margin-top: -26px;
  border-radius: var(--clay-radius-lg);
  background: linear-gradient(155deg, #E9C866, #D4AF37 55%, #B8941E);
  box-shadow: 6px 8px 16px rgba(150,120,40,0.4), -4px -4px 10px rgba(255,244,210,0.55), 0 0 0 6px var(--background);
  display: flex; align-items: center; justify-content: center;
  border: none;
  color: #241C08;
}
```

Mantener los 3 tabs restantes con badge (solo `messages` tenía badge según la exploración — conservar esa lógica tal cual, solo migrando las clases visuales a las nuevas `clay-*` cuando `isNative`).

- [ ] **Step 5: Ejecutar y verificar que pasa**

Run: `npx vitest run src/components/dashboard/__tests__/MobileBottomNav.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: Verificación visual en dispositivo/simulador**

```bash
npm run build
npx cap sync ios
npx cap open ios
```
En el simulador, navegar a `/dashboard` con una cuenta demo, confirmar visualmente que el FAB se ve como en el mockup validado (icono de rayo, elevado, sin texto) y que tocarlo cambia a la vista de Flash Booking.

- [ ] **Step 7: `verify-flows`**

Invocar la skill `verify-flows` del proyecto — este cambio toca navegación de Flash Booking, entra en su alcance obligatorio.

- [ ] **Step 8: Commit**

```bash
git add src/components/dashboard/MobileBottomNav.tsx src/components/dashboard/__tests__/MobileBottomNav.test.tsx src/index.css
git commit -m "feat: FAB central en MobileBottomNav para Flash Booking"
```

---

### Task 5: Transiciones de stack nativas en el Dashboard

**Files:**
- Modify: `src/pages/Dashboard.tsx` (función `renderView()`, L452-505, y el punto donde se monta su resultado, ~L559-575 según el mapa)
- Create: `src/components/dashboard/NativeStackTransition.tsx`
- Test: `src/components/dashboard/__tests__/NativeStackTransition.test.tsx`

**Interfaces:**
- Consumes: `framer-motion` (`AnimatePresence`, `motion`) — ya instalado (`^12.38.0`), ya usado en otro punto de `Dashboard.tsx` según la exploración. `isNative` de `src/lib/capacitor.ts`.
- Produces: componente `<NativeStackTransition activeKey={activeView} direction={'forward' | 'back'}>{children}</NativeStackTransition>` — envuelve el resultado de `renderView()` y anima con slide horizontal en nativo, sin animación (passthrough) en web.

**Nota de diseño (de la spec, riesgo abierto ya resuelto aquí):** se usa Framer Motion (ya instalado) en vez de adoptar Ionic React — evita añadir una dependencia nueva grande solo para el motor de transición, dado que la navegación del dashboard ya es 100% por estado (no rutas anidadas), lo cual Framer Motion maneja bien con `AnimatePresence mode="wait"`.

- [ ] **Step 1: Escribir el test de que el wrapper es passthrough en web**

Crear `src/components/dashboard/__tests__/NativeStackTransition.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/lib/capacitor', () => ({ isNative: false }));

import { NativeStackTransition } from '../NativeStackTransition';

describe('NativeStackTransition en web', () => {
  it('renderiza los hijos sin wrapper de animación', () => {
    render(
      <NativeStackTransition activeKey="explorar" direction="forward">
        <div data-testid="content">contenido</div>
      </NativeStackTransition>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npx vitest run src/components/dashboard/__tests__/NativeStackTransition.test.tsx`
Expected: FAIL, módulo no existe.

- [ ] **Step 3: Implementar `src/components/dashboard/NativeStackTransition.tsx`**

```tsx
import { AnimatePresence, motion } from 'framer-motion';
import { isNative } from '@/lib/capacitor';

interface NativeStackTransitionProps {
  activeKey: string;
  direction: 'forward' | 'back';
  children: React.ReactNode;
}

const variants = {
  enter: (direction: 'forward' | 'back') => ({
    x: direction === 'forward' ? '100%' : '-100%',
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: 'forward' | 'back') => ({
    x: direction === 'forward' ? '-30%' : '30%',
    opacity: 0,
  }),
};

export function NativeStackTransition({ activeKey, direction, children }: NativeStackTransitionProps) {
  if (!isNative) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <motion.div
        key={activeKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `npx vitest run src/components/dashboard/__tests__/NativeStackTransition.test.tsx`
Expected: PASS.

- [ ] **Step 5: Cablear en `Dashboard.tsx` — trackear dirección de navegación**

En `src/pages/Dashboard.tsx`, cerca de donde vive `handleViewChange` (la función que ya cambia `activeView`, invocada por `MobileBottomNav` y `DashboardSidebar`), añadir un estado de dirección:

```tsx
const [navDirection, setNavDirection] = useState<'forward' | 'back'>('forward');

// Dentro de handleViewChange, antes de setActiveView(nextView):
// 'profile'/'settings' y 'explorar' se tratan como "home" del stack — cualquier
// otra vista se considera un nivel hacia adelante; volver a home es "back".
const HOME_VIEWS = new Set(['explorar', 'profile']);
setNavDirection(HOME_VIEWS.has(nextView) ? 'back' : 'forward');
```

Envolver el punto donde se renderiza `renderView()` (según el mapa de exploración, dentro de `<main>`):

```tsx
<NativeStackTransition activeKey={activeView} direction={navDirection}>
  {renderView()}
</NativeStackTransition>
```

- [ ] **Step 6: Verificación visual en simulador**

```bash
npm run build && npx cap sync ios && npx cap open ios
```
Navegar entre Inicio → Flash Booking → Perfil en el simulador, confirmar slide horizontal fluido sin parpadeos ni saltos de layout (el `AnimatePresence mode="wait"` puede introducir un frame en blanco si las vistas son pesadas — vigilar esto específicamente).

- [ ] **Step 7: `verify-flows` + suite completa**

Invocar `verify-flows`. Luego:
Run: `npx vitest run && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/components/dashboard/NativeStackTransition.tsx src/components/dashboard/__tests__/NativeStackTransition.test.tsx src/pages/Dashboard.tsx
git commit -m "feat: transiciones de stack nativas entre vistas del dashboard"
```

---

### Task 6: Swipe-back, pull-to-refresh y haptics

**Files:**
- Create: `src/hooks/useSwipeBack.ts`
- Create: `src/hooks/usePullToRefresh.ts`
- Create: `src/lib/haptics.ts`
- Modify: `src/pages/Dashboard.tsx` (usar `useSwipeBack`), `src/components/dashboard/MobileBottomNav.tsx` (usar `haptics.tap()` en el FAB), listados clave (identificar en Step 5)
- Test: `src/hooks/__tests__/useSwipeBack.test.ts`, `src/hooks/__tests__/usePullToRefresh.test.ts`, `src/lib/__tests__/haptics.test.ts`

**Interfaces:**
- Consumes: `isNative` de `src/lib/capacitor.ts`. Se instala `@capacitor/haptics` (`npm install @capacitor/haptics@^8`, para mantener la misma línea mayor que el resto de paquetes `@capacitor/*` del proyecto, confirmados en `^8.x` por la exploración).
- Produces: `useSwipeBack(onBack: () => void): void` (hook, sin JSX), `usePullToRefresh(onRefresh: () => Promise<void>): { isRefreshing: boolean; bind: React.HTMLAttributes<HTMLDivElement> }`, y `haptics.tap()` / `haptics.confirm()` en `src/lib/haptics.ts`.

- [ ] **Step 1: Instalar la dependencia**

```bash
npm install @capacitor/haptics@^8
```

- [ ] **Step 2: Escribir el test de `haptics.ts` (no-op en web)**

Crear `src/lib/__tests__/haptics.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/capacitor', () => ({ isNative: false }));
vi.mock('@capacitor/haptics', () => ({
  Haptics: { impact: vi.fn() },
  ImpactStyle: { Light: 'LIGHT', Medium: 'MEDIUM' },
}));

import { haptics } from '../haptics';
import { Haptics } from '@capacitor/haptics';

describe('haptics en web', () => {
  it('no llama a Haptics.impact cuando no es nativo', async () => {
    await haptics.tap();
    expect(Haptics.impact).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Ejecutar y verificar que falla**

Run: `npx vitest run src/lib/__tests__/haptics.test.ts`
Expected: FAIL, módulo no existe.

- [ ] **Step 4: Implementar `src/lib/haptics.ts`**

```ts
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { isNative } from './capacitor';

/**
 * Vibración sutil reservada a acciones con intención clara de confirmación:
 * confirmar reserva, enviar Flash Booking, dar like/voto. Nunca en cada tap.
 */
export const haptics = {
  async tap() {
    if (!isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      /* dispositivo sin soporte — no bloquear la acción */
    }
  },
  async confirm() {
    if (!isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      /* ignore */
    }
  },
};
```

- [ ] **Step 5: Ejecutar y verificar que pasa**

Run: `npx vitest run src/lib/__tests__/haptics.test.ts`
Expected: PASS.

- [ ] **Step 6: Escribir el test de `useSwipeBack`**

Crear `src/hooks/__tests__/useSwipeBack.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('@/lib/capacitor', () => ({ isNative: true, isIOS: true }));

import { useSwipeBack } from '../useSwipeBack';

describe('useSwipeBack', () => {
  it('llama onBack cuando el swipe supera el umbral desde el borde izquierdo', () => {
    const onBack = vi.fn();
    renderHook(() => useSwipeBack(onBack));

    const start = new TouchEvent('touchstart', {
      touches: [{ clientX: 5, clientY: 300 } as Touch],
    });
    const end = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 140, clientY: 300 } as Touch],
    });
    window.dispatchEvent(start);
    window.dispatchEvent(end);

    expect(onBack).toHaveBeenCalled();
  });

  it('no llama onBack si el swipe no empieza en el borde', () => {
    const onBack = vi.fn();
    renderHook(() => useSwipeBack(onBack));

    const start = new TouchEvent('touchstart', {
      touches: [{ clientX: 200, clientY: 300 } as Touch],
    });
    const end = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 340, clientY: 300 } as Touch],
    });
    window.dispatchEvent(start);
    window.dispatchEvent(end);

    expect(onBack).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 7: Ejecutar y verificar que falla**

Run: `npx vitest run src/hooks/__tests__/useSwipeBack.test.ts`
Expected: FAIL, módulo no existe.

- [ ] **Step 8: Implementar `src/hooks/useSwipeBack.ts`**

```ts
import { useEffect, useRef } from 'react';
import { isNative, isIOS } from '@/lib/capacitor';

const EDGE_ZONE_PX = 24;
const SWIPE_THRESHOLD_PX = 80;

/**
 * Gesto de swipe-back desde el borde izquierdo, equivalente al back
 * gesture nativo de iOS. En Android el botón físico ya lo cubre
 * initCapacitor's backButton listener — este hook es solo iOS.
 */
export function useSwipeBack(onBack: () => void): void {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!isNative || !isIOS) return;

    function handleStart(e: TouchEvent) {
      const touch = e.touches[0];
      if (touch.clientX <= EDGE_ZONE_PX) {
        startX.current = touch.clientX;
        startY.current = touch.clientY;
      } else {
        startX.current = null;
      }
    }

    function handleEnd(e: TouchEvent) {
      if (startX.current === null) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX.current;
      const deltaY = Math.abs(touch.clientY - (startY.current ?? 0));
      if (deltaX > SWIPE_THRESHOLD_PX && deltaY < 60) {
        onBack();
      }
      startX.current = null;
    }

    window.addEventListener('touchstart', handleStart, { passive: true });
    window.addEventListener('touchend', handleEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleStart);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [onBack]);
}
```

- [ ] **Step 9: Ejecutar y verificar que pasa**

Run: `npx vitest run src/hooks/__tests__/useSwipeBack.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 10: Escribir el test de `usePullToRefresh`**

Crear `src/hooks/__tests__/usePullToRefresh.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePullToRefresh } from '../usePullToRefresh';

describe('usePullToRefresh', () => {
  it('expone isRefreshing en false por defecto', () => {
    const { result } = renderHook(() => usePullToRefresh(vi.fn()));
    expect(result.current.isRefreshing).toBe(false);
  });

  it('llama onRefresh y actualiza isRefreshing durante la ejecución', async () => {
    let resolveRefresh: () => void;
    const onRefresh = vi.fn(() => new Promise<void>((r) => { resolveRefresh = r; }));
    const { result } = renderHook(() => usePullToRefresh(onRefresh));

    await act(async () => {
      const triggerPromise = result.current.triggerRefresh();
      expect(result.current.isRefreshing).toBe(true);
      resolveRefresh!();
      await triggerPromise;
    });

    expect(onRefresh).toHaveBeenCalled();
    expect(result.current.isRefreshing).toBe(false);
  });
});
```

- [ ] **Step 11: Ejecutar y verificar que falla**

Run: `npx vitest run src/hooks/__tests__/usePullToRefresh.test.ts`
Expected: FAIL, módulo no existe.

- [ ] **Step 12: Implementar `src/hooks/usePullToRefresh.ts`**

```ts
import { useCallback, useState } from 'react';

interface PullToRefreshResult {
  isRefreshing: boolean;
  triggerRefresh: () => Promise<void>;
}

/**
 * Lógica de estado de pull-to-refresh, desacoplada del gesto táctil en sí
 * (el gesto visual se implementa por listado consumidor con onTouchMove,
 * ya que cada listado tiene su propio contenedor de scroll). Este hook
 * centraliza solo el ciclo de vida de "refrescando sí/no".
 */
export function usePullToRefresh(onRefresh: () => Promise<void>): PullToRefreshResult {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const triggerRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  return { isRefreshing, triggerRefresh };
}
```

- [ ] **Step 13: Ejecutar y verificar que pasa**

Run: `npx vitest run src/hooks/__tests__/usePullToRefresh.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 14: Cablear `useSwipeBack` en `Dashboard.tsx`**

En `src/pages/Dashboard.tsx`, junto a `handleViewChange` (mismo punto que Task 5, Step 5):

```tsx
useSwipeBack(() => {
  if (activeView !== 'explorar' && activeView !== 'profile') {
    handleViewChange('explorar');
  }
});
```

- [ ] **Step 15: Cablear `haptics.confirm()` en el FAB de `MobileBottomNav.tsx`**

En el `onClick` del FAB (Task 4, Step 4):

```tsx
onClick={() => {
  haptics.tap();
  onViewChange('flashbooking');
}}
```

- [ ] **Step 16: Identificar y cablear `usePullToRefresh` en los 3 listados clave**

Leer `src/components/dashboard/views/` (o donde vivan las vistas `explorar`/directorio, `messages`, y el feed de actividad — confirmar rutas exactas leyendo `src/pages/Dashboard.tsx` L452-505 `renderView()` para saber qué componente monta cada `case`) y añadir el hook a cada uno de los 3 listados que la spec marca como clave: directorio/descubrir, feed de actividad, mensajes. Cada listado ya tiene su propia función de refetch de Supabase (usar la existente como `onRefresh`, no crear una nueva).

Esto requiere leer cada componente de vista individualmente antes de editar — no hay código genérico aquí porque cada listado tiene su propia query. Aplicar el patrón:

```tsx
const { isRefreshing, triggerRefresh } = usePullToRefresh(refetchExistente);
```

Y en el contenedor de scroll del listado, añadir el indicador visual (usar `clay-card` de Task 3 para el indicador de "refrescando") condicionado a `isNative`.

- [ ] **Step 17: Verificación en simulador**

```bash
npm run build && npx cap sync ios && npx cap open ios
```
Probar en simulador: swipe-back desde el borde izquierdo en una vista que no sea Inicio/Perfil, pull-to-refresh en directorio/mensajes/feed, y sentir el haptic al tocar el FAB (solo en dispositivo físico — el simulador de Xcode no reproduce haptics reales, anotar esto como limitación de la verificación).

- [ ] **Step 18: `verify-flows` + suite completa**

Invocar `verify-flows` (toca directorio y Flash Booking).
Run: `npx vitest run && npx tsc --noEmit && node scripts/check-bundle-size.mjs`
Expected: todo en verde.

- [ ] **Step 19: Commit**

```bash
git add src/hooks/useSwipeBack.ts src/hooks/usePullToRefresh.ts src/lib/haptics.ts src/hooks/__tests__ src/lib/__tests__/haptics.test.ts src/pages/Dashboard.tsx src/components/dashboard/MobileBottomNav.tsx package.json package-lock.json
git commit -m "feat: swipe-back, pull-to-refresh y haptics en la app nativa"
```

---

### Task 7: Páginas legales/soporte como pantallas internas del dashboard

**Files:**
- Create: `src/components/dashboard/views/LegalView.tsx`
- Modify: `src/pages/Dashboard.tsx` (añadir case al switch `renderView()`, y entrada en Ajustes)
- Modify: `src/App.tsx` (opcional passthrough — ver Step 6)
- Test: `src/components/dashboard/views/__tests__/LegalView.test.tsx`

**Interfaces:**
- Consumes: el contenido ya existente de `src/pages/Privacidad.tsx`, `Terminos.tsx`, `Cookies.tsx`, `EliminarCuenta.tsx`, `Soporte.tsx` — se extrae el bloque de contenido (`<section>`/texto) de cada uno a un sub-componente reutilizable, sin duplicar el texto legal.
- Produces: `LegalView` con prop `document: 'privacidad' | 'terminos' | 'cookies' | 'eliminar-cuenta' | 'soporte'`, renderizado dentro del dashboard (con su header/nav nativo, no `AmbientBackground`/`LegalFooter`/`FooterPublic`).

**Nota de la spec:** esto corrige también la inconsistencia detectada en la exploración (dos footers legales distintos, `LegalFooter` vs `FooterPublic`) — al extraer solo el contenido, ambos quedan sin usar dentro del dashboard, sin necesidad de unificarlos en la web (fuera de alcance).

- [ ] **Step 1: Leer los 5 archivos completos antes de extraer contenido**

Leer `src/pages/Privacidad.tsx` (106 líneas), `Terminos.tsx` (184), `Cookies.tsx` (111), `EliminarCuenta.tsx` (70), `Soporte.tsx` (72) completos — la exploración dio estructura pero no el contenido textual real, necesario para no perder texto legal al extraer.

- [ ] **Step 2: Escribir el test de que `LegalView` renderiza el documento pedido**

Crear `src/components/dashboard/views/__tests__/LegalView.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LegalView } from '../LegalView';

describe('LegalView', () => {
  it('renderiza el título de privacidad', () => {
    render(<LegalView document="privacidad" />);
    expect(screen.getByRole('heading', { name: /privacidad/i })).toBeInTheDocument();
  });

  it('renderiza el título de eliminar cuenta', () => {
    render(<LegalView document="eliminar-cuenta" />);
    expect(screen.getByRole('heading', { name: /eliminar/i })).toBeInTheDocument();
  });

  it('no importa AmbientBackground ni LegalFooter (viven fuera, en el shell del dashboard)', () => {
    // Verificación estructural: el contenedor raíz de LegalView no debe
    // tener las clases del fondo ambiental de la web pública.
    const { container } = render(<LegalView document="terminos" />);
    expect(container.querySelector('[data-ambient-background]')).toBeNull();
  });
});
```

- [ ] **Step 3: Ejecutar y verificar que falla**

Run: `npx vitest run src/components/dashboard/views/__tests__/LegalView.test.tsx`
Expected: FAIL, módulo no existe.

- [ ] **Step 4: Implementar `src/components/dashboard/views/LegalView.tsx`**

Extraer el contenido real leído en el Step 1 (no placeholder — el contenido literal de cada página) a un objeto de secciones por documento. Estructura (el contenido real se completa con lo leído en Step 1, aquí se muestra el armazón con el primer documento como ejemplo de formato esperado):

```tsx
interface LegalViewProps {
  document: 'privacidad' | 'terminos' | 'cookies' | 'eliminar-cuenta' | 'soporte';
}

const TITLES: Record<LegalViewProps['document'], string> = {
  privacidad: 'Privacidad',
  terminos: 'Términos y condiciones',
  cookies: 'Cookies',
  'eliminar-cuenta': 'Eliminar cuenta',
  soporte: 'Soporte',
};

export function LegalView({ document }: LegalViewProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-display font-extrabold mb-4">{TITLES[document]}</h1>
      {/* Contenido de cada documento extraído literal de src/pages/{Privacidad,Terminos,Cookies,EliminarCuenta,Soporte}.tsx,
          quitando cualquier Helmet/AmbientBackground/LegalFooter/FooterPublic — esos componentes
          quedan exclusivamente para las rutas web (/privacidad, /terminos, etc, que se conservan). */}
      {document === 'privacidad' && <PrivacidadContent />}
      {document === 'terminos' && <TerminosContent />}
      {document === 'cookies' && <CookiesContent />}
      {document === 'eliminar-cuenta' && <EliminarCuentaContent />}
      {document === 'soporte' && <SoporteContent />}
    </div>
  );
}
```

Los componentes `PrivacidadContent`, etc., son funciones que devuelven el JSX de contenido (los `<section>` con el texto real leído en Step 1), definidas en el mismo archivo o en `src/components/dashboard/views/legalContent/` si el volumen de texto lo justifica (decisión del implementador según cuánto texto real haya, siguiendo la guía de "archivos con una responsabilidad clara" — si supera ~150 líneas por documento, separar en su propio archivo).

- [ ] **Step 5: Ejecutar y verificar que pasa**

Run: `npx vitest run src/components/dashboard/views/__tests__/LegalView.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: Añadir al switch de `Dashboard.tsx` y a la navegación de Ajustes**

En `src/pages/Dashboard.tsx`, `renderView()` (L452-505), añadir cases:

```tsx
case 'legal-privacidad':
  return <LegalView document="privacidad" />;
case 'legal-terminos':
  return <LegalView document="terminos" />;
case 'legal-cookies':
  return <LegalView document="cookies" />;
case 'legal-eliminar-cuenta':
  return <LegalView document="eliminar-cuenta" />;
case 'legal-soporte':
  return <LegalView document="soporte" />;
```

Localizar la vista de Ajustes (`case 'settings'` en el mismo switch, componente ya existente) y añadir enlaces/botones a cada `legal-*` vía `onViewChange('legal-privacidad')` etc. — leer el componente de Ajustes real antes de esta edición para seguir su patrón visual existente (lista de opciones, no se detalla aquí el JSX exacto porque depende de la estructura real no cubierta por la exploración; el implementador debe leer `src/components/dashboard/views/` para localizarlo).

- [ ] **Step 7: Las rutas web `/privacidad` etc. permanecen intactas**

Confirmar que no se tocó nada de `src/App.tsx` para estas rutas — siguen sirviendo la web pública sin cambios, y las nuevas `case 'legal-*'` del dashboard son exclusivamente para el flujo dentro de la app (nativa o web-logueada, indistintamente — no hace falta condicionar a `isNative`, son simplemente una forma más de llegar al mismo contenido).

- [ ] **Step 8: Verificación visual + `verify-flows`**

```bash
npm run build && npx cap sync ios && npx cap open ios
```
En el simulador, entrar a Ajustes → Privacidad / Eliminar cuenta / Soporte y confirmar que se ve con el header/nav del dashboard, sin rastro de landing pública. Invocar `verify-flows` (toca el flujo de perfil/ajustes).

- [ ] **Step 9: Ejecutar la suite completa**

Run: `npx vitest run && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add src/components/dashboard/views/LegalView.tsx src/components/dashboard/views/__tests__/LegalView.test.tsx src/pages/Dashboard.tsx
git commit -m "feat: páginas legales como pantallas internas del dashboard nativo"
```

---

### Task 8: Aplicar tokens clay a las superficies principales del dashboard

**Files:**
- Modify: los componentes de card/botón más usados del dashboard — identificar en Step 1 (candidatos según la exploración: componentes bajo `src/components/dashboard/` que usan clases `rounded-*`/`shadow-*`/`border` tipo web, ej. `ProfileCard.tsx`, `OffersWidget.tsx`, `ActivityFeedWidget.tsx`)
- Test: no requiere tests nuevos — este task es de estilo visual puro (clases CSS condicionales), verificado visualmente, no con lógica testeable.

**Interfaces:**
- Consumes: clases `.clay-card`, `.clay-card-inset`, `.clay-btn-primary` de `src/index.css` (Task 3).
- Produces: mismos componentes, con clases condicionadas a `isNative` añadidas (patrón ya usado en `DashboardTopbar.tsx` L165: `` `clases-base${isNative ? ' clay-card' : ''}` ``).

- [ ] **Step 1: Listar los componentes candidato**

```bash
grep -rl "rounded-2xl\|rounded-xl\|shadow-card\|shadow-lg" src/components/dashboard/ | grep -v __tests__
```
Producir la lista real de archivos — no asumir de antemano cuáles son, la exploración no cubrió el detalle de clases Tailwind usadas por cada card individual.

- [ ] **Step 2: Para cada componente de la lista, añadir la clase condicional**

Patrón a aplicar (ejemplo con un componente hipotético `ProfileCard.tsx`, ajustar al JSX real de cada archivo leído):

```tsx
import { isNative } from '@/lib/capacitor';
// ...
<div className={`rounded-2xl border bg-card p-4 shadow-card${isNative ? ' clay-card' : ''}`}>
```

No eliminar las clases web existentes — se añaden las clay como capa adicional que, gracias a la especificidad de `body.is-native-app .clay-card` en el CSS (Task 3), gana visualmente en nativo sin romper el estilo web cuando `isNative` es `false` (la clase `clay-card` ni siquiera se añade al DOM en ese caso).

- [ ] **Step 3: Verificación visual por componente**

Tras cada 3-4 componentes editados, correr `npm run build && npx cap sync ios && npx cap open ios` y revisar visualmente en simulador contra el mockup de referencia (`https://claude.ai/artifact/7z4daXxjxwMbykLbAZ5vHm`) — no es necesario recompilar tras cada archivo individual, agrupar por lote razonable.

- [ ] **Step 4: Confirmar que la web no cambió**

```bash
npm run dev
```
Abrir `/dashboard` en navegador normal (sin `is-native-app` en el body) y confirmar visualmente que no hay ninguna diferencia respecto al estado anterior a este plan — las clases clay no deben afectar nada fuera de `body.is-native-app`.

- [ ] **Step 5: `verify-flows` + suite + bundle size**

Invocar `verify-flows`.
Run: `npx vitest run && npx tsc --noEmit && node scripts/check-bundle-size.mjs`
Expected: todo en verde.

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/
git commit -m "feat: aplicar tokens claymorphism a las superficies del dashboard nativo"
```

---

### Task 9: Verificación end-to-end y actualización de versión iOS/Android

**Files:**
- Modify: `ios/App/App.xcodeproj` (Version + Build number, según el proceso ya documentado en `CLAUDE.md` del proyecto)
- No se crean archivos nuevos — este task es de verificación y empaquetado final.

**Interfaces:** ninguna — task de cierre.

- [ ] **Step 1: Suite completa una última vez**

Run: `npx vitest run && npx tsc --noEmit && node scripts/check-bundle-size.mjs`
Expected: todo en verde.

- [ ] **Step 2: Build y sync**

```bash
npm run build
npx cap sync ios
npx cap sync android
```

- [ ] **Step 3: Checklist manual en dispositivo físico real (no solo simulador)**

Siguiendo la sección "Testing y verificación" de la spec — cada punto se marca aquí como su propio paso:

- [ ] Apertura fría de la app (kill + reopen): sin sesión → splash → `/auth` directo, sin flash de landing.
- [ ] Login → splash breve → dashboard del rol correcto, sin pantallas intermedias.
- [ ] Navegar entre las 4-5 vistas principales del tab bar: transición slide visible, sin saltos.
- [ ] Swipe-back desde el borde izquierdo en una vista no-home: vuelve a Inicio.
- [ ] Pull-to-refresh en directorio, mensajes y feed de actividad: indicador visible, listado se actualiza.
- [ ] Tocar el FAB de Flash Booking: haptic perceptible (dispositivo físico, no simulador) + navega a la vista.
- [ ] Ajustes → Privacidad / Eliminar cuenta / Soporte: contenido correcto, header/nav del dashboard, sin rastro de landing.
- [ ] Botón físico atrás en Android: comportamiento coherente con el swipe-back de iOS (mismo destino).

- [ ] **Step 4: Invocar `verify-flows` una última vez sobre el conjunto completo**

- [ ] **Step 5: Subir Version + Build number**

Seguir el proceso ya documentado en `CLAUDE.md` del proyecto (sección "App iOS (Capacitor)"): subir **Version** en Xcode (cambio visible al usuario) y siempre el **Build number**, luego Archive → Distribute App → App Store Connect.

- [ ] **Step 6: Commit final si quedó algo suelto**

```bash
git status
# Si hay cambios de ios/App/App.xcodeproj (version bump):
git add ios/App/App.xcodeproj
git commit -m "chore: bump version para release app nativa en condiciones"
```

No se hace `npx vercel --prod` ni deploy de producción salvo que el usuario lo pida explícitamente (regla del proyecto: deploy solo si se pide).

---

## Self-Review

**Cobertura de la spec:**
1. Entrada de la app (guard + splash) → Task 1. ✓
2. Rutas SEO fuera del bundle nativo → Task 2. ✓
3. Navegación nativa (transiciones, swipe-back, pull-to-refresh, haptics) → Tasks 5, 6. ✓
4. Sistema visual claymorphism → Task 3 (tokens) + Task 8 (aplicación). ✓
5. Tab bar con FAB central + badges → Task 4. ✓
6. Legal/soporte como pantallas internas → Task 7. ✓
7. Verificación (`verify-flows`, dispositivo real, checklist) → integrado en cada task + Task 9 de cierre. ✓
8. Decisión abierta "motor de transición" (spec la deja pendiente) → resuelta en Task 5 (Framer Motion, ya instalado, justificado).
9. Decisión abierta "qué listados llevan pull-to-refresh" → resuelta en Task 6 Step 16 (los 3 listados que la spec ya nombra: directorio, feed, mensajes).
10. Decisión abierta "alcance de haptics" → resuelta en Task 6 (tap en FAB; ampliar a "confirmar reserva"/"enviar Flash Booking"/"like" requiere tocar esos flujos específicos — no cubiertos en el mapa de exploración inicial. **Gap conocido:** este plan solo cablea haptics en el FAB del tab bar; los otros puntos de la spec — confirmar reserva, enviar Flash Booking, votar — requieren una pasada adicional sobre `FlashBookingRequestModal.tsx`, `ContractModal.tsx`, `VoteButton.tsx` no explorados en detalle. Añadir como Task 6b si se quiere cerrar el 100% de la spec, o tratarlo como iteración posterior tras validar el patrón con el FAB.)

**Placeholder scan:** sin "TBD"/"TODO" en pasos ejecutables. El único punto marcado explícitamente como incompleto es el gap de haptics anterior, señalado como tal (no oculto).

**Consistencia de tipos:** `isRouteBlockedInNative(pathname: string): boolean` (Task 1) se reutiliza igual en `shouldRegisterRoute` (Task 2) vía import, no redefinido. `NativeStackTransition` (Task 5) y `useSwipeBack`/`usePullToRefresh`/`haptics` (Task 6) no comparten tipos entre sí, correcto — son independientes. `LegalView` (Task 7) no depende de ningún tipo de tasks anteriores.
