import { useState, useEffect, useCallback } from 'react';
import { Plus, Clock, X, Zap, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ROLE_ES } from '@/lib/constants';

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
  const [durationHours, setDurationHours] = useState<2 | 24>(24);
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

  // Recarga periódica: refresca el countdown de "Mis ofertas activas" (antes
  // se calculaba una sola vez y se quedaba congelado hasta el próximo render)
  // y retira del listado las ofertas que ya caducaron.
  useEffect(() => {
    const iv = setInterval(loadMyJobs, 30000);
    return () => clearInterval(iv);
  }, [loadMyJobs]);

  const [, forceTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => forceTick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  /**
   * Envía el aviso a los profesionales cuyo rol coincide con el buscado.
   * Devuelve a cuántos se avisó (0 si no había rol o nadie encaja).
   *
   * Si el organizador no especifica rol, NO se manda nada a nadie: un email
   * masivo sin criterio es la forma más rápida de que la gente deje de abrir
   * los correos de XPEAK.
   */
  const notificarProfesionales = async (o: {
    rolBuscado: string; titulo: string; descripcion: string; pago: string; lugar: string;
  }): Promise<number> => {
    const q = o.rolBuscado.toLowerCase().trim();
    if (!q) return 0;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('user_id, display_name, role, zone')
        .not('role', 'in', '("empresario","pending")')
        .limit(300);
      if (!data?.length) return 0;

      // El campo es texto libre ("DJ", "camareros", "Bartender"), así que se
      // compara en ambas direcciones contra el rol de BD y su etiqueta.
      const destinatarios = data.filter((p) => {
        const rol = String((p as { role?: string }).role ?? '').toLowerCase();
        const etiqueta = (ROLE_ES[rol] ?? '').toLowerCase();
        return rol.includes(q) || q.includes(rol) || (etiqueta && (etiqueta.includes(q) || q.includes(etiqueta)));
      });
      if (!destinatarios.length) return 0;

      await Promise.allSettled(destinatarios.map((p) =>
        supabase.functions.invoke('send-email', {
          body: {
            type: 'flash_job_nuevo',
            data: {
              user_id: (p as { user_id?: string }).user_id,
              name: (p as { display_name?: string }).display_name ?? 'Profesional',
              role_needed: o.rolBuscado,
              title: o.titulo,
              description: o.descripcion,
              pay: o.pago,
              location: o.lugar,
            },
          },
        })
      ));
      return destinatarios.length;
    } catch {
      // El aviso es un extra: si falla, la oferta ya está publicada y visible.
      return 0;
    }
  };

  const submit = async () => {
    if (!user || !title.trim()) { toast.error('Introduce al menos un título'); return; }
    setSubmitting(true);
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();
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

    // Avisar por email a los profesionales DEL ROL BUSCADO. Sin esto la oferta
    // solo era una fila en la tabla: el toast prometía visibilidad pero nadie
    // recibía nada, así que dependía de que alguien entrase al panel por
    // casualidad — el mismo agujero del caso Ramón por el otro lado.
    //
    // Se notifica SOLO al rol pedido: mandar una oferta de camarero a los DJs
    // es la vía rápida a que dejen de abrir los correos de XPEAK.
    const rolBuscado = role.trim();
    const avisados = await notificarProfesionales({
      rolBuscado,
      titulo: title.trim(),
      descripcion: desc.trim(),
      pago: pay.trim(),
      lugar: location.trim(),
    });

    toast.success(
      avisados > 0
        ? `Oferta publicada — avisados ${avisados} profesionales por email`
        : `Oferta publicada — visible ${durationHours}h en el panel`
    );
    setShowForm(false);
    setTitle(''); setDesc(''); setPay(''); setLocation(''); setRole(''); setDurationHours(24);
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
        {showForm ? 'Cancelar' : 'Publicar Oferta Urgente'}
      </button>

      {showForm && (
        <div className="glass-panel p-5 animate-[fadeIn_0.25s_ease]">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} style={{ color: '#8A6D0F' }} />
            <h4 className="text-sm font-bold">Nueva Oferta Flash — caduca en {durationHours}h</h4>
          </div>
          <div className="space-y-3">
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Título (ej: DJ Techno urgente para sábado)" maxLength={80}
              className="nightlife-input text-sm w-full" />
            <textarea value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="Descripción del evento (horario, tipo de sala, requisitos...)" rows={3}
              maxLength={300} className="nightlife-input text-sm resize-none w-full" />
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: '#333' }}>
              Duración de la oferta:
              <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--nightlife-border)' }}>
                {([2, 24] as const).map(h => (
                  <button key={h} type="button" onClick={() => setDurationHours(h)}
                    className="px-3 py-1.5 text-xs font-bold transition-all"
                    style={durationHours === h
                      ? { background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }
                      : { background: 'transparent', color: '#666' }}>
                    {h}h
                  </button>
                ))}
              </div>
            </div>
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
                    {j.pay && <span className="text-xs font-bold" style={{ color: '#8A6D0F' }}>{j.pay}</span>}
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
          <p className="text-sm font-bold" style={{ color: '#333' }}>Sin ofertas activas</p>
          <p className="text-xs text-muted-foreground max-w-[260px]">
            Publica una oferta urgente y los profesionales disponibles en tu zona la verán al instante.
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashTab;
