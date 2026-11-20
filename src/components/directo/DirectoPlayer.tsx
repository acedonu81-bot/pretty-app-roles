import { useMemo, useState } from 'react';
import { Play } from 'lucide-react';
import { parseStreamUrl, normalizeStreamUrl } from '@/lib/streaming';
import { enlaceDirectoValido } from '@/lib/directo';

/**
 * Reproductor de un directo (Twitch o YouTube). No carga el iframe hasta que
 * alguien pulsa: así la ficha no baja de velocidad (mismo criterio que
 * EmbedDiferido con Mixcloud y hearthis). La CSP ya permite player.twitch.tv.
 */
export default function DirectoPlayer({ url, titulo }: { url: string; titulo: string }) {
  const [cargado, setCargado] = useState(false);
  // parseStreamUrl acepta cualquier host que "contenga" twitch.tv; aquí se exige el dominio anclado
  // antes de incrustar o enlazar nada que venga de un campo que escribe el usuario.
  const parsed = useMemo(() => (enlaceDirectoValido(url) ? parseStreamUrl(url) : null), [url]);
  if (!parsed) return null;
  const original = normalizeStreamUrl(url);
  const web = parsed.type === 'Twitch' ? 'Twitch' : parsed.type;

  return (
    <div>
      <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: '16 / 9', background: 'radial-gradient(circle at 30% 30%, #3b2a14, #120c05 70%)' }}>
        {cargado ? (
          <iframe
            src={parsed.embedUrl}
            title={titulo}
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none' }}
          />
        ) : (
          <button type="button" onClick={() => setCargado(true)} aria-label={`Ver el directo: ${titulo}`}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-3 text-white">
            <span className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.16)' }}>
              <Play size={26} fill="#fff" color="#fff" style={{ marginLeft: 3 }} />
            </span>
            <span className="text-sm font-bold">Ver el directo</span>
            <span className="absolute left-3 bottom-2 text-[0.75rem]" style={{ color: 'rgba(255,255,255,0.75)' }}>Emite por {web}</span>
          </button>
        )}
      </div>
      {original && (
        <a href={original} target="_blank" rel="noopener noreferrer"
          className="block text-right text-[0.75rem] underline mt-1" style={{ color: '#6b7280' }}>
          ¿No carga? Abrir en {web}
        </a>
      )}
    </div>
  );
}
