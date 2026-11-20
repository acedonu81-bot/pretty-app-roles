import { Link } from 'react-router-dom';
import { useDirectoAhora } from '@/hooks/useDirectoAhora';
import PildoraDirecto from './PildoraDirecto';

/**
 * Barra fina sobre la cabecera de la landing. Solo aparece si hay alguien en
 * directo de verdad (la consulta lleva la caducidad de 8 h); si no, no pinta nada.
 */
export default function BarraDirecto() {
  const { directos } = useDirectoAhora();
  if (directos.length === 0) return null;
  const d = directos[0];
  const resto = directos.length - 1;
  const nombre = d.display_name ?? 'Un profesional';

  return (
    <div role="status" className="flex items-center justify-between sm:justify-center gap-2 sm:gap-3 px-3 py-2 text-[0.82rem] sm:text-sm"
      style={{ background: '#FBF3DD', borderBottom: '1px solid rgba(212,175,55,0.45)', color: '#1a1208' }}>
      <PildoraDirecto />
      <span className="min-w-0 truncate"><b>{nombre}</b> {resto > 0 ? `y ${resto} más están` : 'está'} en directo ahora</span>
      <Link to={`/p/${d.user_id}`} className="flex-shrink-0 font-black text-[0.82rem] px-3.5 py-1.5 rounded-full"
        style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
        Ver directo
      </Link>
    </div>
  );
}
