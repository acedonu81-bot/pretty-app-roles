import { useEffect, useMemo, useState } from 'react';
import { Eye, Headphones, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PHOTO_GATE_OR } from '@/lib/constants';
import { FAMILIAS_ESTILO, encajaEnFamilia } from '@/lib/djEstilos';

// Estilos DJ (11 nov 2026): el filtro de estilo depende de lo que cada DJ marca
// en su perfil, y 23 de 56 no tenían ninguno (no salían en ningún filtro).
// Aquí el admin escucha la sesión y marca los estilos a mano. Cada clic se
// guarda al momento; solo añade o quita ese estilo, el resto de etiquetas del
// perfil (servicios como "Bodas" o "Iluminación") no se tocan.

interface DJ {
  id: string;
  user_id: string;
  display_name: string | null;
  zone: string | null;
  bio: string | null;
  genres: string[] | null;
  audio_embed_url: string | null;
  audio_session_urls: string[] | null;
  experience_level: string | null;
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const tieneEstilo = (dj: DJ) => FAMILIAS_ESTILO.some(f => encajaEnFamilia(dj.genres, f));

const AdminEstilosDJ = () => {
  const [djs, setDjs] = useState<DJ[]>([]);
  const [cargando, setCargando] = useState(true);
  const [soloSin, setSoloSin] = useState(true);
  const [busca, setBusca] = useState('');
  const [guardando, setGuardando] = useState<string | null>(null);
  // Los que se tocan en esta visita siguen a la vista aunque ya tengan estilo,
  // para poder marcarles varios seguidos.
  const [tocados, setTocados] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, display_name, zone, bio, genres, audio_embed_url, audio_session_urls, experience_level')
        .or('role.eq.dj,roles.cs.{dj}')
        .neq('role', 'empresario')
        .or(PHOTO_GATE_OR)
        .order('display_name')
        .limit(500);
      if (error) toast.error('No se pudo cargar la lista de DJs');
      setDjs((data ?? []) as DJ[]);
      setCargando(false);
    })();
  }, []);

  const sinEstilo = djs.filter(d => !tieneEstilo(d)).length;
  const visibles = useMemo(() => {
    const q = norm(busca);
    return djs
      .filter(d => (soloSin ? !tieneEstilo(d) || tocados.has(d.id) : true))
      .filter(d => !q || norm(d.display_name ?? '').includes(q))
      .sort((a, b) => Number(tieneEstilo(a) && !tocados.has(a.id)) - Number(tieneEstilo(b) && !tocados.has(b.id)));
  }, [djs, soloSin, busca, tocados]);

  const alternar = async (dj: DJ, estilo: string) => {
    const actuales = dj.genres ?? [];
    const tiene = actuales.some(g => norm(g) === norm(estilo));
    const nuevos = tiene ? actuales.filter(g => norm(g) !== norm(estilo)) : [...actuales, estilo];
    setGuardando(dj.id);
    setTocados(prev => new Set(prev).add(dj.id));
    const { error } = await supabase.from('profiles').update({ genres: nuevos }).eq('id', dj.id);
    setGuardando(null);
    if (error) { toast.error('No se guardó: ' + error.message); return; }
    setDjs(prev => prev.map(d => (d.id === dj.id ? { ...d, genres: nuevos } : d)));
  };

  // La URL la escribe el DJ: solo se enlaza si es http(s), nunca javascript: u otros esquemas.
  const urlSegura = (u: string | null | undefined) => {
    if (!u) return null;
    try { const x = new URL(u); return x.protocol === 'https:' || x.protocol === 'http:' ? x.href : null; } catch { return null; }
  };
  const sesion = (dj: DJ) => urlSegura(dj.audio_session_urls?.find(Boolean) ?? dj.audio_embed_url);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.1)' }}>
      <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
        <h2 className="text-base font-bold" style={{ color: '#1a1a1a' }}>
          Estilos DJ <span className="text-muted-foreground">({sinEstilo} sin ningún estilo de {djs.length})</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Un DJ sin estilos no sale en el filtro de estilo. Escucha su sesión y marca lo que pincha: cada clic se guarda al momento.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar DJ"
              className="text-sm pl-8 pr-3 py-1.5 rounded-lg bg-white" style={{ border: '1px solid rgba(0,0,0,0.12)' }} />
          </div>
          <button onClick={() => setSoloSin(v => !v)} aria-pressed={soloSin}
            className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{
              background: soloSin ? 'rgba(212,175,55,0.12)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${soloSin ? 'rgba(212,175,55,0.4)' : 'rgba(0,0,0,0.08)'}`,
              color: soloSin ? '#8A6D0F' : '#444',
            }}>
            {soloSin ? 'Viendo solo los que no tienen estilos' : 'Viendo todos los DJs'}
          </button>
        </div>
      </div>

      {cargando ? (
        <p className="text-sm text-center py-12 animate-pulse text-muted-foreground">Cargando...</p>
      ) : visibles.length === 0 ? (
        <p className="text-sm text-center py-12 text-muted-foreground">
          {soloSin ? 'Todos los DJs tienen al menos un estilo.' : 'Ningún DJ coincide con la búsqueda.'}
        </p>
      ) : (
        <ul>
          {visibles.map(dj => {
            const url = sesion(dj);
            return (
              <li key={dj.id} className="px-6 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', opacity: guardando === dj.id ? 0.6 : 1 }}>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-bold text-sm" style={{ color: '#1a1a1a' }}>{dj.display_name || 'Sin nombre'}</span>
                  <span className="text-xs text-muted-foreground">{dj.zone || 'Sin zona'}{dj.experience_level === 'emergente' ? ' · Cantera' : ''}</span>
                  <a href={`/p/${dj.user_id}`} target="_blank" rel="noopener noreferrer" title="Ver ficha pública"
                    className="p-1.5 rounded-md inline-flex" style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>
                    <Eye size={13} />
                  </a>
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" title="Escuchar su sesión"
                      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md"
                      style={{ background: 'rgba(212,175,55,0.12)', color: '#8A6D0F' }}>
                      <Headphones size={12} /> Escuchar sesión
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin sesión subida</span>
                  )}
                </div>
                {dj.bio?.trim() && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{dj.bio}</p>}
                <div className="space-y-1.5">
                  {FAMILIAS_ESTILO.map(f => (
                    <div key={f.label} className="flex flex-wrap items-center gap-1">
                      <span className="text-[0.7rem] font-bold w-36 flex-shrink-0" style={{ color: '#555' }}>{f.label}</span>
                      {f.estilos.map(e => {
                        const on = (dj.genres ?? []).some(g => norm(g) === norm(e));
                        return (
                          <button key={e} onClick={() => alternar(dj, e)} disabled={guardando === dj.id} aria-pressed={on}
                            className="text-[0.7rem] px-2 py-0.5 rounded-full transition-all disabled:cursor-wait"
                            style={{
                              background: on ? 'rgba(212,175,55,0.18)' : '#fff',
                              border: `1px solid ${on ? 'rgba(212,175,55,0.5)' : 'rgba(0,0,0,0.1)'}`,
                              color: on ? '#7a6216' : '#444',
                              fontWeight: on ? 700 : 500,
                            }}>
                            {e}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdminEstilosDJ;
