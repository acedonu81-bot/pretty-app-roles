import { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle, Play, Pause, CheckCircle, XCircle, Shield, Instagram } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PendingProfile {
  id: string;
  display_name: string;
  role: string;
  zone: string | null;
  score: number;
  audio_url: string | null;
  validation_submitted_at: string | null;
  category: string;
  user_id: string;
  instagram: string | null;
}

const AdminValidations = () => {
  const [pending, setPending] = useState<PendingProfile[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, role, zone, score, audio_url, validation_submitted_at, category, user_id, instagram')
      .eq('validation_status', 'pending')
      .order('validation_submitted_at', { ascending: true });
    if (error) { toast.error('Error al cargar validaciones pendientes'); return; }
    setPending((data ?? []) as PendingProfile[]);
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

  const toggleAudio = (id: string, url: string | null) => {
    if (!url) { toast.error('Sin audio disponible'); return; }
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(url);
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingId(null);
      setPlayingId(id);
    }
  };

  return (
    <div className="glass-panel p-5 mb-6">
      <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
        <Shield size={14} style={{ color: '#8A6D0F' }} />
        Validaciones Pendientes
        {pending.length > 0 && (
          <span className="text-[0.75rem] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(255,95,86,0.15)', color: '#ff5f56' }}>
            {pending.length}
          </span>
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

                {/* Audio player */}
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => toggleAudio(p.id, p.audio_url)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#8A6D0F' }}>
                    {playingId === p.id ? <Pause size={12} /> : <Play size={12} />}
                    {playingId === p.id ? 'Pausar' : 'Escuchar sesión'}
                  </button>
                  {!p.audio_url && (
                    <span className="text-[0.75rem] text-muted-foreground italic">Sin audio subido</span>
                  )}
                </div>

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
