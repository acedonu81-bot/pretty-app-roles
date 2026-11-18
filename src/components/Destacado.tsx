import { Star } from 'lucide-react';

// Posición destacada de Premium (18 nov 2026): aro dorado en la tarjeta y la
// etiqueta "Destacado". Rotular la posición de pago es obligatorio (Reglamento
// UE 2019/1150 y normativa de consumidores), así que el aro nunca va sin etiqueta.
// Quien decide si una tarjeta lo lleva es esDestacado() de dailyRotation.ts.

export const ANILLO_DESTACADO = '0 0 0 2px #D4AF37, 0 8px 26px rgba(212,175,55,0.32)';

export const TEXTO_DESTACADO = 'Perfil Premium: aparece destacado en el directorio';

export const EtiquetaDestacado = ({ className = '' }: { className?: string }) => (
  <span title={TEXTO_DESTACADO}
    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[0.75rem] font-black ${className}`}
    style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#1d1a12', boxShadow: '0 1px 6px rgba(0,0,0,0.25)' }}>
    <Star size={10} fill="#1d1a12" strokeWidth={0} aria-hidden="true" /> Destacado
  </span>
);
