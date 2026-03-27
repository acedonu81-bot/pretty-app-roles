import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Radio } from 'lucide-react';

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
        .from('feature_requests' as any)
        .select('*')
        .order('created_at', { ascending: false });
      setRequests((data as any as FeatureRequest[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  const liveCount = requests.filter(r => r.feature_name === 'live_video_beta').length;

  return (
    <div className="rounded-2xl p-6 mb-6" style={{
      background: 'rgba(212,175,55,0.03)',
      border: '1px solid rgba(212,175,55,0.1)',
    }}>
      <div className="flex items-center gap-3 mb-4">
        <Radio size={20} style={{ color: '#D4AF37' }} />
        <h3 className="text-lg font-bold">Solicitudes de Funciones Beta</h3>
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
