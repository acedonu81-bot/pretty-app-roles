import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useDirectoAhora } from '@/hooks/useDirectoAhora';
import { ROLE_LABELS } from '@/hooks/useActivityFeed';
import PildoraDirecto from './PildoraDirecto';

/**
 * Barra fina sobre la cabecera de la landing. Solo aparece si hay alguien en
 * directo de verdad (la consulta lleva la caducidad de 8 h); si no, no pinta nada.
 * Con una persona enlaza a su ficha; con dos o más muestra la lista desplegable.
 */
export default function BarraDirecto() {
  const { directos } = useDirectoAhora();
  const [abierta, setAbierta] = useState(false);
  // Una persona con varios perfiles en directo cuenta una sola vez.
  const personas = useMemo(() => {
    const vistos = new Set<string>();
    return directos.filter(d => (vistos.has(d.user_id) ? false : (vistos.add(d.user_id), true)));
  }, [directos]);
  if (personas.length === 0) return null;

  const primero = personas[0];
  const nombre = (d: typeof primero) => d.display_name ?? 'Un profesional';
  const varios = personas.length > 1;

  return (
    <div role="status" style={{ background: '#FBF3DD', borderBottom: '1px solid rgba(212,175,55,0.45)', color: '#1a1208' }}>
      <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-3 px-3 py-2 text-[0.82rem] sm:text-sm">
        <PildoraDirecto />
        <span className="min-w-0 truncate">
          {varios
            ? <><b>{personas.length}</b><span className="sm:hidden"> en directo</span><span className="hidden sm:inline"> profesionales están en directo ahora</span></>
            : <><b>{nombre(primero)}</b> está en directo ahora</>}
        </span>
        {varios ? (
          <button type="button" onClick={() => setAbierta(a => !a)} aria-expanded={abierta}
            className="flex-shrink-0 inline-flex items-center gap-1 font-black text-[0.82rem] px-3.5 py-1.5 rounded-full"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
            Ver directos <ChevronDown size={14} style={{ transform: abierta ? 'rotate(180deg)' : undefined }} />
          </button>
        ) : (
          <Link to={`/p/${primero.user_id}`} className="flex-shrink-0 font-black text-[0.82rem] px-3.5 py-1.5 rounded-full"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
            Ver directo
          </Link>
        )}
      </div>
      {varios && abierta && (
        <ul className="max-w-xl mx-auto px-3 pb-3 flex flex-col gap-1.5">
          {personas.map(d => (
            <li key={d.user_id}>
              <Link to={`/p/${d.user_id}`} className="flex items-center gap-3 rounded-xl px-3 py-2"
                style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.35)' }}>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-sm truncate">{nombre(d)}</span>
                  <span className="block text-xs truncate" style={{ color: '#4a3f2a' }}>
                    {[ROLE_LABELS[d.role ?? ''] ?? d.role, d.zone, d.stream_title].filter(Boolean).join(' · ')}
                  </span>
                </span>
                <span className="font-black text-xs" style={{ color: '#7a6216' }}>Ver</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
