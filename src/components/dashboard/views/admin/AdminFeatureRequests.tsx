import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Radio, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const GOAL = 50;

interface FeatureRequest {
  id: string;
  user_id: string;
  feature_name: string;
  created_at: string;
}

const AdminFeatureRequests = () => {
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('feature_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      const reqs = (data as FeatureRequest[]) || [];
      setRequests(reqs);
      setLoading(false);

      const liveCount = reqs.filter(r => r.feature_name === 'live_video').length;
      if (liveCount >= GOAL) {
        toast('¡XPEAK está listo! 50 usuarios han solicitado el vídeo en directo. Es hora de activar la pasarela de pagos.', {
          icon: 'trophy',
          duration: 10000,
          style: { background: '#1a1a1a', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' },
        });
      }
    };
    load();
  }, []);

  const liveCount = requests.filter(r => r.feature_name === 'live_video').length;
  const progressPct = Math.min((liveCount / GOAL) * 100, 100);

  return (
    <div className="rounded-2xl p-6 mb-6" style={{
      background: 'rgba(212,175,55,0.03)',
      border: '1px solid rgba(212,175,55,0.1)',
    }}>
      <div className="flex items-center gap-3 mb-4">
        <Radio size={20} style={{ color: '#D4AF37' }} />
        <h3 className="text-lg font-bold">Solicitudes de Funciones Beta</h3>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>
            {liveCount >= GOAL ? (
              <span className="flex items-center gap-1.5"><Trophy size={14} /> ¡Objetivo Alcanzado!</span>
            ) : (
              `Progreso: ${liveCount} / ${GOAL}`
            )}
          </span>
          <span className="text-xs text-muted-foreground">{Math.round(progressPct)}%</span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full" style={{ background: 'rgba(212,175,55,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #B8941E, #D4AF37, #E8C547)',
              boxShadow: liveCount >= GOAL ? '0 0 12px rgba(212,175,55,0.5)' : 'none',
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl p-4 text-center" style={{
          background: 'rgba(212,175,55,0.06)',
          border: '1px solid rgba(212,175,55,0.12)',
        }}>
          <p className="text-3xl font-bold text-gradient">{liveCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Solicitudes Directo Beta</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{
          background: 'rgba(212,175,55,0.06)',
          border: '1px solid rgba(212,175,55,0.12)',
        }}>
          <p className="text-3xl font-bold text-gradient">{requests.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Solicitudes</p>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground animate-pulse">Cargando...</p>
      ) : requests.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sin solicitudes aún.</p>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2">
          {requests.map(r => (
            <div key={r.id} className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="font-mono text-muted-foreground truncate max-w-[180px]">{r.user_id}</span>
              <span className="px-2 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}>
                {r.feature_name}
              </span>
              <span className="text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString('es-ES')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeatureRequests;
