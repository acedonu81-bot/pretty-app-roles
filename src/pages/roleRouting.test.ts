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

/**
 * Prioridad de la vista inicial del dashboard.
 *
 * "Cuando vuelves o cargas el dashboard te dirige a donde le da la gana": eran
 * tres mecanismos compitiendo (estado inicial, RoleDefaultView con su propio
 * mapa, y el efecto de ajuste), cada uno con su criterio. Ahora hay una única
 * función y estos tests fijan su orden.
 */
describe('resolverVistaInicial', () => {
  // El primer import de Dashboard.tsx arrastra el árbol entero de la app
  // (Supabase, router, ~40 vistas lazy) y con los demás ficheros de test
  // corriendo en paralelo puede pasar de los 5 s por defecto. No es lentitud
  // de la función, que es un puñado de comparaciones: es el coste del módulo.
  it('la navegación explícita gana a todo lo demás', { timeout: 30_000 }, async () => {
    const { resolverVistaInicial } = await import('./Dashboard');
    expect(resolverVistaInicial({
      stateView: 'messages', queryView: 'flashbooking', guardada: 'calendar', rol: 'dj',
    })).toBe('messages');
  });

  it('el ?view= de un enlace de email gana a la vista guardada', async () => {
    const { resolverVistaInicial } = await import('./Dashboard');
    expect(resolverVistaInicial({
      queryView: 'flashbooking', guardada: 'calendar', rol: 'dj',
    })).toBe('flashbooking');
  });

  it('sin navegación explícita, vuelve a donde estabas', async () => {
    const { resolverVistaInicial } = await import('./Dashboard');
    expect(resolverVistaInicial({ guardada: 'calendar', rol: 'dj' })).toBe('calendar');
  });

  // Antes, quien entraba por primera vez caía en el listado de su propio
  // gremio (un DJ veía DJs) sin haber visto nunca un mapa de la plataforma:
  // de ahí el "no sé por dónde moverme". Ahora aterriza en 'explorar', que
  // enseña todos los gremios. En cuanto navega, la vista guardada manda y ya
  // no vuelve a verlo.
  it('sin vista guardada, un profesional aterriza en explorar', async () => {
    const { resolverVistaInicial } = await import('./Dashboard');
    expect(resolverVistaInicial({ rol: 'grupo-musical' })).toBe('explorar');
    expect(resolverVistaInicial({ rol: 'staff' })).toBe('explorar');
    expect(resolverVistaInicial({ rol: 'tecnico' })).toBe('explorar');
  });

  it('la vista guardada sigue ganando al aterrizaje en explorar', async () => {
    const { resolverVistaInicial } = await import('./Dashboard');
    expect(resolverVistaInicial({ guardada: 'dj', rol: 'dj' })).toBe('dj');
  });

  // El empresario ya tiene un panel propio pensado para él: mandarlo a
  // explorar los gremios sería un paso de más para quien viene a contratar.
  it('el empresario mantiene su panel, no va a explorar', async () => {
    const { resolverVistaInicial } = await import('./Dashboard');
    expect(resolverVistaInicial({ rol: 'empresario' })).toBe('empresario');
  });

  it('sin rol resuelto va al perfil, NUNCA al directorio de DJs', async () => {
    const { resolverVistaInicial } = await import('./Dashboard');
    expect(resolverVistaInicial({})).toBe('profile');
    expect(resolverVistaInicial({ rol: 'pending' })).toBe('profile');
    expect(resolverVistaInicial({ rol: 'rookie' })).toBe('profile');
  });

  it('es determinista: mismas entradas, misma salida', async () => {
    const { resolverVistaInicial } = await import('./Dashboard');
    const args = { guardada: 'stats', rol: 'dj' };
    const r = Array.from({ length: 5 }, () => resolverVistaInicial(args));
    expect(new Set(r).size).toBe(1);
  });
});

/**
 * El buscador del topbar, cuando se escribe fuera de un directorio, mandaba
 * SIEMPRE al directorio de DJs sin mirar el texto — mismo antipatrón que
 * resolverVistaInicial ya corrigió para el aterrizaje inicial. Un visitante
 * que buscaba "camarero" caía filtrando el listado de DJs y la analítica lo
 * registraba como "búsqueda sin resultados", aunque camareros sí existen en
 * XPEAK (9 sep 2026).
 */
describe('resolverVistaDeBusqueda', () => {
  it('reconoce el oficio buscado y no cae siempre en dj', async () => {
    const { resolverVistaDeBusqueda } = await import('./Dashboard');
    expect(resolverVistaDeBusqueda('camarero')).toBe('staff');
    expect(resolverVistaDeBusqueda('camare')).toBe('staff');
    expect(resolverVistaDeBusqueda('fotografo')).toBe('media');
    expect(resolverVistaDeBusqueda('dj')).toBe('dj');
  });

  it('un término que no matchea ningún oficio no fuerza ningún directorio', async () => {
    const { resolverVistaDeBusqueda } = await import('./Dashboard');
    expect(resolverVistaDeBusqueda('saxofonista bilbao')).toBeNull();
    expect(resolverVistaDeBusqueda('')).toBeNull();
  });
});

