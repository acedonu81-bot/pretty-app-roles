import { useCallback, useEffect, useState } from 'react';
import { CheckCircle, XCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Moderación del Concurso DJ XPEAK Madrid (13 oct 2026). Antes no había
 * ninguna pantalla: una inscripción se quedaba "pendiente" para siempre salvo
 * que alguien la aceptara a mano en la BD. Aceptar publica la sesión en
 * /concurso-dj-madrid y avisa al DJ por email (send-email concurso_aceptada).
 */
const CONCURSO = 'dj-madrid-2026';

type Estado = 'pendiente' | 'aceptada' | 'rechazada';
type Inscripcion = { id: string; user_id: string; soundcloud_url: string; estado: Estado; created_at: string };
type Perfil = { user_id: string; display_name: string | null; photo_url: string | null; zone: string | null; region: string | null; is_primary: boolean | null };

// Los tipos generados de Supabase no incluyen la tabla ni la función del concurso.
type Resultado = Promise<{ data: unknown; error: { message: string } | null }>;
const sb = supabase as unknown as {
  from: (t: string) => {
    select: (c: string) => { eq: (k: string, v: string) => Resultado };
    update: (v: Record<string, unknown>) => { eq: (k: string, v: string) => Resultado };
  };
  rpc: (fn: string, args: Record<string, unknown>) => Resultado;
};

const ORDEN: Record<Estado, number> = { pendiente: 0, aceptada: 1, rechazada: 2 };
const ETIQUETA: Record<Estado, { t: string; bg: string; c: string }> = {
  pendiente: { t: 'Pendiente', bg: 'rgba(212,175,55,0.16)', c: '#8A6D0F' },
  aceptada: { t: 'Publicada', bg: 'rgba(5,150,105,0.12)', c: '#047857' },
  rechazada: { t: 'Rechazada', bg: 'rgba(220,38,38,0.1)', c: '#b91c1c' },
};

const player = (url: string) =>
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23d4af37&auto_play=false&hide_related=true&show_comments=false&show_reposts=false&visual=false`;

export default function AdminConcurso() {
  const [lista, setLista] = useState<Inscripcion[] | null>(null);
  const [perfiles, setPerfiles] = useState<Record<string, Perfil>>({});
  const [votos, setVotos] = useState<Record<string, number>>({});
  const [guardando, setGuardando] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    const { data, error } = await sb.from('concurso_inscripciones')
      .select('id, user_id, soundcloud_url, estado, created_at').eq('concurso', CONCURSO);
    if (error) { toast.error('No se pudieron cargar las inscripciones'); setLista([]); return; }
    const filas = ((data ?? []) as Inscripcion[])
      .sort((a, b) => ORDEN[a.estado] - ORDEN[b.estado] || b.created_at.localeCompare(a.created_at));
    setLista(filas);
    const ids = filas.map(f => f.user_id);
    if (ids.length) {
      const { data: ps } = await supabase.from('profiles')
        .select('user_id, display_name, photo_url, zone, region, is_primary').in('user_id', ids);
      const mapa: Record<string, Perfil> = {};
      for (const p of (ps ?? []) as Perfil[]) {
        if (!mapa[p.user_id] || p.is_primary) mapa[p.user_id] = p;
      }
      setPerfiles(mapa);
    }
    const { data: part } = await sb.rpc('concurso_participantes', { p_concurso: CONCURSO });
    const v: Record<string, number> = {};
    for (const p of (part ?? []) as { user_id: string; me_gusta: number }[]) v[p.user_id] = Number(p.me_gusta);
    setVotos(v);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const cambiar = async (ins: Inscripcion, estado: Estado) => {
    if (estado === 'rechazada' && !window.confirm('¿Rechazar esta sesión? El DJ verá que no cumple las bases.')) return;
    setGuardando(ins.id);
    const { error } = await sb.from('concurso_inscripciones').update({ estado }).eq('id', ins.id);
    if (error) { setGuardando(null); toast.error('No se pudo guardar: ' + error.message); return; }
    // La tarjeta cambia ya y el botón sigue bloqueado hasta acabar: antes se
    // reactivaba mientras se enviaba el email y 4 clics mandaron 4 emails al
    // DJ (13 oct 2026).
    setLista(l => l?.map(x => (x.id === ins.id ? { ...x, estado } : x)) ?? l);
    if (estado === 'aceptada') {
      const nombre = perfiles[ins.user_id]?.display_name ?? 'DJ';
      const { error: mailErr } = await supabase.functions.invoke('send-email', {
        body: { type: 'concurso_aceptada', data: { user_id: ins.user_id, name: nombre } },
      });
      toast[mailErr ? 'warning' : 'success'](mailErr
        ? 'Publicada, pero no se pudo enviar el email al DJ'
        : `Publicada. Hemos avisado a ${nombre} por email.`);
    } else {
      toast.success(estado === 'rechazada' ? 'Rechazada' : 'Guardado');
    }
    setGuardando(null);
    cargar();
  };

  if (lista === null) return <p className="text-sm" style={{ color: 'rgba(10,9,8,0.5)' }}>Cargando inscripciones…</p>;

  const pendientes = lista.filter(i => i.estado === 'pendiente').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="text-sm" style={{ color: 'rgba(10,9,8,0.6)' }}>
          {lista.length} inscripciones · {pendientes} pendientes ·{' '}
          <a href="/concurso-dj-madrid" target="_blank" rel="noreferrer" className="underline">ver la página</a>
        </p>
        <p className="text-xs" style={{ color: 'rgba(10,9,8,0.45)' }}>
          Comprueba que la sesión es suya, pública, de 30 a 60 minutos y que vive en la Comunidad de Madrid.
        </p>
      </div>

      {lista.length === 0 && (
        <p className="text-sm" style={{ color: 'rgba(10,9,8,0.5)' }}>Todavía no se ha inscrito nadie.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {lista.map(ins => {
          const p = perfiles[ins.user_id];
          const e = ETIQUETA[ins.estado];
          const fueraDeMadrid = p && p.region !== 'Madrid';
          return (
            <div key={ins.id} className="rounded-xl p-4 border bg-white" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-3 mb-3">
                {p?.photo_url
                  ? <img src={p.photo_url} alt="" className="w-11 h-11 rounded-full object-cover" />
                  : <div className="w-11 h-11 rounded-full" style={{ background: '#FBF3DD' }} />}
                <div className="flex-1 min-w-0">
                  <a href={`/p/${ins.user_id}`} target="_blank" rel="noreferrer" className="font-bold text-sm hover:underline">{p?.display_name ?? 'DJ'}</a>
                  <p className="text-xs" style={{ color: 'rgba(10,9,8,0.55)' }}>
                    {p?.zone ?? 'Sin ciudad'}{p?.region ? ` (${p.region})` : ''} · {new Date(ins.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <span className="text-[0.65rem] font-black px-2 py-1 rounded-full" style={{ background: e.bg, color: e.c }}>{e.t}</span>
              </div>

              {fueraDeMadrid && (
                <p className="flex items-center gap-1.5 text-xs font-bold mb-2" style={{ color: '#b91c1c' }}>
                  <AlertTriangle size={13} /> Su perfil no es de la Comunidad de Madrid
                </p>
              )}

              <iframe title={`Sesión de ${p?.display_name ?? 'DJ'}`} src={player(ins.soundcloud_url)} className="w-full rounded-lg" height={110} loading="lazy" />

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <a href={ins.soundcloud_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs underline mr-auto" style={{ color: 'rgba(10,9,8,0.6)' }}>
                  Abrir en SoundCloud <ExternalLink size={11} />
                </a>
                {ins.estado === 'aceptada' && (
                  <span className="text-xs font-bold tabular-nums" style={{ color: '#E11D48' }}>{votos[ins.user_id] ?? 0} me gusta</span>
                )}
                {ins.estado !== 'aceptada' && (
                  <button type="button" disabled={guardando === ins.id} onClick={() => cambiar(ins, 'aceptada')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
                    style={{ background: 'rgba(5,150,105,0.12)', color: '#047857' }}>
                    <CheckCircle size={13} /> Aceptar
                  </button>
                )}
                {ins.estado !== 'rechazada' && (
                  <button type="button" disabled={guardando === ins.id} onClick={() => cambiar(ins, 'rechazada')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
                    style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>
                    <XCircle size={13} /> {ins.estado === 'aceptada' ? 'Retirar' : 'Rechazar'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
