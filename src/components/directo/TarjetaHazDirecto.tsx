import { Radio } from 'lucide-react';
import { puedeHacerDirecto } from '@/lib/directo';
import PildoraDirecto from './PildoraDirecto';

/** Aviso en el perfil de cada profesional (todos los roles): dónde se activa el directo. */
export default function TarjetaHazDirecto({ role, enDirecto, onIr }: { role?: string | null; enDirecto?: boolean; onIr: () => void }) {
  if (!puedeHacerDirecto(role)) return null;
  return (
    <div className="rounded-2xl p-4 mb-6 flex items-center gap-3 flex-wrap sm:flex-nowrap"
      style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.45)' }}>
      <span className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 40, height: 40, background: 'rgba(212,175,55,0.18)' }}>
        <Radio size={20} style={{ color: '#8B6A00' }} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-sm" style={{ color: '#1a1208' }}>Haz un directo y consigue más visibilidad</p>
          {enDirecto && <PildoraDirecto texto="Estás en directo" />}
        </div>
        <p className="text-xs mt-0.5" style={{ color: '#4a3f2a' }}>
          Emite por Twitch y apareces "en directo" en la portada de XPEAK y en tu ficha. Quien te vea puede pedirte presupuesto al momento.
        </p>
      </div>
      <button type="button" onClick={onIr} className="font-black text-sm px-4 py-2.5 rounded-xl whitespace-nowrap w-full sm:w-auto"
        style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
        {enDirecto ? 'Gestionar directo' : 'Hacer un directo'}
      </button>
    </div>
  );
}
