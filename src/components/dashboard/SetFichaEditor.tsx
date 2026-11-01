import { useMemo, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  BPM_MAX, BPM_MIN, MAX_ETIQUETAS, MAX_TEMAS, MAX_TITULO, MOODS,
  formatTiempo, parseTracklistTexto, type SetFicha,
} from '@/lib/setFicha';

const MAX_PORTADA_MB = 5;
const MAX_ETIQUETA = 30;

const textoDesdeTracklist = (f?: SetFicha | null) =>
  (f?.tracklist ?? []).map(t => `${formatTiempo(t.t)} ${t.artista} - ${t.tema}`).join('\n');

// Ficha de un set (perfil de DJ tipo Hearthis, fase 1, 1 nov 2026). La
// tracklist se edita como texto pegado porque es lo que el DJ ya tiene
// (exportada de Rekordbox/Serato o en la descripción de SoundCloud): una
// tabla de filas obligaría a meter 20 temas a mano.
const SetFichaEditor = ({ userId, setUrl, ficha, sugerencias = [], onGuardada, onCerrar }: {
  userId: string;
  setUrl: string;
  ficha?: SetFicha | null;
  sugerencias?: string[];
  onGuardada: () => void;
  onCerrar: () => void;
}) => {
  const [titulo, setTitulo] = useState(ficha?.titulo ?? '');
  const [portada, setPortada] = useState<string | null>(ficha?.portada_url ?? null);
  const [etiquetas, setEtiquetas] = useState<string[]>(ficha?.etiquetas ?? []);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const [bpm, setBpm] = useState(ficha?.bpm ? String(ficha.bpm) : '');
  const [mood, setMood] = useState<string | null>(ficha?.mood ?? null);
  const [tracklistTexto, setTracklistTexto] = useState(() => textoDesdeTracklist(ficha));
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const inputPortada = useRef<HTMLInputElement>(null);

  const temas = useMemo(() => parseTracklistTexto(tracklistTexto), [tracklistTexto]);
  const lineasConTexto = tracklistTexto.split(/\r?\n/).filter(l => l.trim()).length;
  const bpmNum = bpm ? Number(bpm) : null;
  const bpmValido = bpmNum === null || (Number.isInteger(bpmNum) && bpmNum >= BPM_MIN && bpmNum <= BPM_MAX);

  const anadirEtiqueta = (valor: string) => {
    const e = valor.trim().slice(0, MAX_ETIQUETA);
    if (!e) return;
    if (etiquetas.some(x => x.toLowerCase() === e.toLowerCase())) { setNuevaEtiqueta(''); return; }
    if (etiquetas.length >= MAX_ETIQUETAS) { toast.error(`Máximo ${MAX_ETIQUETAS} etiquetas por set.`); return; }
    setEtiquetas([...etiquetas, e]);
    setNuevaEtiqueta('');
  };

  const subirPortada = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { toast.error('La portada tiene que ser JPG, PNG o WebP.'); return; }
    if (file.size > MAX_PORTADA_MB * 1024 * 1024) { toast.error(`La portada no puede pasar de ${MAX_PORTADA_MB} MB.`); return; }
    setSubiendo(true);
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `${userId}/covers/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('audio-sessions').upload(path, file, { contentType: file.type });
    setSubiendo(false);
    if (error) { toast.error('No se pudo subir la portada. Inténtalo de nuevo.'); return; }
    setPortada(supabase.storage.from('audio-sessions').getPublicUrl(path).data.publicUrl);
  };

  const guardar = async () => {
    if (!bpmValido) { toast.error(`El BPM tiene que estar entre ${BPM_MIN} y ${BPM_MAX}.`); return; }
    setGuardando(true);
    const { error } = await supabase.from('dj_set_fichas').upsert({
      user_id: userId,
      set_url: setUrl,
      titulo: titulo.trim() || null,
      portada_url: portada,
      etiquetas,
      bpm: bpmNum,
      mood,
      tracklist: temas.map(t => ({ t: t.t, artista: t.artista, tema: t.tema })),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,set_url' });
    setGuardando(false);
    if (error) { toast.error('No se pudo guardar la ficha del set. Inténtalo de nuevo.'); return; }
    toast.success('Ficha del set guardada.');
    onGuardada();
    onCerrar();
  };

  const sugerenciasLibres = sugerencias.filter(s => !etiquetas.some(e => e.toLowerCase() === s.toLowerCase())).slice(0, 8);
  const campo = 'nightlife-input text-base w-full';
  const etiquetaCampo = 'block text-xs font-bold mb-1';

  return (
    <div className="rounded-xl p-3 space-y-3" style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.3)' }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-black" style={{ color: '#8A6D0F' }}>Ficha del set</p>
        <button type="button" onClick={onCerrar} aria-label="Cerrar ficha del set"><X size={16} className="text-muted-foreground" /></button>
      </div>

      <div className="flex gap-3 items-start">
        <button type="button" onClick={() => inputPortada.current?.click()} disabled={subiendo}
          className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center disabled:opacity-50"
          style={{ background: 'rgba(212,175,55,0.1)', border: '1px dashed rgba(212,175,55,0.5)' }}
          aria-label={portada ? 'Cambiar portada' : 'Subir portada'}>
          {portada
            ? <img src={portada} alt="Portada del set" className="w-full h-full object-cover" />
            : <span className="flex flex-col items-center gap-1 text-[0.6875rem] font-bold" style={{ color: '#8A6D0F' }}>
                <ImagePlus size={18} />{subiendo ? 'Subiendo…' : 'Portada'}
              </span>}
        </button>
        <div className="flex-1 min-w-0">
          <label className={etiquetaCampo} htmlFor="set-titulo" style={{ color: '#333' }}>Título</label>
          <input id="set-titulo" value={titulo} onChange={e => setTitulo(e.target.value)} maxLength={MAX_TITULO}
            placeholder="Ej.: Sesión de verano en la terraza" className={campo} />
          {portada && (
            <button type="button" onClick={() => setPortada(null)} className="text-xs font-semibold mt-1.5" style={{ color: '#8A6D0F' }}>
              Quitar portada
            </button>
          )}
        </div>
      </div>
      <input ref={inputPortada} type="file" accept="image/jpeg,image/png,image/webp" onChange={subirPortada} className="hidden" />

      <div>
        <label className={etiquetaCampo} htmlFor="set-etiqueta" style={{ color: '#333' }}>Etiquetas ({etiquetas.length}/{MAX_ETIQUETAS})</label>
        {etiquetas.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1.5">
            {etiquetas.map(e => (
              <button key={e} type="button" onClick={() => setEtiquetas(etiquetas.filter(x => x !== e))}
                className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: '#7a5a12' }}
                aria-label={`Quitar etiqueta ${e}`}>
                {e} ×
              </button>
            ))}
          </div>
        )}
        {etiquetas.length < MAX_ETIQUETAS && (
          <>
            <input id="set-etiqueta" value={nuevaEtiqueta} onChange={e => setNuevaEtiqueta(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); anadirEtiqueta(nuevaEtiqueta); } }}
              onBlur={() => anadirEtiqueta(nuevaEtiqueta)}
              maxLength={MAX_ETIQUETA} placeholder="Escribe y pulsa Intro (Tech House, Afterwork...)" className={campo} />
            {sugerenciasLibres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {sugerenciasLibres.map(s => (
                  <button key={s} type="button" onClick={() => anadirEtiqueta(s)}
                    className="text-xs px-2 py-0.5 rounded-full" style={{ border: '1px solid rgba(212,175,55,0.35)', color: '#555' }}>
                    + {s}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-[6rem_1fr] gap-3 items-start">
        <div>
          <label className={etiquetaCampo} htmlFor="set-bpm" style={{ color: '#333' }}>BPM</label>
          <input id="set-bpm" type="number" inputMode="numeric" min={BPM_MIN} max={BPM_MAX} value={bpm}
            onChange={e => setBpm(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="124" className={campo}
            aria-invalid={!bpmValido} />
        </div>
        <div>
          <span className={etiquetaCampo} style={{ color: '#333' }}>Mood</span>
          <div className="flex flex-wrap gap-1">
            {MOODS.map(m => {
              const sel = mood === m.valor;
              return (
                <button key={m.valor} type="button" onClick={() => setMood(sel ? null : m.valor)} aria-pressed={sel}
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={sel
                    ? { background: '#D4AF37', color: '#000', border: '1px solid #D4AF37' }
                    : { background: '#fff', color: '#555', border: '1px solid rgba(0,0,0,0.12)' }}>
                  {m.etiqueta}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <label className={etiquetaCampo} htmlFor="set-tracklist" style={{ color: '#333' }}>Tracklist</label>
        <textarea id="set-tracklist" value={tracklistTexto} onChange={e => setTracklistTexto(e.target.value)} rows={6}
          placeholder={'Pega tu tracklist, un tema por línea con su minuto:\n0:00 Artista - Tema\n4:30 Artista - Tema'}
          className={`${campo} font-mono text-sm`} />
        {lineasConTexto > 0 && (
          <p className="text-xs mt-1" style={{ color: temas.length < lineasConTexto ? '#8A6D0F' : '#059669' }}>
            {temas.length} {temas.length === 1 ? 'tema reconocido' : 'temas reconocidos'}
            {temas.length < lineasConTexto && ` de ${lineasConTexto} líneas: cada tema necesita su minuto delante y un guion entre artista y tema.`}
            {temas.length >= MAX_TEMAS && ` Máximo ${MAX_TEMAS} temas.`}
          </p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCerrar} className="px-3 py-2 rounded-lg text-sm font-bold" style={{ color: '#555' }}>Cancelar</button>
        <button type="button" onClick={guardar} disabled={guardando || subiendo}
          className="px-4 py-2 rounded-lg text-sm font-black disabled:opacity-50" style={{ background: '#D4AF37', color: '#000' }}>
          {guardando ? 'Guardando…' : 'Guardar ficha'}
        </button>
      </div>
    </div>
  );
};

export default SetFichaEditor;
