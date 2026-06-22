const FOOTER_LINKS = {
  contratar: [
    { label: 'Contratar DJ', href: '/contratar-dj' },
    { label: 'Contratar Camareros', href: '/contratar-camareros' },
    { label: 'Contratar Fotógrafo', href: '/contratar-fotografo' },
    { label: 'Contratar Staff', href: '/contratar-staff' },
    { label: 'Contratar Catering', href: '/contratar-catering' },
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
    { label: 'Únete gratis', href: '/auth' },
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
            <p className="text-[0.6rem] font-black uppercase tracking-widest mb-4" style={{ color: '#7a6216' }}>Contratar</p>
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
            <p className="text-[0.6rem] font-black uppercase tracking-widest mb-4" style={{ color: '#7a6216' }}>Blog</p>
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
            <p className="text-[0.6rem] font-black uppercase tracking-widest mb-4" style={{ color: '#7a6216' }}>XPEAK</p>
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
            <p className="text-[0.6rem] font-black uppercase tracking-widest mb-4" style={{ color: '#7a6216' }}>Legal</p>
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
            <a href="/" className="text-base font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
            <span className="text-[0.65rem]" style={{ color: 'rgba(0,0,0,0.1)' }}>·</span>
            <span className="text-[0.65rem]" style={{ color: '#333' }}>El directorio profesional de eventos en España</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/xpeak.es" target="_blank" rel="noopener noreferrer"
              className="text-[0.65rem] transition-opacity hover:opacity-80" style={{ color: '#333' }}>
              @xpeak.es
            </a>
            <span className="text-[0.65rem]" style={{ color: 'rgba(0,0,0,0.55)' }}>© 2026 XPEAK</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
