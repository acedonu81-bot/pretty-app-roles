import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft, Sparkles, Loader2, Menu, ChevronUp, X,
  Disc3, Camera, Users, Wine, Palette, Megaphone, UtensilsCrossed,
  Music, PartyPopper, Wand2, Mic, Drama, Presentation, Shirt,
  Aperture, CalendarHeart, PenTool, type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import FooterPublic from '@/components/FooterPublic';
import ReelsFeed from '@/components/ReelsFeed';
import { addToCart, useEventCart } from '@/lib/eventCart';
import {
  ALL_ROLES,
  ROLE_CONFIG,
  fetchDirectorioProfiles,
  profileUrl,
  type DirProfile,
} from '@/pages/DirectorioPublico';

/**
 * /descubrir — experiencia tipo Tinder. Pantalla dedicada (no toca home ni
 * dashboard ni /directorio → SEO intacto). Dos estados:
 *   1) Portada de roles (los mismos que el directorio).
 *   2) Al tocar un rol → swipe FULLSCREEN de ese rol (SwipeDirectory sin
 *      `embedded` ya se renderiza a pantalla completa).
 * Reutiliza el fetch, la config de roles y el carrito "Mi evento" existentes.
 */
// Icono distintivo por rol — para que la portada sea escaneable de un vistazo
// (no todas las tarjetas iguales). Slugs = ALL_ROLES.
const ROLE_ICON: Record<string, LucideIcon> = {
  dj: Disc3,
  fotografo: Camera,
  staff: Users,
  camareros: Wine,
  maquillaje: Palette,
  promotores: Megaphone,
  catering: UtensilsCrossed,
  'grupo-musical': Music,
  animador: PartyPopper,
  mago: Wand2,
  humorista: Mic,
  bailarin: Drama,
  speaker: Presentation,
  vestuario: Shirt,
  'photo-booth': Aperture,
  'wedding-planner': CalendarHeart,
  'diseno-grafico': PenTool,
};

