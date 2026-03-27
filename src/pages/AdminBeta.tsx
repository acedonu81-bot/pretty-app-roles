import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Users, ArrowLeft, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AmbientBackground from '@/components/AmbientBackground';
import xpeakLogo from '@/assets/xpeak-logo.png';

interface FeatureRequest {
  id: string;
  user_id: string;
  feature_name: string;
  created_at: string;
}

const AdminBeta = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/', { replace: true }); return; }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roleData) { navigate('/', { replace: true }); return; }
      setAuthorized(true);

      // Load requests
      const { data: reqData } = await supabase
        .from('feature_requests' as any)
        .select('*')
        .order('created_at', { ascending: false });

      const reqs = (reqData as any as FeatureRequest[]) || [];
      setRequests(reqs);

      // Load profile names
      const userIds = [...new Set(reqs.map(r => r.user_id))];
      if (userIds.length > 0) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .in('user_id', userIds);
        const map: Record<string, string> = {};
        profileData?.forEach(p => { map[p.user_id] = p.display_name; });
        setProfiles(map);
      }

      setChecking(false);
    };
    init();
  }, [navigate]);

  if (checking) {
    return (
      <div className="flex h-screen w-screen items-center justify-center" style={{ background: '#0A0A0A' }}>
        <div className="text-xs text-muted-foreground animate-pulse">Verificando acceso...</div>
      </div>
    );
  }

  if (!authorized) return null;

  const liveVideoCount = requests.filter(r => r.feature_name === 'live_video').length;

  return (
    <div className="min-h-screen relative" style={{ background: '#0A0A0A' }}>
      <AmbientBackground />

      <div className="max-w-4xl mx-auto px-6 py-10 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <img src={xpeakLogo} alt="XPEAK" width={32} height={32} />
            <div>
              <h1 className="text-2xl font-bold tracking-wider">
                X<span className="text-gradient">PEAK</span>
                <span className="text-sm font-normal text-muted-foreground ml-3">Admin Panel</span>
              </h1>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
            <ArrowLeft size={14} /> Dashboard
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl p-6 text-center"
            style={{
              background: 'rgba(212,175,55,0.04)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(212,175,55,0.12)',
            }}>
            <Video size={24} className="mx-auto mb-2" style={{ color: '#D4AF37' }} />
            <p className="text-4xl font-bold text-gradient">{liveVideoCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Solicitudes Vídeo en Directo</p>
          </div>
          <div className="rounded-2xl p-6 text-center"
            style={{
              background: 'rgba(212,175,55,0.04)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(212,175,55,0.12)',
            }}>
            <Users size={24} className="mx-auto mb-2" style={{ color: '#D4AF37' }} />
            <p className="text-4xl font-bold text-gradient">{requests.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Solicitudes Beta</p>
          </div>
          <div className="rounded-2xl p-6 text-center"
            style={{
              background: 'rgba(212,175,55,0.04)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(212,175,55,0.12)',
            }}>
            <Shield size={24} className="mx-auto mb-2" style={{ color: '#D4AF37' }} />
            <p className="text-4xl font-bold text-gradient">
              {new Set(requests.map(r => r.user_id)).size}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Usuarios Únicos</p>
          </div>
        </div>

        {/* Requests Table */}
        <div className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(212,175,55,0.03)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(212,175,55,0.1)',
          }}>
          <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
            <Video size={18} style={{ color: '#D4AF37' }} />
            <h2 className="text-lg font-bold">Solicitudes de Acceso Beta</h2>
          </div>

          {requests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">Sin solicitudes aún.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Usuario</th>
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Feature</th>
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.id} className="transition-colors hover:bg-white/[0.02]"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td className="px-6 py-3 font-medium">
                        {profiles[r.user_id] || <span className="text-muted-foreground font-mono text-xs">{r.user_id.slice(0, 8)}…</span>}
                      </td>
                      <td className="px-6 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                          {r.feature_name}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBeta;
