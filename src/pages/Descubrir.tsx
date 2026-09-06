import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Loader2, Menu, X, LayoutDashboard, ArrowLeft,
  Disc3, Camera, Users, Wine, Palette, Megaphone, UtensilsCrossed,
  Music, PartyPopper, Wand2, Mic, Drama, Presentation, Shirt,
  Aperture, CalendarHeart, PenTool, Grid3x3, type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import ReelsFeed from '@/components/ReelsFeed';
import { addToCart, useEventCart, MAX_CART_ITEMS } from '@/lib/eventCart';
import {
  ALL_ROLES,
  ROLE_CONFIG,
  fetchDirectorioProfiles,
  profileUrl,
  type DirProfile,
} from '@/pages/DirectorioPublico';

/**
 * /descubrir — experiencia tipo Instagram/Reels. Entra DIRECTO al swipe (sin
 * portada de roles intermedia — se pidió flujo más ligero e intuitivo):
 *   - Al cargar, lanza el feed con el último rol usado, o "todos" mezclados.
 *   - El rol se cambia desde el menú ☰ (no bloquea el descubrimiento).
 *   - El menú ☰ incluye "Volver a versión clásica" (dashboard).
 * Reutiliza el fetch, la config de roles y el carrito "Mi evento" existentes.
 */

const ROLE_ICON: Record<string, LucideIcon> = {
  dj: Disc3, fotografo: Camera, staff: Users, azafata: Users, camareros: Wine, maquillaje: Palette,
  promotores: Megaphone, catering: UtensilsCrossed, 'grupo-musical': Music,
  animador: PartyPopper, mago: Wand2, humorista: Mic, bailarin: Drama,
  speaker: Presentation, vestuario: Shirt, 'photo-booth': Aperture,
  'wedding-planner': CalendarHeart, 'diseno-grafico': PenTool,
};

// Mismas 6 categorías que la landing y el sidebar del dashboard (Música,
// Camareros & Catering, Imagen & Media, Azafatas & RRPP, Belleza & Estética,
// Entretenimiento) — antes el menú listaba los 17 roles sueltos sin ninguna
// agrupación, difícil de escanear de un vistazo.
const ROLE_GROUPS: { label: string; slugs: string[] }[] = [
  { label: 'Música', slugs: ['dj', 'grupo-musical'] },
  { label: 'Camareros & Catering', slugs: ['staff', 'catering'] },
  { label: 'Imagen & Media', slugs: ['fotografo', 'photo-booth', 'diseno-grafico'] },
  { label: 'Azafatas & RRPP', slugs: ['azafata', 'promotores', 'speaker', 'wedding-planner'] },
  { label: 'Belleza & Estética', slugs: ['maquillaje', 'vestuario'] },
  { label: 'Entretenimiento', slugs: ['animador', 'mago', 'humorista', 'bailarin'] },
];

const LAST_ROLE_KEY = 'xpeak_descubrir_last_role';
// 'todos' = feed mezclado (descubrimiento tipo TikTok "Para ti").
const ALL_SLUG = 'todos';

