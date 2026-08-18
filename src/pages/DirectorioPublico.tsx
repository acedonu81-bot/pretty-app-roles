import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Zap, MapPin, BadgeCheck, ChevronRight, Check, Plus, Users, Play } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import FlashBookingRequestModal from '@/components/dashboard/FlashBookingRequestModal';
import MultiRequestModal from '@/components/MultiRequestModal';
import SwipeDirectory from '@/components/SwipeDirectory';
import FooterPublic from '@/components/FooterPublic';
import { addToCart, useEventCart, MAX_CART_ITEMS } from '@/lib/eventCart';
import { useAuth } from '@/hooks/useAuth';
import GhostProfileCards from '@/components/GhostProfileCards';

// URL de perfil por slug de nombre (la misma que usan sitemap y prerender) en
// vez de UUID — evita dos URLs indexables para el mismo perfil. PublicProfile
// resuelve el slug y redirige al canónico si hiciera falta.
export const profileUrl = (p: { user_id: string; display_name: string | null }) => {
  const slug = (p.display_name ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `/p/${slug || p.user_id}`;
};

export interface DirProfile {
  user_id: string;
  display_name: string;
  role: string;
  specialty: string | null;
  zone: string | null;
  photo_url: string | null;
  hourly_rate: number | null;
  bio: string | null;
  is_flash_active: boolean;
  is_verified: boolean;
  is_seed: boolean;
  score: number;
  fast_responder_count: number;
  avgRating: number;
  reviewCount: number;
  updated_at: string | null;
}

export const ROLE_CONFIG: Record<string, {
  dbRole: string; title: string; subtitle: string;
  seoTitle: string; seoDesc: string; cta: string;
}> = {
  dj: {
    dbRole: 'dj',
    title: 'DJs para eventos en España',
    subtitle: 'Contrata DJs para bodas, comuniones, fiestas privadas y eventos corporativos. Sin intermediarios.',
    seoTitle: 'Contratar DJ para eventos en España — Directorio XPEAK',
    seoDesc: 'Directorio de DJs para bodas, comuniones y eventos en España. Perfiles verificados, precios reales y contacto directo sin comisión.',
    cta: 'Contratar este DJ',
  },
  fotografo: {
    dbRole: 'media',
    title: 'Fotógrafos y videógrafos para eventos',
    subtitle: 'Fotógrafos de bodas, comuniones y eventos en España. Portfolios reales, precios sin sorpresas.',
    seoTitle: 'Contratar fotógrafo para eventos en España — XPEAK',
    seoDesc: 'Directorio de fotógrafos para bodas y eventos en España. Portfolios reales, precios visibles, contacto directo.',
    cta: 'Contratar fotógrafo',
  },
  staff: {
    dbRole: 'staff',
    title: 'Staff y camareros para eventos',
    subtitle: 'Camareros, azafatas y personal de sala para bodas, comuniones y eventos en España.',
    seoTitle: 'Contratar staff para eventos en España — XPEAK',
    seoDesc: 'Directorio de camareros, azafatas y personal de eventos. Perfiles reales, disponibilidad y precios por jornada.',
    cta: 'Contratar para mi evento',
  },
  maquillaje: {
    dbRole: 'makeup',
    title: 'Maquilladoras y peluqueros para bodas y eventos',
    subtitle: 'Maquilladoras, peluqueros y estilistas para novias, comuniones y galas en toda España.',
    seoTitle: 'Contratar maquilladora o peluquero para bodas y eventos — XPEAK',
    seoDesc: 'Directorio de maquilladoras y peluqueros para bodas, comuniones y eventos en España. Portfolios y precios reales.',
    cta: 'Contratar maquilladora o peluquero',
  },
  promotores: {
    dbRole: 'promotor',
    title: 'Promotores y RRPP para eventos',
    subtitle: 'Promotores, relaciones públicas y gestores de lista para clubs y eventos privados.',
    seoTitle: 'Contratar promotores y RRPP para eventos — XPEAK',
    seoDesc: 'Directorio de promotores y RRPP para clubs y eventos en España. Perfiles verificados y contacto directo.',
    cta: 'Contratar promotor',
  },
  camareros: {
    dbRole: 'staff',
    title: 'Camareros para bodas y eventos en España',
    subtitle: 'Camareros profesionales para bodas, comuniones, banquetes y eventos de empresa. Precio por jornada.',
    seoTitle: 'Contratar camareros para bodas y eventos en España — XPEAK',
    seoDesc: 'Directorio de camareros para bodas y eventos en España. Personal de sala verificado, precios visibles y contacto directo.',
    cta: 'Contratar camarero',
  },
  'grupo-musical': {
    dbRole: 'grupo-musical',
    title: 'Grupos musicales para bodas y eventos',
    subtitle: 'Bandas, cuartetos de cuerda, grupos de jazz y música en vivo para cualquier tipo de evento.',
    seoTitle: 'Contratar grupo musical para boda y eventos en España — XPEAK',
    seoDesc: 'Directorio de grupos musicales para bodas y eventos en España. Jazz, clásica, pop, flamenco. Precios reales y contacto directo.',
    cta: 'Contratar grupo musical',
  },
  animador: {
    dbRole: 'animador',
    title: 'Animadores y entertainer para eventos',
    subtitle: 'Animadores infantiles, animadores de adultos y entertainers para bodas, comuniones y eventos de empresa.',
    seoTitle: 'Contratar animador para eventos en España — XPEAK',
    seoDesc: 'Directorio de animadores para bodas, comuniones y fiestas en España. Perfiles verificados, precios reales y contacto directo.',
    cta: 'Contratar animador',
  },
  mago: {
    dbRole: 'mago',
    title: 'Magos para eventos y bodas en España',
    subtitle: 'Magos de close-up, shows de magia escénica y magia para eventos de empresa en toda España.',
    seoTitle: 'Contratar mago para eventos y bodas en España — XPEAK',
    seoDesc: 'Directorio de magos para bodas, comuniones y eventos en España. Magia close-up y shows escénicos. Precios reales.',
    cta: 'Contratar mago',
  },
  'photo-booth': {
    dbRole: 'photo-booth',
    title: 'Photo Booth para bodas y eventos',
    subtitle: 'Cabinas de fotos, photo booth 360 y espejos glamour para bodas, comuniones y eventos de empresa.',
    seoTitle: 'Alquilar Photo Booth para boda y eventos en España — XPEAK',
    seoDesc: 'Directorio de photo booth para bodas y eventos en España. Clásico, 360 y espejo glamour. Precios desde 300€, contacto directo.',
    cta: 'Alquilar photo booth',
  },
  catering: {
    dbRole: 'catering',
    title: 'Catering y chefs para eventos',
    subtitle: 'Catering completo, chefs privados, barra de cócteles y showcooking para bodas y eventos de empresa.',
    seoTitle: 'Contratar catering para bodas y eventos en España — XPEAK',
    seoDesc: 'Directorio de catering y chefs para bodas y eventos en España. Menús por persona, barra libre y showcooking. Precios reales.',
    cta: 'Pedir presupuesto',
  },
  humorista: {
    dbRole: 'humorista',
    title: 'Humoristas y monologuistas para eventos',
    subtitle: 'Cómicos y monologuistas para bodas, cenas de empresa y eventos privados en toda España.',
    seoTitle: 'Contratar humorista para eventos en España — XPEAK',
    seoDesc: 'Directorio de humoristas y monologuistas para bodas y eventos en España. Shows a medida, precios reales y contacto directo.',
    cta: 'Contratar humorista',
  },
  bailarin: {
    dbRole: 'bailarin',
    title: 'Bailarines, compañías de danza e instructores',
    subtitle: 'Shows de baile, coreografías, flamenco y gogós para eventos, e instructores de salsa, bachata y kizomba para clases.',
    seoTitle: 'Contratar bailarines e instructores de baile en España — XPEAK',
    seoDesc: 'Directorio de bailarines, compañías de danza e instructores de salsa y bachata para eventos y clases en España. Flamenco, urbano y coreografías a medida.',
    cta: 'Contratar bailarín',
  },
  speaker: {
    dbRole: 'speaker',
    title: 'Speakers y maestros de ceremonias',
    subtitle: 'Presentadores, maestros de ceremonias y ponentes para bodas, galas, congresos y eventos corporativos.',
    seoTitle: 'Contratar speaker y maestro de ceremonias en España — XPEAK',
    seoDesc: 'Directorio de speakers, presentadores y MCs para bodas y eventos en España. Perfiles verificados y contacto directo.',
    cta: 'Contratar speaker',
  },
  vestuario: {
    dbRole: 'vestuario',
    title: 'Estilistas y vestuario para eventos',
    subtitle: 'Estilistas, personal shoppers y profesionales de vestuario para novias, artistas y producciones.',
    seoTitle: 'Contratar estilista para bodas y eventos en España — XPEAK',
    seoDesc: 'Directorio de estilistas y profesionales de vestuario en España. Novias, artistas y producciones. Contacto directo.',
    cta: 'Contratar estilista',
  },
  'wedding-planner': {
    dbRole: 'event_manager',
    title: 'Wedding planners y encargadas de eventos',
    subtitle: 'Wedding planners y coordinadoras de eventos para bodas, comuniones y celebraciones en toda España.',
    seoTitle: 'Contratar wedding planner para tu boda en España — XPEAK',
    seoDesc: 'Directorio de wedding planners y encargadas de eventos en España. Organización integral de bodas y celebraciones. Precios reales y contacto directo.',
    cta: 'Contratar wedding planner',
  },
  'diseno-grafico': {
    dbRole: 'design',
    title: 'Diseño gráfico y visuales para eventos',
    subtitle: 'Diseñadores gráficos, invitaciones, cartelería y identidad visual para bodas y eventos de empresa.',
    seoTitle: 'Contratar diseño gráfico para bodas y eventos en España — XPEAK',
    seoDesc: 'Directorio de diseñadores gráficos para bodas y eventos en España. Invitaciones, cartelería y visuales a medida. Contacto directo.',
    cta: 'Contratar diseñador',
  },
};

export const ALL_ROLES = [
  { slug: 'dj', label: 'DJs' },
  { slug: 'fotografo', label: 'Fotógrafos' },
  { slug: 'staff', label: 'Staff' },
  { slug: 'camareros', label: 'Camareros' },
  { slug: 'maquillaje', label: 'Maquillaje & Peluquería' },
  { slug: 'promotores', label: 'Promotores' },
  { slug: 'catering', label: 'Catering' },
  { slug: 'grupo-musical', label: 'Grupos' },
  { slug: 'animador', label: 'Animadores' },
  { slug: 'mago', label: 'Magos' },
  { slug: 'humorista', label: 'Humoristas' },
  { slug: 'bailarin', label: 'Bailarines' },
  { slug: 'speaker', label: 'Speakers' },
  { slug: 'vestuario', label: 'Estilistas' },
  { slug: 'photo-booth', label: 'Photo Booth' },
  { slug: 'wedding-planner', label: 'Wedding Planners' },
  { slug: 'diseno-grafico', label: 'Diseño Gráfico' },
];

const CITIES = ['Todas', 'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Ibiza'];

// Sugerencias de categorías relacionadas cuando una queda sin resultados —
// agrupadas por tipo de necesidad, no alfabético, para que la sugerencia tenga sentido real.
const RELATED_ROLES: Record<string, string[]> = {
  mago: ['animador', 'humorista', 'bailarin'],
  animador: ['mago', 'humorista', 'bailarin'],
  humorista: ['mago', 'speaker', 'animador'],
  speaker: ['humorista', 'wedding-planner'],
  bailarin: ['animador', 'grupo-musical', 'dj'],
  'grupo-musical': ['dj', 'bailarin'],
  'photo-booth': ['fotografo', 'diseno-grafico'],
  'diseno-grafico': ['photo-booth', 'fotografo'],
  'wedding-planner': ['speaker', 'catering', 'vestuario'],
  vestuario: ['maquillaje', 'wedding-planner'],
  catering: ['staff', 'wedding-planner'],
  promotores: ['staff', 'dj'],
};
const DEFAULT_RELATED = ['dj', 'fotografo', 'staff'];

const fmt = (n: number | null) => n ? `${n}€/h` : null;

// Solo mostramos "actualizado hace X" si es reciente (últimos 30 días) — un dato
// viejo sería contraproducente, así que se omite en vez de mostrar algo negativo.
function recentUpdateLabel(updatedAt: string | null): string | null {
  if (!updatedAt) return null;
  const diffMs = Date.now() - new Date(updatedAt).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days < 0 || days > 30) return null;
  if (days === 0) {
    const hours = Math.floor(diffMs / 3600000);
    if (hours < 1) return 'Actualizado hace unos minutos';
    return `Actualizado hace ${hours}h`;
  }
  if (days === 1) return 'Actualizado ayer';
  return `Actualizado hace ${days} días`;
}

