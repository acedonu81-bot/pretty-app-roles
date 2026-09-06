import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Blindaje del recorrido ROL -> VISTA del dashboard.
 *
 * Un grupo de música en directo (Soniché, alta del 5 sep 2026) aparecía en el
 * directorio de DJs. La causa no fue el registro: era que 'dj' actuaba como
 * valor por defecto en tres sitios distintos, así que cualquier perfil cuyo rol
 * no se resolviera acababa ahí — y el usuario creía que el sistema le había
 * asignado esa categoría.
 *
 * Estos tests leen el código fuente en vez de importar Dashboard.tsx porque ese
 * módulo arrastra el árbol entero de la app (Supabase, router, ~40 vistas lazy)
 * y montarlo en jsdom para comprobar un mapa de strings sería frágil y lento.
 * Lo que se protege aquí es una regla de negocio simple y muy concreta: NADA
 * cae en DJ por defecto, y todo rol que ofrece el registro tiene su destino.
 */

const raiz = join(__dirname, '..', '..');
const leer = (rel: string) => readFileSync(join(raiz, rel), 'utf8');

const dashboard = leer('src/pages/Dashboard.tsx');
const sidebar = leer('src/components/dashboard/DashboardSidebar.tsx');
const wizard = leer('src/components/OnboardingWizard.tsx');
const auth = leer('src/pages/Auth.tsx');

/** Roles que el wizard de onboarding ofrece elegir. */
const rolesDelWizard = [...wizard.matchAll(/value: '([a-z-]+)'/g)].map(m => m[1]);

/** Roles que el registro acepta por query param (?role=). */
const rolesDeRegistro =
  auth.match(/KNOWN_ROLES = \[([^\]]*)\]/)?.[1]
    .split(',')
    .map(s => s.trim().replace(/'/g, ''))
    .filter(Boolean) ?? [];

/** Ids de vista que el switch de Dashboard.tsx sabe renderizar. */
const casesDelSwitch = new Set(
  [...dashboard.matchAll(/case '([a-z_-]+)':/g)].map(m => m[1])
);

/** Mapas rol -> vista declarados en Dashboard.tsx. */
function leerMapa(nombre: string): Record<string, string> {
  const bloque = dashboard.match(
    new RegExp(`${nombre}[^=]*= \\{([\\s\\S]*?)\\n\\};`)
  )?.[1] ?? '';
  const mapa: Record<string, string> = {};
  for (const m of bloque.matchAll(/'?([a-z_-]+)'?\s*:\s*'([a-z_-]+)'/g)) {
    mapa[m[1]] = m[2];
  }
  return mapa;
}

const ROLE_TO_VIEW = leerMapa('ROLE_TO_VIEW');
const ROLE_DEFAULT_VIEW = leerMapa('ROLE_DEFAULT_VIEW');

describe('enrutado de rol a vista', () => {
  it('el wizard y el registro ofrecen exactamente los mismos roles', () => {
    // Si divergen, alguien puede registrarse con un rol que el wizard no sabe
    // mostrar (o al revés) y acabar en un limbo.
    expect([...rolesDelWizard].sort()).toEqual([...rolesDeRegistro].sort());
  });

  it('cada rol que se puede elegir tiene una vista que lo renderiza', () => {
    const sinDestino = rolesDelWizard.filter(rol => {
      const vista = ROLE_TO_VIEW[rol] ?? rol;
      return !casesDelSwitch.has(vista);
    });
    expect(sinDestino).toEqual([]);
  });

  it('ningún rol se redirige al directorio de DJs salvo el propio dj', () => {
    // Este es EL bug: 'rookie' y 'pending' apuntaban a 'dj', así que un perfil
    // sin oficio definido aterrizaba entre los DJs.
    const caenEnDj = Object.entries({ ...ROLE_TO_VIEW, ...ROLE_DEFAULT_VIEW })
      .filter(([rol, vista]) => vista === 'dj' && rol !== 'dj')
      .map(([rol]) => rol);
    expect(caenEnDj).toEqual([]);
  });

  it('el switch del dashboard no usa DJView como caso por defecto', () => {
    const porDefecto = dashboard.match(/default:\s*return\s*<(\w+)/)?.[1];
    expect(porDefecto).toBeDefined();
    expect(porDefecto).not.toBe('DJView');
  });

  it('el sidebar no usa "dj" como respaldo de la vista de inicio', () => {
    // Antes: `role === 'dj' ? 'dj' : (role ?? 'dj')`, con lo que "Inicio"
    // llevaba al directorio de DJs a quien no tuviera rol.
    const linea = sidebar.match(/const homeView = .*/)?.[0] ?? '';
    expect(linea).not.toMatch(/\?\?\s*'dj'/);
    expect(linea).toMatch(/'profile'/);
  });

  it("un perfil sin rol ('pending') va a completar su perfil", () => {
    expect(ROLE_TO_VIEW['pending'] ?? ROLE_DEFAULT_VIEW['pending']).toBe('profile');
  });

  it('grupo-musical tiene su propia vista y no comparte la de dj', () => {
    const vista = ROLE_TO_VIEW['grupo-musical'] ?? 'grupo-musical';
    expect(vista).toBe('grupo-musical');
    expect(casesDelSwitch.has('grupo-musical')).toBe(true);
  });
});
