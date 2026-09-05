import { ExternalLink } from 'lucide-react';
import { AFFILIATE_CATALOG, resolveAffiliateKey, hexToRgba } from '@/lib/affiliate';
import { logAffiliateClick } from '@/lib/track';

/**
 * Bloque de recursos/equipo recomendado con enlaces de afiliado Amazon (tag
 * xpeak-21), ESPECÍFICO por rol: cada oficio ve el equipo que de verdad usa
 * (camarero → sacacorchos, DJ → auriculares, fotógrafo → objetivos…). Esto es
 * contenido genuino y útil — reduce el riesgo de sanción de Amazon frente a un
 * bloque genérico repetido en cientos de páginas.
 *
 * El catálogo vive en @/lib/affiliate porque el panel de Recursos del
 * dashboard usa exactamente los mismos productos. Aquí se muestran solo los 3
 * primeros: un artículo de blog no puede llevar 8 tarjetas de compra sin
 * parecer un panfleto (y sin hundir el propio contenido del artículo). El
 * catálogo completo se ve dentro del panel, donde el profesional entra a
 * buscar equipo a propósito.
 *
 * @param role rol del blog (dj, camareros, fotografo…). Por defecto 'dj'
 * (retrocompatibilidad con los blogs de DJ que ya lo usaban sin props).
 * Roles sin catálogo real (general, empresario — organizadores no compran
 * "equipo profesional" de oficio) NO caen a DJ por defecto: antes cualquier
 * rol desconocido mostraba auriculares/controladora de DJ en un blog de
 * animadores o de organización de bodas, contenido irrelevante que ni
 * siquiera genera comisión real (mala señal para Amazon y para el lector).
 */
export default function DJResourcesAffiliate({ role = 'dj' }: { role?: string }) {
  const key = resolveAffiliateKey(role);
  if (!key) return null;
  const cat = AFFILIATE_CATALOG[key];
  const HeaderIcon = cat.icon;
  const accent = cat.accent;
  const items = cat.items.slice(0, 3);

  return (
    <section className="mt-10 mb-4">
      <div className="rounded-2xl p-5 sm:p-6"
        style={{ background: hexToRgba(accent, 0.05), border: `1px solid ${hexToRgba(accent, 0.18)}` }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: hexToRgba(accent, 0.12), border: `1px solid ${hexToRgba(accent, 0.25)}`, color: accent }}>
            <HeaderIcon size={16} />
          </div>
          <h3 className="text-base font-black" style={{ color: accent }}>Equipo recomendado para {cat.label}</h3>
        </div>
        <p className="text-xs mb-5" style={{ color: '#666' }}>
          Material que usan profesionales del sector. Selección de XPEAK.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {items.map(r => {
            const Icon = r.icon;
            return (
              <a key={r.title} href={r.href} target="_blank" rel="sponsored noopener noreferrer"
                onClick={() => logAffiliateClick(r.title)}
                className="flex flex-col rounded-xl p-4 transition-all hover:scale-[1.02]"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
                <Icon size={20} style={{ color: accent }} className="mb-2" />
                <p className="text-sm font-bold mb-1" style={{ color: '#111' }}>{r.title}</p>
                <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: '#555' }}>{r.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: accent }}>
                  Ver en Amazon <ExternalLink size={11} />
                </span>
              </a>
            );
          })}
        </div>

        <p className="text-[0.65rem] mt-4 leading-relaxed" style={{ color: '#999' }}>
          XPEAK puede recibir una comisión por las compras realizadas a través de estos enlaces de Amazon, sin coste
          adicional para ti. Solo recomendamos equipo que consideramos útil para profesionales del sector.
        </p>
      </div>
    </section>
  );
}
