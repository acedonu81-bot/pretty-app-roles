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
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>9. Derechos de Propiedad Intelectual sobre Contenidos Musicales</h2>
            <p className="mb-2">Al subir sesiones de audio, mezclas o cualquier contenido musical a la Plataforma, el usuario declara y garantiza que:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Posee los derechos necesarios sobre el contenido publicado, o cuenta con las licencias oportunas de los titulares de los derechos (SGAE, AIE, AGEDI u otras entidades de gestión).</li>
              <li>Es el único responsable del cumplimiento de la normativa de propiedad intelectual aplicable, incluida la Ley 21/2022 de transposición de la Directiva (UE) 2019/790 sobre derechos de autor en el mercado único digital.</li>
              <li>XPEAK actúa como prestador de servicios de alojamiento conforme al art. 14 de la Directiva 2000/31/CE y no será responsable de infracciones cometidas por los usuarios, siempre que actúe con diligencia en la retirada de contenidos infractores una vez notificada.</li>
            </ul>
            <p className="mt-2">XPEAK dispone de un procedimiento de notificación y retirada de contenidos infractores (<em>notice and takedown</em>). Las solicitudes deben enviarse a <span style={{ color: '#D4AF37' }}>legal@xpeak.es</span> indicando el contenido infractor y la titularidad acreditada.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>10. Naturaleza Jurídica de la Intermediación — XPEAK no es Empleador</h2>
            <p className="mb-2">
              <strong style={{ color: '#fff' }}>XPEAK opera exclusivamente como plataforma de intermediación tecnológica</strong> entre profesionales del sector del ocio nocturno y los empresarios o entidades que requieren sus servicios. A todos los efectos legales:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">XPEAK no es empleador</strong> de ningún profesional registrado en la Plataforma, ni existe relación laboral, mercantil de dependencia ni vínculo de ajenidad entre XPEAK y los usuarios profesionales.</li>
              <li>XPEAK no fija las tarifas de los profesionales, no asigna trabajos, no controla el modo de prestación de los servicios ni impone exclusividad.</li>
              <li>La relación contractual derivada de un acuerdo entre un profesional y un empresario es <strong className="text-foreground">exclusiva entre dichas partes</strong>. XPEAK no es parte de dicho contrato.</li>
              <li>Los profesionales actúan como trabajadores autónomos o mediante su propia estructura empresarial, siendo responsables de sus obligaciones fiscales (IVA, IRPF) y de Seguridad Social.</li>
              <li>XPEAK percibe una comisión de intermediación por las transacciones realizadas a través de la Plataforma, en calidad de mandatario o agente tecnológico, de conformidad con el art. 1.709 y ss. del Código Civil.</li>
              <li>Esta cláusula no resulta de aplicación a la eventual relación laboral que XPEAK pudiera mantener con su propio personal empleado.</li>
            </ul>
            <p className="mt-2 text-muted-foreground">
              Lo anterior es conforme con el Real Decreto-ley 9/2021 ("Ley Rider"), cuyo ámbito de aplicación se circunscribe al reparto de productos y no al sector de servicios profesionales creativos y de eventos regulado por los presentes Términos.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>11. Edad Mínima</h2>
            <p>El acceso y registro en XPEAK está reservado a personas mayores de <strong>14 años</strong>, conforme al art. 7 de la Ley Orgánica 3/2018 (LOPDGDD). Al registrarse, el usuario confirma que cumple con este requisito. XPEAK se reserva el derecho de cancelar sin previo aviso las cuentas de usuarios que no cumplan este requisito.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>12. Derechos del Usuario (RGPD)</h2>
            <p className="mb-2">De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la LOPDGDD, el usuario tiene derecho a:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Acceso</strong> a sus datos personales tratados por XPEAK.</li>
              <li><strong className="text-foreground">Rectificación</strong> de datos inexactos o incompletos.</li>
              <li><strong className="text-foreground">Supresión</strong> ("derecho al olvido") mediante la función "Eliminar cuenta" disponible en Ajustes.</li>
              <li><strong className="text-foreground">Portabilidad</strong> mediante la función "Exportar mis datos" disponible en Ajustes (formato JSON).</li>
              <li><strong className="text-foreground">Oposición</strong> y <strong className="text-foreground">limitación del tratamiento</strong>, dirigiéndose a <span style={{ color: '#D4AF37' }}>legal@xpeak.es</span>.</li>
            </ul>
            <p className="mt-2">Puede presentar reclamación ante la Agencia Española de Protección de Datos (AEPD) en <em>www.aepd.es</em>.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>13. Modificaciones</h2>
            <p>XPEAK se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios serán notificados a los usuarios registrados por correo electrónico y/o mediante aviso en la Plataforma con un mínimo de 15 días de antelación para cambios sustanciales.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>14. Legislación Aplicable</h2>
            <p>Los presentes Términos se rigen por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de Madrid (España), con renuncia expresa a cualquier otro fuero que pudiera corresponderles.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>Contacto</h2>
            <p>Consultas generales: <span style={{ color: '#D4AF37' }}>admin@xpeak.es</span></p>
            <p className="mt-1">Asuntos legales y protección de datos: <span style={{ color: '#D4AF37' }}>legal@xpeak.es</span></p>
          </section>
        </div>
      </div>

      <LegalFooter />
    </div>
  );
};

export default Terminos;
