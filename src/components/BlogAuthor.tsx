import { LogoInstagram, LogoTikTok, LogoLinkedIn } from '@/components/IconosMarcas';

// Perfiles de XPEAK debajo del autor: dan a quien lee una forma de seguirnos y
// a Google la pista de que la marca existe fuera de la web. Logo y color de
// cada red, como en la barra de compartir (25 oct).
const REDES = [
  { label: 'Instagram', href: 'https://www.instagram.com/xpeaksite?utm_source=xpeak_web&utm_medium=social&utm_campaign=blog_autor', Icon: LogoInstagram, bg: 'linear-gradient(45deg,#F58529,#DD2A7B 50%,#8134AF)' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@xpeak30?utm_source=xpeak_web&utm_medium=social&utm_campaign=blog_autor', Icon: LogoTikTok, bg: '#000000' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/xpeak-site-79a8a3436/?utm_source=xpeak_web&utm_medium=social&utm_campaign=blog_autor', Icon: LogoLinkedIn, bg: '#0A66C2' },
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
        {REDES.map(({ label, href, Icon, bg }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer me"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-85"
            style={{ background: bg }}>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default BlogAuthor;
