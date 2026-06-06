import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AmbientBackground from '@/components/AmbientBackground';
import LegalFooter from '@/components/LegalFooter';

const Privacidad = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: '#000' }}>
      <Helmet>
        <title>Política de Privacidad | XPEAK</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://xpeak.es/privacidad" />
      </Helmet>
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
            <p>El responsable del tratamiento de tus datos personales es XPEAK, con domicilio social en España, y correo electrónico de contacto: admin@xpeak.es. Los datos se almacenan en servidores seguros gestionados mediante infraestructura cloud (Supabase).</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>2. Datos que Recopilamos</h2>
            <p className="mb-2">Para el funcionamiento técnico de la plataforma, recogemos los siguientes datos:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Datos de Registro:</strong> Nombre, apellidos, correo electrónico y teléfono.</li>
              <li><strong className="text-foreground">Datos Profesionales:</strong> Categoría (DJ, Staff, MUA, Wardrobe), experiencia y zona de trabajo en España.</li>
              <li><strong className="text-foreground">Contenido Multimedia:</strong> Audios de sesiones (vía SoundCloud/Mixcloud), fotografías de perfil y de trabajos realizados.</li>
              <li><strong className="text-foreground">Datos de Ubicación:</strong> Localización aproximada para filtrar eventos y profesionales cercanos en España.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>3. Finalidad del Tratamiento</h2>
            <p className="mb-2">Tus datos se utilizan exclusivamente para:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Gestionar la conexión entre talento y empresas de eventos.</li>
              <li>Permitir la votación pública y el cambio de estatus de Rookie a Profesional.</li>
              <li>Enviar notificaciones automáticas sobre ofertas de trabajo ("Flash Jobs").</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>4. Base Legal</h2>
            <p>La base legal para el tratamiento de tus datos es el consentimiento explícito al registrarte y la ejecución de un contrato (aceptación de los Términos y Condiciones) al utilizar los servicios de la plataforma.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>5. Conservación de los Datos</h2>
            <p>Los datos y archivos multimedia se conservarán mientras se mantenga la relación con la plataforma o hasta que el usuario solicite su supresión.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>6. Destinatarios y Transferencias Internacionales</h2>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Empresas del Sector:</strong> Tus datos profesionales y multimedia son públicos para los usuarios registrados como "Empresa" con el fin de facilitar tu contratación.</li>
              <li><strong className="text-foreground">Supabase (infraestructura):</strong> Los datos se almacenan en servidores de Supabase Inc. ubicados en la Unión Europea (Irlanda, AWS eu-west-1). La transferencia está amparada por las Cláusulas Contractuales Estándar de la Comisión Europea conforme al art. 46.2.c del RGPD.</li>
              <li><strong className="text-foreground">Autoridades:</strong> Solo en caso de requerimiento legal administrativo o judicial conforme a la legislación española aplicable.</li>
            </ul>
            <p className="text-muted-foreground mt-2 text-sm">Para más información sobre las garantías de transferencia internacional puedes contactar con nosotros en admin@xpeak.es (RGPD arts. 44–49).</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>7. Tus Derechos</h2>
            <p className="mb-3">Conforme al RGPD (UE) 2016/679 y la LOPDGDD (LO 3/2018) tienes los siguientes derechos:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Acceso (Art. 15)</strong> — solicitar confirmación de si tratamos tus datos y obtener una copia.</li>
              <li><strong className="text-foreground">Rectificación (Art. 16)</strong> — corregir datos inexactos o incompletos.</li>
              <li><strong className="text-foreground">Supresión (Art. 17)</strong> — solicitar el borrado de tus datos cuando ya no sean necesarios o retires el consentimiento. En la plataforma puedes ejercerlo desde <em>Ajustes → Eliminar cuenta</em>.</li>
              <li><strong className="text-foreground">Portabilidad (Art. 20)</strong> — recibir tus datos en formato estructurado (JSON/CSV) desde <em>Ajustes → Exportar datos</em>.</li>
              <li><strong className="text-foreground">Limitación del tratamiento (Art. 18)</strong> — solicitar que suspendamos el tratamiento mientras se resuelve una impugnación.</li>
              <li><strong className="text-foreground">Oposición (Art. 21)</strong> — oponerte al tratamiento basado en interés legítimo, incluyendo elaboración de perfiles con fines de marketing directo.</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">Para ejercer cualquiera de estos derechos envía un correo a <span style={{ color: '#D4AF37' }}>admin@xpeak.es</span> con una copia de tu DNI o documento equivalente. Responderemos en el plazo máximo de <strong>30 días naturales</strong> (RGPD Art. 12.3).</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>8. Reclamaciones ante la Autoridad de Control</h2>
            <p className="text-sm text-muted-foreground">
              Si consideras que el tratamiento de tus datos infringe la normativa de protección de datos, tienes derecho a presentar una reclamación ante la <strong className="text-foreground">Agencia Española de Protección de Datos (AEPD)</strong>, sin perjuicio de cualquier otro recurso administrativo o acción judicial.
            </p>
            <p className="text-sm mt-2">
              <span style={{ color: '#D4AF37' }}>www.aepd.es</span> · C/ Jorge Juan, 6 · 28001 Madrid · Tel. 901 100 099
            </p>
          </section>
        </div>
      </div>

      <LegalFooter />
    </div>
  );
};

export default Privacidad;
