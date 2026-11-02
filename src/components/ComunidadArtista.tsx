import { Repeat2, Users } from 'lucide-react';
import SetFilaArtista from '@/components/SetFilaArtista';
import { fotoOptimizada } from '@/lib/imagen';
import type { RepostHecho, Seguidor } from '@/hooks/useComunidadArtista';

// Pestañas "Seguidores" y "Reposts" del perfil de DJ (2 nov 2026). Solo
// salen con nombre los profesionales con oficio; empresarios y cuentas sin rol
// se cuentan sin nombre ("y 3 personas más"): sin exposición pública.

export const PanelSeguidores = ({ seguidores, total }: { seguidores: Seguidor[] | null; total: number }) => {
  if (!total) {
    return <p className="text-sm rounded-2xl p-5" style={{ color: '#555', background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}>Todavía no le sigue nadie. Sé el primero.</p>;
  }
  // Sin la lista (cargando o error) no se sabe quién es profesional y quién
  // organizador: solo el número, sin clasificar a nadie.
  if (!seguidores) {
    return <p className="text-sm flex items-center gap-2" style={{ color: '#555' }}><Users size={15} style={{ color: '#2563EB' }} />{total} {total === 1 ? 'seguidor' : 'seguidores'}</p>;
  }
  const sinNombre = Math.max(0, total - seguidores.length);
  return (
    <div>
      <ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        {seguidores.map(s => (
          <li key={s.user_id}>
            <a href={`/p/${s.user_id}`} className="flex flex-col items-center text-center gap-1.5 group">
              {s.foto ? (
                <img src={fotoOptimizada(s.foto, 160)} alt="" aria-hidden="true" loading="lazy"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover transition-transform group-hover:scale-105"
                  style={{ border: '2px solid rgba(212,175,55,0.4)', objectPosition: '50% 20%' }} />
              ) : (
                <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-xl font-black"
                  style={{ background: 'linear-gradient(135deg,#3B82F6,#2563EB)', color: '#fff' }} aria-hidden="true">
                  {s.nombre.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="text-xs font-bold line-clamp-2" style={{ color: '#222' }}>{s.nombre}</span>
            </a>
          </li>
        ))}
      </ul>
      {sinNombre > 0 && (
        <p className="text-sm mt-4 flex items-center gap-2" style={{ color: '#555' }}>
          <Users size={15} style={{ color: '#2563EB' }} />
          {/* Sin nombre van organizadores y cuentas que aún no han elegido
              rol: "personas" vale para ambos sin afirmar lo que no sabemos. */}
          {seguidores.length
            ? `Y ${sinNombre} ${sinNombre === 1 ? 'persona más' : 'personas más'}`
            : `${sinNombre} ${sinNombre === 1 ? 'persona' : 'personas'}`}
        </p>
      )}
    </div>
  );
};

export const ListaReposts = ({ nombre, reposts, viewerId, onIniciarSesion }: {
  nombre: string; reposts: RepostHecho[]; viewerId?: string; onIniciarSesion: () => void;
}) => {
  if (!reposts.length) {
    return <p className="text-sm rounded-2xl p-5" style={{ color: '#555', background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}>{nombre} todavía no ha recomendado ningún set.</p>;
  }
  return (
    <div className="flex flex-col">
      {reposts.map((r, i) => (
        <div key={r.set_url}>
          <p className="flex items-center gap-1.5 text-xs font-bold pt-4" style={{ color: '#2563EB' }}>
            <Repeat2 size={13} /> {nombre} ha recomendado un set de <a href={`/p/${r.dj_user_id}`} className="underline">{r.dj_nombre ?? 'otro DJ'}</a>
          </p>
          <SetFilaArtista url={r.set_url} autor={r.dj_nombre ?? 'DJ'} ficha={null} numero={i + 1} destacado={false}
            estiloPorDefecto={null} djUserId={r.dj_user_id} viewerId={viewerId} onIniciarSesion={onIniciarSesion} />
        </div>
      ))}
    </div>
  );
};
