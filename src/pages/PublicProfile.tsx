import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, MapPin, Clock, ArrowLeft, Zap, MessageCircle, BadgeCheck, Headphones, BookOpen, Video, Music, Instagram, Send, X, Shield, Check, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { addToCart, useEventCart, MAX_CART_ITEMS } from '@/lib/eventCart';
import { parseStreamUrl, resolveHearthisProfile, resolveHearthisTrack } from '@/lib/streaming';
import { profiles, toSlug } from '@/data/profiles';
import { useAuth } from '@/hooks/useAuth';
import PublicContactModal from '@/components/PublicContactModal';
import GeometricAvatar from '@/components/dashboard/GeometricAvatar';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

/* ── Reviews ─────────────────────────────────────────────────────────────── */
interface Review {
  id: string;
  reviewer_name: string;
  reviewer_role: string;
  event_type: string | null;
  rating: number;
  comment: string;
  created_at: string;
  approved: boolean;
}

const StarRating = ({ value, onChange }: { value: number; onChange?: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(n => (
      <button key={n} type="button" onClick={() => onChange?.(n)}
        className={onChange ? 'cursor-pointer' : 'cursor-default'}
        style={{ background: 'none', border: 'none', padding: 0 }}>
        <Star size={onChange ? 28 : 14}
          fill={n <= value ? '#D4AF37' : 'none'}
          stroke={n <= value ? '#D4AF37' : 'rgba(22,20,18,0.2)'}
          strokeWidth={1.5} />
      </button>
    ))}
  </div>
);

const EVENT_TYPES = ['Boda','Comunión','Evento corporativo','Fiesta privada','Festival','Cumpleaños','Inauguración','Otro'];

