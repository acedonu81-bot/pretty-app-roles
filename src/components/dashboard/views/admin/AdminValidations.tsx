import { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Play, ChevronUp, CheckCircle, XCircle, Shield, Instagram, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SessionAudioPlayer from '@/components/SessionAudioPlayer';

interface PendingProfile {
  id: string;
  display_name: string;
  role: string;
  zone: string | null;
  score: number;
  audio_embed_url: string | null;
  audio_session_urls: string[] | null;
  validation_submitted_at: string | null;
  category: string;
  user_id: string;
  instagram: string | null;
}

const AdminValidations = () => {
  const [pending, setPending] = useState<PendingProfile[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    // audio_url (singular) es un campo legacy que ningún flujo de la app
    // rellena — 0 perfiles lo tienen en producción, así que "Escuchar
    // sesión" siempre decía "Sin audio subido" aunque el profesional sí
    // tuviera sesiones reales guardadas en audio_session_urls/audio_embed_url
    // (el mismo par de campos que ya usa el perfil público).
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, role, zone, score, audio_embed_url, audio_session_urls, validation_submitted_at, category, user_id, instagram')
      .eq('validation_status', 'pending')
      .order('validation_submitted_at', { ascending: true });
    if (error) { toast.error('Error al cargar validaciones pendientes'); return; }
    setPending((data ?? []) as PendingProfile[]);
  };

  const getSessionUrls = (p: PendingProfile): string[] => {
    const urls: string[] = [];
    if (p.audio_embed_url) urls.push(p.audio_embed_url);
    if (p.audio_session_urls) urls.push(...p.audio_session_urls);
    return urls;
  };

  // null → registros antiguos sin fecha de envío (previos a que se empezara a
  // guardar validation_submitted_at). Sin esto, new Date(null) da epoch 1970
  // y el cálculo de espera sale en cientos de miles de horas.
  const getWaitHours = (submitted: string | null): number | null => {
    if (!submitted) return null;
    return (Date.now() - new Date(submitted).getTime()) / (1000 * 60 * 60);
  };

  const getPriorityStyle = (hours: number | null) => {
    if (hours === null) return { border: '1px solid rgba(0,0,0,0.08)', bg: 'rgba(0,0,0,0.015)', color: '#555', label: 'SIN FECHA' };
    if (hours > 20) return { border: '1px solid rgba(255,95,86,0.4)', bg: 'rgba(255,95,86,0.05)', color: '#ff5f56', label: 'CRÍTICO' };
    if (hours > 12) return { border: '1px solid rgba(255,188,0,0.4)', bg: 'rgba(255,188,0,0.05)', color: '#ffbc00', label: 'URGENTE' };
    return { border: '1px solid rgba(0,0,0,0.08)', bg: 'rgba(0,0,0,0.015)', color: '#555', label: 'NORMAL' };
  };

  const handleAction = async (profile: PendingProfile, action: 'approved' | 'rookie' | 'rejected') => {
    const category = action === 'approved' ? 'professional' : action === 'rookie' ? 'rookie' : 'rejected';
    const { error } = await supabase
      .from('profiles')
      .update({ validation_status: action, category })
      .eq('id', profile.id);

    if (error) {
      toast.error('Error al actualizar');
      return;
    }

    const emailType: Record<string, string> = {
      approved: 'admin_approved',
      rookie: 'admin_rookie',
      rejected: 'admin_rejected',
    };
    // El validation_status ya quedó guardado arriba, así que el cambio real
    // es correcto pase lo que pase con el email — pero ese email es el
    // ÚNICO canal por el que el profesional se entera de la decisión (no
    // hay aviso in-app). Antes el toast decía siempre "Email enviado"
    // aunque el envío fallara (.catch(() => {}) silencioso), sin forma de
    // saber que había que reenviarlo manualmente.
    const { error: emailError } = await supabase.functions.invoke('send-email', {
      body: { type: emailType[action], data: { user_id: profile.user_id, name: profile.display_name, role: profile.role } },
    });

    const labels: Record<string, string> = {
      approved: 'Aprobado como PROFESIONAL',
      rookie: 'Asignado como ROOKIE',
      rejected: '❌ Perfil rechazado',
    };
    if (emailError) {
      toast.warning(`${labels[action]} — el email de aviso falló, avísale por otro medio.`);
    } else {
      toast.success(`${labels[action]} — Email enviado`);
    }
    setPending(prev => prev.filter(p => p.id !== profile.id));
  };

  // Solicitudes "SIN FECHA" son registros antiguos, previos a que se
  // empezara a guardar validation_submitted_at (fix del 29 ago) — no son
  // rechazos de calidad reales, así que no se avisa por email como un
  // rechazo normal (handleAction). Solo las saca de la cola de pendientes,
  // el perfil y la cuenta del usuario no se tocan.
  const handleDiscard = async (profile: PendingProfile) => {
    const { error } = await supabase
      .from('profiles')
      .update({ validation_status: 'rejected', category: 'rejected' })
      .eq('id', profile.id);
    if (error) { toast.error('Error al descartar'); return; }
    toast.success(`"${profile.display_name}" descartada de la cola`);
    setPending(prev => prev.filter(p => p.id !== profile.id));
  };

  const handleDiscardAllWithoutDate = async () => {
    const toDiscard = pending.filter(p => !p.validation_submitted_at);
    if (toDiscard.length === 0) return;
    if (!confirm(`¿Descartar las ${toDiscard.length} solicitudes SIN FECHA? Los perfiles no se borran, solo salen de esta cola.`)) return;
    const { error } = await supabase
      .from('profiles')
      .update({ validation_status: 'rejected', category: 'rejected' })
      .in('id', toDiscard.map(p => p.id));
    if (error) { toast.error('Error al descartar en bloque'); return; }
    toast.success(`${toDiscard.length} solicitudes sin fecha descartadas`);
    setPending(prev => prev.filter(p => p.validation_submitted_at));
  };

  return (
    <div className="glass-panel p-5 mb-6">
      <h3 className="text-sm font-bold mb-4 flex items-center gap-2 flex-wrap">
        <Shield size={14} style={{ color: '#8A6D0F' }} />
        Validaciones Pendientes
        {pending.length > 0 && (
          <span className="text-[0.75rem] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(255,95,86,0.15)', color: '#ff5f56' }}>
            {pending.length}
          </span>
        )}
        {pending.some(p => !p.validation_submitted_at) && (
          <button onClick={handleDiscardAllWithoutDate}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[0.75rem] font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)', color: '#555' }}>
            <Trash2 size={11} /> Descartar todas SIN FECHA ({pending.filter(p => !p.validation_submitted_at).length})
          </button>
        )}
      </h3>

      {pending.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6">No hay validaciones pendientes</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {pending.map((p) => {
            const hours = getWaitHours(p.validation_submitted_at);
            const priority = getPriorityStyle(hours);
            return (
              <div key={p.id} className="p-4 rounded-lg transition-all"
                style={{ background: priority.bg, border: priority.border }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{p.display_name}</span>
                    <span className="text-[0.75rem] px-1.5 py-0.5 rounded font-bold uppercase"
                      style={{ background: 'rgba(212,175,55,0.1)', color: '#8A6D0F' }}>
                      {p.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hours !== null && hours > 12 && <AlertTriangle size={12} style={{ color: priority.color }} />}
                    <span className="text-[0.75rem] font-bold" style={{ color: priority.color }}>
                      {hours !== null ? `${priority.label} · ${Math.floor(hours)}h` : priority.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                  <span>Zona: {p.zone || 'Sin definir'}</span>
                  <span>Score: <span className="font-bold" style={{ color: p.score >= 40 ? '#22c55e' : '#ff5f56' }}>{p.score}/100</span></span>
                  <span className="flex items-center gap-1">
                    <Instagram size={11} style={{ color: p.instagram ? '#8A6D0F' : '#ff5f56' }} />
                    {p.instagram ? `@${p.instagram.replace(/^@/, '')}` : <span style={{ color: '#ff5f56' }}>Sin Instagram</span>}
                  </span>
                </div>

                {/* Audio player(s) — puede haber varios: audio_embed_url +
                    cada URL de audio_session_urls. Colapsado por defecto
                    para no cargar N iframes de golpe con hasta 31 tarjetas. */}
                {(() => {
                  const sessionUrls = getSessionUrls(p);
                  const isExpanded = expandedId === p.id;
                  return (
                    <div className="mb-3">
                      <button onClick={() => setExpandedId(isExpanded ? null : p.id)}
                        disabled={sessionUrls.length === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                        style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#8A6D0F' }}>
                        {isExpanded ? <ChevronUp size={12} /> : <Play size={12} />}
                        {sessionUrls.length === 0
                          ? 'Sin audio subido'
                          : isExpanded ? 'Ocultar' : `Escuchar sesión${sessionUrls.length > 1 ? `es (${sessionUrls.length})` : ''}`}
                      </button>
                      {isExpanded && (
                        <div className="flex flex-col gap-2 mt-2">
                          {sessionUrls.map((url, i) => <SessionAudioPlayer key={i} url={url} />)}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button onClick={() => handleAction(p, 'approved')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}>
                    <CheckCircle size={12} /> Aprobar PRO
                  </button>
                  <button onClick={() => handleAction(p, 'rookie')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#8A6D0F' }}>
                    <Clock size={12} /> Asignar ROOKIE
                  </button>
                  <button onClick={() => handleAction(p, 'rejected')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(255,95,86,0.08)', border: '1px solid rgba(255,95,86,0.2)', color: '#ff5f56' }}>
                    <XCircle size={12} /> Rechazar
                  </button>
                  {hours === null && (
                    <button onClick={() => handleDiscard(p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all hover:scale-105"
                      style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)', color: '#555' }}>
                      <Trash2 size={12} /> Descartar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminValidations;
