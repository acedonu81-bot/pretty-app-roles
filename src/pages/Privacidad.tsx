import { Link } from 'react-router-dom';
import AmbientBackground from '@/components/AmbientBackground';
import LegalFooter from '@/components/LegalFooter';

const Privacidad = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: '#000' }}>
      <AmbientBackground />

      <div className="flex-1 z-10 max-w-3xl mx-auto px-4 py-12">
        <Link to="/" className="inline-block mb-6 text-xs font-bold transition-colors" style={{ color: '#D4AF37' }}>
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold mb-2">
          🔐 Política de <span className="text-gradient">Privacidad</span>
        </h1>
        <p className="text-xs text-muted-foreground mb-8">Fecha de entrada en vigor: 25 de marzo de 2026</p>

        <div className="glass-panel p-6 md:p-8 space-y-6 text-sm leading-relaxed" style={{ color: '#ccc' }}>
          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>1. Responsable del Tratamiento</h2>
            <p>El responsable del tratamiento de tus datos personales es XPEAK, con domicilio social en Madrid, España, y correo electrónico de contacto: admin@xpeak.es.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>2. Datos que Recopilamos</h2>
            <p className="mb-2">Para el funcionamiento técnico de la plataforma, recogemos los siguientes datos:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Datos de Registro:</strong> Nombre, apellidos, correo electrónico y teléfono.</li>
              <li><strong className="text-foreground">Datos Profesionales:</strong> Categoría (DJ, Staff, MUA, Wardrobe), experiencia y zona de trabajo en Madrid.</li>
              <li><strong className="text-foreground">Contenido Multimedia:</strong> Audios de sesiones (vía SoundCloud/Mixcloud o subida directa), fotografías de perfil y de trabajos realizados.</li>
              <li><strong className="text-foreground">Datos de Ubicación:</strong> Localización aproximada para filtrar eventos y profesionales cercanos en la Comunidad de Madrid.</li>
              <li><strong className="text-foreground">Datos de Pago:</strong> Gestionados de forma segura a través de Stripe. La plataforma no almacena números de tarjeta de crédito en sus servidores.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>3. Finalidad del Tratamiento</h2>
            <p className="mb-2">Tus datos se utilizan exclusivamente para:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Gestionar la conexión entre talento y empresas de eventos.</li>
              <li>Permitir la votación pública y el cambio de estatus de Rookie a Profesional.</li>
              <li>Procesar suscripciones Premium y pagos de servicios TopWeekend.</li>
              <li>Enviar notificaciones automáticas sobre ofertas de trabajo ("Flash Jobs").</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>4. Base Legal</h2>
            <p>La base legal para el tratamiento de tus datos es el consentimiento explícito al registrarte y la ejecución de un contrato (aceptación de los Términos y Condiciones) al utilizar los servicios de reserva y suscripción.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>5. Conservación de los Datos</h2>
            <p>Los datos y archivos multimedia se conservarán mientras se mantenga la relación con la plataforma o hasta que el usuario solicite su supresión. Los datos de transacciones económicas se conservarán durante los plazos legales exigidos por la normativa fiscal española (5 años).</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>6. Destinatarios y Transferencias</h2>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Empresas del Sector:</strong> Tus datos profesionales y multimedia son públicos para los usuarios registrados como "Empresa" con el fin de facilitar tu contratación.</li>
              <li><strong className="text-foreground">Proveedores Técnicos:</strong> Los datos se alojan en servidores seguros y los pagos se procesan mediante Stripe.</li>
              <li><strong className="text-foreground">Autoridades:</strong> Solo en caso de requerimiento legal administrativo o judicial.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>7. Tus Derechos (Derechos ARCO)</h2>
            <p>Tienes derecho a acceder, rectificar, suprimir tus datos, así como a la portabilidad de los mismos y a la limitación u oposición de su tratamiento. Para ejercer estos derechos, debes enviar un correo electrónico a <span style={{ color: '#D4AF37' }}>admin@nightlife.madrid</span> adjuntando una copia de tu DNI o documento equivalente.</p>
          </section>
        </div>
      </div>

      <LegalFooter />
    </div>
  );
};

export default Privacidad;
