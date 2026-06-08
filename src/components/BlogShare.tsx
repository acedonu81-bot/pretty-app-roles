import { useState } from 'react';
import { Share2, MessageCircle, Twitter, Link, Check } from 'lucide-react';

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

  return (
    <div className="my-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5">
      <div className="flex items-center gap-2 text-sm text-neutral-400 shrink-0">
        <Share2 className="w-4 h-4" />
        <span>Compartir</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] text-sm font-medium hover:bg-[#25D366]/20 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-neutral-300 text-sm font-medium hover:bg-white/10 transition-colors"
        >
          <Twitter className="w-4 h-4" />
          Twitter / X
        </a>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-neutral-300 text-sm font-medium hover:bg-white/10 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Link className="w-4 h-4" />}
          {copied ? '¡Copiado!' : 'Copiar link'}
        </button>
      </div>
    </div>
  );
}
