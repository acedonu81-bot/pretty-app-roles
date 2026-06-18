import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MessageCircle, FileText, ShoppingBag, MapPin, Globe,
  Zap, CheckCircle, Crown, ExternalLink, Heart, Star,
  Music, Camera, Users, Radio, Megaphone, Clock, Shield,
  Instagram, ChevronLeft,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { parseStreamUrl } from '@/lib/streaming';
import { useProfile as useMyProfile } from '@/hooks/useProfile';
import GeometricAvatar from './GeometricAvatar';
import ContractModal from './ContractModal';
import type { Profile } from '@/data/profiles';

// ─────────────────────────────────────────────────────────────────────────────
// Role visual config
// ─────────────────────────────────────────────────────────────────────────────
const ROLE_CFG: Record<string, {
  color: string; glow: string; label: string; emoji: string; tagline: string; icon: React.ElementType;
}> = {
  dj:        { color: '#4285F4', glow: 'rgba(66,133,244,0.45)',   label: 'DJ · Artista',       emoji: '🎧', tagline: 'La pista empieza aquí',        icon: Music },
  rookie:    { color: '#FBBF24', glow: 'rgba(251,191,36,0.4)',    label: 'DJ Promesa',          emoji: '⭐', tagline: 'El próximo grande',             icon: Star },
  staff:     { color: '#34D399', glow: 'rgba(52,211,153,0.35)',   label: 'Staff · RRPP',        emoji: '🎪', tagline: 'El engranaje invisible del show', icon: Users },
  makeup:    { color: '#F472B6', glow: 'rgba(244,114,182,0.35)',  label: 'Maquillaje · Estilismo',emoji:'💄', tagline: 'Arte en la piel',              icon: Star },
  media:     { color: '#A78BFA', glow: 'rgba(167,139,250,0.4)',   label: 'Media · Contenido',   emoji: '📸', tagline: 'Cada frame es eterno',          icon: Camera },
  ambassador:{ color: '#FB923C', glow: 'rgba(251,146,60,0.35)',   label: 'Promotor',            emoji: '📣', tagline: 'La energía que llena salas',    icon: Megaphone },
  vestuario: { color: '#D4AF37', glow: 'rgba(212,175,55,0.35)',   label: 'Vestuario',           emoji: '👗', tagline: 'Estilo que habla',              icon: Crown },
  design:    { color: '#22D3EE', glow: 'rgba(34,211,238,0.35)',   label: 'VJing · Diseño',      emoji: '🎨', tagline: 'El visual de tu evento',        icon: Camera },
  promotor:  { color: '#FB923C', glow: 'rgba(251,146,60,0.35)',   label: 'Promotor',            emoji: '📣', tagline: 'La energía que llena salas',    icon: Megaphone },
  empresario:{ color: '#D4AF37', glow: 'rgba(212,175,55,0.4)',    label: 'Empresario · Venue',  emoji: '🏛️', tagline: 'Tu espacio, tus eventos',       icon: Crown },
};

const getRoleCfg = (role: string) => ROLE_CFG[role] ?? ROLE_CFG.dj;

