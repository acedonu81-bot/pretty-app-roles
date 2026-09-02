import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  X, MessageCircle, FileText, ShoppingBag, MapPin, Globe,
  Zap, CheckCircle, Crown, ExternalLink, Star,
  Music, Camera, Users, Radio, Megaphone, Clock,
  Instagram, ChevronLeft,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { parseStreamUrl, resolveHearthisProfile, resolveHearthisTrack, normalizeStreamUrl } from '@/lib/streaming';
import { useProfile as useMyProfile } from '@/hooks/useProfile';
import GeometricAvatar from './GeometricAvatar';
import ContractModal from './ContractModal';
import SessionAudioPlayer from '@/components/SessionAudioPlayer';
import { instagramUrl, extractInstagramHandle } from '@/lib/social';
import type { Profile } from '@/data/profiles';

// ─────────────────────────────────────────────────────────────────────────────
// Role visual config
// ─────────────────────────────────────────────────────────────────────────────
const ROLE_CFG: Record<string, {
  color: string; glow: string; label: string; emoji: string; tagline: string; icon: React.ElementType;
}> = {
  dj:        { color: '#4285F4', glow: 'rgba(66,133,244,0.45)',   label: 'DJ · Artista',       emoji: '🎧', tagline: 'La pista empieza aquí',        icon: Music },
  rookie:    { color: '#FBBF24', glow: 'rgba(251,191,36,0.4)',    label: 'DJ Promesa',          emoji: '⭐', tagline: 'El próximo grande',             icon: Star },
  staff:     { color: '#34D399', glow: 'rgba(52,211,153,0.35)',   label: 'Camarero',            emoji: '🎪', tagline: 'El engranaje invisible del show', icon: Users },
  azafata:   { color: '#F472B6', glow: 'rgba(244,114,182,0.35)',  label: 'Azafata',             emoji: '🎀', tagline: 'La primera impresión del evento', icon: Users },
  makeup:    { color: '#F472B6', glow: 'rgba(244,114,182,0.35)',  label: 'Maquillaje',            emoji:'💄', tagline: 'Arte en la piel',              icon: Star },
  peluqueria:{ color: '#EC4899', glow: 'rgba(236,72,153,0.35)',   label: 'Peluquería a Domicilio', emoji:'✂️', tagline: 'Estilo que llega hasta ti',   icon: Star },
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
    if (role !== 'dj') return;
    const iv = setInterval(() =>
      setBars(Array(18).fill(0).map(() => 15 + Math.random() * 85)), 140);
    return () => clearInterval(iv);
  }, [role]);

  if (role === 'dj') {
    return (
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-[3px] overflow-hidden pointer-events-none" style={{ height: 80, opacity: 0.35 }}>
        {bars.map((h, i) => (
          <div key={i} className="w-2 rounded-t transition-all duration-100"
            style={{ height: `${h}%`, background: `linear-gradient(180deg,${color},transparent)` }} />
        ))}
      </div>
    );
  }

  if (role === 'makeup' || role === 'peluqueria') {
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
    audioSessionUrls?: string[];
    portfolioUrls?: string[];
    bio?: string;
    specialty?: string | null;
    languages?: string[];
    genres?: string[];
    hourlyRate?: number;
    isVerified?: boolean;
    offersClasses?: boolean;
    classStyles?: string[];
    classPrice?: number | null;
    seekingDancePartner?: boolean;
    danceLevel?: string | null;
    danceRole?: string | null;
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
        // audio_session_urls faltaba aquí — este modal (usado desde el
        // dashboard) nunca mostraba la sección "Sesiones" que sí tiene el
        // perfil público (PublicProfile.tsx), aunque el profesional tuviera
        // varias sesiones reales guardadas (p. ej. Dj Poly, 2 en Mixcloud).
        .select('audio_embed_url, audio_session_urls, portfolio_urls, bio, specialty, languages, genres, hourly_rate, is_verified, offers_classes, class_styles, class_price, seeking_dance_partner, dance_level, dance_role')
        .eq('user_id', p.userId)
        .maybeSingle();
      if (!data) return;

      setFull({
        audioEmbedUrl: (data as any).audio_embed_url,
        audioSessionUrls: (data as any).audio_session_urls ?? [],
        portfolioUrls: (data as any).portfolio_urls ?? [],
        bio: (data as any).bio || p.description,
        specialty: (data as any).specialty ?? null,
        languages: (data as any).languages ?? p.languages ?? [],
        genres: (data as any).genres ?? p.badges ?? [],
        hourlyRate: (data as any).hourly_rate ?? p.price,
        isVerified: (data as any).is_verified ?? p.isVerified,
        offersClasses: (data as any).offers_classes ?? false,
        classStyles: (data as any).class_styles ?? [],
        classPrice: (data as any).class_price ?? null,
        seekingDancePartner: (data as any).seeking_dance_partner ?? false,
        danceLevel: (data as any).dance_level ?? null,
        danceRole: (data as any).dance_role ?? null,
      });
    };
    load();
  }, [p.userId, p.description, p.languages, p.badges, p.price, p.isVerified]);

  const [audioEmbed, setAudioEmbed] = useState<ReturnType<typeof parseStreamUrl>>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioRawUrl, setAudioRawUrl] = useState<string | null>(null);
  useEffect(() => {
    const raw = (full.audioEmbedUrl ?? (p as any).audio_embed_url) || p.streamUrl;
    setAudioRawUrl(raw ? String(raw) : null);
    const parsed = parseStreamUrl(raw);
    if (parsed?.needsResolve && parsed._hearthisUser) {
      // HearThis: el widget solo carga con ID numérico — resolver vía API (puede fallar).
      setAudioLoading(true);
      const resolver = parsed._hearthisSlug
        ? resolveHearthisTrack(parsed._hearthisUser, parsed._hearthisSlug)
        : resolveHearthisProfile(parsed._hearthisUser);
      resolver.then(url => {
        setAudioEmbed(url ? { type: 'HearThis', embedUrl: url } : null);
        setAudioLoading(false);
      }).catch(() => { setAudioEmbed(null); setAudioLoading(false); });
    } else {
      setAudioEmbed(parsed);
    }
  }, [full.audioEmbedUrl, p.streamUrl]);
  const isCompany = me.role === 'empresario';
  const isDJ = p.role === 'dj';
  const bio = full.bio || p.description || '';
  // specialty es texto libre donde los profesionales meten su rider tecnico y
  // detalles de formato. La ficha no lo pedia en el select, asi que un rider
  // completo (caso Aurora, 2 sep) quedaba guardado pero invisible al contratante.
  const specialty = (full.specialty ?? '').trim();
  const genres = full.genres?.length ? full.genres : p.badges;
  const langs = full.languages?.length ? full.languages : (p.languages ?? []);
  const price = full.hourlyRate ?? p.price;
  const verified = full.isVerified ?? p.isVerified ?? false;

  const priceHidden = ['makeup', 'peluqueria', 'vestuario', 'media', 'design'].includes(p.role);

  const contact = () => {
    if (!p.userId) return;
    onMessage?.(p.userId, p.name);
    onClose();
  };
  const mediaLabel = isDJ ? 'Audio & Stream' : p.role === 'media' ? 'Portfolio' : 'Media';
  const hasLive = p.isLive && p.streamUrl && parseStreamUrl(p.streamUrl);

  return (
    // Sin <AnimatePresence> propio: el padre (Dashboard.tsx) desmonta este
    // componente entero de golpe cuando selectedProfile pasa a null, así que
    // un AnimatePresence aquí nunca llegaría a reproducir el exit — el padre
    // es quien debe envolver el montaje/desmontaje en su propio AnimatePresence.
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>

        {/* Panel — fullscreen, single scroll column */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 36 }}
          className="absolute inset-0 overflow-y-auto"
          ref={scrollRef}
          style={{ background: '#ffffff' }}>

          {/* Close */}
          <button onClick={onClose}
            aria-label="Cerrar perfil"
            className="fixed top-4 right-4 z-[110] w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(0,0,0,0.45)', color: '#fff', backdropFilter: 'blur(8px)' }}>
            <X size={18} />
          </button>

          {/* ════════ HERO — foto full-width ════════ */}
          <div className="relative" style={{ height: 'clamp(360px, 52vh, 520px)' }}>
            {p.photo && !imgError ? (
              // object-position 50% 30%: object-top clavaba el borde superior de la
              // foto y en retratos verticales cortaba la cara por la frente.
              <img src={p.photo} alt={p.name} className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: '50% 30%' }}
                onError={() => setImgError(true)} />
            ) : (
              <div className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${cfg.color}28 0%, #070710 70%), radial-gradient(ellipse at 30% 50%, ${cfg.glow} 0%, transparent 65%)` }}>
                <RoleHeroAnim role={p.role} color={cfg.color} />
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <GeometricAvatar role={p.role as any} seed={p.id} size={200} isLive={p.isLive} />
                </div>
              </div>
            )}

            {/* Gradiente abajo */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.92) 100%)' }} />

            {/* Role pill + LIVE */}
            <div className="absolute top-5 left-5 flex items-center gap-1.5">
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

            {/* Nombre + meta inline anclados abajo */}
            <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 pb-6">
              <div className="max-w-3xl mx-auto">
                <h1 className="font-black tracking-tight"
                  style={{ fontSize: 'clamp(1.7rem, 7vw, 3rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#fff', textShadow: '0 2px 24px rgba(0,0,0,0.55)', overflow: 'visible', paddingBottom: '0.1em', wordBreak: 'break-word' }}>
                  {p.name}
                </h1>
                <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                  <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    <MapPin size={13} /> {p.zone || p.location || 'España'}
                  </span>
                  {!priceHidden && price > 0 && (
                    <>
                      <span style={{ color: 'rgba(255,255,255,0.35)' }}>·</span>
                      <span className="text-sm font-black" style={{ color: '#fff' }}>€{price}<span className="font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>/h</span></span>
                    </>
                  )}
                  {p.isFlashActive && (
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: '#15803d', color: '#fff' }}>
                      <Zap size={10} fill="#fff" /> Disponible ahora
                    </span>
                  )}
                  {p.experience && (
                    <>
                      <span style={{ color: 'rgba(255,255,255,0.35)' }}>·</span>
                      <span className="flex items-center gap-1 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        <Clock size={12} /> {p.experience}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ════════ CUERPO — scroll único ════════ */}
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-7 space-y-6"
            style={{ paddingBottom: 'calc(96px + env(safe-area-inset-bottom))' }}>

            {/* Bio */}
            {bio && (
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="text-[0.95rem] leading-relaxed" style={{ color: '#333' }}>{bio}</motion.p>
            )}

            {/* Formato y rider tecnico (profiles.specialty). Texto libre con
                saltos de linea, por eso whitespace-pre-line: los profesionales
                lo escriben como una lista de requisitos tecnicos. */}
            {specialty && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-4"
                style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.22)' }}>
                <h3 className="text-[0.7rem] font-bold uppercase tracking-wider mb-2" style={{ color: '#8A6D0F' }}>
                  Formato y requisitos técnicos
                </h3>
                <p className="text-[0.9rem] leading-relaxed whitespace-pre-line" style={{ color: '#333' }}>{specialty}</p>
              </motion.div>
            )}

            {/* Géneros + idiomas */}
            {((genres && genres.length > 0) || langs.length > 0) && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="flex flex-wrap gap-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 22 }}>
                {genres?.map((g: string) => (
                  <span key={g} className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: `${cfg.color}14`, border: `1px solid ${cfg.color}30`, color: '#7a6216' }}>
                    {g}
                  </span>
                ))}
                {langs.map((l: string) => (
                  <span key={l} className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#555' }}>
                    {l}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Clases particulares (bailarines) */}
            {p.role === 'bailarin' && full.offersClasses && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
                className="rounded-2xl p-5" style={{ background: `${cfg.color}0A`, border: `1px solid ${cfg.color}25` }}>
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#7a6216' }}>💃 Clases particulares</p>
                <p className="text-sm mb-3" style={{ color: '#333' }}>{p.name} también da clases particulares de baile.</p>
                {full.classStyles && full.classStyles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {full.classStyles.map((s: string) => (
                      <span key={s} className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: '#fff', border: `1px solid ${cfg.color}30`, color: '#555' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {full.classPrice != null && full.classPrice > 0 && (
                  <p className="text-sm font-bold mb-3" style={{ color: '#222' }}>
                    Desde €{full.classPrice}<span className="font-medium" style={{ color: '#666' }}>/hora</span>
                  </p>
                )}
                <button onClick={contact}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{ background: cfg.color, color: '#fff' }}>
                  <MessageCircle size={15} /> Contactar para clases
                </button>
              </motion.div>
            )}

            {/* Busca pareja de baile */}
            {p.role === 'bailarin' && full.seekingDancePartner && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
                className="rounded-2xl p-5" style={{ background: `${cfg.color}0A`, border: `1px solid ${cfg.color}25` }}>
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#7a6216' }}>🤝 Busca pareja de baile</p>
                <p className="text-sm mb-3" style={{ color: '#333' }}>
                  {p.name} está buscando pareja de baile fija
                  {full.danceRole === 'lead' ? ' — leader' : full.danceRole === 'follow' ? ' — follower' : full.danceRole === 'ambos' ? ' — baila ambos roles' : ''}
                  {full.danceLevel ? `, nivel ${full.danceLevel.toLowerCase()}` : ''}.
                </p>
                <button onClick={contact}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{ background: cfg.color, color: '#fff' }}>
                  <MessageCircle size={15} /> Contactar
                </button>
              </motion.div>
            )}

            {/* Live stream */}
            {hasLive && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 22 }}>
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
            {(audioEmbed || audioLoading || (audioRawUrl && !audioEmbed)) && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 22 }}>
                <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#444' }}>
                  🎵 {audioEmbed?.type ?? 'Audio'}
                </p>

                {audioLoading && (
                  <div className="rounded-xl flex items-center justify-center gap-2 py-8"
                    style={{ border: `1px solid ${cfg.color}20`, background: 'rgba(0,0,0,0.02)' }}>
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: cfg.color, borderTopColor: 'transparent' }} />
                    <span className="text-xs text-muted-foreground">Cargando audio…</span>
                  </div>
                )}

                {!audioLoading && audioEmbed && (
                  <div className="rounded-xl overflow-hidden"
                    style={{ height: audioEmbed.type === 'SoundCloud' ? 166 : audioEmbed.type === 'Spotify' ? 152 : audioEmbed.type === 'HearThis' ? 150 : 120,
                      border: `1px solid ${cfg.color}20` }}>
                    <iframe src={audioEmbed.embedUrl} className="w-full h-full"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen"
                      title={`${p.name} audio`} />
                  </div>
                )}

                {/* Fallback: hay URL pero no se pudo embeber → enlace directo en vez de desaparecer */}
                {!audioLoading && !audioEmbed && audioRawUrl && (
                  <a href={normalizeStreamUrl(audioRawUrl)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all hover:scale-[1.01]"
                    style={{ border: `1px solid ${cfg.color}30`, color: cfg.color, background: `${cfg.color}08` }}>
                    <ExternalLink size={14} /> Escuchar set / audio
                  </a>
                )}
              </motion.div>
            )}

            {/* Sesiones — antes solo existían en el perfil público
                (PublicProfile.tsx); este modal (dashboard) nunca las
                consultaba ni las mostraba, aunque el profesional tuviera
                varias guardadas. */}
            {full.audioSessionUrls && full.audioSessionUrls.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}
                style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 22 }}>
                <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#444' }}>🎧 SESIONES</p>
                <div className="flex flex-col gap-3">
                  {full.audioSessionUrls.slice(0, 5).map((url, i) => (
                    <SessionAudioPlayer key={i} url={url} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Portfolio grid */}
            {full.portfolioUrls && full.portfolioUrls.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
                style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 22 }}>
                <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#444' }}>PORTFOLIO</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {full.portfolioUrls.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      className="rounded-xl overflow-hidden aspect-square relative group cursor-pointer block"
                      style={{ border: `1px solid ${cfg.color}15` }}>
                      <img src={url} alt={`${p.name} trabajo ${i + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { (e.currentTarget.closest('a') as HTMLElement)?.style.setProperty('display', 'none'); }} />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <ExternalLink size={18} className="text-white" />
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Redes sociales — registrados */}
            {me.userId && (p.instagram || p.tiktok) && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
                className="flex gap-2 flex-wrap" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 22 }}>
                {p.instagram && (
                  <a href={instagramUrl(p.instagram)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(225,48,108,0.08)', color: '#E1306C', border: '1px solid rgba(225,48,108,0.15)' }}>
                    <Instagram size={13} /> @{extractInstagramHandle(p.instagram)}
                  </a>
                )}
                {p.tiktok && (
                  <a href={`https://tiktok.com/@${p.tiktok}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(0,0,0,0.04)', color: '#333', border: '1px solid rgba(0,0,0,0.08)' }}>
                    TikTok @{p.tiktok}
                  </a>
                )}
              </motion.div>
            )}

            {/* Empty media hint si no hay nada */}
            {!audioEmbed && !hasLive && (!full.portfolioUrls || full.portfolioUrls.length === 0) && (
              <div className="rounded-xl p-8 text-center flex flex-col items-center gap-2"
                style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: 4 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${cfg.color}10`, border: `1px solid ${cfg.color}20` }}>
                  <cfg.icon size={18} style={{ color: `${cfg.color}80` }} />
                </div>
                <p className="text-xs" style={{ color: '#777' }}>{p.name} aún no ha subido {mediaLabel.toLowerCase()}.</p>
              </div>
            )}

            {/* Nota de confianza */}
            <p className="text-center text-[11px]" style={{ color: '#999', paddingTop: 6 }}>
              Contrato directo · Sin comisión · Pago acordado entre las partes
            </p>
          </div>

          {/* ════════ BARRA FIJA — único CTA de contacto ════════ */}
          <div className="fixed bottom-0 left-0 right-0 z-[105] px-5 sm:px-8 py-3 flex gap-2.5"
            style={{
              background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)',
              borderTop: '1px solid rgba(0,0,0,0.08)',
              paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
            }}>
            <div className="max-w-3xl mx-auto w-full flex gap-2.5">
              <button onClick={contact} disabled={!p.userId}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm transition-all active:scale-[0.98] disabled:opacity-40"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 4px 18px rgba(212,175,55,0.3)' }}>
                <MessageCircle size={17} /> Contactar a {p.name}
              </button>
              {isCompany && (
                <button onClick={() => setShowContract(true)}
                  aria-label="Generar contrato"
                  className="px-4 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.35)', color: '#7a6216' }}>
                  <FileText size={17} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Contract modal */}
      {showContract && (
        <ContractModal professional={p} onClose={() => setShowContract(false)} />
      )}
    </>
  );
};

export default ProfessionalProfilePage;
