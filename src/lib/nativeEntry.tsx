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