export default function Descubrir() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role: profileRole } = useProfile();
  const { items: cartItems } = useEventCart();

  // El feed swipe es una experiencia móvil. En desktop se ve mal (foto estirada,
  // gesto no natural) → desktop va a la versión clásica: dashboard si está
  // logueado, directorio si no. El feed queda solo para móvil.
  const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
  useEffect(() => {
    // Esperar a que useAuth hidrate la sesión — si no, un usuario recién
    // logueado (p.ej. tras volver de Google) es tratado como "no logueado"
    // durante el primer render y se le rebota al directorio en vez del dashboard.
    if (isDesktop && !authLoading) navigate(user ? '/dashboard' : '/directorio/dj', { replace: true });
  }, [isDesktop, authLoading, user, navigate]);

  const [activeRole, setActiveRole] = useState<string>(() => {
    try { return localStorage.getItem(LAST_ROLE_KEY) || ALL_SLUG; } catch { return ALL_SLUG; }
  });
  const [profiles, setProfiles] = useState<DirProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadRole = useCallback(async (slug: string) => {
    setLoading(true);
    setProfiles([]);
    try { localStorage.setItem(LAST_ROLE_KEY, slug); } catch { /* noop */ }
    try {
      let data: DirProfile[];
      if (slug === ALL_SLUG) {
        // Feed mezclado: TODAS las categorías, no una lista fija.
        //
        // Antes eran tres slugs escritos a mano ('dj', 'fotografo', 'catering')
        // elegidos por "populares". Medido contra producción: de 17 perfiles
        // con foto solo salían 9 — los 4 grupos musicales, los 2 de maquillaje
        // y los camareros no aparecían NUNCA en "Todos", mientras dos de los
        // tres roles cargados estaban vacíos. Una lista fija de roles envejece
        // en cuanto cambia el inventario, que es justo lo que pasó.
        const slugs = Object.keys(ROLE_CONFIG);
        const lists = await Promise.all(slugs.map(s => fetchDirectorioProfiles(ROLE_CONFIG[s].dbRole, 'Todas').catch(() => [])));

        // Intercalado (uno de cada categoría por ronda) en vez de concatenar.
        // Con .flat() salían agrupados —los 9 DJs seguidos, luego el resto—,
        // así que quien no quiere DJ abandona antes de llegar a nada más. El
        // feed es de descubrimiento: la variedad tiene que verse desde la
        // primera tarjeta.
        const intercalado: DirProfile[] = [];
        const maxLargo = Math.max(0, ...lists.map(l => l.length));
        for (let i = 0; i < maxLargo; i++) {
          for (const lista of lists) if (lista[i]) intercalado.push(lista[i]);
        }
        data = dedupe(intercalado);
      } else {
        data = await fetchDirectorioProfiles(ROLE_CONFIG[slug].dbRole, 'Todas');
      }
      // El swipe es 100% visual — sin foto se ve como pantalla negra/vacía,
      // así que se excluye del feed (no solo se le baja el orden). Recupera
      // su sitio automáticamente en cuanto sube una foto real.
      setProfiles(data.filter(p => !!p.photo_url));
    } catch {
      toast.error('No se pudieron cargar los perfiles. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Entra directo al feed al montar (con el rol recordado o "todos").
  // En desktop no cargamos: se redirige a la versión clásica.
  useEffect(() => { if (!isDesktop) loadRole(activeRole); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function pickRole(slug: string) {
    setMenuOpen(false);
    setActiveRole(slug);
    loadRole(slug);
  }

  const roleLabel = activeRole === ALL_SLUG
    ? 'Para ti'
    : (ALL_ROLES.find(r => r.slug === activeRole)?.label ?? 'Descubrir');

  // En desktop nunca se llega a pintar el feed ni su loader: el useEffect de
  // arriba redirige en cuanto authLoading resuelve, pero mientras tanto (la
  // ventana entre el primer render y esa resolución) antes se veía el loader
  // "Cargando…" de golpe en una página que de todos modos iba a abandonarse
  // — un flash de UI que no aporta nada. null es la salida correcta aquí.
  if (isDesktop) return null;

  return (
    <>
      <Helmet>
        <title>Descubrir profesionales para tu evento — XPEAK</title>
        <meta name="description" content="Desliza y encuentra al profesional perfecto para tu evento en España. DJs, fotógrafos, catering y más." />
        <link rel="canonical" href="https://xpeak.es/descubrir" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {loading ? (
        <div className="fixed inset-0 z-[55] flex flex-col items-center justify-center gap-4" style={{ background: '#090909', color: '#fff' }}>
          <Loader2 size={30} className="animate-spin" style={{ color: '#D4AF37' }} />
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Cargando {roleLabel}…</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="fixed inset-0 z-[55] flex flex-col items-center justify-center gap-4 px-8 text-center" style={{ background: '#090909', color: '#fff' }}>
          <p className="text-base font-black">Por aquí no hay nadie todavía</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Ningún {roleLabel.toLowerCase()} ha llegado aún a esta categoría. ¿Probamos con otra?</p>
          <button onClick={() => setMenuOpen(true)} className="mt-2 px-6 py-3 rounded-xl font-bold text-sm" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Elegir categoría</button>
        </div>
      ) : (
        <ReelsFeed
          profiles={profiles as any}
          onOpenProfile={(p) => { window.location.href = profileUrl(p as DirProfile); }}
          onBookNow={(p) => { window.location.href = profileUrl(p as DirProfile); }}
          onAddToCart={(p) => {
            const prof = p as DirProfile;
            const result = addToCart({ userId: prof.user_id, displayName: prof.display_name, role: prof.role, photoUrl: prof.photo_url, hourlyRate: prof.hourly_rate, zone: prof.zone });
            if (result === 'added') toast.success(`${prof.display_name} añadido a "Mi evento"`);
            else if (result === 'limit_reached') toast.error(`Máximo ${MAX_CART_ITEMS} profesionales por evento. Elimina alguno para añadir más.`);
          }}
          isInCart={(userId) => cartItems.some(i => i.userId === userId)}
          showCartButton={profileRole === 'empresario'}
        />
      )}

      {/* Feed inmersivo: ☰ (categorías + volver a clásica) + un botón "volver"
          directo siempre visible — sin salida evidente el feed daba sensación
          de pantalla "atrapada" (había que abrir el menú primero). */}
      {!loading && (
        <>
          <button onClick={() => navigate(user ? '/dashboard' : '/')} aria-label="Volver"
            className="fixed top-0 left-0 z-[70] m-3 w-11 h-11 rounded-full flex items-center justify-center active:scale-95"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)', marginTop: 'calc(env(safe-area-inset-top) + 0.5rem)' }}>
            <ArrowLeft size={20} color="#fff" />
          </button>
          <button onClick={() => setMenuOpen(true)} aria-label="Menú"
            className="fixed top-0 right-0 z-[70] m-3 w-11 h-11 rounded-full flex items-center justify-center active:scale-95"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)', marginTop: 'calc(env(safe-area-inset-top) + 0.5rem)' }}>
            <Menu size={20} color="#fff" />
          </button>
        </>
      )}

      {menuOpen && (
        <DiscoverMenu
          activeRole={activeRole}
          onPick={pickRole}
          onClose={() => setMenuOpen(false)}
          onClassic={() => navigate(user ? '/dashboard' : '/')}
          isLogged={!!user}
        />
      )}
    </>
  );
}

function dedupe(list: DirProfile[]): DirProfile[] {
  const seen = new Set<string>();
  return list.filter(p => (seen.has(p.user_id) ? false : (seen.add(p.user_id), true)));
}

// ── Menú ☰ del feed: cambiar categoría + volver a versión clásica ─────────
function DiscoverMenu({ activeRole, onPick, onClose, onClassic, isLogged }: {
  activeRole: string;
  onPick: (slug: string) => void;
  onClose: () => void;
  onClassic: () => void;
  isLogged: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div className="absolute top-0 right-0 h-full w-[86%] max-w-sm overflow-y-auto"
        style={{ background: 'linear-gradient(160deg,#0e0d0b,#090909)', borderLeft: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center justify-between px-5 py-4 sticky top-0 z-10" style={{ background: '#0b0a09', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#D4AF37' }}>Explorar</span>
          <button onClick={onClose} aria-label="Cerrar" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <X size={16} color="#fff" />
          </button>
        </div>

        <div className="p-4">
          {/* Para ti (mezclado) — suelto arriba, fuera de cualquier grupo */}
          <button onClick={() => onPick(ALL_SLUG)}
            className="relative overflow-hidden p-4 rounded-2xl text-left transition-all active:scale-[0.97] min-h-[104px] flex flex-col w-full mb-4"
            style={activeRole === ALL_SLUG
              ? { background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.45)' }
              : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))', border: '1px solid rgba(212,175,55,0.2)' }}>
              <Grid3x3 size={20} strokeWidth={2} style={{ color: '#D4AF37' }} />
            </div>
            <p className="text-sm font-black leading-tight mb-auto" style={{ color: '#fff' }}>Para ti</p>
            {activeRole === ALL_SLUG && <p className="text-[0.6rem] font-bold uppercase tracking-wider mt-1" style={{ color: '#D4AF37' }}>Viendo</p>}
          </button>

          {/* Roles agrupados por categoría — mismo naming que landing/dashboard */}
          {ROLE_GROUPS.map(group => {
            const roles = ALL_ROLES.filter(r => group.slugs.includes(r.slug) && ROLE_CONFIG[r.slug]);
            if (roles.length === 0) return null;
            return (
              <div key={group.label} className="mb-4">
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-2 px-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {group.label}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map(r => {
                    const Icon = ROLE_ICON[r.slug] ?? Sparkles;
                    const active = r.slug === activeRole;
                    return (
                      <button key={r.slug} onClick={() => onPick(r.slug)}
                        className="relative overflow-hidden p-4 rounded-2xl text-left transition-all active:scale-[0.97] min-h-[104px] flex flex-col"
                        style={active
                          ? { background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.45)' }
                          : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))', border: '1px solid rgba(212,175,55,0.2)' }}>
                          <Icon size={20} strokeWidth={2} style={{ color: '#D4AF37' }} />
                        </div>
                        <p className="text-sm font-black leading-tight mb-auto" style={{ color: '#fff' }}>{r.label}</p>
                        {active && <p className="text-[0.6rem] font-bold uppercase tracking-wider mt-1" style={{ color: '#D4AF37' }}>Viendo</p>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Volver a versión clásica */}
        <div className="p-4 pt-0">
          <button onClick={onClassic}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
            <LayoutDashboard size={16} /> {isLogged ? 'Volver a versión clásica' : 'Ir al inicio clásico'}
          </button>
        </div>
      </div>
    </div>
  );
}
