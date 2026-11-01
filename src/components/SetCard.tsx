import { useState } from 'react';
import { ChevronDown, ListMusic } from 'lucide-react';
import SessionAudioPlayer, { type SaltoAudio } from '@/components/SessionAudioPlayer';
import { parseStreamUrl } from '@/lib/streaming';
import { etiquetaMood, fichaTieneContenido, formatTiempo, tituloPorDefecto, type SetFicha } from '@/lib/setFicha';
import { fotoOptimizada } from '@/lib/imagen';

// Tarjeta de un set en el perfil público (perfil de DJ tipo Hearthis, fase 1,
// 1 nov 2026). Sin ficha rellena se ve exactamente igual que antes: solo el
// reproductor. Con ficha suma portada, título, etiquetas, BPM, mood y la
// tracklist; en archivos subidos a XPEAK cada minuto salta a ese punto. En
// SoundCloud/Mixcloud/hearthis el iframe no deja saltar desde fuera, así que
// ahí los minutos son solo informativos.
// En el perfil de DJ (`artista`) el set va siempre como tarjeta con portada
// y título, aunque el DJ no haya rellenado la ficha (opción B, estilo Hearthis).
const SetCard = ({ url, autor, ficha: fichaBD, artista = false, numero = 1 }: {
  url: string; autor?: string; ficha?: SetFicha | null; artista?: boolean; numero?: number;
}) => {
  const [salto, setSalto] = useState<SaltoAudio | null>(null);
  const [tracklistAbierta, setTracklistAbierta] = useState(false);

  const tieneFicha = fichaTieneContenido(fichaBD);
  if (!tieneFicha && !artista) return <SessionAudioPlayer url={url} autor={autor} />;

  const ficha: SetFicha = tieneFicha
    ? fichaBD
    : { set_url: url, titulo: null, portada_url: null, etiquetas: [], bpm: null, mood: null, tracklist: [] };
  const titulo = ficha.titulo || tituloPorDefecto(url, numero);
  const esArchivo = !parseStreamUrl(url);
  const mood = etiquetaMood(ficha.mood);
  const datos = [ficha.bpm ? `${ficha.bpm} BPM` : null, mood].filter(Boolean) as string[];

  return (
    <article className="rounded-2xl p-3 sm:p-4" style={{ background: '#ffffff', border: '1px solid rgba(212,175,55,0.22)' }}>
      <div className="flex items-center gap-3 mb-3">
        {ficha.portada_url ? (
          <img src={fotoOptimizada(ficha.portada_url, 200)} alt={`Portada de ${titulo}`}
            loading="lazy" className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#E3B54F,#B8941E)' }} aria-hidden="true">
            <ListMusic size={22} color="#fff" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-base font-black leading-tight line-clamp-2 break-words" style={{ color: '#111' }}>{titulo}</h3>
          {datos.length > 0 && (
            <p className="text-xs font-semibold mt-0.5" style={{ color: '#8B6A00' }}>{datos.join(' · ')}</p>
          )}
          {ficha.etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {ficha.etiquetas.map(e => (
                <span key={e} className="text-[0.6875rem] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.14)', color: '#7a5a12' }}>{e}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <SessionAudioPlayer url={url} autor={autor} titulo={titulo} saltarA={esArchivo ? salto : null} />

      {ficha.tracklist.length > 0 && (
        <div className="mt-3">
          <button type="button" onClick={() => setTracklistAbierta(a => !a)} aria-expanded={tracklistAbierta}
            className="flex items-center gap-1.5 text-xs font-bold" style={{ color: '#8B6A00' }}>
            <ListMusic size={13} />
            Tracklist ({ficha.tracklist.length} {ficha.tracklist.length === 1 ? 'tema' : 'temas'})
            <ChevronDown size={13} className="transition-transform" style={{ transform: tracklistAbierta ? 'rotate(180deg)' : undefined }} />
          </button>
          {tracklistAbierta && (
            <ol className="mt-2 flex flex-col">
              {ficha.tracklist.map((tema, i) => {
                const contenido = (
                  <>
                    <span className="text-xs font-bold tabular-nums flex-shrink-0" style={{ color: '#8B6A00', minWidth: 44 }}>
                      {formatTiempo(tema.t)}
                    </span>
                    <span className="text-sm min-w-0 truncate" style={{ color: '#222' }}>
                      <span className="font-semibold">{tema.artista}</span>
                      <span style={{ color: '#666' }}> · {tema.tema}</span>
                    </span>
                  </>
                );
                return (
                  <li key={`${tema.t}-${i}`} style={{ borderTop: i ? '1px solid rgba(0,0,0,0.05)' : undefined }}>
                    {esArchivo ? (
                      <button type="button" onClick={() => setSalto({ segundos: tema.t, n: Date.now() })}
                        className="w-full flex items-center gap-2 py-1.5 text-left rounded-md hover:bg-black/[0.03]"
                        aria-label={`Escuchar desde ${formatTiempo(tema.t)}: ${tema.artista}, ${tema.tema}`}>
                        {contenido}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 py-1.5">{contenido}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </article>
  );
};

export default SetCard;
