import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AmbientBackground from '@/components/AmbientBackground';
import LegalFooter from '@/components/LegalFooter';

// Schema Person propio del autor, distinto del Organization de SobreNosotros
// — es lo que le falta al author.url de los 320 artículos del blog, que hoy
// apuntan a la home genérica en vez de a una página de autor real (auditoría
// GEO 22 sep 2026: E-E-A-T score 34/100, Expertise el más bajo por esto).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Daniel",
  "jobTitle": "Fundador de XPEAK",
  "url": "https://xpeak.es/autor/daniel",
  "sameAs": ["https://danieltorrez.es"],
  "worksFor": { "@type": "Organization", "name": "XPEAK", "url": "https://xpeak.es" },
};

const AutorDaniel = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: '#FFFFFF' }}>
      <Helmet>
        <title>Daniel, Fundador de XPEAK | Autor</title>
        <meta name="description" content="Daniel es el fundador de XPEAK y autor de las guías del blog: precios, contratos y tendencias del sector de eventos en España." />
        <link rel="canonical" href="https://xpeak.es/autor/daniel" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <AmbientBackground />

      <div className="flex-1 z-10 max-w-3xl mx-auto px-4 py-12 w-full">
        <Link to="/blog" className="inline-block mb-8 text-xs font-bold transition-colors" style={{ color: '#8B6A00' }}>
          ← Volver al blog
        </Link>

        <div className="flex items-start gap-4 mb-10">
          <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xl"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
            D
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Daniel</h1>
            <p className="text-sm mt-1" style={{ color: '#374151' }}>Fundador de XPEAK</p>
          </div>
        </div>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: '#374151' }}>
          <div className="glass-panel p-6 md:p-8" style={{ background: '#FFFDF7', border: '1px solid rgba(122,98,22,0.16)' }}>
            <p>
              Daniel es el fundador de <Link to="/" style={{ color: '#8B6A00' }}>XPEAK</Link>, el directorio profesional de eventos en España. Es el autor de las guías del <Link to="/blog" style={{ color: '#8B6A00' }}>blog de XPEAK</Link> sobre precios, contratos y tendencias del sector de eventos.
            </p>
          </div>

          <div className="glass-panel p-6 md:p-8" style={{ background: '#FFFDF7', border: '1px solid rgba(122,98,22,0.16)' }}>
            <h2 className="text-lg font-black mb-3" style={{ color: '#111' }}>Enlaces</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span style={{ color: '#374151' }}>Web personal:</span>
                <a href="https://danieltorrez.es" target="_blank" rel="noopener noreferrer" className="font-bold transition-all hover:opacity-80" style={{ color: '#8B6A00' }}>danieltorrez.es</a>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: '#374151' }}>XPEAK:</span>
                <Link to="/" className="font-bold transition-all hover:opacity-80" style={{ color: '#8B6A00' }}>xpeak.es</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LegalFooter />
    </div>
  );
};

export default AutorDaniel;
