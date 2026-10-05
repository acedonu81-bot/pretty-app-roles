import { ExternalLink } from 'lucide-react';
import { detectProductionType, buildProductionEmbedSrc, PRODUCTION_PLATFORM_LABEL } from '@/lib/productions';

// Render de un enlace de producción (Spotify/Apple Music/YouTube/Bandcamp/Beatport/Patreon)
// en la ficha pública del profesional. Mismo criterio que ProductionsUpload: embed real
// cuando la plataforma lo permite, enlace directo cuando no.
const ProductionLink = ({ url }: { url: string }) => {
  const type = detectProductionType(url);
  if (!type) return null;
  const embedSrc = buildProductionEmbedSrc(url, type);

  if (embedSrc) {
    return (
      <iframe
        src={embedSrc}
        width="100%"
        height={type === 'youtube' ? 180 : 152}
        allow="autoplay; encrypted-media"
        className="rounded-xl"
        style={{ border: 'none' }}
      />
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.01]"
      style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', color: '#2563EB' }}>
      Escuchar en {PRODUCTION_PLATFORM_LABEL[type]} <ExternalLink size={14} />
    </a>
  );
};

export default ProductionLink;
