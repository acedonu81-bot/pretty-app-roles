import { ArrowRight, Sparkles } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { AFFILIATE_CATALOG, resolveAffiliateKey } from '@/lib/affiliate';

/**
 * Tarjeta de entrada a Recursos para la home del dashboard.
 *
 * Va en la home porque el panel de Recursos, colgando solo del sidebar, lo
 * abriría casi nadie: el sidebar arranca COLAPSADO a icon-rail, así que
 * "Recursos" es un icono sin etiqueta hasta que el usuario despliega la barra
 * a propósito. Esta tarjeta es lo que le da visibilidad real.
 *
 * Dorado XPEAK y no un color de "anuncio": esto no es publicidad de un
 * tercero metida con calzador, es una sección del producto — y así se lee.
 */
const ResourcesBanner = ({ onNavigate }: { onNavigate?: (view: string) => void }) => {
  const { role } = useProfile();
  const key = role ? resolveAffiliateKey(role) : null;
  const cat = key ? AFFILIATE_CATALOG[key] : null;

  // Sin catálogo para el rol no hay nada que prometer: mejor no pintar la
  // tarjeta que llevar a una sección medio vacía.
  if (!cat || !onNavigate) return null;

  const count = cat.items.length;
  const Icon = cat.icon;

  return (
    <button
      onClick={() => onNavigate('resources')}
      className="group w-full text-left rounded-2xl p-4 sm:p-5 mb-4 sm:mb-5 transition-all hover:shadow-md relative overflow-hidden"
      style={{
        background: 'linear-gradient(115deg, #1a1208 0%, #2d2110 45%, #3d2d15 100%)',
        border: '1px solid rgba(212,175,55,0.35)',
      }}
    >
      {/* Brillo dorado difuso, ancla la mirada sin tapar el texto */}
      <span
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          right: -60, top: -60, width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.28) 0%, rgba(212,175,55,0) 70%)',
        }}
      />

      <div className="relative flex items-center gap-3 sm:gap-4">
        <div
          className="hidden sm:flex items-center justify-center rounded-xl flex-shrink-0 transition-transform group-hover:scale-105"
          style={{
            width: 48, height: 48,
            background: 'linear-gradient(135deg,#E0BC4B,#B8941E)',
            color: '#1a1208',
            boxShadow: '0 2px 10px rgba(212,175,55,0.3)',
          }}
        >
          <Icon size={23} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={12} style={{ color: '#E0BC4B' }} className="flex-shrink-0" />
            <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.14em]" style={{ color: '#E0BC4B' }}>
              Recursos para {cat.singular}
            </span>
          </div>
          <p className="text-[0.95rem] sm:text-base font-black leading-snug" style={{ color: '#fff' }}>
            Guías, plantillas y el equipo que usan los profesionales
          </p>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {count} imprescindibles de tu oficio, contrato listo para firmar y calculadora de tarifas.
          </p>
        </div>

        <span
          className="flex-shrink-0 flex items-center justify-center rounded-full transition-transform group-hover:translate-x-1"
          style={{
            width: 32, height: 32,
            background: 'rgba(212,175,55,0.15)',
            border: '1px solid rgba(212,175,55,0.3)',
            color: '#E0BC4B',
          }}
        >
          <ArrowRight size={16} />
        </span>
      </div>
    </button>
  );
};

export default ResourcesBanner;
