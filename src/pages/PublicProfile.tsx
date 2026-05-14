import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, MapPin, Clock, ArrowLeft, Zap, MessageCircle, BadgeCheck, Headphones, BookOpen } from 'lucide-react';
import { parseStreamUrl } from '@/lib/streaming';
import { profiles, toSlug } from '@/data/profiles';
import GeometricAvatar from '@/components/dashboard/GeometricAvatar';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';


const BASE_URL = 'https://xpeak.es';

// UUID v4 pattern
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface SupabaseProfile {
  user_id: string;
  display_name: string;
  role: string;
  specialty: string | null;
  zone: string | null;
  bio: string | null;
  photo_url: string | null;
  hourly_rate: number | null;
  genres: string[] | null;
  is_live: boolean;
  is_verified: boolean;
  is_flash_active: boolean;
  subscription_tier: string;
  stream_url: string | null;
  instagram: string | null;
  audio_embed_url: string | null;
  portfolio_urls: string[] | null;
}

interface RelatedProfile {
  user_id: string;
  display_name: string;
  role: string;
  specialty: string | null;
  zone: string | null;
}

const PublicProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [sbProfile, setSbProfile] = useState<SupabaseProfile | null>(null);
  const [related, setRelated] = useState<RelatedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [publicPosts, setPublicPosts] = useState<{ id: string; content: string; post_type: string; created_at: string; media_url: string | null }[]>([]);

  const isUUID = UUID_RE.test(slug ?? '');

  // Load from Supabase — UUID lookup for real users, slug fallback for legacy/demo
  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    setLoading(true);

    const query = isUUID
      ? supabase.from('profiles')
          .select('user_id, display_name, role, specialty, zone, bio, photo_url, hourly_rate, genres, is_live, is_verified, is_flash_active, subscription_tier, stream_url, instagram, audio_embed_url, portfolio_urls')
          .eq('user_id', slug)
          .maybeSingle()
      : supabase.from('profiles')
          .select('user_id, display_name, role, specialty, zone, bio, photo_url, hourly_rate, genres, is_live, is_verified, is_flash_active, subscription_tier, stream_url, instagram, audio_embed_url, portfolio_urls')
          .ilike('display_name', slug.replace(/-/g, '%'))
          .limit(20)
          .then(({ data, error }) => {
            // Try to match slug against normalized display_name
            const match = (data ?? []).find(p =>
              p.display_name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '') === slug
            );
            return { data: match ?? null, error };
          });

    (query as Promise<{ data: SupabaseProfile | null; error: unknown }>)
      .then(({ data }) => {
        setSbProfile(data ?? null);
        if (data?.user_id) {
          // Track profile view — increment score column
          supabase.from('profiles').select('score').eq('user_id', data.user_id).maybeSingle()
            .then(({ data: s }) => {
              const current = (s?.score as number) ?? 0;
              supabase.from('profiles').update({ score: current + 1 } as any).eq('user_id', data.user_id).then(() => {});
            });
          // Load related profiles
          supabase
            .from('profiles')
            .select('user_id, display_name, role, specialty, zone')
            .eq('role', data.role)
            .neq('user_id', data.user_id)
            .limit(3)
            .then(({ data: rel }) => setRelated(rel ?? []));
          // Load public micro-blog posts (fan_tier IS NULL = public)
          supabase
            .from('profile_posts' as any)
            .select('id, content, post_type, created_at, media_url')
            .eq('user_id', data.user_id)
            .is('fan_tier', null)
            .order('created_at', { ascending: false })
            .limit(8)
            .then(({ data: posts }) => setPublicPosts((posts ?? []) as any));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, isUUID]);

  // Static profile fallback (demo profiles via name slug)
  const staticProfile = !isUUID
    ? profiles.find(p => toSlug(p.name) === slug || String(p.id) === slug)
    : null;

  // Loading state (only for UUID profiles)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#090909' }}>
        <p className="text-white/30 text-sm animate-pulse">Cargando perfil…</p>
      </div>
    );
  }

  // Not found in either source
  if (!sbProfile && !staticProfile) {
    return (
      <>
        <Helmet>
          <title>Perfil no encontrado | XPEAK</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#090909' }}>
          <p className="text-white/50">Perfil no encontrado</p>
          <button onClick={() => navigate('/')} className="text-sm font-bold" style={{ color: '#D4AF37' }}>
            ← Volver a XPEAK
          </button>
        </div>
      </>
    );
  }

  // Normalize to common shape regardless of source
  const profile = sbProfile ? {
    name: sbProfile.display_name || 'Sin nombre',
    role: sbProfile.role,
    specialty: sbProfile.specialty ?? '',
    zone: sbProfile.zone ?? 'España',
    location: sbProfile.zone ?? 'España',
    description: sbProfile.bio ?? '',
    photo: sbProfile.photo_url ?? '',
    audioUrl: sbProfile.audio_embed_url ?? '',
    badges: sbProfile.genres ?? [],
    rating: 0,
    reviews: 0,
    experience: '',
    price: sbProfile.hourly_rate ?? 0,
    isLive: sbProfile.is_live,
    isVerified: sbProfile.is_verified,
    isFlashActive: sbProfile.is_flash_active,
    isPremium: sbProfile.subscription_tier !== 'free',
    subscriptionTier: sbProfile.subscription_tier,
    id: 0,
  } : staticProfile!;

  const profileSlug = isUUID ? slug! : toSlug(staticProfile!.name);
  const profileUrl = `${BASE_URL}/p/${profileSlug}`;
  const pageTitle = `${profile.name} — ${profile.specialty} | XPEAK`;
  const pageDesc = `${profile.name}, ${profile.specialty} en ${profile.zone}. ${profile.description || 'Profesional del sector del ocio nocturno.'} Contacta directamente en XPEAK.`;
  const ogImage = profile.photo && profile.photo.trim().length > 5
    ? profile.photo
    : `${BASE_URL}/og-image.jpg`;

  const roleLabel: Record<string, string> = {
    dj: 'DJ & Artista', staff: 'Staff & Promoción', event_manager: 'Encargada de Eventos',
    makeup: 'Belleza & Estética', media: 'Imagen & Media', design: 'Diseño & Visuales',
    promotor: 'Promotor', ambassador: 'Embajador',
  };

  // Related profiles: Supabase results for UUID, static data for demo
  const relatedProfiles = isUUID
    ? related.map(r => ({
        key: r.user_id,
        name: r.display_name,
        role: r.role,
        specialty: r.specialty ?? '',
        zone: r.zone ?? '',
        href: `/p/${r.user_id}`,
        rating: 0,
        id: r.user_id,
      }))
    : profiles
        .filter(p => p.role === profile.role && p.id !== (staticProfile?.id ?? -1))
        .slice(0, 3)
        .map(p => ({ key: String(p.id), name: p.name, role: p.role, specialty: p.specialty, zone: p.zone ?? '', href: `/p/${toSlug(p.name)}`, rating: p.rating, id: p.id }));

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={profileUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={profileUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="XPEAK" />
        <meta property="og:locale" content="es_ES" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImage} />

        {/* JSON-LD Person */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": profile.name,
          "jobTitle": profile.specialty,
          "description": profile.description,
          "url": profileUrl,
          "image": ogImage,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": profile.zone,
            "addressCountry": "ES"
          },
          "worksFor": {
            "@type": "Organization",
            "name": "XPEAK",
            "url": BASE_URL
          }
        })}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        {/* Nav */}
        <nav className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
          style={{ background: 'rgba(9,9,9,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-semibold transition-all hover:opacity-80"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            <ArrowLeft size={16} /> XPEAK
          </button>
          <button onClick={() => navigate('/auth')}
            className="text-xs font-bold px-4 py-2 rounded-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
            Unirse a XPEAK
          </button>
        </nav>

        <div className="max-w-lg mx-auto px-4 py-10">
          {/* Hero */}
          <div className="flex flex-col items-center text-center mb-8">
            {profile.photo && profile.photo.trim().length > 5 ? (
              <div className="relative w-20 h-20 flex-shrink-0">
                <img src={profile.photo} alt={profile.name}
                  className="w-20 h-20 rounded-2xl object-cover"
                  style={{ border: '2px solid rgba(212,175,55,0.25)' }} />
                {profile.isLive && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#22c55e' }} />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-[#090909]" style={{ background: '#22c55e' }} />
                  </span>
                )}
              </div>
            ) : (
              <GeometricAvatar role={profile.role as any} seed={profile.id} size={80} isLive={profile.isLive} />
            )}
            <div className="mt-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                {(profile as any).isVerified && (
                  <BadgeCheck size={18} style={{ color: '#D4AF37', flexShrink: 0 }} />
                )}
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#D4AF37' }}>{roleLabel[profile.role] ?? profile.role}</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{profile.specialty}</p>
            </div>
          </div>

          {/* Stats */}
          {(profile.rating > 0 || profile.reviews > 0 || profile.experience) && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Valoración', value: profile.rating > 0 ? profile.rating.toFixed(1) : '—' },
                { label: 'Reseñas', value: profile.reviews > 0 ? profile.reviews : '—' },
                { label: 'Experiencia', value: profile.experience || '—' },
              ].map(s => (
                <div key={s.label} className="text-center p-3 rounded-xl"
                  style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
                  <p className="text-lg font-black" style={{ color: '#D4AF37' }}>{s.value}</p>
                  <p className="text-xs text-white/40 uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Info */}
          <div className="glass-panel p-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
            <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <MapPin size={12} /> {profile.zone}
              {profile.experience && <><span className="mx-1">·</span><Clock size={12} /> {profile.experience}</>}
              {profile.isFlashActive && (
                <><span className="mx-1">·</span>
                <Zap size={12} style={{ color: '#22c55e' }} />
                <span style={{ color: '#22c55e' }}>Disponible ahora</span></>
              )}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{profile.description}</p>
          </div>

          {/* Badges */}
          {profile.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {profile.badges.map(b => (
                <span key={b} className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
                  {b}
                </span>
              ))}
            </div>
          )}

          {/* Audio player */}
          {(profile as any).audioUrl && (() => {
            const parsed = parseStreamUrl((profile as any).audioUrl);
            if (!parsed) return null;
            return (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Headphones size={13} style={{ color: '#D4AF37' }} />
                  <span className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: 'rgba(212,175,55,0.7)' }}>Mix / Sesión</span>
                </div>
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.12)' }}>
                  <iframe
                    src={parsed.embedUrl}
                    width="100%"
                    height={parsed.type === 'soundcloud' ? '166' : '120'}
                    frameBorder="0"
                    allow="autoplay"
                    title="Mix"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })()}

          {/* Portfolio gallery */}
          {sbProfile?.portfolio_urls && sbProfile.portfolio_urls.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: 'rgba(212,175,55,0.7)' }}>Portfolio</span>
                <span className="text-[0.7rem] text-muted-foreground">({sbProfile.portfolio_urls.length})</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {sbProfile.portfolio_urls.slice(0, 9).map((url, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden group cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    onClick={() => window.open(url, '_blank', 'noopener')}>
                    <img
                      src={url}
                      alt={`${sbProfile.display_name} portfolio ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Micro-blog — posts públicos */}
          {publicPosts.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={13} style={{ color: 'rgba(212,175,55,0.7)' }} />
                <span className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: 'rgba(212,175,55,0.7)' }}>Novedades</span>
              </div>
              <div className="flex flex-col gap-3">
                {publicPosts.map(post => (
                  <div key={post.id} className="rounded-xl p-4"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xs text-muted-foreground mb-2">
                      {new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.8)' }}>{post.content}</p>
                    {post.media_url && post.post_type === 'image' && (
                      <div className="mt-3 rounded-lg overflow-hidden">
                        <img src={post.media_url} alt="Post" className="w-full max-h-60 object-cover" loading="lazy"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => { navigate('/dashboard', { state: { view: 'messages' } }); toast.info('Inicia sesión para enviar un mensaje.'); }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <MessageCircle size={18} /> Enviar mensaje
            </button>
          </div>

          {/* XPEAK CTA */}
          <div className="mt-8 p-5 rounded-2xl text-center"
            style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#D4AF37' }}>XPEAK · Directorio Profesional Europa</p>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Descubre cientos de profesionales verificados del sector nocturno en toda Europa.
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate('/auth')}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                Crear perfil gratis →
              </button>
              <button onClick={() => navigate('/auth')}
                className="w-full py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                Ya tengo cuenta · Acceder
              </button>
            </div>
          </div>

          {/* Aviso legal */}
          <p className="mt-6 text-center text-[0.65rem] leading-relaxed px-2" style={{ color: 'rgba(255,255,255,0.18)' }}>
            El contenido publicado en este perfil es responsabilidad exclusiva de su titular.
            XPEAK actúa como plataforma intermediaria y no se hace responsable de la veracidad,
            legalidad ni calidad de los servicios ofertados.
          </p>

          {/* Otros perfiles del mismo rol */}
          {relatedProfiles.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Más {roleLabel[profile.role] ?? profile.role}s en XPEAK
              </p>
              <div className="flex flex-col gap-2">
                {relatedProfiles.map(p => (
                  <button key={p.key} onClick={() => navigate(p.href)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:scale-[1.01]"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <GeometricAvatar role={p.role as any} seed={typeof p.id === 'number' ? p.id : p.id.charCodeAt(0)} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{p.name}</p>
                      <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.specialty} · {p.zone}</p>
                    </div>
                    {p.rating > 0 && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: '#D4AF37' }}>
                        <Star size={10} fill="#D4AF37" /> {p.rating}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PublicProfile;
