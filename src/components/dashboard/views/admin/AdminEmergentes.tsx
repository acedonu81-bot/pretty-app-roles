import { useState, useEffect } from 'react';
import { Instagram, ArrowUpCircle, GraduationCap, FileEdit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmergenteProfile {
  id: string;
  user_id: string;
  display_name: string;
  role: string;
  zone: string | null;
  instagram: string | null;
  emergente_sub_nivel: string | null;
  emergente_anios: number | null;
  emergente_verified_at: string | null;
}

const SUB_NIVELES = ['principiante', 'medio', 'avanzado'] as const;

const SUB_NIVEL_LABEL: Record<string, string> = {
  principiante: 'Principiante',
  medio: 'Medio',
  avanzado: 'Avanzado',
};

const nextSubNivel = (actual: string | null) => {
  const i = SUB_NIVELES.indexOf((actual ?? 'principiante') as typeof SUB_NIVELES[number]);
  return SUB_NIVELES[Math.min(i + 1, SUB_NIVELES.length - 1)];
};

const AdminEmergentes = () => {
  const [profiles, setProfiles] = useState<EmergenteProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, user_id, display_name, role, zone, instagram, emergente_sub_nivel, emergente_anios, emergente_verified_at')
      .eq('experience_level', 'emergente')
      .order('created_at', { ascending: false })
      .limit(300);
    if (data) setProfiles(data as unknown as EmergenteProfile[]);
    setLoading(false);
  };

  const promoteSubNivel = async (p: EmergenteProfile) => {
    const nuevo = nextSubNivel(p.emergente_sub_nivel);
    const { error } = await supabase
      .from('profiles')
      .update({
        emergente_sub_nivel: nuevo,
        emergente_verified_at: new Date().toISOString(),
        emergente_verified_by: (await supabase.auth.getUser()).data.user?.id ?? null,
      })
      .eq('id', p.id);
    if (error) { toast.error('Error al subir de nivel'); return; }
    toast.success(`${p.display_name || 'Perfil'} pasa a ${SUB_NIVEL_LABEL[nuevo]}`);
    setProfiles(prev => prev.map(u => u.id === p.id ? { ...u, emergente_sub_nivel: nuevo, emergente_verified_at: new Date().toISOString() } : u));
  };

  const graduate = async (p: EmergenteProfile) => {
    if (!window.confirm(`¿Graduar a ${p.display_name || 'este perfil'} a profesional? Saldrá del directorio Emergentes y entrará en el directorio normal.`)) return;
    const { error } = await supabase
      .from('profiles')
      .update({
        experience_level: null,
        emergente_verified_at: new Date().toISOString(),
        emergente_verified_by: (await supabase.auth.getUser()).data.user?.id ?? null,
      })
      .eq('id', p.id);
    if (error) { toast.error('Error al graduar'); return; }
    toast.success(`${p.display_name || 'Perfil'} graduado a profesional`);
    setProfiles(prev => prev.filter(u => u.id !== p.id));
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.1)' }}>
      <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
        <h2 className="text-base font-bold" style={{ color: '#1a1a1a' }}>
          Emergentes <span className="text-muted-foreground">({profiles.length})</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Revisar Instagram y sesiones subidas antes de subir de nivel o graduar a profesional. El ascenso siempre es manual, nunca automático por años declarados.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-center py-12 animate-pulse text-muted-foreground">Cargando...</p>
      ) : profiles.length === 0 ? (
        <p className="text-sm text-center py-12 text-muted-foreground">No hay perfiles en Emergentes.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                {['Usuario', 'Rol · Zona', 'Años declarados', 'Sub-nivel', 'Instagram', 'Última revisión', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[0.65rem] font-bold uppercase tracking-wider whitespace-nowrap text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.map(p => (
                <tr key={p.id} className="transition-colors hover:bg-black/[0.02]" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <td className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: '#1a1a1a' }}>
                    {p.display_name || <span className="font-normal text-muted-foreground">Sin nombre</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{p.role} · {p.zone || 'Sin zona'}</td>
                  <td className="px-4 py-3 tabular-nums" style={{ color: '#333' }}>{p.emergente_anios ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="text-[0.7rem] px-1.5 py-0.5 rounded font-bold whitespace-nowrap" style={{ background: 'rgba(255,188,0,0.1)', color: '#b45309' }}>
                      {SUB_NIVEL_LABEL[p.emergente_sub_nivel ?? 'principiante']}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.instagram ? (
                      <a href={`https://instagram.com/${p.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#8B5CF6] hover:underline whitespace-nowrap">
                        <Instagram size={12} /> {p.instagram}
                      </a>
                    ) : <span className="text-muted-foreground">Sin Instagram</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {p.emergente_verified_at ? new Date(p.emergente_verified_at).toLocaleDateString('es-ES') : 'Nunca'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <a href={`/p/${p.user_id}`} target="_blank" rel="noopener noreferrer" title="Ver ficha pública"
                        className="p-1.5 rounded-md transition-all hover:scale-110 inline-flex"
                        style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>
                        <FileEdit size={13} />
                      </a>
                      <button onClick={() => promoteSubNivel(p)} disabled={p.emergente_sub_nivel === 'avanzado'}
                        title="Subir sub-nivel" className="p-1.5 rounded-md transition-all hover:scale-110 disabled:opacity-30 disabled:hover:scale-100"
                        style={{ background: 'rgba(59,130,246,0.1)', color: '#2563eb' }}>
                        <ArrowUpCircle size={13} />
                      </button>
                      <button onClick={() => graduate(p)} title="Graduar a profesional (sale de Emergentes)"
                        className="p-1.5 rounded-md transition-all hover:scale-110"
                        style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                        <GraduationCap size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminEmergentes;
