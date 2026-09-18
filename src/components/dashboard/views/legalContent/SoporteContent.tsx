import { Link } from 'react-router-dom';

// Contenido extraído literal de src/pages/Soporte.tsx (sin Helmet,
// AmbientBackground, logo ni LegalFooter — esos quedan solo para la ruta web
// /soporte). Ver src/pages/Soporte.tsx para la fuente original.
export function SoporteContent() {
  return (
    <div className="space-y-6 text-sm leading-relaxed" style={{ color: 'rgba(22,20,18,0.78)' }}>

      <div className="glass-panel p-6 md:p-8">
        <h2 className="text-lg font-black mb-3" style={{ color: '#111' }}>¿En qué podemos ayudarte?</h2>
        <p className="mb-3">
          Si tienes dudas sobre tu cuenta, un problema técnico con la app o la web, una pregunta sobre cómo funciona XPEAK, o necesitas ayuda con un contrato o una solicitud, escríbenos directamente y te respondemos lo antes posible.
        </p>
        <p>
          Antes de escribir, puede que tu duda ya esté resuelta en las <a href="/#faq" className="font-bold transition-all hover:opacity-80" style={{ color: '#D4AF37' }}>preguntas frecuentes</a> de la página principal.
        </p>
      </div>

      <div className="glass-panel p-6 md:p-8">
        <h2 className="text-lg font-black mb-3" style={{ color: '#111' }}>Contacto</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Email:</span>
            <a href="mailto:info@xpeak.es" className="font-bold transition-all hover:opacity-80" style={{ color: '#D4AF37' }}>info@xpeak.es</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Web:</span>
            <a href="https://xpeak.es" className="font-bold transition-all hover:opacity-80" style={{ color: '#D4AF37' }}>xpeak.es</a>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/sobre-nosotros" className="text-xs underline text-muted-foreground">Sobre nosotros</Link>
          <Link to="/privacidad" className="text-xs underline text-muted-foreground">Política de privacidad</Link>
          <Link to="/terminos" className="text-xs underline text-muted-foreground">Términos de uso</Link>
          <Link to="/eliminar-cuenta" className="text-xs underline text-muted-foreground">Eliminar cuenta</Link>
        </div>
      </div>

    </div>
  );
}
