import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, MapPin, BadgeCheck, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import FlashBookingRequestModal from '@/components/dashboard/FlashBookingRequestModal';
import FooterPublic from '@/components/FooterPublic';

interface DirProfile {
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
  score: number;
  fast_responder_count: number;
  avgRating: number;
  reviewCount: number;
}

const ROLE_CONFIG: Record<string, {
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
    title: 'Maquilladoras para bodas y eventos',
    subtitle: 'Maquilladoras y estilistas para novias, comuniones y galas en toda España.',
    seoTitle: 'Contratar maquilladora para bodas y eventos — XPEAK',
    seoDesc: 'Directorio de maquilladoras para bodas, comuniones y eventos en España. Portfolios y precios reales.',
    cta: 'Contratar maquilladora',
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
};

const ALL_ROLES = [
  { slug: 'dj', label: 'DJs' },
  { slug: 'fotografo', label: 'Fotógrafos' },
  { slug: 'staff', label: 'Staff' },
  { slug: 'maquillaje', label: 'Maquillaje' },
  { slug: 'promotores', label: 'Promotores' },
];

const CITIES = ['Todas', 'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Ibiza'];

const fmt = (n: number | null) => n ? `${n}€/h` : null;

export default function DirectorioPublico() {
  const { rol } = useParams<{ rol: string }>();
  const config = ROLE_CONFIG[rol ?? 'dj'] ?? ROLE_CONFIG.dj;

  const [profiles, setProfiles] = useState<DirProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [city, setCity] = useState('Todas');
  const [bookingPro, setBookingPro] = useState<DirProfile | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLoading(true);
    setProfiles([]);
    setFetchError(false);
    let q = supabase
      .from('profiles')
      .select('user_id, display_name, role, specialty, zone, photo_url, hourly_rate, bio, is_flash_active, is_verified, is_early_adopter, score, fast_responder_count')
      .eq('role', config.dbRole)
      .not('display_name', 'is', null)
      .order('is_early_adopter', { ascending: false })
      .order('is_verified', { ascending: false })
      .order('score', { ascending: false })
      .limit(60) as any;

    if (city !== 'Todas') q = q.ilike('zone', `%${city}%`);

    const reviewsQ = supabase.from('reviews').select('reviewed_user_id, rating').eq('approved', true);

    Promise.all([q, reviewsQ]).then(([{ data, error }, { data: reviewsData }]: any) => {
      if (error) {
        setFetchError(true);
      } else {
        const ratingMap = new Map<string, { sum: number; count: number }>();
        (reviewsData ?? []).forEach((r: any) => {
          if (!r.reviewed_user_id) return;
          const entry = ratingMap.get(r.reviewed_user_id) || { sum: 0, count: 0 };
          entry.sum += r.rating;
          entry.count += 1;
          ratingMap.set(r.reviewed_user_id, entry);
        });
        setProfiles((data ?? []).filter((p: any) => p.display_name?.trim().length > 1).map((p: any) => {
          const stats = ratingMap.get(p.user_id);
          return { ...p, avgRating: stats ? Math.round((stats.sum / stats.count) * 10) / 10 : 0, reviewCount: stats?.count ?? 0 };
        }));
      }
      setLoading(false);
    });
  }, [config.dbRole, city]);

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
            <p className="text-sm leading-relaxed max-w-xl" style={{ color: '#333' }}>{config.subtitle}</p>
          </div>

          {/* Tabs por rol */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 pb-1">
            {ALL_ROLES.map(r => (
              <a key={r.slug} href={`/directorio/${r.slug}`}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex-shrink-0"
                style={r.slug === (rol ?? 'dj')
                  ? { background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }
                  : { background: '#ffffff', color: '#222', border: '1px solid rgba(0,0,0,0.12)' }
                }>{r.label}</a>
            ))}
          </div>

          {/* Filtro ciudad */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 pb-1">
            <span className="text-xs font-bold self-center flex-shrink-0" style={{ color: '#333' }}>Ciudad:</span>
            {CITIES.map(c => (
              <button key={c} onClick={() => setCity(c)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0"
                style={c === city
                  ? { background: 'rgba(212,175,55,0.12)', color: '#7a6216', border: '1px solid rgba(212,175,55,0.45)' }
                  : { background: '#ffffff', color: '#222', border: '1px solid rgba(0,0,0,0.1)' }
                }>{c}</button>
            ))}
            <span className="text-xs self-center ml-auto" style={{ color: '#333' }}>
              {profiles.length} profesional{profiles.length !== 1 ? 'es' : ''}
            </span>
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

          {!fetchError && !loading && profiles.length === 0 && (
            <div className="p-12 rounded-2xl text-center" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)' }}>
              <p className="text-sm font-bold mb-2">Sin resultados en {city}</p>
              <p className="text-xs mb-4" style={{ color: '#444' }}>Prueba con otra ciudad o ve al directorio completo.</p>
              <button onClick={() => setCity('Todas')} className="px-4 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#7a6216', border: '1px solid rgba(212,175,55,0.35)' }}>
                Ver todos
              </button>
            </div>
          )}

          {!fetchError && !loading && profiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map(p => (
                <div key={p.user_id} className="rounded-2xl overflow-hidden flex flex-col bg-white"
                  style={{
                    border: (p as any).is_early_adopter ? '2px solid rgba(96,165,250,0.7)' : '1px solid rgba(0,0,0,0.12)',
                    boxShadow: (p as any).is_early_adopter ? '0 0 20px rgba(96,165,250,0.2), 0 2px 12px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.1)',
                  }}>

                  {/* Foto — tall on mobile (3:4), wide on desktop (4:3) */}
                  <a href={`/p/${p.user_id}`} className="block relative aspect-card-photo overflow-hidden">
                    <div className="absolute inset-0">
                      {p.photo_url && !imgErrors[p.user_id] ? (
                        <img src={p.photo_url} alt={p.display_name}
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
                      {/* Mobile: ONE badge, priority Disponible > Pro > Early > Rápida */}
                      <span className="sm:hidden">
                        {p.is_flash_active ? (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[0.65rem] font-black"
                            style={{ background: '#15803d', color: '#fff' }}>
                            <Zap size={10} fill="#fff" /> Disponible
                          </span>
                        ) : p.is_verified ? (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[0.65rem] font-black"
                            style={{ background: '#D4AF37', color: '#000' }}>
                            <BadgeCheck size={10} /> Pro
                          </span>
                        ) : (p as any).is_early_adopter ? (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[0.65rem] font-black"
                            style={{ background: 'rgba(96,165,250,0.95)', color: '#fff' }}>
                            ⭐ Early
                          </span>
                        ) : null}
                      </span>
                      {/* Desktop: full set */}
                      {(p as any).is_early_adopter && (
                        <span className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-[0.65rem] font-black"
                          style={{ background: 'rgba(96,165,250,0.9)', color: '#000' }}>
                          ⭐ Early Adopter
                        </span>
                      )}
                      {p.is_verified && (
                        <span className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-[0.65rem] font-black"
                          style={{ background: '#D4AF37', color: '#000' }}>
                          <BadgeCheck size={10} /> Pro verificado
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
                    <a href={`/p/${p.user_id}`} className="block hover:opacity-70 transition-opacity">
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

                    {/* Bio — desktop only */}
                    {p.bio && (
                      <p className="hidden sm:block text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: '#333' }}>
                        "{p.bio.slice(0, 100)}{p.bio.length > 100 ? '…' : ''}"
                      </p>
                    )}

                    {/* CTAs — 1 button on mobile, 2 on desktop */}
                    <div className="mt-auto flex gap-2 pt-2">
                      <a href={`/p/${p.user_id}`}
                        className="hidden sm:flex flex-1 text-center justify-center py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-black/5"
                        style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.12)', color: '#333' }}>
                        Ver perfil
                      </a>
                      <button onClick={() => setBookingPro(p)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
                        style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 2px 10px rgba(212,175,55,0.25)' }}>
                        Solicitar presupuesto
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
    </>
  );
}
