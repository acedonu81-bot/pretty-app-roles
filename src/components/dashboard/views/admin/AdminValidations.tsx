import { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle, Play, Pause, CheckCircle, XCircle, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PendingProfile {
  id: string;
  display_name: string;
  role: string;
  zone: string | null;
  score: number;
  audio_url: string | null;
  validation_submitted_at: string;
  category: string;
  user_id: string;
}

const AdminValidations = () => {
  const [pending, setPending] = useState<PendingProfile[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const { data } = await (supabase
      .from('profiles')
      .select('*') as any)
      .eq('validation_status', 'pending')
      .order('validation_submitted_at', { ascending: true });
    if (data) setPending(data as PendingProfile[]);
  };

  const getWaitHours = (submitted: string) => {
    return (Date.now() - new Date(submitted).getTime()) / (1000 * 60 * 60);
  };

  const getPriorityStyle = (hours: number) => {
    if (hours > 20) return { border: '1px solid rgba(255,95,86,0.4)', bg: 'rgba(255,95,86,0.05)', color: '#ff5f56', label: 'CRÍTICO' };
    if (hours > 12) return { border: '1px solid rgba(255,188,0,0.4)', bg: 'rgba(255,188,0,0.05)', color: '#ffbc00', label: 'URGENTE' };
    return { border: '1px solid var(--nightlife-border)', bg: 'rgba(255,255,255,0.02)', color: '#8E8EA0', label: 'NORMAL' };
  };

  const handleAction = async (profile: PendingProfile, action: 'approved' | 'rookie' | 'rejected') => {
    const category = action === 'approved' ? 'professional' : action === 'rookie' ? 'rookie' : 'rejected';
    const { error } = await (supabase
      .from('profiles')
      .update({ validation_status: action, category } as any) as any)
      .eq('id', profile.id);

    if (error) {
      toast.error('Error al actualizar');
      return;
    }

    const labels: Record<string, string> = {
      approved: '✅ Aprobado como PROFESIONAL — Email de confirmación enviado',
      rookie: '🌟 Asignado como ROOKIE — Email de bienvenida enviado',
      rejected: '❌ Perfil rechazado — Email de notificación enviado',
    };
    toast.success(labels[action]);
    
    // TODO: When email domain is configured, trigger transactional email here
    // supabase.functions.invoke('send-transactional-email', { body: { templateName: `admin-${action}`, recipientEmail: ... } })
    
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
        <Shield size={14} style={{ color: '#D4AF37' }} />
        Validaciones Pendientes
        {pending.length > 0 && (
          <span className="text-[0.55rem] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(255,95,86,0.15)', color: '#ff5f56' }}>
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
                    <span className="text-[0.55rem] px-1.5 py-0.5 rounded font-bold uppercase"
                      style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                      {p.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hours > 12 && <AlertTriangle size={12} style={{ color: priority.color }} />}
                    <span className="text-[0.55rem] font-bold" style={{ color: priority.color }}>
                      {priority.label} · {Math.floor(hours)}h
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                  <span>Zona: {p.zone || 'Sin definir'}</span>
                  <span>Score: <span className="font-bold" style={{ color: p.score >= 40 ? '#22c55e' : '#ff5f56' }}>{p.score}/100</span></span>
                </div>

                {/* Audio player */}
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => toggleAudio(p.id, p.audio_url)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
                    {playingId === p.id ? <Pause size={12} /> : <Play size={12} />}
                    {playingId === p.id ? 'Pausar' : 'Escuchar sesión'}
                  </button>
                  {!p.audio_url && (
                    <span className="text-[0.55rem] text-muted-foreground italic">Sin audio subido</span>
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
                    style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
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