const ReviewsSection = ({ professionalUserId, professionalName }: { professionalUserId: string; professionalName: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', role: 'Organizador', event_type: '', rating: 5, comment: '' });

  useEffect(() => {
    if (!professionalUserId) return;
    supabase
      .from('reviews')
      .select('id, reviewer_name, reviewer_role, event_type, rating, comment, created_at, approved')
      .eq('reviewed_user_id', professionalUserId)
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setReviews((data ?? []) as Review[]));
  }, [professionalUserId]);

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim() || form.rating < 1) return;
    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      reviewed_user_id: professionalUserId,
      reviewer_name: form.name.trim(),
      reviewer_role: form.role,
      event_type: form.event_type || null,
      rating: form.rating,
      comment: form.comment.trim(),
      approved: false,
    });
    setSubmitting(false);
    if (error) { toast.error('Error al enviar. Inténtalo de nuevo.'); return; }
    toast.success('¡Gracias! Tu valoración se publicará tras revisión.');
    setShowForm(false);
    setForm({ name: '', role: 'Organizador', event_type: '', rating: 5, comment: '' });
  };

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-black" style={{ color: '#222', fontFamily: 'Syne, sans-serif' }}>
            Valoraciones
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Star size={14} fill="#D4AF37" stroke="#D4AF37" />
              <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>{avgRating.toFixed(1)}</span>
              <span className="text-xs" style={{ color: '#444' }}>({reviews.length})</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-80"
          style={{ background: 'rgba(212,175,55,0.1)', color: '#B8941E', border: '1px solid rgba(212,175,55,0.25)' }}>
          <Star size={11} /> Dejar valoración
        </button>
      </div>

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="py-6 text-center rounded-2xl" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <Star size={24} className="mx-auto mb-2" style={{ color: 'rgba(212,175,55,0.25)' }} />
          <p className="text-xs" style={{ color: '#444' }}>Sé el primero en valorar a {professionalName}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map(r => (
            <div key={r.id} className="p-4 rounded-2xl" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-bold" style={{ color: '#222' }}>{r.reviewer_name}</p>
                  <p className="text-xs" style={{ color: '#444' }}>
                    {r.reviewer_role}{r.event_type ? ` · ${r.event_type}` : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating value={r.rating} />
                  <span className="text-[10px]" style={{ color: '#444' }}>
                    {new Date(r.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#333' }}>"{r.comment}"</p>
            </div>
          ))}
        </div>
      )}

      {/* Review form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              className="w-full max-w-md rounded-3xl p-6"
              style={{ background: '#fff', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-black text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Valorar a {professionalName}
                </h4>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-black/5">
                  <X size={16} style={{ color: '#333' }} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Rating */}
                <div>
                  <label className="text-xs font-bold mb-2 block" style={{ color: '#333' }}>PUNTUACIÓN *</label>
                  <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
                </div>
                {/* Name */}
                <div>
                  <label className="text-xs font-bold mb-1.5 block" style={{ color: '#333' }}>TU NOMBRE *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="María García" required
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
                {/* Role */}
                <div>
                  <label className="text-xs font-bold mb-1.5 block" style={{ color: '#333' }}>ERES</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none appearance-none"
                    style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)' }}>
                    {['Organizador','Empresa','Novio/a','Particular','Sala / Club'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                {/* Event type */}
                <div>
                  <label className="text-xs font-bold mb-1.5 block" style={{ color: '#333' }}>TIPO DE EVENTO</label>
                  <select value={form.event_type} onChange={e => setForm(f => ({ ...f, event_type: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none appearance-none"
                    style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)' }}>
                    <option value="">Seleccionar...</option>
                    {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                {/* Comment */}
                <div>
                  <label className="text-xs font-bold mb-1.5 block" style={{ color: '#333' }}>TU VALORACIÓN *</label>
                  <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Cuéntanos tu experiencia..." required rows={3}
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
                    style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', opacity: submitting ? 0.7 : 1 }}>
                  <Send size={14} /> {submitting ? 'Enviando...' : 'Enviar valoración'}
                </button>
                <p className="text-[10px] text-center" style={{ color: '#444' }}>
                  Las valoraciones se publican tras revisión en 24h.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


/** Sesión del perfil: embed si es SoundCloud/Mixcloud/hearthis, <audio> si es archivo subido. */
const SessionAudio = ({ url }: { url: string }) => {
  const [embedSrc, setEmbedSrc] = useState<string | null>(null);
  const parsed = useMemo(() => parseStreamUrl(url), [url]);

  useEffect(() => {
    if (!parsed) return;
    if (!parsed.needsResolve) { setEmbedSrc(parsed.embedUrl); return; }
    if (!parsed._hearthisUser) return;
    const resolver = parsed._hearthisSlug
      ? resolveHearthisTrack(parsed._hearthisUser, parsed._hearthisSlug)
      : resolveHearthisProfile(parsed._hearthisUser);
    resolver.then(u => setEmbedSrc(u));
  }, [parsed]);

  if (parsed) {
    if (!embedSrc) return null;
    return (
      <iframe
        src={embedSrc}
        width="100%"
        height={parsed.type === 'SoundCloud' ? 166 : 120}
        allow="autoplay"
        className="rounded-xl"
        style={{ border: 'none' }}
        title="Sesión de audio"
      />
    );
  }
  return (
    <audio
      src={url}
      controls
      className="w-full rounded-xl"
      onError={(e) => {
        const audio = e.currentTarget;
        const p = document.createElement('p');
        p.textContent = 'Sesión no disponible temporalmente';
        p.style.cssText = 'font-size:11px;color:#444;padding:8px 12px;background:rgba(0,0,0,0.04);border-radius:8px;';
        audio.replaceWith(p);
      }}
    />
  );
};

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
  is_seed: boolean;
  is_flash_active: boolean;
  subscription_tier: string;
  stream_url: string | null;
  instagram: string | null;
  audio_embed_url: string | null;
  portfolio_urls: string[] | null;
  offers_classes: boolean | null;
  class_styles: string[] | null;
  class_price: number | null;
  seeking_dance_partner: boolean | null;
  dance_level: string | null;
  dance_role: string | null;
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
  const [extraMedia, setExtraMedia] = useState<{ bio_video_url?: string | null; bg_music_url?: string | null; audio_session_urls?: string[] | null; video_session_urls?: string[] | null }>({});

  const { user: authUser } = useAuth();
  const { items: cartItems } = useEventCart();
  const [showContact, setShowContact] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [audioEmbed, setAudioEmbed] = useState<ReturnType<typeof parseStreamUrl>>(null);
  const [seoReviews, setSeoReviews] = useState<{ rating: number }[]>([]);
  const [weeklyViews, setWeeklyViews] = useState<number | null>(null);
  const isUUID = UUID_RE.test(slug ?? '');

  useEffect(() => {
    const onScroll = () => setScrolledPastHero(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Load from Supabase — UUID lookup for real users, slug fallback for legacy/demo
  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    setLoading(true);

    const query = isUUID
      ? supabase.from('profiles')
          .select('user_id, display_name, role, specialty, zone, bio, photo_url, hourly_rate, genres, is_live, is_verified, is_seed, is_flash_active, subscription_tier, stream_url, instagram, audio_embed_url, portfolio_urls, offers_classes, class_styles, class_price, seeking_dance_partner, dance_level, dance_role')
          .eq('user_id', slug)
          .maybeSingle()
      : supabase.from('profiles')
          .select('user_id, display_name, role, specialty, zone, bio, photo_url, hourly_rate, genres, is_live, is_verified, is_seed, is_flash_active, subscription_tier, stream_url, instagram, audio_embed_url, portfolio_urls, offers_classes, class_styles, class_price, seeking_dance_partner, dance_level, dance_role')
          .not('display_name', 'is', null)
          .then(({ data, error }) => {
            // ILIKE no entiende acentos/e\u00f1es (slug.replace('-','%') nunca
            // matchea "Mar~I\u00f1a" porque \u00f1\u2260n para SQL) \u2014 comparamos en JS con
            // la misma normalizaci\u00f3n que genera el slug (toSlug), fiable
            // para cualquier car\u00e1cter no-ASCII del nombre real.
            const match = (data ?? []).find(p => toSlug(p.display_name ?? '') === slug);
            return { data: match ?? null, error };
          });

    (query as Promise<{ data: SupabaseProfile | null; error: unknown }>)
      .then(({ data }) => {
        setSbProfile(data ?? null);
        if (data?.user_id) {
          supabase.from('reviews').select('rating').eq('reviewed_user_id', data.user_id).eq('approved', true)
            .then(({ data: rev }) => setSeoReviews(rev ?? []));
        }
        if (isUUID && data?.display_name) {
          const canonical = toSlug(data.display_name);
          if (canonical && canonical !== slug) {
            navigate(`/p/${canonical}`, { replace: true });
            return;
          }
        }
        if (data?.audio_embed_url) {
          const parsed = parseStreamUrl(data.audio_embed_url);
          if (parsed?.needsResolve && parsed._hearthisUser) {
            const resolver = parsed._hearthisSlug
              ? resolveHearthisTrack(parsed._hearthisUser, parsed._hearthisSlug)
              : resolveHearthisProfile(parsed._hearthisUser);
            resolver.then(url => {
              setAudioEmbed(url ? { type: 'HearThis', embedUrl: url } : null);
            });
          } else {
            setAudioEmbed(parsed);
          }
        }
        if (data?.user_id) {
          // Track profile view — increment score column
          supabase.from('profiles').select('score').eq('user_id', data.user_id).maybeSingle()
            .then(({ data: s }) => {
              const current = (s?.score as number) ?? 0;
              supabase.from('profiles').update({ score: current + 1 } as any).eq('user_id', data.user_id).then(() => {});
            });
          // Log every real visit in profile_business_views — one insert per
          // view, used two ways downstream: (1) RecentBusinessViewLine shows
          // "una sala de {zona} ha visto tu perfil" only when viewer_zone is
          // set (i.e. a logged-in empresario), (2) the public view counter
          // on the profile itself counts ALL rows regardless of viewer_zone.
          if (!authUser || authUser.id !== data.user_id) {
            (authUser
              ? supabase.from('profiles').select('role, zone').eq('user_id', authUser.id).maybeSingle()
              : Promise.resolve({ data: null })
            ).then(({ data: viewerProfile }) => {
              const zone = (viewerProfile as { role?: string; zone?: string } | null)?.role === 'empresario'
                ? (viewerProfile as { zone?: string }).zone ?? null
                : null;
              supabase.from('profile_business_views').insert({
                viewed_user_id: data.user_id,
                viewer_zone: zone,
              }).then(({ error }) => {
                if (error) console.error('[PublicProfile] profile_business_views insert error:', error);
              });
            });
          }
          // Weekly view count for the on-profile social-proof line. Only
          // shown above a threshold (3) so a near-empty count never reads
          // as a negative signal — omitting it is honest, a low number
          // dressed up as impressive would not be.
          supabase.rpc('profile_views_last_7_days', { p_viewed_user_id: data.user_id })
            .then(({ data: count, error }) => {
              if (error) { console.error('[PublicProfile] view count rpc error:', error); return; }
              setWeeklyViews(typeof count === 'number' ? count : null);
            });
          // Load related profiles
          supabase
            .from('profiles')
            .select('user_id, display_name, role, specialty, zone')
            .eq('role', data.role)
            .neq('user_id', data.user_id)
            .not('display_name', 'is', null)
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
          // Load extended media fields (may not exist yet if migration pending)
          supabase
            .from('profiles')
            .select('bio_video_url, bg_music_url, audio_session_urls, video_session_urls')
            .eq('user_id', data.user_id)
            .maybeSingle()
            .then(({ data: m }) => { if (m) setExtraMedia(m as any); })
            .catch(() => {});
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
    isSeed: sbProfile.is_seed,
    isFlashActive: sbProfile.is_flash_active,
    isPremium: sbProfile.subscription_tier !== 'free',
    subscriptionTier: sbProfile.subscription_tier,
    offersClasses: sbProfile.offers_classes ?? false,
    classStyles: sbProfile.class_styles ?? [],
    classPrice: sbProfile.class_price ?? null,
    seekingDancePartner: sbProfile.seeking_dance_partner ?? false,
    danceLevel: sbProfile.dance_level ?? null,
    danceRole: sbProfile.dance_role ?? null,
    id: 0,
  } : staticProfile!;

  const profileSlug = sbProfile?.display_name ? toSlug(sbProfile.display_name) : slug!;
  const inCart = sbProfile ? cartItems.some(i => i.userId === sbProfile.user_id) : false;
  const handleAddToCart = () => {
    if (!sbProfile) return;
    const result = addToCart({
      userId: sbProfile.user_id,
      displayName: profile.name,
      role: profile.role,
      photoUrl: profile.photo || null,
      hourlyRate: profile.price || null,
      zone: profile.zone,
    });
    if (result === 'limit_reached') {
      toast.error(`Máximo ${MAX_CART_ITEMS} profesionales por evento. Elimina alguno para añadir más.`);
      return;
    }
    if (result === 'duplicate') return;
    toast.success(`${profile.name} añadido a "Mi evento"`, { description: 'Añade varios profesionales y pide presupuesto conjunto desde el botón dorado de abajo a la derecha.' });
  };
  const profileUrl = `${BASE_URL}/p/${profileSlug}`;
  const cityShort = profile.zone ? profile.zone.split(',')[0].trim() : 'España';
  const priceStr = (profile as any).price > 0 ? ` Tarifa desde ${(profile as any).price}€/h.` : '';
  const availStr = (profile as any).isFlashActive ? ' Disponible ahora.' : '';
  const verifiedStr = '';
  const pageTitle = profile.specialty
    ? `Contratar ${profile.name} — ${profile.specialty} en ${cityShort} | XPEAK`
    : `${profile.name} — Profesional de eventos en ${cityShort} | XPEAK`;
  const pageDesc = `Contrata a ${profile.name}${profile.specialty ? `, ${profile.specialty}` : ''} en ${cityShort}.${priceStr}${availStr}${verifiedStr} ${profile.description ? profile.description.slice(0, 100) + (profile.description.length > 100 ? '…' : '') : 'Contacta directamente en XPEAK sin comisión.'}`;
  const ogImage = profile.photo && profile.photo.trim().length > 5
    ? profile.photo
    : `${BASE_URL}/og-image.jpg`;

  const roleLabel: Record<string, string> = {
    dj: 'DJ & Artista', staff: 'Staff & Promoción', event_manager: 'Encargada de Eventos',
    makeup: 'Belleza & Estética', media: 'Imagen & Media', design: 'Diseño & Visuales',
    promotor: 'Promotor', ambassador: 'Embajador', azafata: 'Azafata',
  };

  // Related profiles: Supabase results for real profiles, static data for
  // demo-only profiles — antes comprobaba isUUID (si la URL era un UUID
  // crudo), pero todas las URLs reales usan slug, así que esa condición
  // siempre era falsa y mostraba profesionales inventados ("Luna Deep",
  // "MC Ráfaga") como "similares" en el 100% de los perfiles reales.
  const relatedProfiles = sbProfile
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

  const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } };
  const stagger = { show: { transition: { staggerChildren: 0.1 } } };

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
          "jobTitle": profile.specialty || roleLabel[profile.role] || profile.role,
          "description": profile.description || `${profile.name}, ${profile.specialty} en ${cityShort}. Disponible para bodas, comuniones y eventos en España.`,
          "url": profileUrl,
          "image": ogImage,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": cityShort,
            "addressCountry": "ES"
          },
          "worksFor": {
            "@type": "Organization",
            "name": "XPEAK",
            "url": BASE_URL
          },
          ...((profile as any).price > 0 ? {
            "offers": {
              "@type": "Offer",
              "name": `Contratar ${profile.name} para eventos`,
              "description": `Tarifa de ${profile.name}, ${profile.specialty} en ${cityShort}`,
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": (profile as any).price,
                "priceCurrency": "EUR",
                "unitText": "hora"
              },
              "priceValidUntil": `${new Date().getFullYear()}-12-31`,
              "availability": sbProfile?.is_flash_active ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability",
              "areaServed": {
                "@type": "Country",
                "name": "España"
              },
              "seller": { "@type": "Person", "name": profile.name },
              "potentialAction": {
                "@type": "ReserveAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": profileUrl,
                  "actionPlatform": ["https://schema.org/DesktopWebPlatform", "https://schema.org/MobileWebPlatform"]
                },
                "result": { "@type": "Reservation", "name": `Reserva de ${profile.name} para tu evento` }
              }
            }
          } : {}),
          ...(profile.badges && profile.badges.length > 0 ? { "knowsAbout": profile.badges } : {}),
          ...(sbProfile?.instagram ? { "sameAs": [`https://www.instagram.com/${sbProfile.instagram}`] } : {}),
          ...(seoReviews.length > 0 ? {
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": (seoReviews.reduce((s, r) => s + r.rating, 0) / seoReviews.length).toFixed(1),
              "reviewCount": seoReviews.length,
              "bestRating": "5",
              "worstRating": "1"
            }
          } : {}),
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "XPEAK", "item": BASE_URL },
            { "@type": "ListItem", "position": 2, "name": roleLabel[profile.role] || 'Profesionales', "item": `${BASE_URL}/directorio/${profile.role || 'dj'}` },
            ...(cityShort !== 'España' ? [{ "@type": "ListItem", "position": 3, "name": cityShort, "item": `${BASE_URL}/contratar-dj/${toSlug(cityShort)}` }] : []),
            { "@type": "ListItem", "position": cityShort !== 'España' ? 4 : 3, "name": profile.name, "item": profileUrl },
          ]
        })}</script>
      </Helmet>

      {/* pb en móvil (rem, escala con fuente del sistema) reserva el espacio de
          la barra fija inferior para que nunca tape botones/contenido, ni con
          el tamaño de fuente de accesibilidad grande activado. */}
      <div className="min-h-screen pb-[6.5rem] md:pb-0" style={{ background: '#ffffff', color: '#222' }}>
        {/* Nav */}
        <nav className="sticky top-0 z-50 px-5 pb-3 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.07)', paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
          <button onClick={() => {
            if (window.history.length > 1) { navigate(-1); }
            else if (authUser) { navigate('/dashboard'); }
            else { navigate('/'); }
          }} className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase transition-all hover:opacity-60"
            style={{ color: '#333' }}>
            <ArrowLeft size={14} /> XPEAK
          </button>
          <div className="flex items-center gap-2">
            {(profile as any).isSeed && (
              <span className="flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
                Perfil de ejemplo
              </span>
            )}
            {profile.isFlashActive && (
              <span className="flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#16a34a' }}>
                <Zap size={11} fill="#16a34a" /> DISPONIBLE
              </span>
            )}
            {scrolledPastHero && (
              <button
                onClick={() => setShowContact(true)}
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-sm transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}>
                <MessageCircle size={14} /> Contactar gratis
              </button>
            )}
          </div>
        </nav>

        {/* ═══════════ HERO full-width ═══════════ */}
        <div className="relative overflow-hidden" style={{ minHeight: '80vw', maxHeight: '92vh' }}>
          {/* Fondo: foto a pantalla completa o gradiente */}
          {profile.photo && profile.photo.trim().length > 5 ? (
            <div className="absolute inset-0 z-0">
              <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover object-top" />
            </div>
          ) : (
            <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, #C8820A 0%, #D4511A 35%, #C23460 65%, #8B1A6B 100%)' }}>
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <GeometricAvatar role={profile.role as any} seed={profile.id} size={300} isLive={false} />
              </div>
            </div>
          )}

          {/* Gradiente overlay abajo */}
          <div className="absolute inset-0 z-1" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.9) 100%)' }} />

          {/* Contenido sobre la foto — anclado abajo */}
          <motion.div className="relative z-10 flex flex-col justify-end px-5 md:px-8 pb-8 md:pb-12"
            style={{ minHeight: '80vw', maxHeight: '92vh' }}
            initial="hidden" animate="show" variants={stagger}>

            <motion.div variants={fadeUp}>
              {/* Role badge */}
              <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full mb-3"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }}>
                {roleLabel[profile.role] ?? profile.role}
              </span>

              {/* Nombre grande */}
              <h1 className="font-black tracking-tight mb-1" style={{ fontSize: 'clamp(1.8rem, 8vw, 5rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
                {profile.name}
              </h1>

              {profile.specialty && (
                <p className="text-xs sm:text-sm font-semibold mb-3 truncate max-w-[80vw]" style={{ color: 'rgba(255,255,255,0.75)' }}>{profile.specialty}</p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {profile.isVerified && (
                  <span className="flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(212,175,55,0.85)', color: '#000', backdropFilter: 'blur(8px)' }}>
                    <BadgeCheck size={12} /> Verificado por XPEAK
                  </span>
                )}
                {profile.zone && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
                    <MapPin size={11} /> {profile.zone}
                  </span>
                )}
                {weeklyViews !== null && weeklyViews >= 3 && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
                    👀 {weeklyViews} vistas esta semana
                  </span>
                )}
                {profile.badges.slice(0, 3).map(b => (
                  <span key={b} className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(212,175,55,0.85)', color: '#000', backdropFilter: 'blur(8px)' }}>
                    {b}
                  </span>
                ))}
                {(profile as any).price > 0 && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
                    Desde {(profile as any).price}€/h
                  </span>
                )}
                {profile.isLive && (
                  <span className="flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(34,197,94,0.85)', color: '#fff' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping inline-block" /> EN VIVO
                  </span>
                )}
              </div>

              {/* Instagram */}
              {sbProfile?.instagram && (
                <div className="mb-4">
                  <a href={`https://instagram.com/${sbProfile.instagram}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105"
                    style={{ background: 'rgba(225,48,108,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(225,48,108,0.4)', color: '#fff' }}>
                    <Instagram size={12} /> @{sbProfile.instagram}
                  </a>
                </div>
              )}

              {/* CTA — directo a mensajes si logueado. Oculto en móvil: el sticky bottom ya lo cubre */}
              <div className="hidden md:flex gap-3 flex-wrap">
                <button
                  onClick={() => {
                    if (authUser && sbProfile?.user_id) {
                      navigate('/dashboard', { state: { view: 'messages', messageUserId: sbProfile.user_id, messageName: profile.name } });
                    } else {
                      setShowContact(true);
                    }
                  }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-base transition-all hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 8px 30px rgba(212,175,55,0.4)' }}>
                  <MessageCircle size={18} />
                  Escríbele ahora
                </button>
                {sbProfile && (
                  <button
                    onClick={handleAddToCart}
                    disabled={inCart}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-base transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100"
                    style={inCart
                      ? { background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.4)', color: '#16a34a' }
                      : { background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)', color: '#333' }}>
                    {inCart ? <Check size={18} /> : <Plus size={18} />}
                    {inCart ? 'En tu evento' : 'Añadir a mi evento'}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ═══════════ CONTENIDO ═══════════ */}
        <div className="max-w-3xl mx-auto px-5 pb-24 pt-8">
          <div className="flex flex-col gap-8">

          {/* Tarjeta precio — sin CTA duplicado */}
          {(profile as any).price > 0 && (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="rounded-2xl p-5"
              style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}>
              <div>
                <span className="text-3xl font-black" style={{ color: '#111' }}>{(profile as any).price}€</span>
                <span className="text-sm font-semibold ml-1" style={{ color: '#333' }}>/hora · sin comisión</span>
              </div>
              <p className="text-xs mt-1" style={{ color: '#333' }}>
                {profile.zone && `📍 ${profile.zone} · `}Contrato directo · Pago acordado con el profesional
              </p>
            </motion.div>
          )}

          {/* Video — mobile-first: show before bio for max impact */}
          {extraMedia.bio_video_url && (() => {
            const url = extraMedia.bio_video_url!;
            const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/);
            const vm = url.match(/vimeo\.com\/(\d+)/);
            const embed = yt ? `https://www.youtube.com/embed/${yt[1]}` : vm ? `https://player.vimeo.com/video/${vm[1]}` : null;
            if (!embed) return null;
            return (
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
                <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <iframe src={embed} className="w-full h-full" allowFullScreen title="Vídeo presentación" loading="lazy" />
                </div>
              </motion.div>
            );
          })()}

          {/* Bio */}
          {profile.description && (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Sobre mí</h2>
              <p className="text-base leading-relaxed" style={{ color: '#333' }}>{profile.description}</p>
            </motion.div>
          )}

          {/* Clases particulares (bailarines) */}
          {profile.role === 'bailarin' && (profile as any).offersClasses && (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="rounded-2xl p-5" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h2 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#D4AF37' }}>💃 Clases particulares</h2>
              <p className="text-sm mb-3" style={{ color: '#333' }}>{profile.name} también da clases particulares de baile.</p>
              {(profile as any).classStyles && (profile as any).classStyles.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(profile as any).classStyles.map((s: string) => (
                    <span key={s} className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.3)', color: '#555' }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {(profile as any).classPrice != null && (profile as any).classPrice > 0 && (
                <p className="text-sm font-bold mb-3" style={{ color: '#222' }}>
                  Desde €{(profile as any).classPrice}<span className="font-medium" style={{ color: '#666' }}>/hora</span>
                </p>
              )}
              <button onClick={() => setShowContact(true)}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:scale-[1.02]"
                style={{ background: '#D4AF37', color: '#000' }}>
                <MessageCircle size={15} /> Contactar para clases
              </button>
            </motion.div>
          )}

          {/* Busca pareja de baile (bailarines) */}
          {profile.role === 'bailarin' && (profile as any).seekingDancePartner && (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="rounded-2xl p-5" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h2 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#D4AF37' }}>🤝 Busca pareja de baile</h2>
              <p className="text-sm mb-3" style={{ color: '#333' }}>
                {profile.name} está buscando pareja de baile fija
                {(profile as any).danceRole === 'lead' ? ' — leader' : (profile as any).danceRole === 'follow' ? ' — follower' : (profile as any).danceRole === 'ambos' ? ' — baila ambos roles' : ''}
                {(profile as any).danceLevel ? `, nivel ${(profile as any).danceLevel.toLowerCase()}` : ''}.
              </p>
              <button onClick={() => setShowContact(true)}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:scale-[1.02]"
                style={{ background: '#D4AF37', color: '#000' }}>
                <MessageCircle size={15} /> Contactar
              </button>
            </motion.div>
          )}

          {audioEmbed && (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <div className="flex items-center gap-2 mb-4">
                <Headphones size={14} style={{ color: '#D4AF37' }} />
                <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: '#D4AF37' }}>Mix</span>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <iframe src={audioEmbed.embedUrl} width="100%"
                  height={audioEmbed.type === 'SoundCloud' ? '166' : audioEmbed.type === 'HearThis' ? '150' : '120'}
                  frameBorder="0" allow="autoplay; encrypted-media" title="Mix" loading="lazy" />
              </div>
            </motion.div>
          )}

          {extraMedia.audio_session_urls && extraMedia.audio_session_urls.length > 0 && (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <div className="flex items-center gap-2 mb-4">
                <Headphones size={14} style={{ color: '#D4AF37' }} />
                <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: '#D4AF37' }}>Sesiones</span>
              </div>
              <div className="flex flex-col gap-3">
                {extraMedia.audio_session_urls.slice(0, 5).map((url, i) => (
                  <div key={i} className="w-full">
                    <SessionAudio url={url} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* bio_video already rendered above bio section */}

          {sbProfile?.portfolio_urls && sbProfile.portfolio_urls.length > 0 && (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: '#D4AF37' }}>Portfolio</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {sbProfile.portfolio_urls.slice(0, 9).map((url, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                    onClick={() => window.open(url, '_blank', 'noopener')}>
                    <img src={url} alt={`${sbProfile.display_name} ${i + 1}`}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      loading="lazy" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {extraMedia.video_session_urls && extraMedia.video_session_urls.length > 0 && (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <div className="flex items-center gap-2 mb-4">
                <Video size={14} style={{ color: '#D4AF37' }} />
                <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: '#D4AF37' }}>Clips</span>
              </div>
              <div className="flex flex-col gap-4">
                {extraMedia.video_session_urls.slice(0, 3).map((url, i) => (
                  <video key={i} src={url} controls className="w-full rounded-2xl"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                ))}
              </div>
            </motion.div>
          )}

          {publicPosts.length > 0 && (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={14} style={{ color: '#D4AF37' }} />
                <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: '#D4AF37' }}>Novedades</span>
              </div>
              <div className="flex flex-col gap-3">
                {publicPosts.map(post => (
                  <div key={post.id} className="p-5 rounded-2xl"
                    style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}>
                    <p className="text-xs mb-2" style={{ color: '#444' }}>
                      {new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#222' }}>{post.content}</p>
                    {post.media_url && post.post_type === 'image' && (
                      <img src={post.media_url} alt="Post" className="w-full max-h-60 object-cover rounded-xl mt-3" loading="lazy"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Availability */}
          {sbProfile && (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <AvailabilityCalendar userId={sbProfile.user_id} />
            </motion.div>
          )}

          {/* Reviews */}
          {sbProfile && (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <ReviewsSection
                professionalUserId={sbProfile.user_id}
                professionalName={sbProfile.display_name ?? profile.name}
              />
            </motion.div>
          )}

          {/* Garantías XPEAK — siempre visible */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Por qué contratar en XPEAK</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: <Shield size={20} />, title: 'Sin comisión', desc: 'El precio acordado va directo al profesional.' },
                { icon: <BadgeCheck size={20} />, title: 'Verificados', desc: 'Identidad y experiencia comprobadas por XPEAK.' },
                { icon: <Clock size={20} />, title: 'Respuesta rápida', desc: 'Responden en menos de 24h.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="p-4 rounded-2xl flex items-start gap-3" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>{icon}</div>
                  <div>
                    <p className="text-sm font-black mb-0.5" style={{ color: '#111' }}>{title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#222' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Profesionales similares */}
          {relatedProfiles.length > 0 && (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Profesionales similares</h2>
              <div className="flex flex-col gap-2">
                {relatedProfiles.map(r => (
                  <a key={r.key} href={r.href}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01]"
                    style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                      {(r.name || 'X').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: '#222' }}>{r.name}</p>
                      <p className="text-xs truncate" style={{ color: '#444' }}>{r.specialty} {r.zone ? `· ${r.zone}` : ''}</p>
                    </div>
                    <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>Ver →</span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}

          </div>
        </div>

        {showContact && profile && (
          <PublicContactModal
            professionalName={profile.name}
            professionalUserId={sbProfile ? sbProfile.user_id : String(profile.id)}
            professionalRole={sbProfile ? sbProfile.role : null}
            professionalZone={sbProfile ? sbProfile.zone : null}
            isFlashActive={sbProfile?.is_flash_active ?? false}
            onClose={() => setShowContact(false)}
          />
        )}

        {/* Sticky CTA mobile */}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden flex gap-2"
          style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(0,0,0,0.07)', paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          {sbProfile && (
            <button
              onClick={handleAddToCart}
              disabled={inCart}
              className="flex-shrink-0 w-14 flex items-center justify-center rounded-2xl font-black text-base transition-all active:scale-95 disabled:active:scale-100"
              style={inCart
                ? { background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.4)', color: '#16a34a' }
                : { background: '#f5f4f0', border: '1.5px solid rgba(0,0,0,0.1)', color: '#333' }}>
              {inCart ? <Check size={18} /> : <Plus size={18} />}
            </button>
          )}
          <button
            onClick={() => {
              if (authUser && sbProfile?.user_id) {
                navigate('/dashboard', { state: { view: 'messages', messageUserId: sbProfile.user_id, messageName: profile.name } });
              } else {
                setShowContact(true);
              }
            }}
            className="flex-1 min-w-0 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-base leading-tight text-center transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
            <MessageCircle size={18} className="flex-shrink-0" /> <span>Escríbele ahora</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default PublicProfile;
