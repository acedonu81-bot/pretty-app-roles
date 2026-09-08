import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AmbientBackground from '@/components/AmbientBackground';
import LegalFooter from '@/components/LegalFooter';
import xpeakLogo from '@/assets/xpeak-logo.png';

const Soporte = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: '#090909' }}>
      <Helmet>
        <title>Soporte | XPEAK — Ayuda y contacto</title>
        <meta name="description" content="¿Necesitas ayuda con XPEAK? Contacta con nuestro equipo de soporte por email y resolvemos tu duda lo antes posible." />
        <link rel="canonical" href="https://xpeak.es/soporte" />
      </Helmet>
      <AmbientBackground />

      <div className="flex-1 z-10 max-w-3xl mx-auto px-4 py-12 w-full">
        <Link to="/" className="inline-block mb-8 text-xs font-bold transition-colors" style={{ color: '#D4AF37' }}>
          ← Volver al inicio
        </Link>

        <div className="flex items-center gap-4 mb-10">
          <img src={xpeakLogo} alt="XPEAK logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Soporte <span className="text-gradient">XPEAK</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Estamos aquí para ayudarte</p>
          </div>
        </div>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>

          <div className="glass-panel p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="text-lg font-black mb-3" style={{ color: '#fff' }}>¿En qué podemos ayudarte?</h2>
            <p className="mb-3">
              Si tienes dudas sobre tu cuenta, un problema técnico con la app o la web, una pregunta sobre cómo funciona XPEAK, o necesitas ayuda con un contrato o una solicitud, escríbenos directamente y te respondemos lo antes posible.
            </p>
            <p>
              Antes de escribir, puede que tu duda ya esté resuelta en las <a href="/#faq" className="font-bold transition-all hover:opacity-80" style={{ color: '#D4AF37' }}>preguntas frecuentes</a> de la página principal.
            </p>
          </div>

          <div className="glass-panel p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="text-lg font-black mb-3" style={{ color: '#fff' }}>Contacto</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Email:</span>
                <a href="mailto:info@xpeak.es" className="font-bold transition-all hover:opacity-80" style={{ color: '#D4AF37' }}>info@xpeak.es</a>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Web:</span>
                <a href="https://xpeak.es" className="font-bold transition-all hover:opacity-80" style={{ color: '#D4AF37' }}>xpeak.es</a>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/sobre-nosotros" className="text-xs underline" style={{ color: 'rgba(255,255,255,0.35)' }}>Sobre nosotros</Link>
              <Link to="/privacidad" className="text-xs underline" style={{ color: 'rgba(255,255,255,0.35)' }}>Política de privacidad</Link>
              <Link to="/terminos" className="text-xs underline" style={{ color: 'rgba(255,255,255,0.35)' }}>Términos de uso</Link>
              <Link to="/eliminar-cuenta" className="text-xs underline" style={{ color: 'rgba(255,255,255,0.35)' }}>Eliminar cuenta</Link>
            </div>
          </div>

        </div>
      </div>

      <LegalFooter />
    </div>
  );
};

export default Soporte;
