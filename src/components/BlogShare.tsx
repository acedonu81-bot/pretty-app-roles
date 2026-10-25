import { useState } from 'react';
import { Share2, Link, Check } from 'lucide-react';
import { LogoWhatsApp, LogoFacebook, LogoLinkedIn, LogoTelegram, LogoX } from '@/components/IconosMarcas';

// Cada red con su logo y su color de marca, botón relleno y texto blanco: con
// iconos genéricos y fondos pálidos no se reconocían a primera vista (25 oct).
const BOTON = 'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-85';

export default function BlogShare() {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== 'undefined' ? window.location.href : '';
  const title = typeof document !== 'undefined' ? document.title : 'XPEAK';
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const redes = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, Icon: LogoWhatsApp, bg: '#25D366' },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, Icon: LogoFacebook, bg: '#1877F2' },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, Icon: LogoLinkedIn, bg: '#0A66C2' },
    { label: 'Telegram', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, Icon: LogoTelegram, bg: '#26A5E4' },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, Icon: LogoX, bg: '#000000' },
  ];

  return (
    <div className="my-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl"
      style={{ background: '#FFFDF7', border: '1px solid rgba(122,98,22,0.16)' }}>
      <div className="flex items-center gap-2 text-sm font-semibold shrink-0" style={{ color: '#4b5563' }}>
        <Share2 className="w-4 h-4" />
        <span>Compartir</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {redes.map(({ label, href, Icon, bg }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            className={BOTON} style={{ background: bg }}>
            <Icon className="w-4 h-4" />
            {label}
          </a>
        ))}
        <button onClick={handleCopy} className={BOTON}
          style={{ background: copied ? '#059669' : '#4b5563' }}>
          {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
          {copied ? '¡Copiado!' : 'Copiar link'}
        </button>
      </div>
    </div>
  );
}