export async function fetchDirectorioProfiles(dbRole: string, city: string): Promise<DirProfile[]> {
  // 'camarero' es un rol legacy (opción retirada de los selectores) — equivale a staff
  const dbRoles = dbRole === 'staff' ? ['staff', 'camarero'] : [dbRole];
  // Match por el array `roles` (overlaps) O por el `role` singular — algunos
  // perfiles reales tienen roles:[] pero role con valor (p.ej. altas antiguas),
  // y quedaban fuera del feed aunque sí salen en el directorio clásico.
  const orFilter = dbRoles.map(r => `role.eq.${r}`).join(',') + ',' + dbRoles.map(r => `roles.cs.{${r}}`).join(',');
  let q = supabase
    .from('profiles')
    .select('user_id, display_name, role, roles, specialty, zone, photo_url, bio_video_url, hourly_rate, bio, is_flash_active, is_verified, is_seed, is_early_adopter, score, fast_responder_count, audio_embed_url, audio_session_urls, portfolio_urls, updated_at, created_at')
    .or(orFilter)
    .not('display_name', 'is', null)
    .order('score', { ascending: false })
    .limit(60) as any;

  if (city !== 'Todas') q = q.ilike('zone', `%${city}%`);

  const { data, error } = await q;
  if (error) throw error;

  // Filtro anti-spam: registros NUEVOS (a partir de este cambio) con zona
  // genérica "España" — es decir, que no rellenaron una ciudad real — no
  // aparecen en el directorio hasta que la completen. Los perfiles creados
  // antes de este corte se dejan intactos (ya se han revisado a mano).
  const NEW_PROFILE_GATE_SINCE = '2026-08-17T17:53:25.000Z';
  const isGenericZone = (zone: string | null) => !zone?.trim() || zone.trim() === 'España';
  const filtered = (data ?? []).filter((p: any) =>
    !(p.created_at >= NEW_PROFILE_GATE_SINCE && isGenericZone(p.zone))
  );

  const userIds = filtered.map((p: any) => p.user_id);
  const { data: reviewsData } = userIds.length > 0
    ? await supabase.from('reviews').select('reviewed_user_id, rating').eq('approved', true).in('reviewed_user_id', userIds)
    : { data: [] };

  const ratingMap = new Map<string, { sum: number; count: number }>();
  (reviewsData ?? []).forEach((r: any) => {
    if (!r.reviewed_user_id) return;
    const entry = ratingMap.get(r.reviewed_user_id) || { sum: 0, count: 0 };
    entry.sum += r.rating;
    entry.count += 1;
    ratingMap.set(r.reviewed_user_id, entry);
  });
  // Puntuación de perfil completo — los perfiles con media suben (modelo GigSalad:
  // el perfil completo gana visibilidad; incentiva subir sesión/portfolio).
  const completeness = (p: any): number => {
    const hasMedia = !!(p.audio_embed_url?.trim())
      || (Array.isArray(p.audio_session_urls) && p.audio_session_urls.length > 0)
      || (Array.isArray(p.portfolio_urls) && p.portfolio_urls.length > 0);
    return (hasMedia ? 4 : 0) + (p.photo_url ? 2 : 0) + (p.bio?.trim() ? 1 : 0);
  };
  const enriched = filtered.filter((p: any) => p.display_name?.trim().length > 1).map((p: any) => {
    const stats = ratingMap.get(p.user_id);
    return { ...p, avgRating: stats ? Math.round((stats.sum / stats.count) * 10) / 10 : 0, reviewCount: stats?.count ?? 0 };
  });
  enriched.sort((a: any, b: any) =>
    (Number(b.is_early_adopter) - Number(a.is_early_adopter))
    || (Number(b.is_verified) - Number(a.is_verified))
    || (completeness(b) - completeness(a))
    || ((b.score ?? 0) - (a.score ?? 0))
  );
  return enriched;
}

