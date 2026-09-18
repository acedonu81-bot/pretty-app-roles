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
 * Fuente única de la promesa de sesión nativa. `main.tsx` la usa para saber
 * cuándo ocultar el splash y `NativeRootRedirect` la usa para decidir el
 * destino de "/" — memoizada para que ambos consuman la MISMA llamada a
 * `getSession()` en vez de dispararla por duplicado y arriesgar que
 * diverjan.
 */
let nativeSessionReady: ReturnType<typeof supabase.auth.getSession> | null = null;

export function getNativeSessionReady() {
  if (!nativeSessionReady) {
    nativeSessionReady = supabase.auth.getSession();
  }
  return nativeSessionReady;
}

// Tope de seguridad: si getSession() nunca resuelve, no dejamos
// NativeRootRedirect devolviendo null (pantalla en blanco) para siempre
// una vez que el splash ya se ocultó (que tiene su propio timeout de 2s
// en capacitor.ts). Debe ser >= a ese timeout para no "ganarle" el splash.
const SESSION_TIMEOUT_MS = 2500;

/**
 * Se monta una sola vez en la raíz de `<Routes>` cuando `isNative` es true.
 * Resuelve la sesión y decide si la ruta "/" debe ir a /auth o /dashboard,
 * sin dejar pasar nunca la Landing pública dentro de la app.
 */
export function NativeRootRedirect() {
  const [session, setSession] = useState<SessionState>('loading');

  useEffect(() => {
    let cancelled = false;
    Promise.race([
      getNativeSessionReady().then((result) => ({ result })),
      new Promise<{ timedOut: true }>((resolve) =>
        setTimeout(() => resolve({ timedOut: true }), SESSION_TIMEOUT_MS)
      ),
    ]).then((outcome) => {
      if (cancelled) return;
      if ('timedOut' in outcome) {
        // Sin sesión resuelta a tiempo: tratamos como anónimo en vez de
        // dejar la pantalla en blanco para siempre.
        setSession('anonymous');
        return;
      }
      setSession(outcome.result.data.session ? 'authenticated' : 'anonymous');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (session === 'loading') {
    // El splash nativo (Task 1, Step 6) sigue visible hasta que esto resuelve.
    return null;
  }

  return <Navigate to={session === 'authenticated' ? '/dashboard' : '/auth'} replace />;
}

/**
 * Guard síncrono para el resto de rutas bloqueadas (SEO, blog, directorio).
 * La ruta "/" queda deliberadamente excluida: su destino depende de la
 * sesión y esa decisión es responsabilidad exclusiva de `NativeRootRedirect`
 * (que sí espera `getSession()`). Si este guard también redirigiera "/" de
 * forma síncrona, ganaría la carrera contra `NativeRootRedirect` — que se
 * monta a la vez pero de forma asíncrona — y un usuario ya autenticado
 * aterrizaría siempre en /auth en vez de /dashboard.
 */
export function useNativeGuardedPath(pathname: string): boolean {
  return isNative && pathname !== '/' && isRouteBlockedInNative(pathname);
}
