import { useState } from 'react';
import { Share2, MessageCircle, Twitter, Facebook, Linkedin, Send, Link, Check } from 'lucide-react';

// Antes usaba clases de tema oscuro (text-neutral-300 sobre bg-white/5) y en
// el blog, que es claro, Twitter y "Copiar link" casi no se veían (25 oct).
const BOTON = 'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors';

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
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, Icon: MessageCircle, color: '#128C4A', bg: 'rgba(37,211,102,0.12)' },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, Icon: Facebook, color: '#1877F2', bg: 'rgba(24,119,242,0.10)' },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, Icon: Linkedin, color: '#0A66C2', bg: 'rgba(10,102,194,0.10)' },
    { label: 'Telegram', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, Icon: Send, color: '#1A8AC4', bg: 'rgba(38,165,228,0.12)' },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, Icon: Twitter, color: '#111827', bg: 'rgba(17,24,39,0.07)' },
  ];

  return (
    <div className="my-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl"
      style={{ background: '#FFFDF7', border: '1px solid rgba(122,98,22,0.16)' }}>
      <div className="flex items-center gap-2 text-sm font-semibold shrink-0" style={{ color: '#4b5563' }}>
        <Share2 className="w-4 h-4" />
        <span>Compartir</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {redes.map(({ label, href, Icon, color, bg }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            className={`${BOTON} hover:opacity-80`} style={{ background: bg, color }}>
            <Icon className="w-4 h-4" />
            {label}
          </a>
        ))}
        <button onClick={handleCopy} className={`${BOTON} hover:opacity-80`}
          style={{ background: 'rgba(17,24,39,0.07)', color: '#111827' }}>
          {copied ? <Check className="w-4 h-4" style={{ color: '#059669' }} /> : <Link className="w-4 h-4" />}
          {copied ? '¡Copiado!' : 'Copiar link'}
        </button>
      </div>
    </div>
  );
}