// ─────────────────────────────────────────────────────────────────────────────
// Role-specific animated hero background element
// ─────────────────────────────────────────────────────────────────────────────
const RoleHeroAnim = ({ role, color }: { role: string; color: string }) => {
  const [bars, setBars] = useState(Array(18).fill(30));
  useEffect(() => {
    if (role !== 'dj' && role !== 'rookie') return;
    const iv = setInterval(() =>
      setBars(Array(18).fill(0).map(() => 15 + Math.random() * 85)), 140);
    return () => clearInterval(iv);
  }, [role]);

  if (role === 'dj' || role === 'rookie') {
    return (
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-[3px] overflow-hidden pointer-events-none" style={{ height: 80, opacity: 0.35 }}>
        {bars.map((h, i) => (
          <div key={i} className="w-2 rounded-t transition-all duration-100"
            style={{ height: `${h}%`, background: `linear-gradient(180deg,${color},transparent)` }} />
        ))}
      </div>
    );
  }

  if (role === 'makeup') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { c: '#F472B6', x: '10%', y: '20%', s: 200, d: '12s' },
          { c: '#E879F9', x: '75%', y: '10%', s: 160, d: '18s' },
          { c: '#FB7185', x: '50%', y: '60%', s: 120, d: '9s' },
        ].map((o, i) => (
          <div key={i} className="absolute rounded-full"
            style={{ left: o.x, top: o.y, width: o.s, height: o.s, transform: 'translate(-50%,-50%)',
              background: `radial-gradient(circle at 40% 40%,${o.c}22,transparent 70%)`,
              filter: 'blur(40px)', animation: `orbFloat${(i%3)+1} ${o.d} ease-in-out infinite` }} />
        ))}
      </div>
    );
  }

  if (role === 'media') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={color} strokeWidth="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pgrid)" />
        </svg>
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 60% 40%, ${color}40 0%, transparent 60%)`,
          animation: 'orbFloat2 14s ease-in-out infinite',
        }} />
      </div>
    );
  }

  if (role === 'ambassador') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[1,2,3].map(i => (
          <div key={i} className="absolute rounded-full border"
            style={{
              left: '50%', top: '50%',
              width: i * 120, height: i * 120,
              transform: 'translate(-50%,-50%)',
              borderColor: `${color}${['30','1A','0D'][i-1]}`,
              animation: `orbFloat${i} ${8 + i*4}s ease-in-out infinite`,
            }} />
        ))}
      </div>
    );
  }

  if (role === 'empresario') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="luxgrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#D4AF37" strokeWidth="0.5"/>
              <circle cx="60" cy="0" r="1.5" fill="#D4AF37" opacity="0.4"/>
              <circle cx="0" cy="60" r="1.5" fill="#D4AF37" opacity="0.4"/>
              <circle cx="0" cy="0" r="1.5" fill="#D4AF37" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#luxgrid)" />
        </svg>
      </div>
    );
  }

  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Full profile page
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  profile: Profile;
  onClose: () => void;
  onMessage?: (userId: string, name: string) => void;
}

const ProfessionalProfilePage = ({ profile: p, onClose, onMessage }: Props) => {
  const me = useMyProfile();
  const cfg = getRoleCfg(p.role);
  const [full, setFull] = useState<{
    audioEmbedUrl?: string | null;
    portfolioUrls?: string[];
    bio?: string;
    languages?: string[];
    genres?: string[];
    hourlyRate?: number;
    isVerified?: boolean;
  }>({});
  const [showContract, setShowContract] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [tab, setTab] = useState<'overview' | 'media' | 'contact'>('overview');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch full data from Supabase
  useEffect(() => {
    if (!p.userId) return;
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('audio_embed_url, portfolio_urls, bio, languages, genres, hourly_rate, is_verified')
        .eq('user_id', p.userId)
        .maybeSingle();
      if (!data) return;

      setFull({
        audioEmbedUrl: (data as any).audio_embed_url,
        portfolioUrls: (data as any).portfolio_urls ?? [],
        bio: (data as any).bio || p.description,
        languages: (data as any).languages ?? p.languages ?? [],
        genres: (data as any).genres ?? p.badges ?? [],
        hourlyRate: (data as any).hourly_rate ?? p.price,
        isVerified: (data as any).is_verified ?? p.isVerified,
      });
    };
    load();
  }, [p.userId, p.description, p.languages, p.badges, p.price, p.isVerified]);

  const audioEmbed = parseStreamUrl((full.audioEmbedUrl ?? (p as any).audio_embed_url) || p.streamUrl);
  const isCompany = me.role === 'empresario';
  const isDJ = p.role === 'dj' || p.role === 'rookie';
  const bio = full.bio || p.description || '';
  const genres = full.genres?.length ? full.genres : p.badges;
  const langs = full.languages?.length ? full.languages : (p.languages ?? []);
  const price = full.hourlyRate ?? p.price;
  const verified = full.isVerified ?? p.isVerified ?? false;

  const priceHidden = ['makeup', 'vestuario', 'media', 'design'].includes(p.role);

  const tabs = [
    { id: 'overview', label: 'Perfil' },
    { id: 'media',    label: isDJ ? 'Audio & Stream' : p.role === 'media' ? 'Portfolio' : 'Media' },
    { id: 'contact',  label: 'Contactar' },
  ] as const;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>

        {/* Panel — fullscreen */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 36 }}
          className="absolute inset-0 overflow-y-auto md:overflow-hidden md:flex md:flex-row"
          ref={scrollRef}
          style={{ background: '#ffffff' }}>

          {/* Close */}
          <button onClick={onClose}
            aria-label="Cerrar perfil"
            className="fixed top-4 right-4 z-[110] w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(0,0,0,0.1)', backdropFilter: 'blur(8px)' }}>
            <X size={16} />
          </button>

          {/* ── LEFT COLUMN (hero + identity) ── */}
          <div className="md:w-[400px] md:flex-shrink-0 md:sticky md:top-0 md:h-screen md:overflow-y-auto"
            style={{ borderRight: '1px solid rgba(0,0,0,0.05)' }}>

          {/* ── HERO — foto full-width, gradiente abajo, nombre anclado ── */}
          <div className="relative flex-shrink-0" style={{ minHeight: 320 }}>
            {/* Fondo: foto a pantalla completa o gradiente fallback */}
            {p.photo && !imgError ? (
              <div className="absolute inset-0 z-0">
                <img src={p.photo} alt={p.name} className="w-full h-full object-cover object-top"
                  onError={() => setImgError(true)} />
              </div>
            ) : (
              <div className="absolute inset-0 z-0"
                style={{ background: `linear-gradient(135deg, ${cfg.color}28 0%, #070710 70%), radial-gradient(ellipse at 30% 50%, ${cfg.glow} 0%, transparent 65%)` }}>
                <RoleHeroAnim role={p.role} color={cfg.color} />
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <GeometricAvatar role={p.role as any} seed={p.id} size={200} isLive={p.isLive} />
                </div>
              </div>
            )}

            {/* Gradiente overlay abajo */}
            <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.9) 100%)' }} />

            {/* Role pill top-left */}
            <div className="absolute top-5 left-6 z-[2] flex items-center gap-1.5">
              <span className="text-xs font-black px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }}>
                {cfg.emoji} {cfg.label}
              </span>
              {p.isLive && (
                <span className="flex items-center gap-1 text-[0.65rem] font-black px-2 py-0.5 rounded-full"
                  style={{ background: '#E53935', color: '#fff', boxShadow: '0 0 10px rgba(229,57,53,0.6)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping inline-block" />LIVE
                </span>
              )}
            </div>

            {/* Nombre + location anclados abajo */}
            <div className="relative z-[2] flex flex-col justify-end px-6 pb-5" style={{ minHeight: 320 }}>
              <h1 className="font-black tracking-tight"
                style={{ fontSize: 'clamp(1.4rem, 6vw, 2.4rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.5)', overflow: 'visible', paddingBottom: '0.1em', wordBreak: 'break-word', maxWidth: '100%' }}>
                {p.name}
                {verified && <CheckCircle size={20} className="inline ml-2 mb-1" style={{ color: '#4285F4' }} />}
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <MapPin size={11} style={{ color: 'rgba(255,255,255,0.7)' }} />
                <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>{p.zone || p.location || 'España'}</span>
                {p.experience && (
                  <>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                    <Clock size={11} style={{ color: 'rgba(255,255,255,0.5)' }} />
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{p.experience}</span>
                  </>
                )}
                {p.isFlashActive && (
                  <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(34,197,94,0.85)', color: '#fff' }}>
                    <Zap size={9} />DISPONIBLE
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── PRICE ROW ── */}
          <div className="px-6 pt-4 pb-4 flex items-center justify-end gap-3 flex-wrap"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            {!priceHidden && price > 0 && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Desde</p>
                <p className="text-2xl font-black" style={{ color: cfg.color }}>€{price}
                  <span className="text-sm font-medium text-muted-foreground">/hora</span>
                </p>
              </div>
            )}
            {priceHidden && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Tarifa</p>
                <p className="text-sm font-bold text-muted-foreground">A consultar</p>
              </div>
            )}
          </div>

          </div>{/* end left column */}

          {/* ── RIGHT COLUMN (tabs + content) ── */}
          <div className="flex-1 md:overflow-y-auto md:h-screen flex flex-col">

          {/* ── TABS ── */}
          <div className="px-8 flex gap-1 mb-0 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="px-4 py-2.5 text-xs font-bold transition-all relative"
                style={{ color: tab === t.id ? cfg.color : 'rgba(22,20,18,0.4)' }}>
                {t.label}
                {tab === t.id && (
                  <motion.div layoutId="tabbar" className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                    style={{ background: cfg.color }} />
                )}
              </button>
            ))}
          </div>

          {/* ── TAB CONTENT ── */}
          <div className="px-8 py-6 space-y-5">

            {/* ════ OVERVIEW ════ */}
            {tab === 'overview' && (
              <>
                {/* Bio */}
                {bio && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="rounded-xl p-4"
                    style={{ background: `${cfg.color}08`, border: `1px solid ${cfg.color}18` }}>
                    <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: cfg.color }}>Sobre {p.name}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{bio}</p>
                  </motion.div>
                )}

                {/* Specialties / Genres */}
                {genres && genres.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'rgba(22,20,18,0.35)' }}>
                      {isDJ ? 'GÉNEROS' : 'ESPECIALIDADES'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {genres.map((g: string) => (
                        <span key={g} className="text-xs font-bold px-3 py-1.5 rounded-lg"
                          style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}30`, color: cfg.color }}>
                          {g}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Languages */}
                {langs.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                    <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(22,20,18,0.35)' }}>IDIOMAS</p>
                    <div className="flex gap-2 flex-wrap">
                      {langs.map((l: string) => (
                        <span key={l} className="text-xs font-bold px-3 py-1 rounded-lg"
                          style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: 'rgba(22,20,18,0.65)' }}>
                          <Globe size={10} className="inline mr-1 opacity-60" />{l}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Stats row */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
                  className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Visitas', value: p.profileViews > 0 ? p.profileViews.toString() : '—' },
                    { label: 'Bookings', value: '—' },
                    { label: 'Reseñas', value: p.reviews > 0 ? `${p.reviews}` : '—' },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-3 text-center"
                      style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <p className="text-base font-black">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </motion.div>

                {/* Social links — solo visibles para usuarios registrados */}
                {(p.instagram || p.tiktok) && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                    className="flex gap-2 flex-wrap">
                    {me.userId ? (
                      <>
                        {p.instagram && (
                          <a href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
                            style={{ background: 'rgba(225,48,108,0.1)', color: '#E1306C', border: '1px solid rgba(225,48,108,0.2)' }}>
                            <Instagram size={12} /> @{p.instagram}
                          </a>
                        )}
                        {p.tiktok && (
                          <a href={`https://tiktok.com/@${p.tiktok}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
                            style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(22,20,18,0.65)', border: '1px solid rgba(0,0,0,0.08)' }}>
                            TikTok @{p.tiktok}
                          </a>
                        )}
                      </>
                    ) : (
                      <a href="/auth" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
                        style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                        <Shield size={11} /> Regístrate para ver redes sociales
                      </a>
                    )}
                  </motion.div>
                )}

                {/* Flash Booking CTA */}
                {p.isFlashActive && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="rounded-xl p-4 flex items-center gap-3"
                    style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <Zap size={20} style={{ color: '#22c55e', flexShrink: 0 }} />
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#22c55e' }}>Flash Booking activo</p>
                      <p className="text-xs text-muted-foreground">Este profesional acepta bookings de última hora. Responde en &lt;2h.</p>
                    </div>
                  </motion.div>
                )}

                {/* Empresario: venue info */}
                {p.role === 'empresario' && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                    className="rounded-xl p-4"
                    style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>
                      🏛️ Espacio & Capacidad
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Ubicación</p>
                        <p className="font-bold">{p.zone || p.location || 'España'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Especialidad</p>
                        <p className="font-bold">{p.specialty || 'Eventos, Clubs, Festivales'}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* GDPR legal note */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Shield size={11} style={{ color: 'rgba(0,0,0,0.1)', flexShrink: 0 }} />
                  <p className="text-xs" style={{ color: 'rgba(22,20,18,0.3)' }}>
                    XPEAK actúa como intermediario. Sin relación laboral con la plataforma.
                  </p>
                </motion.div>
              </>
            )}

            {/* ════ MEDIA TAB ════ */}
            {tab === 'media' && (
              <>
                {/* Live stream */}
                {p.isLive && p.streamUrl && parseStreamUrl(p.streamUrl) && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#E53935' }} />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#E53935' }} />
                      </span>
                      <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#E53935' }}>EN DIRECTO AHORA</p>
                    </div>
                    <div className="rounded-xl overflow-hidden" style={{ height: 240, border: '1px solid rgba(229,57,53,0.2)' }}>
                      <iframe src={parseStreamUrl(p.streamUrl)!.embedUrl} className="w-full h-full"
                        allowFullScreen allow="autoplay; encrypted-media; fullscreen"
                        sandbox="allow-scripts allow-same-origin allow-presentation"
                        title={`${p.name} en directo`} />
                    </div>
                  </motion.div>
                )}

                {/* Audio embed */}
                {audioEmbed && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'rgba(22,20,18,0.35)' }}>
                      🎵 {audioEmbed.type}
                    </p>
                    <div className="rounded-xl overflow-hidden"
                      style={{ height: audioEmbed.type === 'SoundCloud' ? 166 : audioEmbed.type === 'Spotify' ? 152 : 120,
                        border: `1px solid ${cfg.color}20` }}>
                      <iframe src={audioEmbed.embedUrl} className="w-full h-full"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen"
                        title={`${p.name} audio`} />
                    </div>
                  </motion.div>
                )}

                {/* Portfolio grid */}
                {(full.portfolioUrls && full.portfolioUrls.length > 0) ? (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'rgba(22,20,18,0.35)' }}>PORTFOLIO</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {full.portfolioUrls.map((url: string, i: number) => (
                        <div key={i} className="rounded-xl overflow-hidden aspect-square relative group cursor-pointer"
                          style={{ border: `1px solid ${cfg.color}15` }}>
                          <img src={url} alt={`${p.name} trabajo ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: 'rgba(0,0,0,0.5)' }}>
                            <ExternalLink size={18} className="text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="rounded-xl p-10 text-center flex flex-col items-center gap-3"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(0,0,0,0.08)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${cfg.color}10`, border: `1px solid ${cfg.color}20` }}>
                        <cfg.icon size={18} style={{ color: `${cfg.color}60` }} />
                      </div>
                      <p className="text-sm font-bold">Sin contenido media todavía</p>
                      <p className="text-xs text-muted-foreground">{p.name} aún no ha subido portfolio o sesiones de audio.</p>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* ════ CONTACT TAB ════ */}
            {tab === 'contact' && (
              <>
                {/* Message */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
                  <button
                    onClick={() => p.userId && onMessage?.(p.userId, p.name)}
                    disabled={!p.userId}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-40"
                    style={{ background: `linear-gradient(90deg,${cfg.color},${cfg.color}bb)`, color: 'rgba(22,20,18,0.88)' }}>
                    <MessageCircle size={16} /> Enviar mensaje
                  </button>
                </motion.div>

                {/* Contract — empresarios only */}
                {isCompany && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}>
                    <button onClick={() => setShowContract(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                      style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
                      <FileText size={16} /> Generar contrato de servicio
                    </button>
                  </motion.div>
                )}


                {/* Flash booking */}
                {p.isFlashActive && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <button
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                      style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e' }}>
                      <Zap size={16} /> Flash Booking — Reserva urgente
                    </button>
                  </motion.div>
                )}

                {/* Social quick links — solo para usuarios registrados */}
                {(p.instagram || p.tiktok) && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
                    <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(22,20,18,0.3)' }}>
                      REDES SOCIALES
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {me.userId ? (
                        <>
                          {p.instagram && (
                            <a href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
                              style={{ background: 'rgba(225,48,108,0.1)', color: '#E1306C', border: '1px solid rgba(225,48,108,0.2)' }}>
                              <Instagram size={12} /> Instagram
                            </a>
                          )}
                          {p.tiktok && (
                            <a href={`https://tiktok.com/@${p.tiktok}`} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
                              style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(22,20,18,0.55)', border: '1px solid rgba(0,0,0,0.08)' }}>
                              TikTok
                            </a>
                          )}
                        </>
                      ) : (
                        <a href="/auth" className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
                          style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                          <Shield size={11} /> Regístrate gratis para ver redes sociales
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* ── STICKY BOTTOM BAR ── */}
          <div className="sticky bottom-0 mt-auto px-8 py-4 flex gap-3 flex-shrink-0"
            style={{ background: 'rgba(7,7,16,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <button onClick={() => setTab('contact')}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
              style={{ background: `linear-gradient(90deg,${cfg.color},${cfg.color}bb)`, color: 'rgba(22,20,18,0.88)' }}>
              <MessageCircle size={15} /> Contactar
            </button>
            <button onClick={() => setTab('media')}
              className="px-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', color: 'rgba(22,20,18,0.65)' }}>
              <Heart size={15} />
            </button>
          </div>
          </div>{/* end right column */}
        </motion.div>
      </motion.div>

      {/* Contract modal (portaled above the profile page) */}
      {showContract && (
        <ContractModal professional={p} onClose={() => setShowContract(false)} />
      )}
    </AnimatePresence>
  );
};

export default ProfessionalProfilePage;
