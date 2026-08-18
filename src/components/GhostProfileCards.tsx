import { Lock } from 'lucide-react';

interface Props {
  role: string;
  className?: string;
}

// Hash determinista simple del rol → mismo número de fantasmas siempre para
// la misma categoría (no cambia en cada carga, evita que se note el patrón),
// pero distinto entre categorías para que parezca contenido real y no una
// plantilla repetida. Rango 4-11: suficiente para sugerir "hay mucho más"
// sin exagerar hasta lo increíble.
function ghostCountFor(role: string): number {
  let hash = 0;
  for (let i = 0; i < role.length; i++) hash = (hash * 31 + role.charCodeAt(i)) >>> 0;
  return 4 + (hash % 8);
}

/**
 * Tarjetas placeholder muy difuminadas para el directorio público sin login
 * — dan sensación de "hay mucho más contenido" sin crear perfiles falsos en
 * la base de datos. Solo visual, sin datos reales ni enlaces funcionales.
 */
export default function GhostProfileCards({ role, className }: Props) {
  const count = ghostCountFor(role);
  const items = Array.from({ length: count });

  return (
    <div className={className}>
      {/* Altura fija: aunque haya hasta 11 fantasmas, el bloque visible se
          recorta aquí para que el CTA aparezca cerca del scroll real del
          usuario en vez de al final de un grid larguísimo en móvil (1 col). */}
      <div className="relative overflow-hidden" style={{ maxHeight: '520px' }} aria-hidden="true">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden flex flex-col bg-white select-none pointer-events-none"
              style={{ border: '1px solid rgba(0,0,0,0.08)', filter: 'blur(3px)', opacity: 0.8 }}>
              <div className="relative aspect-card-photo overflow-hidden">
                <div className="w-full h-full" style={{ background: `linear-gradient(135deg, hsl(${(i * 47) % 360},35%,82%), hsl(${(i * 47 + 40) % 360},35%,72%))` }} />
              </div>
              <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
                <div className="h-4 rounded" style={{ width: '70%', background: 'rgba(0,0,0,0.18)' }} />
                <div className="h-3 rounded" style={{ width: '45%', background: 'rgba(0,0,0,0.12)' }} />
                <div className="h-8 rounded-xl mt-auto" style={{ background: 'rgba(0,0,0,0.1)' }} />
              </div>
            </div>
          ))}
        </div>
        {/* Overlay de desvanecido hacia abajo + CTA, anclado a los últimos
            ~60% del bloque de altura fija (no del grid completo). */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-8"
          style={{ top: '40%', background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.9) 40%, #fff 75%)' }}>
          <div className="flex flex-col items-center gap-3 text-center px-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)' }}>
              <Lock size={16} style={{ color: '#8A6D0F' }} />
            </div>
            <p className="text-sm font-black" style={{ color: '#111' }}>
              Hay {count} profesionales más en esta categoría
            </p>
            <p className="text-xs max-w-xs" style={{ color: '#555' }}>
              Regístrate gratis para ver todos los perfiles, precios y contactar directamente.
            </p>
            <a href="/auth?role=profesional"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Ver todos gratis
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
