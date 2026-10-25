import { Instagram, Linkedin } from 'lucide-react';
import { TikTokIcon } from '@/components/FooterPublic';

// Perfiles de XPEAK debajo del autor: dan a quien lee una forma de seguirnos y
// a Google la pista de que la marca existe fuera de la web.
const REDES = [
  { label: 'Instagram', href: 'https://www.instagram.com/xpeaksite?utm_source=xpeak_web&utm_medium=social&utm_campaign=blog_autor', Icon: Instagram },
  { label: 'TikTok', href: 'https://www.tiktok.com/@xpeak30?utm_source=xpeak_web&utm_medium=social&utm_campaign=blog_autor', Icon: TikTokIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/xpeak-site-79a8a3436/?utm_source=xpeak_web&utm_medium=social&utm_campaign=blog_autor', Icon: Linkedin },
];

const BlogAuthor = () => (
  <div className="flex items-start gap-3 mt-10 mb-2 pt-6"
    style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm"
      style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
      D
    </div>
    <div>
      <p className="text-sm font-bold">Daniel, fundador de XPEAK</p>
      <p className="text-xs" style={{ color: '#333' }}>
        Especialista en el sector de eventos y entretenimiento en España. Creador de{' '}
        <a href="https://xpeak.es" style={{ color: '#8B6A00' }}>xpeak.es</a>
        , la plataforma de referencia para profesionales del sector.
      </p>
      <div className="flex flex-wrap items-center gap-2 mt-2.5">
        <span className="text-xs font-semibold" style={{ color: '#4b5563' }}>Síguenos:</span>
        {REDES.map(({ label, href, Icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer me"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors hover:opacity-80"
            style={{ background: '#FBF3DD', border: '1px solid rgba(212,175,55,0.35)', color: '#7a6216' }}>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default BlogAuthor;
