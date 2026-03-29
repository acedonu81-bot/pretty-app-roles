import { Link } from 'react-router-dom';
import AmbientBackground from '@/components/AmbientBackground';
import LegalFooter from '@/components/LegalFooter';

const Terminos = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: '#0A0A0A' }}>
      <AmbientBackground />

      <div className="flex-1 z-10 max-w-3xl mx-auto px-4 py-12">
        <Link to="/" className="inline-block mb-6 text-xs font-bold transition-colors" style={{ color: '#D4AF37' }}>
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold mb-2">
          📜 Términos y <span className="text-gradient">Condiciones</span>
        </h1>
        <p className="text-xs text-muted-foreground mb-8">Fecha de entrada en vigor: 25 de marzo de 2026</p>

        <div className="glass-panel p-6 md:p-8 space-y-6 text-sm leading-relaxed" style={{ color: '#ccc' }}>
          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>1. Objeto</h2>
            <p>Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma XPEAK (en adelante, "la Plataforma"), un directorio profesional de intermediación técnica para el sector de eventos en España. Al registrarse, el usuario acepta íntegramente estas condiciones.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>2. Naturaleza del Servicio</h2>
            <p>XPEAK actúa exclusivamente como tablón de anuncios y directorio. No interviene en la contratación entre las partes, no verifica la situación legal, fiscal ni laboral de los usuarios, y no gestiona contratos ni pagos entre profesionales y empresas. La relación contractual es exclusiva entre las partes.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>3. Verificación de Identidad</h2>
            <p className="mb-2">XPEAK ofrece un servicio opcional de verificación de identidad con las siguientes condiciones:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Coste:</strong> 9,99 € (pago único, no reembolsable).</li>
              <li><strong className="text-foreground">Proceso:</strong> Requiere validación manual por parte del equipo de XPEAK. El usuario deberá enviar documentación acreditativa (DNI/NIE o pasaporte) junto con una foto selfie de verificación.</li>
              <li><strong className="text-foreground">Alcance:</strong> La verificación confirma la identidad del usuario, pero <strong>no otorga prioridad en las búsquedas</strong> ni ventajas de posicionamiento dentro del directorio.</li>
              <li><strong className="text-foreground">Distintivo:</strong> Los perfiles verificados mostrarán una insignia de verificación visible para otros usuarios.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>4. Niveles de Cuenta</h2>
            <p className="mb-2">La Plataforma dispone de los siguientes niveles de suscripción:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Promesa (Gratuito):</strong> Perfil básico con funcionalidades limitadas. Requiere 500 votos de la comunidad para ascender a Profesional. Periodo de prueba de 15 días con acceso a funcionalidades Pro.
              </li>
              <li>
                <strong className="text-foreground">Pase Diario (4,99 €):</strong> Posicionamiento destacado durante 24 horas.
              </li>
              <li>
                <strong className="text-foreground">Pase Weekend (8,99 €):</strong> Posicionamiento destacado durante el fin de semana (viernes a domingo).
              </li>
              <li>
                <strong className="text-foreground">Profesional / Pro (29,99 €/mes):</strong> Perfil completo, sesiones ilimitadas, acceso a Flash Jobs y estadísticas avanzadas. Descuento del 30% en facturación anual.
              </li>
              <li>
                <strong className="text-foreground">Business (59,99 €/mes):</strong> Todas las funcionalidades Pro más herramientas de gestión empresarial, soporte prioritario y analíticas avanzadas. Descuento del 30% en facturación anual.
              </li>
              <li>
                <strong className="text-foreground">Agency (99,99 €/mes):</strong> Gestión de múltiples perfiles profesionales, panel de control centralizado, reportes personalizados y acceso API. Descuento del 30% en facturación anual.
              </li>
            </ul>
            <p className="mt-2">XPEAK no cobra comisiones por contrato, únicamente por suscripción y pases.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>5. Pagos</h2>
            <p>Todos los pagos se procesan de forma segura a través de Stripe. XPEAK no almacena datos de tarjetas de crédito en sus servidores. Las suscripciones se renuevan automáticamente salvo cancelación previa. El usuario puede cancelar en cualquier momento desde su panel de configuración.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>6. Descuentos</h2>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Facturación anual:</strong> 30% de descuento sobre el precio mensual.</li>
              <li><strong className="text-foreground">Cumpleaños:</strong> 40% de descuento aplicable durante el mes de cumpleaños del usuario (requiere fecha de nacimiento verificada en el perfil).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>7. Responsabilidad</h2>
            <p>Cada usuario declara actuar bajo su propia responsabilidad legal. XPEAK no se hace responsable de la veracidad de los perfiles publicados, del cumplimiento de obligaciones fiscales o laborales de los usuarios, ni de los acuerdos alcanzados entre las partes a través de la Plataforma.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>8. Propiedad Intelectual</h2>
            <p>Los usuarios conservan la propiedad de todo el contenido que suban a la Plataforma (fotos, audios, vídeos). Al publicar contenido, el usuario otorga a XPEAK una licencia no exclusiva para mostrarlo dentro de la Plataforma con fines de promoción del perfil profesional.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>9. Modificaciones</h2>
            <p>XPEAK se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios serán notificados a los usuarios registrados por correo electrónico y/o mediante aviso en la Plataforma.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>10. Legislación Aplicable</h2>
            <p>Los presentes Términos se rigen por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de Madrid (España).</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>Contacto</h2>
            <p>Para cualquier consulta: <span style={{ color: '#D4AF37' }}>admin@xpeak.es</span></p>
          </section>
        </div>
      </div>

      <LegalFooter />
    </div>
  );
};

export default Terminos;
