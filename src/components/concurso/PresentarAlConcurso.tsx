import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { concursoActivo, estadoInscripcionMadrid } from '@/lib/concursoMadrid';
import { leerEnlaceSoundcloud } from '@/lib/soundcloudEnlace';
import { CONCURSO, inscribirSesion } from '@/lib/concursoInscripcion';

/**
 * Aviso en las sesiones de audio del perfil (14 oct 2026): un DJ de Madrid que
 * ya tiene una sesión de SoundCloud puede presentarla al concurso con un clic.
 * No se inscribe en silencio: la inscripción exige aceptar las bases y
 * autorizar la difusión de la sesión, así que se pide ese consentimiento.
 */
const sb = supabase as unknown as {
  from: (t: string) => {
    select: (c: string) => { eq: (k: string, v: string) => { eq: (k: string, v: string) => { maybeSingle: () => Promise<{ data: unknown }> } } };
  };
};

export default function PresentarAlConcurso({ enlaces }: { enlaces: string[] }) {
  const { user } = useAuth();
  const [elegible, setElegible] = useState(false);
  const [inscrito, setInscrito] = useState(false);
  const [elegida, setElegida] = useState(0);
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const activo = concursoActivo();
  const sesiones = enlaces.filter(u => leerEnlaceSoundcloud(u));

  useEffect(() => {
    if (!user || !activo) return;
    sb.from('concurso_inscripciones').select('estado').eq('concurso', CONCURSO).eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setInscrito(!!data));
    supabase.from('profiles').select('photo_url, bio, region').eq('user_id', user.id)
      .then(({ data }) => setElegible(estadoInscripcionMadrid(data ?? []) === 'ok'));
  }, [user, activo]);

  if (!user || !activo || !elegible || inscrito || sesiones.length === 0) return null;

  const presentar = async () => {
    if (!acepta) { toast.error('Marca que aceptas las bases para presentarla.'); return; }
    setEnviando(true);
    const res = await inscribirSesion(user.id, sesiones[Math.min(elegida, sesiones.length - 1)], 'perfil_audio');
    setEnviando(false);
    if (!res.ok) { toast.error(res.mensaje); return; }
    setInscrito(true);
    toast.success('Sesión presentada al concurso. La revisamos y te avisamos por email.');
  };

  return (
    <div className="rounded-xl px-4 py-4 mb-3" style={{ background: 'linear-gradient(135deg, rgba(43,109,255,0.10), rgba(165,46,224,0.08))', border: '1.5px solid rgba(43,109,255,0.35)' }}>
      <p className="text-sm font-black mb-1 flex items-center gap-2" style={{ color: '#1d3fd6' }}>
        <Trophy size={15} /> ¿Presentar tu sesión al Concurso DJ Madrid?
      </p>
      <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--nightlife-text-secondary)' }}>
        Hasta el 2 nov. Las 3 con más me gusta van a la final y el jurado elige quién se lleva unos Pioneer DJ HDJ-X5. Tiene que ser una mezcla tuya de entre 30 y 80 minutos.
      </p>
      {sesiones.length > 1 && (
        <select value={elegida} onChange={e => setElegida(Number(e.target.value))}
          className="nightlife-input text-xs w-full mb-3" aria-label="Sesión a presentar">
          {sesiones.map((u, i) => <option key={u} value={i}>{u.replace(/^https?:\/\/(www\.)?/, '')}</option>)}
        </select>
      )}
      <label className="flex items-start gap-2 mb-3 cursor-pointer">
        <input type="checkbox" checked={acepta} onChange={e => setAcepta(e.target.checked)} className="mt-0.5 flex-shrink-0 accent-[#2b6dff]" />
        <span className="text-xs leading-relaxed" style={{ color: '#222' }}>
          He leído y acepto las{' '}
          <RouterLink to="/concurso-dj-madrid#bases" target="_blank" className="underline" style={{ color: '#1d3fd6' }}>bases</RouterLink>
          {' '}y autorizo a XPEAK a mostrar mi nombre, foto y esta sesión en el concurso.
        </span>
      </label>
      <button onClick={presentar} disabled={enviando}
        className="px-4 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-50"
        style={{ background: '#2b6dff' }}>
        {enviando ? 'Enviando…' : 'Presentar al concurso'}
      </button>
    </div>
  );
}
