import { Instagram, Linkedin, Facebook } from 'lucide-react';

export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82c-.9-.95-1.4-2.17-1.4-3.46h-3.14v13.5c0 1.63-1.32 2.95-2.95 2.95a2.95 2.95 0 0 1 0-5.9c.26 0 .51.03.76.1v-3.2a6.15 6.15 0 0 0-.76-.05A6.1 6.1 0 0 0 3 15.86a6.1 6.1 0 0 0 6.1 6.1 6.1 6.1 0 0 0 6.1-6.1V9.4a8.25 8.25 0 0 0 4.8 1.54V7.8a4.85 4.85 0 0 1-3.4-1.98Z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/xpeaksite?utm_source=xpeak_web&utm_medium=social&utm_campaign=footer', Icon: Instagram },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/xpeak-site-79a8a3436/?utm_source=xpeak_web&utm_medium=social&utm_campaign=footer', Icon: Linkedin },
  { label: 'TikTok', href: 'https://www.tiktok.com/@xpeak30?utm_source=xpeak_web&utm_medium=social&utm_campaign=footer', Icon: TikTokIcon },
  { label: 'Facebook', href: null, Icon: Facebook },
];

const FOOTER_LINKS = {
  contratar: [
    { label: 'Contratar DJ', href: '/contratar-dj' },
    { label: 'Contratar Camareros', href: '/contratar-camareros' },
    { label: 'Contratar Fotógrafo', href: '/contratar-fotografo' },
    { label: 'Contratar Staff', href: '/contratar-staff' },
    { label: 'Contratar Catering', href: '/contratar-catering' },
    { label: 'Contratar Food Truck', href: '/contratar-food-truck' },
    { label: 'Disco Móvil', href: '/contratar-disco-movil' },
    { label: 'Promotores', href: '/contratar-promotores' },
  ],
  blog: [
    { label: 'Cuánto cobra un DJ', href: '/blog/cuanto-cobra-un-dj-en-espana' },
    { label: 'Camareros para boda', href: '/blog/cuantos-camareros-necesito-para-mi-boda' },
    { label: 'Coste de una boda', href: '/blog/cuanto-cuesta-una-boda-en-espana' },
    { label: 'Fotógrafo de bodas', href: '/blog/contratar-fotografo-de-bodas' },
    { label: 'DJ para cumpleaños', href: '/blog/dj-para-cumpleanos-precio' },
    { label: 'Ver todos los artículos', href: '/blog' },
  ],
  xpeak: [
    { label: 'Cómo funciona', href: '/' },
    { label: 'Precios', href: '/precios' },
    { label: 'Únete', href: '/auth?mode=register' },
    { label: 'Sobre nosotros', href: '/sobre-nosotros' },
  ],
  legal: [
    { label: 'Privacidad', href: '/privacidad' },
    { label: 'Términos', href: '/terminos' },
    { label: 'Aviso legal', href: '/aviso-legal' },
    { label: 'Cookies', href: '/cookies' },
  ],
};

export default function FooterPublic() {
  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.09)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {/* Top grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {/* Contratar */}
          <div>
            <p className="text-[0.75rem] font-black uppercase tracking-widest mb-4" style={{ color: '#7a6216' }}>Contratar</p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.contratar.map(l => (
                <li key={l.href}>
                  <a href={l.href} className="inline-block py-1 text-xs transition-opacity hover:opacity-80" style={{ color: '#222' }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div>
            <p className="text-[0.75rem] font-black uppercase tracking-widest mb-4" style={{ color: '#7a6216' }}>Blog</p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.blog.map(l => (
                <li key={l.href}>
                  <a href={l.href} className="inline-block py-1 text-xs transition-opacity hover:opacity-80" style={{ color: '#222' }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* XPEAK */}
          <div>
            <p className="text-[0.75rem] font-black uppercase tracking-widest mb-4" style={{ color: '#7a6216' }}>XPEAK</p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.xpeak.map(l => (
                <li key={l.href}>
                  <a href={l.href} className="inline-block py-1 text-xs transition-opacity hover:opacity-80" style={{ color: '#222' }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[0.75rem] font-black uppercase tracking-widest mb-4" style={{ color: '#7a6216' }}>Legal</p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map(l => (
                <li key={l.href}>
                  <a href={l.href} className="inline-block py-1 text-xs transition-opacity hover:opacity-80" style={{ color: '#222' }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-3">
            <a href="/" className="text-base font-black tracking-tight" style={{ color: '#8B6A00' }}>XPEAK</a>
            <span className="text-[0.75rem]" style={{ color: 'rgba(0,0,0,0.1)' }}>·</span>
            <span className="text-[0.75rem]" style={{ color: '#333' }}>El directorio profesional de eventos en España</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center -mx-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) =>
                href ? (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="p-3 transition-opacity hover:opacity-70" style={{ color: '#333' }}>
                    <Icon className="w-4 h-4" />
                  </a>
                ) : (
                  <span key={label} role="img" aria-label={`${label} (próximamente)`} className="p-3" style={{ color: 'rgba(0,0,0,0.3)' }}>
                    <Icon className="w-4 h-4" />
                  </span>
                )
              )}
            </div>
            <span className="text-[0.75rem]" style={{ color: 'rgba(0,0,0,0.55)' }}>© 2026 XPEAK</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