export default function Descubrir() {
  const { items: cartItems } = useEventCart();
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<DirProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function openRole(slug: string) {
    const cfg = ROLE_CONFIG[slug];
    if (!cfg) return;
    setActiveRole(slug);
    setLoading(true);
    setProfiles([]);
    try {
      const data = await fetchDirectorioProfiles(cfg.dbRole, 'Todas');
      setProfiles(data);
    } catch {
      toast.error('No se pudieron cargar los profesionales. Inténtalo de nuevo.');
      setActiveRole(null);
    } finally {
      setLoading(false);
    }
  }

  function backToRoles() {
    setActiveRole(null);
    setProfiles([]);
  }

  const activeCfg = activeRole ? ROLE_CONFIG[activeRole] : null;

  // ── Estado 2: swipe fullscreen del rol activo ──────────────────────────
  if (activeRole && activeCfg) {
    if (loading) {
      return (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4" style={{ background: '#090909', color: '#fff' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: '#D4AF37' }} />
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Cargando {ALL_ROLES.find(r => r.slug === activeRole)?.label ?? ''}…</p>
          <button onClick={backToRoles} className="text-xs font-bold underline" style={{ color: 'rgba(255,255,255,0.4)' }}>Volver</button>
        </div>
      );
    }
    if (profiles.length === 0) {
      return (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 px-8 text-center" style={{ background: '#090909', color: '#fff' }}>
          <p className="text-base font-black">Aún no hay {ALL_ROLES.find(r => r.slug === activeRole)?.label ?? 'profesionales'} disponibles</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Estamos creciendo. Prueba con otro rol.</p>
          <button onClick={backToRoles} className="mt-2 px-6 py-3 rounded-xl font-bold text-sm" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver otros roles</button>
        </div>
      );
    }
    return (
      <>
        <ReelsFeed
          profiles={profiles as any}
          onOpenProfile={(p) => { window.location.href = profileUrl(p as DirProfile); }}
          onBookNow={(p) => { window.location.href = profileUrl(p as DirProfile); }}
          onAddToCart={(p) => {
            const prof = p as DirProfile;
            if (cartItems.some(i => i.userId === prof.user_id)) return;
            addToCart({ userId: prof.user_id, displayName: prof.display_name, role: prof.role, photoUrl: prof.photo_url, hourlyRate: prof.hourly_rate, zone: prof.zone });
            toast.success(`${prof.display_name} añadido a "Mi evento"`);
          }}
          isInCart={(userId) => cartItems.some(i => i.userId === userId)}
        />

        {/* Barra superior sobre el feed: volver + rol activo + menú ☰ */}
        <div className="fixed top-0 left-0 right-0 z-[70] flex items-center justify-between px-4 py-3"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)' }}>
          <button onClick={backToRoles} aria-label="Volver a roles"
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <span className="px-3 py-1.5 rounded-full text-xs font-black" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', color: '#D4AF37' }}>
            {ALL_ROLES.find(r => r.slug === activeRole)?.label}
          </span>
          <button onClick={() => setMenuOpen(true)} aria-label="Cambiar rol"
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
            <Menu size={18} color="#fff" />
          </button>
        </div>

        {/* Hint de scroll (solo primeros segundos, discreto) */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[65] flex flex-col items-center gap-1 pointer-events-none animate-pulse">
          <ChevronUp size={20} color="rgba(255,255,255,0.6)" />
          <span className="text-[0.65rem] font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>Desliza para más</span>
        </div>

        {menuOpen && (
          <RoleMenu
            activeRole={activeRole}
            onPick={(slug) => { setMenuOpen(false); openRole(slug); }}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </>
    );
  }

  // ── Estado 1: portada de roles ─────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>Descubrir profesionales para tu evento — XPEAK</title>
        <meta name="description" content="Descubre DJs, fotógrafos, catering y más deslizando como en una app. Elige un rol y encuentra al profesional perfecto para tu evento en España." />
        <link rel="canonical" href="https://xpeak.es/descubrir" />
        <meta property="og:title" content="Descubrir profesionales para tu evento — XPEAK" />
        <meta property="og:description" content="Elige un rol y desliza para encontrar al profesional perfecto para tu evento." />
        <meta property="og:url" content="https://xpeak.es/descubrir" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="flex items-center gap-2 text-xs font-bold transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <ArrowLeft size={15} /> Inicio
          </a>
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
        </nav>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={16} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Descubrir</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3 leading-tight">¿Qué profesional buscas?</h1>
          <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Elige un rol y desliza para encontrar al profesional perfecto para tu evento. Como en tu app favorita.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {ALL_ROLES.filter(r => ROLE_CONFIG[r.slug]).map(r => {
              const Icon = ROLE_ICON[r.slug] ?? Sparkles;
              return (
                <button
                  key={r.slug}
                  onClick={() => openRole(r.slug)}
                  className="group relative overflow-hidden p-5 sm:p-6 rounded-2xl text-left transition-all hover:scale-[1.03] active:scale-[0.98] min-h-[132px] flex flex-col"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {/* Halo dorado que aparece al pasar por encima */}
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.18), transparent 70%)' }} />
                  <div className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <Icon size={22} strokeWidth={2} style={{ color: '#D4AF37' }} />
                  </div>
                  <p className="relative text-base font-black mb-auto leading-tight">{r.label}</p>
                  <p className="relative text-xs font-bold mt-2 flex items-center gap-1 transition-colors" style={{ color: 'rgba(212,175,55,0.55)' }}>
                    Deslizar <span className="transition-transform group-hover:translate-x-1">→</span>
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <FooterPublic />
      </div>
    </>
  );
}

// ── Menú ☰ del feed: selector de rol vistoso (panel lateral) ──────────────
function RoleMenu({ activeRole, onPick, onClose }: {
  activeRole: string | null;
  onPick: (slug: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      {/* Panel */}
      <div className="absolute top-0 right-0 h-full w-[86%] max-w-sm overflow-y-auto"
        style={{ background: 'linear-gradient(160deg,#0e0d0b,#090909)', borderLeft: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center justify-between px-5 py-4 sticky top-0" style={{ background: '#0b0a09', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#D4AF37' }}>Cambiar categoría</span>
          <button onClick={onClose} aria-label="Cerrar" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <X size={16} color="#fff" />
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {ALL_ROLES.filter(r => ROLE_CONFIG[r.slug]).map(r => {
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
                <p className="text-sm font-black leading-tight mb-auto">{r.label}</p>
                {active && <p className="text-[0.6rem] font-bold uppercase tracking-wider mt-1" style={{ color: '#D4AF37' }}>Viendo ahora</p>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
