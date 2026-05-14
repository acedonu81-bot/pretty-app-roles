import { useState, useEffect, useCallback } from 'react';
import { Plus, Clock, X, Zap, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface FlashJob {
  id: string;
  title: string;
  description: string | null;
  pay: string | null;
  location: string | null;
  role_needed: string | null;
  expires_at: string;
  created_at: string;
}

const fmtCountdown = (expiresAt: string) => {
  const s = Math.max(0, Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000));
  if (s <= 0) return 'Expirada';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const FlashTab = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle]       = useState('');
  const [desc, setDesc]         = useState('');
  const [pay, setPay]           = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole]         = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [myJobs, setMyJobs] = useState<FlashJob[]>([]);

  const loadMyJobs = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('flash_jobs')
      .select('id, title, description, pay, location, role_needed, expires_at, created_at')
      .eq('employer_id', user.id)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(10);
    setMyJobs((data as FlashJob[]) ?? []);
  }, [user]);

  useEffect(() => { loadMyJobs(); }, [loadMyJobs]);

  const submit = async () => {
    if (!user || !title.trim()) { toast.error('Introduce al menos un título'); return; }
    setSubmitting(true);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from('flash_jobs').insert({
      employer_id: user.id,
      title: title.trim(),
      description: desc.trim() || null,
      pay: pay.trim() || null,
      location: location.trim() || null,
      role_needed: role.trim() || null,
      expires_at: expiresAt,
    } as any);
    setSubmitting(false);
    if (error) { toast.error('Error al publicar: ' + error.message); return; }
    toast.success('Oferta publicada — visible 24h para todos los profesionales');
    setShowForm(false);
    setTitle(''); setDesc(''); setPay(''); setLocation(''); setRole('');
    loadMyJobs();
  };

  const cancelJob = async (id: string) => {
    const { error } = await supabase.from('flash_jobs').delete().eq('id', id).eq('employer_id', user!.id);
    if (error) { toast.error('Error al cancelar'); return; }
    toast.success('Oferta cancelada');
    setMyJobs(prev => prev.filter(j => j.id !== id));
  };

  return (
    <div className="mb-5 space-y-4">
      <button onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
        style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
        {showForm ? <X size={14} /> : <Plus size={14} />}
        {showForm ? 'Cancelar' : 'Publicar Oferta Urgente (24h)'}
      </button>

      {showForm && (
        <div className="glass-panel p-5 animate-[fadeIn_0.25s_ease]">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} style={{ color: '#D4AF37' }} />
            <h4 className="text-sm font-bold">Nueva Oferta Flash — caduca en 24h</h4>
          </div>
          <div className="space-y-3">
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Título (ej: DJ Techno urgente para sábado)" maxLength={80}
              className="nightlife-input text-sm w-full" />
            <textarea value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="Descripción del evento (horario, tipo de sala, requisitos...)" rows={3}
              maxLength={300} className="nightlife-input text-sm resize-none w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input value={pay} onChange={e => setPay(e.target.value)}
                placeholder="Pago (ej: €350)" maxLength={30} className="nightlife-input text-sm" />
              <input value={location} onChange={e => setLocation(e.target.value)}
                placeholder="Ciudad / Sala" maxLength={80} className="nightlife-input text-sm" />
              <input value={role} onChange={e => setRole(e.target.value)}
                placeholder="Rol necesario" list="flash-role-suggestions"
                maxLength={60} className="nightlife-input text-sm" />
              <datalist id="flash-role-suggestions">
                {['DJ', 'DJ Techno', 'DJ House', 'DJ Comercial', 'DJ Urbano', 'Staff / Camarero',
                  'Hostess / Azafata', 'RRPP', 'Seguridad', 'Maquillaje', 'Fotógrafo', 'Videógrafo'].map(v => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>
            <button onClick={submit} disabled={submitting || !title.trim()}
              className="w-full py-2.5 rounded-lg font-bold text-sm disabled:opacity-50 transition-all hover:scale-[1.01]"
              style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
              {submitting ? 'Publicando...' : 'Publicar Oferta'}
            </button>
          </div>
        </div>
      )}

      {myJobs.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Mis ofertas activas</p>
          <div className="space-y-2">
            {myJobs.map(j => (
              <div key={j.id} className="glass-panel p-4 flex items-start gap-3"
                style={{ border: '1px solid rgba(212,175,55,0.12)' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{j.title}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {j.location && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={10} /> {j.location}
                      </span>
                    )}
                    {j.pay && <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>{j.pay}</span>}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={10} /> {fmtCountdown(j.expires_at)}
                    </span>
                  </div>
                </div>
                <button onClick={() => cancelJob(j.id)}
                  className="p-1.5 rounded-lg transition-all hover:scale-105 flex-shrink-0"
                  style={{ background: 'rgba(255,95,86,0.08)', border: '1px solid rgba(255,95,86,0.2)' }}
                  title="Cancelar oferta">
                  <X size={12} style={{ color: '#ff5f56' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {myJobs.length === 0 && !showForm && (
        <div className="glass-panel p-8 flex flex-col items-center text-center gap-3">
          <Zap size={24} style={{ color: 'rgba(212,175,55,0.25)' }} />
          <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>Sin ofertas activas</p>
          <p className="text-xs text-muted-foreground max-w-[260px]">
            Publica una oferta urgente y los profesionales disponibles en tu zona la verán al instante.
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashTab;
