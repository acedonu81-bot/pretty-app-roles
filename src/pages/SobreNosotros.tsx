import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AmbientBackground from '@/components/AmbientBackground';
import LegalFooter from '@/components/LegalFooter';
import xpeakLogo from '@/assets/xpeak-logo.png';

const SobreNosotros = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: '#090909' }}>
      <Helmet>
        <title>Sobre Nosotros | XPEAK — La plataforma del talento nocturno</title>
        <meta name="description" content="Conoce el equipo detrás de XPEAK. Conectamos DJs, artistas y profesionales del ocio nocturno con salas, promotoras y empresas de eventos en toda España." />
        <link rel="canonical" href="https://xpeak.es/sobre-nosotros" />
      </Helmet>
      <AmbientBackground />

      <div className="flex-1 z-10 max-w-3xl mx-auto px-4 py-12 w-full">
        <Link to="/" className="inline-block mb-8 text-xs font-bold transition-colors" style={{ color: '#D4AF37' }}>
          ← Volver al inicio
        </Link>

        <div className="flex items-center gap-4 mb-10">
          <img src={xpeakLogo} alt="XPEAK" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Sobre <span className="text-gradient">XPEAK</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">El directorio profesional del ocio nocturno</p>
          </div>
        </div>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>

          <div className="glass-panel p-6 md:p-8">
            <h2 className="text-lg font-black mb-3" style={{ color: '#fff' }}>¿Qué es XPEAK?</h2>
            <p className="mb-3">
              XPEAK es la primera plataforma profesional diseñada exclusivamente para el sector del ocio nocturno en España y Europa. Conectamos DJs, Staff, Estilistas, Fotógrafos, Promotores y Empresarios en un solo lugar.
            </p>
            <p>
              Nació de una frustración real: el sector nocturno siempre ha funcionado por contactos informales, grupos de WhatsApp y llamadas de última hora. XPEAK lo digitaliza — con perfiles verificados, disponibilidad en tiempo real y comunicación directa entre profesionales y salas.
            </p>
          </div>

          <div className="glass-panel p-6 md:p-8">
            <h2 className="text-lg font-black mb-3" style={{ color: '#fff' }}>Nuestra misión</h2>
            <p className="mb-3">
              Que cada profesional del ocio nocturno tenga una vitrina digital digna de su talento — y que cada empresario encuentre al profesional adecuado en minutos, no en días.
            </p>
            <p>
              Creemos que el talento no debería depender de quién conoces, sino de cómo te muestras.
            </p>
          </div>

          <div className="glass-panel p-6 md:p-8">
            <h2 className="text-lg font-black mb-4" style={{ color: '#fff' }}>Lo que ofrecemos</h2>
            <ul className="space-y-3">
              {[
                ['Perfil profesional', 'Bio, fotos, mixes, portfolio y tarifas en un solo lugar.'],
                ['Directorio público', 'Búsqueda por rol, ciudad y especialidad. Visible para cualquiera.'],
                ['Flash Booking', 'Sistema de ofertas urgentes — cubre una noche en menos de una hora.'],
                ['Escenario Virtual', 'Emite sesiones en directo y llega a empresarios de toda Europa.'],
                ['Fan Club', 'Monetiza tu audiencia con suscripciones de fans desde 4,99€/mes.'],
                ['Mensajería directa', 'Sin intermediarios. Profesional y empresario se comunican directamente.'],
              ].map(([title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#D4AF37' }} />
                  <span><strong style={{ color: '#fff' }}>{title}</strong> — {desc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel p-6 md:p-8">
            <h2 className="text-lg font-black mb-3" style={{ color: '#fff' }}>¿Dónde estamos?</h2>
            <p className="mb-3">
              XPEAK es un proyecto español, lanzado en 2026 con sede en España. Actualmente operamos en las principales ciudades del país — Madrid, Barcelona, Valencia, Sevilla, Ibiza y más — con planes de expansión a Portugal, Francia e Italia en 2027.
            </p>
          </div>

          <div className="glass-panel p-6 md:p-8">
            <h2 className="text-lg font-black mb-3" style={{ color: '#fff' }}>Contacto</h2>
            <p className="mb-1">¿Tienes alguna pregunta, sugerencia o quieres colaborar?</p>
            <a href="mailto:info@xpeak.es"
              className="inline-flex items-center gap-2 mt-2 text-sm font-bold transition-all hover:scale-[1.02]"
              style={{ color: '#D4AF37' }}>
              info@xpeak.es →
            </a>
          </div>

        </div>
      </div>

      <LegalFooter />
    </div>
  );
};

export default SobreNosotros;
