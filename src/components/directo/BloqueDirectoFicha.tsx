import { useEffect } from 'react';
import { useDirectoAhora } from '@/hooks/useDirectoAhora';
import { medirDirecto } from '@/lib/track';
import DirectoPlayer from './DirectoPlayer';
import PildoraDirecto from './PildoraDirecto';

/** Bloque del directo en la ficha pública. Si la persona no está emitiendo, no pinta nada. */
export default function BloqueDirectoFicha({ userId, nombre, onContactar }: { userId?: string | null; nombre: string; onContactar: () => void }) {
  const { directos } = useDirectoAhora(userId ?? undefined);
  const hayDirecto = !!userId && directos.length > 0;
  useEffect(() => { if (hayDirecto) medirDirecto('ficha_vista', 'ficha', userId); }, [hayDirecto, userId]);
  if (!userId || directos.length === 0) return null;
  const d = directos[0];
  return (
    <section aria-label={`${nombre} está en directo`} className="rounded-2xl p-3.5 sm:p-4"
      style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.45)' }}>
      <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
        <PildoraDirecto texto="En directo ahora" />
        <span className="text-sm font-bold" style={{ color: '#1a1208' }}>{d.stream_title?.trim() || `Sesión de ${nombre}`}</span>
      </div>
      <DirectoPlayer userId={userId} url={d.stream_url} titulo={d.stream_title?.trim() || `Directo de ${nombre}`} />
      <div className="flex items-center justify-between gap-3 flex-wrap mt-3">
        <span className="text-sm" style={{ color: '#4a3f2a' }}>Si te gusta lo que ves, pídele presupuesto sin salir de XPEAK.</span>
        <button type="button" onClick={() => { medirDirecto('escribir', 'ficha_directo', userId); onContactar(); }} className="font-black text-sm px-5 py-2.5 rounded-xl whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 6px 20px rgba(212,175,55,0.35)' }}>
          Escríbele ahora
        </button>
      </div>
    </section>
  );
}

/** Píldora "EN VIVO" de la cabecera de la ficha: solo si el directo está vigente. */
export function PildoraHeroDirecto({ userId }: { userId?: string | null }) {
  const { directos } = useDirectoAhora(userId ?? undefined);
  if (!userId || directos.length === 0) return null;
  return <PildoraDirecto texto="En vivo" />;
}
