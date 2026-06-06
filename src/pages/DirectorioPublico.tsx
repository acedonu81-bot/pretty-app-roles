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
  const [city, setCity] = useState('Todas');
  const [bookingPro, setBookingPro] = useState<DirProfile | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLoading(true);
    setProfiles([]);
    let q = supabase
      .from('profiles')
      .select('user_id, display_name, role, specialty, zone, photo_url, hourly_rate, bio, is_flash_active, is_verified, score')
      .eq('role', config.dbRole)
      .not('display_name', 'is', null)
      .order('is_verified', { ascending: false })
      .order('score', { ascending: false })
      .limit(60) as any;

    if (city !== 'Todas') q = q.ilike('zone', `%${city}%`);

    q.then(({ data }: any) => {
      setProfiles((data ?? []).filter((p: any) => p.display_name?.trim().length > 1));
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

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        {/* Nav */}
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Blog</a>
            <a href="/auth?role=profesional" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Soy profesional</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Contratar ahora</a>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#D4AF37' }}>Directorio · XPEAK</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3">{config.title}</h1>
            <p className="text-sm leading-relaxed max-w-xl" style={{ color: '#8E8EA0' }}>{config.subtitle}</p>
          </div>

          {/* Tabs por rol */}
          <div className="flex flex-wrap gap-2 mb-6">
            {ALL_ROLES.map(r => (
              <a key={r.slug} href={`/directorio/${r.slug}`}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={r.slug === (rol ?? 'dj')
                  ? { background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
                }>{r.label}</a>
            ))}
          </div>

          {/* Filtro ciudad */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="text-xs font-bold self-center" style={{ color: 'rgba(255,255,255,0.3)' }}>Ciudad:</span>
            {CITIES.map(c => (
              <button key={c} onClick={() => setCity(c)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={c === city
                  ? { background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }
                  : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.06)' }
                }>{c}</button>
            ))}
            <span className="text-xs self-center ml-auto" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {profiles.length} profesional{profiles.length !== 1 ? 'es' : ''}
            </span>
          </div>

          {/* Grid de perfiles */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl p-4 animate-pulse" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-16 h-16 rounded-xl bg-white/5 mx-auto mb-3" />
                  <div className="h-3 bg-white/5 rounded mb-2 w-3/4 mx-auto" />
                  <div className="h-2 bg-white/5 rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          )}

          {!loading && profiles.length === 0 && (
            <div className="p-12 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-sm font-bold mb-2">Sin resultados en {city}</p>
              <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>Prueba con otra ciudad o ve al directorio completo.</p>
              <button onClick={() => setCity('Todas')} className="px-4 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                Ver todos
              </button>
            </div>
          )}

          {!loading && profiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {profiles.map(p => (
                <div key={p.user_id} className="rounded-2xl overflow-hidden flex flex-col"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {/* Foto */}
                  <a href={`/p/${p.user_id}`} className="block relative">
                    {p.photo_url && !imgErrors[p.user_id] ? (
                      <img src={p.photo_url} alt={p.display_name}
                        onError={() => setImgErrors(e => ({ ...e, [p.user_id]: true }))}
                        className="w-full aspect-square object-cover" />
                    ) : (
                      <div className="w-full aspect-square flex items-center justify-center text-4xl font-black"
                        style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.12),rgba(0,0,0,0.4))', color: '#D4AF37' }}>
                        {initialFor(p.display_name)}
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                      {p.is_verified && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold"
                          style={{ background: 'rgba(212,175,55,0.9)', color: '#000' }}>
                          <BadgeCheck size={9} /> Pro
                        </span>
                      )}
                      {p.is_flash_active && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold"
                          style={{ background: 'rgba(34,197,94,0.9)', color: '#000' }}>
                          <Zap size={9} /> Disponible
                        </span>
                      )}
                    </div>
                  </a>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    <a href={`/p/${p.user_id}`} className="block mb-1 hover:opacity-80 transition-opacity">
                      <p className="text-sm font-black leading-tight truncate">{p.display_name}</p>
                      {p.specialty && (
                        <p className="text-[0.7rem] truncate" style={{ color: '#D4AF37' }}>{p.specialty}</p>
                      )}
                    </a>
                    {p.zone && (
                      <p className="text-[0.65rem] flex items-center gap-1 mb-2" style={{ color: '#8E8EA0' }}>
                        <MapPin size={9} />{p.zone.split(',')[0]}
                      </p>
                    )}
                    {fmt(p.hourly_rate) && (
                      <p className="text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        desde {fmt(p.hourly_rate)}
                      </p>
                    )}
                    <div className="mt-auto flex gap-1.5">
                      <a href={`/p/${p.user_id}`}
                        className="flex-1 text-center py-1.5 rounded-lg text-[0.65rem] font-bold transition-all hover:opacity-80"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                        Ver perfil
                      </a>
                      <button onClick={() => setBookingPro(p)}
                        className="flex-1 py-1.5 rounded-lg text-[0.65rem] font-black transition-all hover:scale-105"
                        style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                        Contratar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA registrarse como profesional */}
          <div className="mt-16 p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
            <p className="text-sm font-black mb-1">¿Eres profesional y quieres aparecer aquí?</p>
            <p className="text-xs mb-4" style={{ color: '#8E8EA0' }}>
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
