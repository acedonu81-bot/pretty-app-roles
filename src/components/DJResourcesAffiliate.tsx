import { Headphones, Disc3, Music, ExternalLink } from 'lucide-react';

/**
 * Bloque de recursos recomendados para DJs con enlaces de afiliado.
 * Amazon Afiliados (ID xpeak-21) ya está activo. Loopmasters/Beatport está
 * pendiente de aprobación — cuando llegue, sustituir AFF.loopmasters por el
 * enlace real del panel Post Affiliate Pro y activar ese recurso.
 *
 * Aviso legal de afiliación incluido al pie (obligatorio).
 */

// Enlaces generados con SiteStripe desde el panel de Amazon Afiliados (ID
// xpeak-21) — cada uno ya lleva el tag de afiliado incluido por Amazon.
const RESOURCES: { icon: typeof Music; title: string; desc: string; cta: string; href: string }[] = [
  {
    icon: Headphones,
    title: 'Auriculares DJ profesionales',
    desc: 'Referencia del sector para monitorizar tus mezclas con precisión, en cabina y en estudio.',
    cta: 'Ver en Amazon',
    href: 'https://www.amazon.es/s?k=auriculares+dj+pioneer&tag=xpeak-21',
  },
  {
    icon: Disc3,
    title: 'Controladora / mesa de mezclas',
    desc: 'Equipo compacto para practicar en casa o llevar a bolos pequeños.',
    cta: 'Ver en Amazon',
    href: 'https://www.amazon.es/s?k=controladora+dj&tag=xpeak-21',
  },
  {
    icon: Music,
    title: 'Monitor de estudio / altavoz activo',
    desc: 'Para producir y afinar tus sets con un sonido fiable.',
    cta: 'Ver en Amazon',
    href: 'https://www.amazon.es/s?k=monitor+estudio+krk&tag=xpeak-21',
  },
];

export default function DJResourcesAffiliate() {
  return (
    <section className="mt-10 mb-4">
      <div className="rounded-2xl p-5 sm:p-6"
        style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.18)' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', color: '#8A6D0F' }}>
            <Disc3 size={16} />
          </div>
          <h3 className="text-base font-black" style={{ color: '#D4AF37' }}>Recursos recomendados para DJs</h3>
        </div>
        <p className="text-xs mb-5" style={{ color: 'rgba(212,175,55,0.6)' }}>
          Equipo que usan DJs y productores profesionales. Selección de XPEAK.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {RESOURCES.map(r => {
            const Icon = r.icon;
            return (
              <a key={r.title} href={r.href} target="_blank" rel="sponsored noopener noreferrer"
                className="flex flex-col rounded-xl p-4 transition-all hover:scale-[1.02]"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
                <Icon size={20} style={{ color: '#8A6D0F' }} className="mb-2" />
                <p className="text-sm font-bold mb-1" style={{ color: '#111' }}>{r.title}</p>
                <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: '#555' }}>{r.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: '#8A6D0F' }}>
                  {r.cta} <ExternalLink size={11} />
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
