import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AmbientBackground from '@/components/AmbientBackground';
import LegalFooter from '@/components/LegalFooter';
import xpeakLogo from '@/assets/xpeak-logo.png';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "XPEAK",
  "url": "https://xpeak.es",
  "logo": "https://xpeak.es/xpeak-icon-512.png",
  "foundingDate": "2026",
  "foundingLocation": "España",
  "description": "Plataforma profesional para el sector de eventos y entretenimiento en España. Conectamos DJs, fotógrafos, camareros, staff y coordinadores de eventos con salas, promotoras y particulares.",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "info@xpeak.es",
    "contactType": "customer support",
    "availableLanguage": "Spanish"
  },
  "sameAs": [
    "https://xpeak.es"
  ],
  "founder": {
    "@type": "Person",
    "name": "Daniel",
    "jobTitle": "Fundador y CEO",
    "worksFor": { "@type": "Organization", "name": "XPEAK" }
  }
};

const SobreNosotros = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: '#090909' }}>
      <Helmet>
        <title>Sobre Nosotros | XPEAK — Plataforma profesional de eventos en España</title>
        <meta name="description" content="Conoce la historia y el equipo detrás de XPEAK. Fundada en 2026, conectamos más de 31 profesionales verificados del sector de eventos con organizadores en toda España." />
        <link rel="canonical" href="https://xpeak.es/sobre-nosotros" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
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
              Sobre <span className="text-gradient">XPEAK</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">La plataforma profesional de eventos en España</p>
          </div>
        </div>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>

          {/* Stats rápidas */}
          <div className="grid grid-cols-3 gap-3">
            {[
              ['31+', 'Profesionales verificados'],
              ['2026', 'Año de fundación'],
              ['España', 'Mercado principal'],
            ].map(([val, label]) => (
              <div key={label} className="glass-panel p-4 text-center">
                <p className="text-2xl font-black" style={{ color: '#D4AF37' }}>{val}</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Historia real */}
          <div className="glass-panel p-6 md:p-8">
            <h2 className="text-lg font-black mb-3" style={{ color: '#fff' }}>La historia de XPEAK</h2>
            <p className="mb-3">
              XPEAK nació en 2026 de una frustración real con el sector de eventos en España: los profesionales más talentosos — DJs, fotógrafos, coordinadores, camareros — dependían de contactos informales, grupos de WhatsApp y llamadas de última hora para conseguir trabajo.
            </p>
            <p className="mb-3">
              Los organizadores de eventos, por su parte, perdían horas buscando profesionales disponibles, sin poder comparar precios ni verificar experiencia. No existía una plataforma específica para el sector.
            </p>
            <p>
              Decidimos construirla. XPEAK digitaliza el proceso completo: directorio verificado, Flash Booking en menos de 1 hora, contratos digitales automáticos y mensajería directa entre profesionales y clientes. Sin comisiones, sin intermediarios.
            </p>
          </div>

          {/* Fundador — EEAT signal */}
          <div className="glass-panel p-6 md:p-8">
            <h2 className="text-lg font-black mb-4" style={{ color: '#fff' }}>El equipo fundador</h2>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-black text-base"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                D
              </div>
              <div>
                <p className="font-black text-white">Daniel — Fundador y CEO</p>
                <p className="text-xs mt-1 mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Madrid, España</p>
                <p style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Especialista en el sector de eventos y entretenimiento nocturno en España. Con experiencia directa en el ecosistema de salas, festivales y eventos privados, fundó XPEAK para resolver los problemas que él mismo vivió al intentar conectar talento con oportunidades en el sector.
                </p>
                <p className="mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Es el autor de todos los artículos del <Link to="/blog" style={{ color: '#D4AF37' }}>blog de XPEAK</Link>, donde publica guías de precios, contratos y tendencias del sector de eventos en España.
                </p>
              </div>
            </div>
          </div>

          {/* Misión */}
          <div className="glass-panel p-6 md:p-8">
            <h2 className="text-lg font-black mb-3" style={{ color: '#fff' }}>Nuestra misión</h2>
            <p className="mb-3">
              Que cada profesional del sector de eventos tenga una vitrina digital profesional — y que cada organizador encuentre al profesional adecuado en minutos, no en días.
            </p>
            <p className="mb-3">
              Creemos que el talento no debería depender de quién conoces, sino de cómo te muestras. XPEAK da a los profesionales las herramientas que antes solo tenían las grandes agencias.
            </p>
            <blockquote className="border-l-2 pl-4 italic mt-4" style={{ borderColor: '#D4AF37', color: 'rgba(255,255,255,0.5)' }}>
              "El sector de eventos mueve miles de millones al año en España. Los profesionales merecen una plataforma a su altura."
            </blockquote>
          </div>

          {/* Funcionalidades */}
          <div className="glass-panel p-6 md:p-8">
            <h2 className="text-lg font-black mb-4" style={{ color: '#fff' }}>Qué ofrecemos</h2>
            <ul className="space-y-3">
              {[
                ['Perfiles verificados', 'Bio, fotos, portfolio y tarifas públicas. Verificación manual por el equipo de XPEAK.'],
                ['Directorio profesional', 'Búsqueda por especialidad, ciudad y disponibilidad. Acceso público y gratuito.'],
                ['Flash Booking', 'Sistema de contratación urgente. Cubre un evento en menos de 1 hora.'],
                ['Contratos digitales', 'Generación automática de contratos con validez legal en España.'],
                ['Mensajería directa', 'Sin intermediarios. Profesional y cliente se comunican directamente.'],
                ['Fan Club', 'Monetización de audiencia con suscripciones desde 4,99€/mes. Próximamente.'],
              ].map(([title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#D4AF37' }} />
                  <span><strong style={{ color: '#fff' }}>{title}</strong> — {desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cobertura */}
          <div className="glass-panel p-6 md:p-8">
            <h2 className="text-lg font-black mb-3" style={{ color: '#fff' }}>Cobertura geográfica</h2>
            <p className="mb-3">
              XPEAK opera actualmente en toda España, con mayor concentración de profesionales en Madrid, Barcelona, Valencia, Sevilla, Bilbao e Ibiza.
            </p>
            <p>
              El plan de expansión incluye Portugal y el sur de Francia en 2027, aprovechando la demanda de eventos internacionales y festivales europeos.
            </p>
          </div>

          {/* Transparencia / trust */}
          <div className="glass-panel p-6 md:p-8">
            <h2 className="text-lg font-black mb-4" style={{ color: '#fff' }}>Transparencia y confianza</h2>
            <ul className="space-y-2">
              {[
                '0% de comisión para salas y organizadores — siempre.',
                'Verificación manual de cada perfil profesional antes de publicarlo.',
                'Contratos con validez legal bajo legislación española.',
                'Política de privacidad conforme al RGPD europeo.',
                'Datos almacenados en servidores europeos (Supabase EU-West).',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.65)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="glass-panel p-6 md:p-8">
            <h2 className="text-lg font-black mb-3" style={{ color: '#fff' }}>Contacto</h2>
            <p className="mb-4">¿Tienes preguntas, sugerencias o quieres colaborar con XPEAK?</p>
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
              <Link to="/privacidad" className="text-xs underline" style={{ color: 'rgba(255,255,255,0.35)' }}>Política de privacidad</Link>
              <Link to="/terminos" className="text-xs underline" style={{ color: 'rgba(255,255,255,0.35)' }}>Términos de uso</Link>
              <Link to="/aviso-legal" className="text-xs underline" style={{ color: 'rgba(255,255,255,0.35)' }}>Aviso legal</Link>
              <Link to="/eliminar-cuenta" className="text-xs underline" style={{ color: 'rgba(255,255,255,0.35)' }}>Eliminar cuenta</Link>
            </div>
          </div>

        </div>
      </div>

      <LegalFooter />
    </div>
  );
};

export default SobreNosotros;