/**
 * El bug real reportado (9 sep 2026): resolverVistaDeBusqueda por sí sola
 * quedó bien, pero handleSearch solo la consultaba cuando la vista activa NO
 * era YA un directorio — y 'dj' (la home de casi todo el mundo) SÍ es un
 * directorio. Resultado: estando en DJ y buscando "camarero" o "mago", te
 * quedabas filtrando dentro de DJ en vez de saltar al directorio correcto.
 * Estos tests cubren TODOS los oficios, no solo camarero, porque el fallo era
 * estructural (la condición bloqueaba el salto para cualquier término).
 */
describe('resolverDestinoBusqueda', () => {
  const DIRECTORIOS = new Set([
    'dj', 'staff', 'azafata', 'event_manager', 'makeup', 'peluqueria', 'media',
    'ambassador', 'vestuario', 'design', 'promotor', 'camarero', 'catering',
  ]);

  it('estando en DJ, buscar otro oficio SIEMPRE salta a su directorio', async () => {
    const { resolverDestinoBusqueda } = await import('./Dashboard');
    expect(resolverDestinoBusqueda('camarero', 'dj', DIRECTORIOS)).toBe('staff');
    expect(resolverDestinoBusqueda('mago', 'dj', DIRECTORIOS)).toBe('mago');
    expect(resolverDestinoBusqueda('fotografo', 'dj', DIRECTORIOS)).toBe('media');
    expect(resolverDestinoBusqueda('azafata', 'dj', DIRECTORIOS)).toBe('azafata');
  });

  it('lo mismo al revés: estando en Staff, buscar "mago" salta a Mago, no se queda ni va a dj', async () => {
    const { resolverDestinoBusqueda } = await import('./Dashboard');
    expect(resolverDestinoBusqueda('mago', 'staff', DIRECTORIOS)).toBe('mago');
  });

  it('buscar el oficio en el que ya estás no navega a ningún sitio (sigue filtrando ahí)', async () => {
    const { resolverDestinoBusqueda } = await import('./Dashboard');
    expect(resolverDestinoBusqueda('dj', 'dj', DIRECTORIOS)).toBeNull();
    expect(resolverDestinoBusqueda('camarero', 'staff', DIRECTORIOS)).toBeNull();
  });

  it('un término sin oficio reconocido, estando en un directorio, no te saca de ahí', async () => {
    const { resolverDestinoBusqueda } = await import('./Dashboard');
    expect(resolverDestinoBusqueda('saxofonista bilbao', 'dj', DIRECTORIOS)).toBeNull();
  });

  it('un término sin oficio reconocido, fuera de un directorio, manda a explorar (nunca a dj)', async () => {
    const { resolverDestinoBusqueda } = await import('./Dashboard');
    expect(resolverDestinoBusqueda('saxofonista bilbao', 'messages', DIRECTORIOS)).toBe('explorar');
  });

  it('campo vacío no navega a ningún sitio', async () => {
    const { resolverDestinoBusqueda } = await import('./Dashboard');
    expect(resolverDestinoBusqueda('', 'dj', DIRECTORIOS)).toBeNull();
  });
});

/**
 * El Set `directoryViews` de Dashboard.tsx (usado por handleSearch para saber
 * si ya se está dentro de un directorio) estaba incompleto de origen: solo
 * tenía 13 de las 19 vistas reales. Faltaban mago, bailarin, humorista,
 * monologo, animador, speaker, photo-booth, grupo-musical y tecnico (9 sep
 * 2026) — exactamente el patrón de "lista duplicada a mano" que ya mordió
 * este repo antes. Este test lee el Set del código fuente y lo compara contra
 * cada rol real del wizard, así que un oficio nuevo que se olvide añadir aquí
 * rompe el test en vez de fallar en silencio en producción.
 */
describe('directoryViews cubre todos los oficios del wizard', () => {
  const bloqueDirectoryViews = dashboard.match(/directoryViews = new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? '';
  const directoryViewsDeclarado = new Set(
    [...bloqueDirectoryViews.matchAll(/'([a-z_-]+)'/g)].map(m => m[1])
  );

  it('se pudo leer el Set del código fuente (si esto falla, cambió la sintaxis)', () => {
    expect(directoryViewsDeclarado.size).toBeGreaterThan(0);
  });

  it('todo rol del wizard cuya vista es un directorio está en directoryViews', () => {
    // 'empresario' no es un directorio (tiene panel propio); el resto de
    // roles del wizard sí lo son.
    const rolesConDirectorio = rolesDelWizard.filter(r => r !== 'empresario');
    const vistasEsperadas = rolesConDirectorio.map(r => ROLE_TO_VIEW[r] ?? r);
    const faltan = vistasEsperadas.filter(v => !directoryViewsDeclarado.has(v));
    expect(faltan).toEqual([]);
  });
});
