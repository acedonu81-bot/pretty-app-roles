import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Send, Eye, MessageCircle, MessageSquare, ExternalLink, Crown, Flag, X, Users, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';
import { normalizeStreamUrl, parseStreamUrl } from '@/lib/streaming';
import { sanitizeInput } from '@/lib/contentFilter';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import IVSPlayer from '@/components/dashboard/IVSPlayer';

// Chat starts empty — messages accumulate from live viewers and sendChat()
const fakeChat: { user: string; text: string; color: string }[] = [];

const REPORT_REASONS = [
  'Contenido ilegal o violento',
  'Consumo de sustancias',
  'Contenido sexual explícito',
  'Acoso o discriminación',
  'Infracción de derechos de autor',
  'Otro',
];

const ReportModal = ({
  onClose,
  streamerId,
  streamerName,
}: {
  onClose: () => void;
  streamerId: string;
  streamerName: string;
}) => {
  const { user } = useAuth();
  const [selected, setSelected] = useState('');
  const [detail, setDetail] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!selected) { toast.error('Selecciona un motivo.'); return; }
    setSending(true);
    await supabase.from('feature_requests').insert({
      user_id: user?.id ?? null,
      feature_name: `live_report:${streamerId}:${selected}`,
      description: detail.trim() || null,
    }).then(() => {}, () => {});
    setSending(false);
    toast.success('Reporte enviado. Revisaremos el directo en menos de 24 h.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm glass-panel p-5 animate-[fadeIn_0.2s_ease]"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
          style={{ color: '#333' }}
        >
          <X size={15} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,95,86,0.1)', border: '1px solid rgba(255,95,86,0.25)' }}>
            <Flag size={13} style={{ color: '#ff5f56' }} />
          </div>
          <div>
            <p className="text-sm font-bold">Reportar directo</p>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{streamerName}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          Motivo del reporte — revisaremos el contenido en menos de 24 horas.
        </p>

        <div className="flex flex-col gap-1.5 mb-3">
          {REPORT_REASONS.map(r => (
            <button
              key={r}
              onClick={() => setSelected(r)}
              className="text-left text-xs px-3 py-2 rounded-lg transition-all"
              style={{
                background: selected === r ? 'rgba(255,95,86,0.1)' : 'rgba(255,255,255,0.02)',
                border: selected === r ? '1px solid rgba(255,95,86,0.35)' : '1px solid rgba(0,0,0,0.05)',
                color: selected === r ? '#ff5f56' : 'var(--nightlife-text-secondary)',
                fontWeight: selected === r ? 700 : 400,
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <textarea
          value={detail}
          onChange={e => setDetail(e.target.value.slice(0, 300))}
          placeholder="Detalles adicionales (opcional, máx. 300 caracteres)"
          rows={3}
          className="nightlife-input w-full text-xs !py-2 mb-3 resize-none"
        />

        <button
          onClick={submit}
          disabled={sending || !selected}
          className="w-full py-2.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50"
          style={{ background: 'rgba(255,95,86,0.15)', border: '1px solid rgba(255,95,86,0.3)', color: '#ff5f56' }}
        >
          {sending ? 'Enviando...' : 'Enviar reporte'}
        </button>

        <p className="text-[0.75rem] text-muted-foreground text-center mt-2">
          Los reportes falsos o abusivos pueden suponer la suspensión de tu cuenta.
        </p>
      </div>
    </div>
  );
};

const ROLE_LABEL: Record<string, string> = { dj: 'DJ', staff: 'Staff', makeup: 'Makeup', rookie: 'Promesa', media: 'Media', design: 'Diseño', promotor: 'Promotor', ambassador: 'Embajador', vestuario: 'Moda' };
const ROLE_COLOR: Record<string, string> = { dj: '#D4AF37', staff: '#8B5CF6', makeup: '#EC4899', rookie: '#F59E0B', media: '#3B82F6', design: '#34D399', promotor: '#F97316', ambassador: '#A78BFA', vestuario: '#F472B6' };

interface LiveProfile { id: string; display_name: string; role: string; stream_title: string | null; zone: string | null; stream_url: string | null; }

const EscenarioVirtualView = () => {
  const profile = useProfile();
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(false);
  const [chatMessages, setChatMessages] = useState(fakeChat);
  const [chatInput, setChatInput] = useState('');
  const [viewers, setViewers] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [eqHeights, setEqHeights] = useState<number[]>(Array(20).fill(20));
  const [streamUrl, setStreamUrl] = useState(profile.stream_url ?? '');
  const [streamTitle, setStreamTitle] = useState(profile.stream_title ?? '');
  const [savingStream, setSavingStream] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const [liveProfiles, setLiveProfiles] = useState<LiveProfile[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);

  useEffect(() => {
    if (profile.role !== 'empresario') return;
    setLiveLoading(true);
    supabase.from('profiles').select('id, display_name, role, stream_title, zone, stream_url')
      .eq('is_live', true).limit(12)
      .then(({ data }) => { setLiveProfiles((data as LiveProfile[]) ?? []); setLiveLoading(false); });
  }, [profile.role]);

  useEffect(() => {
    setStreamUrl(profile.stream_url ?? '');
    setStreamTitle(profile.stream_title ?? '');
  }, [profile.stream_url, profile.stream_title]);

  const normalizedStreamUrl = normalizeStreamUrl(streamUrl);
  const streamEmbed = parseStreamUrl(normalizedStreamUrl);

  useEffect(() => {
    if (!isLive) return;
    const iv = setInterval(() => setEqHeights(Array(20).fill(0).map(() => 15 + Math.random() * 85)), 150);
    return () => clearInterval(iv);
  }, [isLive]);

  useEffect(() => {
    if (!isLive) { setViewers(0); return; }
  }, [isLive]);

  useEffect(() => {
    if (!isLive) { setElapsed(0); return; }
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [isLive]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatMessages]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const { clean, reason } = sanitizeInput(chatInput);
    if (!clean) { toast.error(reason); return; }
    setChatMessages(prev => [...prev, { user: 'Tú', text: chatInput, color: '#ffffff' }]);
    setChatInput('');
  };

  const handleSaveStream = async () => {
    const trimmedUrl = streamUrl.trim();

    if (trimmedUrl && !streamEmbed) {
      toast.error('La URL no es compatible. Usa Twitch, YouTube, Mixcloud, SoundCloud, Vimeo o Spotify.');
      return;
    }

    setSavingStream(true);
    await profile.updateField({
      stream_url: trimmedUrl ? normalizedStreamUrl : null,
      stream_title: streamTitle.trim() || null,
    });
    if (trimmedUrl) await profile.activateTrial();
    setSavingStream(false);
    toast.success('Ajustes del directo guardados.');
  };

  const toggleLive = async () => {
    if (streamUrl.trim() && !streamEmbed) {
      toast.error('La URL del streaming no es válida para incrustar el vídeo.');
      return;
    }
    const newLive = !isLive;
    setIsLive(newLive);
    await profile.updateField({ is_live: newLive });
    toast.success(newLive ? '¡Estás en directo!' : 'Has salido del directo.');
  };

  if (profile.role === 'empresario') {
    return (
      <div className="animate-[fadeIn_0.4s_ease]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">
            Talento <span className="text-gradient">en Directo</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Profesionales emitiendo ahora mismo. Escúchalos y contacta al instante — sin intermediarios.
          </p>
        </div>

        {liveLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="glass-panel p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5" />
                  <div className="flex-1">
                    <div className="h-3 bg-white/5 rounded mb-2 w-3/4" />
                    <div className="h-2 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-8 bg-white/5 rounded-lg" />
              </div>
            ))}
          </div>
        ) : liveProfiles.length === 0 ? (
          <div className="glass-panel p-12 flex flex-col items-center gap-4 text-center"
            style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <Radio size={24} style={{ color: 'rgba(212,175,55,0.35)' }} />
            </div>
            <div>
              <p className="text-sm font-bold mb-1">Nadie emite en este momento</p>
              <p className="text-xs max-w-xs leading-relaxed" style={{ color: '#222' }}>
                Los directos aparecen aquí en tiempo real. Vuelve los viernes y sábados por la tarde — es cuando más profesionales están en vivo.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs mt-1"
              style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <Zap size={12} style={{ color: '#8A6D0F' }} />
              <span style={{ color: '#222' }}>
                ¿Necesitas alguien para esta noche? Usa <strong style={{ color: '#8A6D0F' }}>Flash Booking</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveProfiles.map(p => {
              const color = ROLE_COLOR[p.role] ?? '#D4AF37';
              const label = ROLE_LABEL[p.role] ?? p.role;
              return (
                <div key={p.id} className="glass-panel p-5 flex flex-col gap-4"
                  style={{ border: `1px solid ${color}20` }}>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black"
                        style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                        {p.display_name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                        style={{ background: '#E53935', borderColor: '#0e0e0e', boxShadow: '0 0 6px rgba(229,57,53,0.7)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-tight truncate">{p.display_name}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: '#222' }}>
                        {p.stream_title || p.zone || label}
                      </p>
                    </div>
                    <span className="text-[0.65rem] font-black px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                      {label.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {p.stream_url ? (
                      <a
                        href={p.stream_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.02]"
                        style={{ background: 'rgba(229,57,53,0.15)', border: '1px solid rgba(229,57,53,0.35)', color: '#E53935' }}>
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#E53935' }} />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#E53935' }} />
                        </span>
                        Ver directo
                      </a>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg flex-shrink-0"
                        style={{ background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.2)', color: '#E53935' }}>
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#E53935' }} />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#E53935' }} />
                        </span>
                        En vivo
                      </span>
                    )}
                    <button
                      onClick={() => navigate('/dashboard', { state: { view: 'messages', contactId: p.id } })}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.02]"
                      style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                      <MessageCircle size={12} /> Contactar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs mt-8" style={{ color: 'rgba(0,0,0,0.1)' }}>
          Los directos se actualizan en tiempo real · Sin comisiones de contratación
        </p>
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_0.4s_ease] relative">
      {/* Ambient dancefloor video background */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden rounded-2xl">
        <video autoPlay muted loop playsInline preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.07, filter: 'saturate(0.6) brightness(0.5)' }}>
          <source src="/hero-dancefloor.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(229,57,53,0.08) 0%, transparent 60%)' }} />
      </div>

      {showReport && (
        <ReportModal
          onClose={() => setShowReport(false)}
          streamerId={profile.id ?? 'unknown'}
          streamerName={profile.display_name ?? 'Directo'}
        />
      )}


      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            Escenario <span className="text-gradient">Virtual</span>
          </h2>
          <p className="text-sm text-muted-foreground">Emite en directo y conecta con empresarios en tiempo real.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => setShowUrlInput(!showUrlInput)}
            className="flex items-center gap-2 px-4 py-3 rounded-lg font-bold text-xs transition-all duration-200"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#8A6D0F' }}>
            <ExternalLink size={14} /> Stream URL
          </button>
          <button onClick={toggleLive}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 flex-1 sm:flex-initial justify-center"
            style={{
              background: isLive ? 'linear-gradient(90deg, #ff5f56, #ff2d2d)' : 'linear-gradient(90deg, #D4AF37, #B8941E)',
              color: isLive ? 'white' : '#000',
            }}>
            <Radio size={16} className={isLive ? 'animate-pulse' : ''} />
            {isLive ? 'DETENER' : 'EN VIVO'}
          </button>
        </div>
      </div>

      {showUrlInput && (
        <div className="glass-panel p-4 mb-4 animate-[fadeIn_0.3s_ease]">
          <p className="text-xs font-bold mb-2 flex items-center gap-2">
            <ExternalLink size={12} style={{ color: '#8A6D0F' }} /> Introduce tu URL de streaming
          </p>
          <p className="text-xs text-muted-foreground mb-3">Soporta Twitch, YouTube, Mixcloud, SoundCloud, HearThis, Vimeo y Spotify</p>

          {/* Demo rápido */}
          {!streamUrl && (
            <button
              type="button"
              onClick={() => {
                setStreamTitle('Demo — Tech House Session Live');
                setStreamUrl('https://www.youtube.com/watch?v=36YnV9STBqc');
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold mb-3 transition-all hover:scale-[1.01]"
              style={{ background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.25)', color: '#E53935' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#E53935' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#E53935' }} />
              </span>
              Cargar sesión de prueba (demo)
            </button>
          )}

          <input value={streamTitle} onChange={e => setStreamTitle(e.target.value)}
            placeholder="Título del directo" className="nightlife-input text-sm !py-2.5 mb-2" />
          <div className="flex gap-2">
            <input value={streamUrl} onChange={e => setStreamUrl(e.target.value)}
              placeholder="Twitch, YouTube, Mixcloud, SoundCloud, Vimeo, Spotify..." className="nightlife-input text-sm !py-2.5 flex-1" />
            {streamUrl && (
              <button type="button" onClick={() => setStreamUrl('')}
                className="px-3 rounded-lg flex items-center flex-shrink-0"
                style={{ background: 'rgba(255,85,85,0.08)', border: '1px solid rgba(255,85,85,0.2)', color: '#ff5555' }}
                title="Eliminar URL">
                <X size={14} />
              </button>
            )}
          </div>
          {streamEmbed && (
            <p className="text-xs mt-2 font-bold" style={{ color: '#22c55e' }}>✓ {streamEmbed.type} detectado</p>
          )}
          <button
            onClick={handleSaveStream}
            disabled={savingStream}
            className="mt-3 w-full rounded-lg border border-border bg-card px-4 py-2 text-xs font-bold text-primary transition-opacity disabled:opacity-60"
          >
            {savingStream ? 'Guardando...' : 'Guardar ajustes del directo'}
          </button>
        </div>
      )}

      {isLive && (
        <div className="flex items-center gap-3 mb-4 px-4 py-2 rounded-lg" style={{ background: 'rgba(255,95,86,0.06)', border: '1px solid rgba(255,95,86,0.2)' }}>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#ff5f56' }} />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#ff5f56' }} />
          </span>
          <span className="text-xs font-bold" style={{ color: '#ff5f56' }}>EN VIVO</span>
          <span className="text-xs text-muted-foreground">{formatTime(elapsed)}</span>
          <div className="flex items-center gap-1 ml-auto text-xs text-muted-foreground">
            <Eye size={12} /> <span className="font-semibold" style={{ color: '#8A6D0F' }}>{viewers}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4" style={{ minHeight: '55vh' }}>
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-5">
            <div className="relative w-full rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.6)', aspectRatio: '16/9' }}>
              {streamEmbed && isLive ? (
                streamEmbed.isHls ? (
                  <IVSPlayer src={streamEmbed.embedUrl} />
                ) : (
                <iframe
                  src={streamEmbed.embedUrl}
                  title={`Stream en directo — ${streamEmbed.type}`}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                  sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                  style={{ border: 'none' }}
                />
                )
              ) : isLive ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="flex items-end justify-center gap-1 h-16">
                    {eqHeights.map((h, i) => (
                      <div key={i} className="w-2 rounded-full transition-all duration-150"
                        style={{ height: `${h}%`, background: 'linear-gradient(180deg, #D4AF37, #B8941E)', opacity: Math.max(0.3, h / 100) }} />
                    ))}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(212,175,55,0.4)' }}>
                    En vivo · Sin señal de vídeo
                  </p>
                  <p className="text-[0.75rem] text-muted-foreground text-center max-w-[200px]">
                    Configura tu URL de Twitch o YouTube con el botón <span className="font-bold">Stream URL</span>
                  </p>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <Radio size={26} style={{ color: 'rgba(212,175,55,0.5)' }} />
                  </div>
                  <p className="text-sm text-muted-foreground">Pulsa <span className="font-bold text-primary">EN VIVO</span> para comenzar</p>
                  {profile.stream_title && <p className="text-xs font-semibold text-primary">{profile.stream_title}</p>}
                  {!streamUrl && (
                    <p className="text-xs text-muted-foreground mt-1">Configura tu URL de streaming con el botón <span className="font-bold">Stream URL</span></p>
                  )}
                </div>
              )}

              {/* DSA report button — always visible over the player */}
              <button
                onClick={() => setShowReport(true)}
                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded transition-all hover:opacity-100"
                style={{
                  background: 'rgba(0,0,0,0.55)',
                  border: '1px solid rgba(255,95,86,0.2)',
                  color: 'rgba(255,95,86,0.6)',
                  opacity: 0.7,
                  backdropFilter: 'blur(6px)',
                }}
                title="Reportar este contenido"
              >
                <Flag size={10} />
                <span className="text-[0.7rem] font-bold uppercase tracking-wider">Reportar</span>
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => toast.info('Usa Mensajes para contactar directamente.')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-[1.01]"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <MessageCircle size={18} /> Enviar mensaje
              </button>
            </div>
          </div>

        </div>

        <div className="glass-panel p-4 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={14} style={{ color: '#8A6D0F' }} />
            <span className="text-xs font-bold uppercase tracking-wider">Chat en Directo</span>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto flex flex-col gap-1 mb-3 min-h-0">
            {chatMessages.length > 0 ? chatMessages.map((msg, i) => (
              <div key={i} className="text-xs px-2 py-1.5 rounded" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="font-bold mr-1" style={{ color: msg.color }}>{msg.user}</span>
                <span className="text-muted-foreground">{msg.text}</span>
              </div>
            )) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 text-center">
                <MessageSquare size={20} style={{ color: 'rgba(212,175,55,0.15)' }} />
                <p className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.1)' }}>
                  {isLive ? 'Sin espectadores aún' : 'Inicia el directo para activar el chat'}
                </p>
                <p className="text-[0.75rem] text-muted-foreground max-w-[160px] leading-relaxed">
                  Los espectadores podrán escribir aquí mientras emites en directo.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
              placeholder={isLive ? 'Escribe un mensaje...' : 'Solo disponible en directo'}
              disabled={!isLive}
              className="nightlife-input flex-1 text-xs !py-2 disabled:opacity-40" />
            <button onClick={sendChat} disabled={!isLive}
              className="px-3 rounded-lg disabled:opacity-40"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#8A6D0F' }}>
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscenarioVirtualView;