export default function DirectorioPublico() {
  const { rol } = useParams<{ rol: string }>();
  const config = ROLE_CONFIG[rol ?? 'dj'] ?? ROLE_CONFIG.dj;

  const [city, setCity] = useState('Todas');
  const [bookingPro, setBookingPro] = useState<DirProfile | null>(null);
  const [showMultiRequest, setShowMultiRequest] = useState(false);
  const [showSwipe, setShowSwipe] = useState(false);
  const [swipeStartIndex, setSwipeStartIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const { items: cartItems } = useEventCart();
  const { user, loading: authLoading } = useAuth();

  const { data: profiles = [], isLoading: loading, isError: fetchError } = useQuery({
    queryKey: ['directorio-publico', config.dbRole, city],
    queryFn: () => fetchDirectorioProfiles(config.dbRole, city),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });

  const canonical = `https://xpeak.es/directorio/${rol ?? 'dj'}`;
  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Directorio', item: 'https://xpeak.es/directorio' },
      { '@type': 'ListItem', position: 3, name: config.title, item: canonical },
    ],
  };

  const initialFor = (name: string) => name.charAt(0).toUpperCase();

  // Lead centralizado: solo profesionales reales (sin perfiles de ejemplo).
  const realPros = profiles.filter(p => !(p as any).is_seed);

  return (
    <>
      <Helmet>
        <title>{config.seoTitle}</title>
        <meta name="description" content={config.seoDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={config.seoTitle} />
        <meta property="og:description" content={config.seoDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#222' }}>
        {/* Nav */}
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#1a1208' }}>X<span style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PEAK</span></a>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs font-semibold hidden sm:flex items-center gap-1 transition-all hover:opacity-70" style={{ color: '#444' }}>← Inicio</a>
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#444' }}>Blog</a>
            <a href="/auth?role=profesional" className="text-xs font-bold hidden sm:block" style={{ color: '#444' }}>Soy profesional</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Contratar ahora</a>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#7a6216' }}>Directorio · XPEAK</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3" style={{ color: '#111' }}>{config.title}</h1>
            <p className="text-sm leading-relaxed max-w-xl mb-5" style={{ color: '#333' }}>{config.subtitle}</p>

            <div className="flex flex-wrap gap-2.5">
              {realPros.length >= 2 && (
                <button onClick={() => setShowMultiRequest(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.02] active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 6px 20px rgba(212,175,55,0.3)' }}>
                  <Users size={16} /> Pide presupuesto a varios de golpe
                  <span className="text-[0.7rem] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.15)' }}>
                    1 formulario · {realPros.length} respuestas
                  </span>
                </button>
              )}
              {profiles.length >= 2 && (
                <button onClick={() => { setSwipeStartIndex(0); setShowSwipe(true); }}
                  className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.02] active:scale-95"
                  style={{ background: '#111', color: '#fff', border: '1px solid rgba(212,175,55,0.3)' }}>
                  <Play size={14} fill="#D4AF37" color="#D4AF37" /> Vista Swipe
                </button>
              )}
            </div>
          </div>

          {/* Vista Swipe: por defecto en móvil, embebida en el flujo (no
              modal) — sin botón, tal como TikTok. El grid clásico con SEO
              sigue existiendo debajo, oculto visualmente en móvil, visible
              en desktop. */}
          {!fetchError && !loading && profiles.length >= 2 && (
            <div className="sm:hidden -mx-4 mb-6 rounded-2xl overflow-hidden">
              <SwipeDirectory
                embedded
                profiles={profiles}
                onOpenProfile={(p) => { window.location.href = profileUrl(p as DirProfile); }}
                onBookNow={(p) => setBookingPro(p as DirProfile)}
                onAddToCart={(p) => {
                  const prof = p as DirProfile;
                  const result = addToCart({ userId: prof.user_id, displayName: prof.display_name, role: prof.role, photoUrl: prof.photo_url, hourlyRate: prof.hourly_rate, zone: prof.zone });
                  if (result === 'added') toast.success(`${prof.display_name} añadido a "Mi evento"`);
                  else if (result === 'limit_reached') toast.error(`Máximo ${MAX_CART_ITEMS} profesionales por evento. Elimina alguno para añadir más.`);
                }}
                isInCart={(userId) => cartItems.some(i => i.userId === userId)}
              />
            </div>
          )}

          {/* Tabs por rol */}
          <div className="relative mb-6">
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
              {ALL_ROLES.map(r => (
                <a key={r.slug} href={`/directorio/${r.slug}`}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex-shrink-0"
                  style={r.slug === (rol ?? 'dj')
                    ? { background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }
                    : { background: '#ffffff', color: '#222', border: '1px solid rgba(0,0,0,0.12)' }
                  }>{r.label}</a>
              ))}
            </div>
            <div className="sm:hidden pointer-events-none absolute right-0 top-0 bottom-1 w-10 flex items-center justify-end"
              style={{ background: 'linear-gradient(to right, transparent, #FFFFFF 70%)' }}>
              <ChevronRight size={16} style={{ color: '#D4AF37' }} />
            </div>
          </div>

          {/* Filtro ciudad */}
          <div className="relative mb-8">
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
              <span className="text-xs font-bold self-center flex-shrink-0" style={{ color: '#333' }}>Ciudad:</span>
              {CITIES.map(c => (
                <button key={c} onClick={() => setCity(c)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0"
                  style={c === city
                    ? { background: 'rgba(212,175,55,0.12)', color: '#7a6216', border: '1px solid rgba(212,175,55,0.45)' }
                    : { background: '#ffffff', color: '#222', border: '1px solid rgba(0,0,0,0.1)' }
                  }>{c}</button>
              ))}
            </div>
            <div className="sm:hidden pointer-events-none absolute right-0 top-0 bottom-1 w-10 flex items-center justify-end"
              style={{ background: 'linear-gradient(to right, transparent, #FFFFFF 70%)' }}>
              <ChevronRight size={16} style={{ color: '#D4AF37' }} />
            </div>
          </div>

          {/* Grid de perfiles */}
          {fetchError && (
            <div className="p-12 rounded-2xl text-center" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)' }}>
              <p className="text-sm font-bold mb-2">No se pudo cargar el directorio</p>
              <p className="text-xs mb-4" style={{ color: '#444' }}>Comprueba tu conexión y vuelve a intentarlo.</p>
              <button onClick={() => { setCity(city); setFetchError(false); setLoading(true); }}
                className="px-4 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#7a6216', border: '1px solid rgba(212,175,55,0.35)' }}>
                Reintentar
              </button>
            </div>
          )}

          {!fetchError && loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl p-4 animate-pulse" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)' }}>
                  <div className="w-16 h-16 rounded-xl bg-black/5 mx-auto mb-3" />
                  <div className="h-3 bg-black/5 rounded mb-2 w-3/4 mx-auto" />
                  <div className="h-2 bg-black/5 rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          )}

          {!fetchError && !loading && profiles.length === 0 && city !== 'Todas' && (
            <div className="p-12 rounded-2xl text-center" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)' }}>
              <p className="text-sm font-bold mb-2">Sin resultados en {city}</p>
              <p className="text-xs mb-4" style={{ color: '#444' }}>Prueba con otra ciudad o ve al directorio completo.</p>
              <button onClick={() => setCity('Todas')} className="px-4 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#7a6216', border: '1px solid rgba(212,175,55,0.35)' }}>
                Ver todos
              </button>
            </div>
          )}

          {!fetchError && !loading && profiles.length === 0 && city === 'Todas' && (
            <div className="p-12 rounded-2xl text-center" style={{ background: '#ffffff', border: '1px solid rgba(212,175,55,0.3)' }}>
              <p className="text-sm font-black mb-2" style={{ color: '#111' }}>Categoría recién abierta</p>
              <p className="text-xs mb-5 max-w-sm mx-auto" style={{ color: '#444' }}>
                Estamos verificando los primeros perfiles. Si trabajas en este sector, este es el mejor momento: publícate gratis y sal el primero en las búsquedas.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 mb-6">
                <a href={`/auth?mode=register&role=${config.dbRole}`} className="px-5 py-2.5 rounded-xl text-xs font-black"
                  style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                  Publicar mi perfil gratis →
                </a>
              </div>
              {(() => {
                const related = (RELATED_ROLES[rol ?? ''] ?? DEFAULT_RELATED).filter(s => s !== rol);
                return (
                  <div className="pt-5" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <p className="text-[0.7rem] font-bold uppercase tracking-wider mb-3" style={{ color: '#888' }}>
                      Mientras tanto, busca otros profesionales
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {related.map(slug => {
                        const r = ROLE_CONFIG[slug];
                        const label = ALL_ROLES.find(a => a.slug === slug)?.label ?? r?.title ?? slug;
                        if (!r) return null;
                        return (
                          <a key={slug} href={`/directorio/${slug}`} className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                            style={{ background: 'rgba(0,0,0,0.04)', color: '#333', border: '1px solid rgba(0,0,0,0.1)' }}>
                            {label}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {!fetchError && !loading && profiles.length > 0 && (
            <div className={`${profiles.length >= 2 ? 'hidden sm:grid' : 'grid'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
              {profiles.map(p => (
                <div key={p.user_id} className="rounded-2xl overflow-hidden flex flex-col bg-white"
                  style={{
                    border: (p as any).is_early_adopter ? '4px solid rgba(96,165,250,0.7)' : '1px solid rgba(0,0,0,0.12)',
                    boxShadow: (p as any).is_early_adopter ? '0 0 20px rgba(96,165,250,0.2), 0 2px 12px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.1)',
                  }}>

                  {/* Foto — tall on mobile (3:4), wide on desktop (4:3) */}
                  <a href={profileUrl(p)} className="block relative aspect-card-photo overflow-hidden">
                    <div className="absolute inset-0">
                      {p.photo_url && !imgErrors[p.user_id] ? (
                        <img src={p.photo_url} alt={p.display_name} loading="lazy"
                          onError={() => setImgErrors(e => ({ ...e, [p.user_id]: true }))}
                          className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl font-black"
                          style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05))', color: '#D4AF37' }}>
                          {initialFor(p.display_name)}
                        </div>
                      )}
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 45%)' }} />
                    </div>
                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap z-10">
                      {(p as any).is_seed && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[0.65rem] font-black"
                          style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}>
                          Perfil de ejemplo
                        </span>
                      )}
                      {/* Mobile: ONE badge, priority Disponible > Verificado > Pro > Early > Rápida */}
                      <span className="sm:hidden">
                        {p.is_flash_active ? (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[0.65rem] font-black"
                            style={{ background: '#15803d', color: '#fff' }}>
                            <Zap size={10} fill="#fff" /> Disponible
                          </span>
                        ) : p.is_verified ? (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[0.65rem] font-black"
                            style={{ background: 'rgba(212,175,55,0.95)', color: '#000' }}>
                            <BadgeCheck size={10} /> Verificado
                          </span>
                        ) : (p as any).is_early_adopter ? (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[0.65rem] font-black"
                            style={{ background: 'rgba(96,165,250,0.95)', color: '#fff' }}>
                            ⭐ Early
                          </span>
                        ) : null}
                      </span>
                      {/* Desktop: full set */}
                      {p.is_verified && (
                        <span className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-[0.65rem] font-black"
                          style={{ background: 'rgba(212,175,55,0.95)', color: '#000' }}>
                          <BadgeCheck size={10} /> Verificado por XPEAK
                        </span>
                      )}
                      {(p as any).is_early_adopter && (
                        <span className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-[0.65rem] font-black"
                          style={{ background: 'rgba(96,165,250,0.9)', color: '#000' }}>
                          ⭐ Early Adopter
                        </span>
                      )}
                      {p.is_flash_active && (
                        <span className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-[0.65rem] font-black"
                          style={{ background: '#15803d', color: '#fff' }}>
                          <Zap size={10} fill="#fff" /> Disponible ahora
                        </span>
                      )}
                      {(p as any).fast_responder_count >= 1 && (
                        <span className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-[0.65rem] font-black"
                          style={{ background: 'rgba(251,146,60,0.9)', color: '#000' }}>
                          ⚡ Respuesta rápida
                        </span>
                      )}
                    </div>
                    {/* Price overlay — desktop only */}
                    {p.hourly_rate > 0 && (
                      <div className="absolute bottom-2.5 right-2.5 z-10 hidden sm:block">
                        <span className="px-2 py-1 rounded-lg text-xs font-black"
                          style={{ background: 'rgba(255,255,255,0.92)', color: '#1a1208', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
                          desde {p.hourly_rate}€/h
                        </span>
                      </div>
                    )}
                  </a>

                  {/* Info — clean & minimal on mobile */}
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <a href={profileUrl(p)} className="block hover:opacity-70 transition-opacity">
                      <p className="text-sm sm:text-base font-black leading-tight truncate" style={{ color: '#111' }}>{p.display_name}</p>
                      {/* Zone + specialty inline on mobile — single clean line */}
                      <p className="text-xs truncate mt-0.5 sm:hidden" style={{ color: '#717171' }}>
                        {[p.zone?.split(',')[0], p.specialty?.split(/[·+(]/)[0].trim()].filter(Boolean).join(' · ')}
                      </p>
                      {/* Desktop: specialty on its own line */}
                      {p.specialty && (
                        <p className="hidden sm:block text-xs font-semibold mb-1 mt-0.5 truncate" style={{ color: '#7a6216' }}>{p.specialty}</p>
                      )}
                    </a>

                    {/* Price — prominent text on mobile */}
                    {p.hourly_rate > 0 && (
                      <p className="text-sm font-black mt-1 sm:hidden" style={{ color: '#333' }}>desde {p.hourly_rate}€/h</p>
                    )}

                    {/* Rating — only if reviews exist */}
                    {p.reviewCount > 0 && (
                      <div className="flex items-center gap-1.5 mt-1 mb-1">
                        <span className="text-xs font-bold" style={{ color: '#333' }}>★ {p.avgRating}</span>
                        <span className="text-[0.65rem]" style={{ color: '#333' }}>({p.reviewCount})</span>
                      </div>
                    )}
                    {/* "Sin valoraciones" — desktop only */}
                    {p.reviewCount === 0 && (
                      <span className="hidden sm:block text-[0.65rem] mt-1 mb-1" style={{ color: '#444' }}>Sin valoraciones aún</span>
                    )}

                    {/* Zone — separate line on desktop */}
                    {p.zone && (
                      <p className="hidden sm:flex text-xs items-center gap-1 mb-2" style={{ color: '#444' }}>
                        <MapPin size={10} />{p.zone.split(',')[0]}
                      </p>
                    )}

                    {/* Actividad reciente real — solo si hubo cambios en el perfil en los últimos 30 días */}
                    {recentUpdateLabel(p.updated_at) && (
                      <p className="text-[0.65rem] mb-2" style={{ color: '#7a6216' }}>
                        {recentUpdateLabel(p.updated_at)}
                      </p>
                    )}

                    {/* Bio — desktop only */}
                    {p.bio && (
                      <p className="hidden sm:block text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: '#333' }}>
                        "{p.bio.slice(0, 100)}{p.bio.length > 100 ? '…' : ''}"
                      </p>
                    )}

                    {/* CTAs — 1 button on mobile, 2 on desktop */}
                    <div className="mt-auto flex gap-2 pt-2">
                      <a href={profileUrl(p)}
                        className="hidden sm:flex flex-1 text-center justify-center py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-black/5"
                        style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.12)', color: '#333' }}>
                        Ver perfil
                      </a>
                      <button onClick={() => setBookingPro(p)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
                        style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 2px 10px rgba(212,175,55,0.25)' }}>
                        Solicitar presupuesto
                      </button>
                      <button
                        onClick={() => {
                          const result = addToCart({ userId: p.user_id, displayName: p.display_name, role: p.role, photoUrl: p.photo_url, hourlyRate: p.hourly_rate, zone: p.zone });
                          if (result === 'added') toast.success(`${p.display_name} añadido a "Mi evento"`, { description: 'Añade varios profesionales y pide presupuesto conjunto desde el botón dorado de abajo a la derecha.' });
                          else if (result === 'limit_reached') toast.error(`Máximo ${MAX_CART_ITEMS} profesionales por evento. Elimina alguno para añadir más.`);
                        }}
                        disabled={cartItems.some(i => i.userId === p.user_id)}
                        title={cartItems.some(i => i.userId === p.user_id) ? 'Ya está en tu evento' : 'Añadir a "Mi evento"'}
                        className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2.5 rounded-xl transition-all hover:scale-105 disabled:hover:scale-100"
                        style={cartItems.some(i => i.userId === p.user_id)
                          ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }
                          : { background: '#ffffff', border: '1px solid rgba(0,0,0,0.12)', color: '#333' }}>
                        {cartItems.some(i => i.userId === p.user_id) ? <Check size={15} /> : <Plus size={15} />}
                        <span className="hidden sm:inline text-xs font-bold">
                          {cartItems.some(i => i.userId === p.user_id) ? 'Añadido' : 'Añadir'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tarjetas fantasma: solo sin sesión, dan sensación de "hay más
              contenido" para empujar el registro. No son perfiles reales. */}
          {!authLoading && !user && !loading && !fetchError && (
            <GhostProfileCards role={config.dbRole} className="mt-6" />
          )}

          {/* CTA profesional */}
          <div className="mt-16 p-6 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.08),rgba(249,115,22,0.06))', border: '1px solid rgba(212,175,55,0.2)' }}>
            <p className="text-sm font-black mb-1" style={{ color: '#111' }}>¿Eres profesional y quieres aparecer aquí?</p>
            <p className="text-xs mb-4" style={{ color: '#333' }}>
              Crea tu perfil gratis en XPEAK. Los organizadores de tu ciudad te encontrarán y podrán contactarte directamente.
            </p>
            <a href="/auth?role=profesional"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Crear mi perfil gratis <ChevronRight size={14} />
            </a>
          </div>
        </main>

        <FooterPublic />
      </div>

      {bookingPro && (
        <FlashBookingRequestModal
          professionalName={bookingPro.display_name}
          professionalRole={bookingPro.role}
          professionalUserId={bookingPro.user_id}
          onClose={() => setBookingPro(null)}
        />
      )}

      {showMultiRequest && (
        <MultiRequestModal
          categoryLabel={config.title.split(' ')[0]}
          city={city}
          pros={realPros.map(p => ({ user_id: p.user_id, display_name: p.display_name, role: p.role }))}
          onClose={() => setShowMultiRequest(false)}
        />
      )}

      {showSwipe && (
        <SwipeDirectory
          profiles={profiles}
          initialIndex={swipeStartIndex}
          onClose={() => setShowSwipe(false)}
          onOpenProfile={(p) => { window.location.href = profileUrl(p as DirProfile); }}
          onBookNow={(p) => { setShowSwipe(false); setBookingPro(p as DirProfile); }}
          onAddToCart={(p) => {
            const prof = p as DirProfile;
            const result = addToCart({ userId: prof.user_id, displayName: prof.display_name, role: prof.role, photoUrl: prof.photo_url, hourlyRate: prof.hourly_rate, zone: prof.zone });
            if (result === 'added') toast.success(`${prof.display_name} añadido a "Mi evento"`);
            else if (result === 'limit_reached') toast.error(`Máximo ${MAX_CART_ITEMS} profesionales por evento. Elimina alguno para añadir más.`);
          }}
          isInCart={(userId) => cartItems.some(i => i.userId === userId)}
        />
      )}
    </>
  );
}
