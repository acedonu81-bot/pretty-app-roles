import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Users, ArrowLeft, Shield, Trophy, Tag, Plus, Trash2, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AmbientBackground from '@/components/AmbientBackground';
import xpeakLogo from '@/assets/xpeak-logo.png';
import { toast } from 'sonner';

interface FeatureRequest {
  id: string;
  user_id: string;
  feature_name: string;
  created_at: string;
}

interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  discount_percent: number;
  plan_id: string | null;
  valid_until: string | null;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  created_at: string;
}

const TABS = ['Solicitudes', 'Códigos Promo'] as const;
type Tab = typeof TABS[number];

const AdminBeta = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('Solicitudes');

  // Solicitudes
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});

  // Promo codes
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [promoLoading, setPromoLoading] = useState(false);
  const [newCode, setNewCode] = useState({ code: '', description: '', discount_percent: 20, plan_id: '', valid_until: '', max_uses: '' });
  const [creating, setCreating] = useState(false);

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

  const loadPromoCodes = async () => {
    setPromoLoading(true);
    const { data } = await (supabase.from as any)('promo_codes').select('*').order('created_at', { ascending: false });
    setPromoCodes((data as PromoCode[]) || []);
    setPromoLoading(false);
  };

  useEffect(() => {
    if (authorized && activeTab === 'Códigos Promo') loadPromoCodes();
  }, [authorized, activeTab]);

  const handleCreateCode = async () => {
    if (!newCode.code.trim() || !newCode.discount_percent) { toast.error('Código y descuento son obligatorios'); return; }
    setCreating(true);
    const payload: any = {
      code: newCode.code.trim().toUpperCase(),
      description: newCode.description || null,
      discount_percent: Number(newCode.discount_percent),
      plan_id: newCode.plan_id || null,
      valid_until: newCode.valid_until || null,
      max_uses: newCode.max_uses ? Number(newCode.max_uses) : null,
    };
    const { error } = await (supabase.from as any)('promo_codes').insert(payload);
    setCreating(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Código "${payload.code}" creado`);
    setNewCode({ code: '', description: '', discount_percent: 20, plan_id: '', valid_until: '', max_uses: '' });
    loadPromoCodes();
  };

  const handleToggleCode = async (id: string, current: boolean) => {
    await (supabase.from as any)('promo_codes').update({ is_active: !current }).eq('id', id);
    loadPromoCodes();
  };

  const handleDeleteCode = async (id: string, code: string) => {
    if (!confirm(`¿Eliminar el código "${code}"? Esta acción no se puede deshacer.`)) return;
    await (supabase.from as any)('promo_codes').delete().eq('id', id);
    toast.success('Código eliminado');
    loadPromoCodes();
  };

  if (checking) {
    return (
      <div className="flex h-screen w-screen items-center justify-center" style={{ background: '#0A0A0A' }}>
        <div className="text-xs text-muted-foreground animate-pulse">Verificando acceso...</div>
      </div>
    );
  }

  if (!authorized) return null;

  const GOAL = 50;
  const liveVideoCount = requests.filter(r => r.feature_name === 'live_video').length;
  const progressPct = Math.min((liveVideoCount / GOAL) * 100, 100);

  return (
    <div className="min-h-screen relative" style={{ background: '#0A0A0A' }}>
      <AmbientBackground />

      <div className="max-w-4xl mx-auto px-6 py-10 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src={xpeakLogo} alt="XPEAK" width={32} height={32} />
            <h1 className="text-2xl font-bold tracking-wider">
              X<span className="text-gradient">PEAK</span>
              <span className="text-sm font-normal text-muted-foreground ml-3">Admin Panel</span>
            </h1>
          </div>
          <button onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
            <ArrowLeft size={14} /> Dashboard
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                background: activeTab === tab ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${activeTab === tab ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: activeTab === tab ? '#D4AF37' : '#8E8EA0',
              }}
            >
              {tab === 'Solicitudes' ? <Users size={13} /> : <Tag size={13} />}
              {tab}
            </button>
          ))}
        </div>

        {/* ── TAB: Solicitudes ── */}
        {activeTab === 'Solicitudes' && (
          <>
            {/* Progress Bar */}
            <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>
                  {liveVideoCount >= GOAL
                    ? <span className="flex items-center gap-2"><Trophy size={16} /> ¡Objetivo Alcanzado!</span>
                    : `Beta Tracker: ${liveVideoCount} / ${GOAL} solicitudes`}
                </span>
                <span className="text-xs text-muted-foreground">{Math.round(progressPct)}%</span>
              </div>
              <div className="relative h-4 w-full overflow-hidden rounded-full" style={{ background: 'rgba(212,175,55,0.08)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #B8941E, #D4AF37, #E8C547)' }} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: <Video size={24} />, value: liveVideoCount, label: 'Solicitudes Vídeo en Directo' },
                { icon: <Users size={24} />, value: requests.length, label: 'Total Solicitudes Beta' },
                { icon: <Shield size={24} />, value: new Set(requests.map(r => r.user_id)).size, label: 'Usuarios Únicos' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-6 text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
                  <div className="mx-auto mb-2 flex justify-center" style={{ color: '#D4AF37' }}>{s.icon}</div>
                  <p className="text-4xl font-bold text-gradient">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.1)' }}>
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
                        <tr key={r.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td className="px-6 py-3 font-medium">
                            {profiles[r.user_id] || <span className="text-muted-foreground font-mono text-xs">{r.user_id.slice(0, 8)}…</span>}
                          </td>
                          <td className="px-6 py-3">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
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
          </>
        )}

        {/* ── TAB: Códigos Promo ── */}
        {activeTab === 'Códigos Promo' && (
          <div className="space-y-6">
            {/* Crear código */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <div className="flex items-center gap-2 mb-5">
                <Plus size={16} style={{ color: '#D4AF37' }} />
                <h2 className="text-base font-bold">Crear código promo</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Código *</label>
                  <input
                    value={newCode.code}
                    onChange={e => setNewCode(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                    placeholder="XPEAK20"
                    maxLength={32}
                    className="nightlife-input text-sm w-full"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Descuento % *</label>
                  <input
                    type="number" min={1} max={100}
                    value={newCode.discount_percent}
                    onChange={e => setNewCode(p => ({ ...p, discount_percent: Number(e.target.value) }))}
                    className="nightlife-input text-sm w-full"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Plan (vacío = todos)</label>
                  <select
                    value={newCode.plan_id}
                    onChange={e => setNewCode(p => ({ ...p, plan_id: e.target.value }))}
                    className="nightlife-input text-sm w-full appearance-none"
                    style={{ background: 'rgba(255,255,255,0.03)', color: newCode.plan_id ? 'inherit' : '#8E8EA0' }}
                  >
                    <option value="" style={{ background: '#0e0e14' }}>Todos los planes</option>
                    {['starter', 'business', 'agency'].map(p => (
                      <option key={p} value={p} style={{ background: '#0e0e14' }}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Caduca (vacío = nunca)</label>
                  <input
                    type="date"
                    value={newCode.valid_until}
                    onChange={e => setNewCode(p => ({ ...p, valid_until: e.target.value }))}
                    className="nightlife-input text-sm w-full"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Máx. usos (vacío = ∞)</label>
                  <input
                    type="number" min={1}
                    value={newCode.max_uses}
                    onChange={e => setNewCode(p => ({ ...p, max_uses: e.target.value }))}
                    placeholder="∞"
                    className="nightlife-input text-sm w-full"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Descripción interna</label>
                  <input
                    value={newCode.description}
                    onChange={e => setNewCode(p => ({ ...p, description: e.target.value }))}
                    placeholder="Ej. Lanzamiento Madrid"
                    maxLength={100}
                    className="nightlife-input text-sm w-full"
                  />
                </div>
              </div>
              <button
                onClick={handleCreateCode}
                disabled={creating}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:scale-105 disabled:opacity-50"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}
              >
                <Plus size={14} />
                {creating ? 'Creando...' : 'Crear código'}
              </button>
            </div>

            {/* Lista de códigos */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                <Tag size={16} style={{ color: '#D4AF37' }} />
                <h2 className="text-base font-bold">Códigos activos</h2>
                <span className="ml-auto text-xs text-muted-foreground">{promoCodes.filter(c => c.is_active).length} activos</span>
              </div>
              {promoLoading ? (
                <p className="text-sm text-muted-foreground text-center py-10 animate-pulse">Cargando...</p>
              ) : promoCodes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10">Sin códigos creados.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                        {['Código', 'Dto.', 'Plan', 'Usos', 'Caduca', 'Estado', ''].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {promoCodes.map(c => (
                        <tr key={c.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td className="px-4 py-3 font-mono font-bold text-xs" style={{ color: '#D4AF37' }}>{c.code}</td>
                          <td className="px-4 py-3 font-bold" style={{ color: '#22c55e' }}>{c.discount_percent}%</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{c.plan_id ?? 'todos'}</td>
                          <td className="px-4 py-3 text-xs">{c.current_uses}{c.max_uses ? `/${c.max_uses}` : ''}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {c.valid_until ? new Date(c.valid_until).toLocaleDateString('es-ES') : '∞'}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleToggleCode(c.id, c.is_active)}
                              className="flex items-center gap-1 px-2 py-1 rounded text-[0.65rem] font-bold transition-all"
                              style={c.is_active
                                ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }
                                : { background: 'rgba(255,255,255,0.04)', color: '#8E8EA0', border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                              {c.is_active ? <><Check size={10} /> Activo</> : <><X size={10} /> Inactivo</>}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleDeleteCode(c.id, c.code)} className="text-muted-foreground hover:text-red-400 transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBeta;
