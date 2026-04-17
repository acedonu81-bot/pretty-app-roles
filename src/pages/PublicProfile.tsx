import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, MapPin, Clock, ArrowLeft, Zap, CheckCircle, Heart, Crown, Lock, Music, Image, FileText, MessageCircle, BadgeCheck } from 'lucide-react';
import { profiles, toSlug } from '@/data/profiles';
import GeometricAvatar from '@/components/dashboard/GeometricAvatar';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const FAKE_POSTS = [
  { icon: Music, label: 'Set exclusivo B2B — Club privado 2h', locked: false },
  { icon: Image, label: 'Backstage · Fotos exclusivas noche', locked: true },
  { icon: FileText, label: 'Mensaje personal a mis fans ❤️', locked: true },
];

const BASE_URL = 'https://xpeak.site';

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
  const [fanTier, setFanTier] = useState<'fan' | 'vip'>('fan');
  const [sbProfile, setSbProfile] = useState<SupabaseProfile | null>(null);
  const [related, setRelated] = useState<RelatedProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const isUUID = UUID_RE.test(slug ?? '');

  // Load from Supabase — UUID lookup for real users, slug fallback for legacy/demo
  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    setLoading(true);

    const query = isUUID
      ? supabase.from('profiles')
          .select('user_id, display_name, role, specialty, zone, bio, photo_url, hourly_rate, genres, is_live, is_verified, is_flash_active, subscription_tier, stream_url, instagram')
          .eq('user_id', slug)
          .maybeSingle()
      : supabase.from('profiles')
          .select('user_id, display_name, role, specialty, zone, bio, photo_url, hourly_rate, genres, is_live, is_verified, is_flash_active, subscription_tier, stream_url, instagram')
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

    (query as Promise<{ data: SupabaseProfile | null; error: unknown }>).then(({ data }) => {
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
      }
      setLoading(false);
    });
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
    dj: 'DJ & Artista', staff: 'Staff & Promoción', makeup: 'Belleza & Estética',
    media: 'Imagen & Media', design: 'Diseño & Visuales', promotor: 'Promotor', ambassador: 'Embajador',
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
            <GeometricAvatar role={profile.role as any} seed={profile.id} size={80} isLive={profile.isLive} />
            <div className="mt-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                {(profile as any).isVerified && (
                  <BadgeCheck size={18} style={{ color: '#D4AF37', flexShrink: 0 }} />
                )}
                {profile.isPremium && (
                  <span className="text-[0.55rem] font-black px-2 py-0.5 rounded-md"
                    style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>ELITE</span>
                )}
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#D4AF37' }}>{roleLabel[profile.role] ?? profile.role}</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{profile.specialty}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Valoración', value: profile.rating.toFixed(1) },
              { label: 'Reseñas', value: profile.reviews },
              { label: 'Experiencia', value: profile.experience },
            ].map(s => (
              <div key={s.label} className="text-center p-3 rounded-xl"
                style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
                <p className="text-lg font-black" style={{ color: '#D4AF37' }}>{s.value}</p>
                <p className="text-[0.6rem] text-white/40 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="glass-panel p-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
            <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <MapPin size={12} /> {profile.zone}{profile.location ? `, ${profile.location}` : ''}
              <span className="mx-1">·</span>
              <Clock size={12} /> {profile.experience}
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

          {/* Fan Club */}
          <div className="mt-8 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="px-5 py-4 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.1),rgba(184,148,30,0.06))' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Heart size={16} fill="currentColor" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black" style={{ color: '#D4AF37' }}>Fan Club · {profile.name}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Contenido exclusivo para suscriptores</p>
              </div>
            </div>

            <div className="px-5 pt-4 flex gap-2">
              {([
                { id: 'fan', label: 'Fan', price: '4,99€/mes', icon: <Heart size={13} /> },
                { id: 'vip', label: 'VIP', price: '9,99€/mes', icon: <Crown size={13} /> },
              ] as const).map(t => (
                <button key={t.id} onClick={() => setFanTier(t.id)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    background: fanTier === t.id ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${fanTier === t.id ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    color: fanTier === t.id ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                  }}>
                  {t.icon} {t.label} · {t.price}
                </button>
              ))}
            </div>

            <div className="px-5 py-4 space-y-2">
              {FAKE_POSTS.map((post, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: post.locked ? 'rgba(0,0,0,0.35)' : 'rgba(212,175,55,0.05)',
                    border: `1px solid ${post.locked ? 'rgba(255,255,255,0.04)' : 'rgba(212,175,55,0.12)'}`,
                  }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: post.locked ? 'rgba(255,255,255,0.04)' : 'rgba(212,175,55,0.1)', color: post.locked ? '#3a3a3a' : '#D4AF37' }}>
                    <post.icon size={14} />
                  </div>
                  <p className="text-xs flex-1" style={{ color: post.locked ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.7)' }}>
                    {post.label}
                  </p>
                  {post.locked
                    ? <Lock size={12} style={{ color: '#3a3a3a', flexShrink: 0 }} />
                    : <CheckCircle size={12} style={{ color: '#22c55e', flexShrink: 0 }} />
                  }
                </motion.div>
              ))}
              <p className="text-[0.6rem] text-center pt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
                +{fanTier === 'vip' ? '12' : '8'} publicaciones exclusivas disponibles al suscribirte
              </p>
            </div>

            <div className="px-5 pb-5">
              <button
                onClick={() => navigate('/auth')}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                {fanTier === 'vip' ? <Crown size={15} /> : <Heart size={15} fill="currentColor" />}
                Suscribirse · {fanTier === 'vip' ? '9,99€' : '4,99€'}/mes
              </button>
              <p className="text-center text-[0.6rem] mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Cancela cuando quieras · 80% va directo al artista
              </p>
            </div>
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
