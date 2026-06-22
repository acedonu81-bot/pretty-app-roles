import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AmbientBackground from '@/components/AmbientBackground';
import LegalFooter from '@/components/LegalFooter';

const Terminos = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: '#0A0A0A' }}>
      <Helmet>
        <title>Términos y Condiciones | XPEAK</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://xpeak.es/terminos" />
      </Helmet>
      <AmbientBackground />

      <div className="flex-1 z-10 max-w-3xl mx-auto px-4 py-12">
        <Link to="/" className="inline-block mb-6 text-xs font-bold transition-colors" style={{ color: '#D4AF37' }}>
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold mb-2">
          📜 Términos y <span className="text-gradient">Condiciones</span>
        </h1>
        <p className="text-xs mb-8" style={{ color: '#333' }}>Última actualización: 13 de junio de 2026</p>

        <div className="glass-panel p-6 md:p-8 space-y-6 text-sm leading-relaxed" style={{ color: 'rgba(22,20,18,0.78)' }}>
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
            <ul className="list-disc list-inside space-y-1" style={{ color: '#222' }}>
              <li><strong style={{ color: '#111' }}>Coste:</strong> 9,99 € (pago único, no reembolsable).</li>
              <li><strong style={{ color: '#111' }}>Proceso:</strong> Requiere validación manual por parte del equipo de XPEAK. El usuario deberá enviar documentación acreditativa (DNI/NIE o pasaporte) junto con una foto selfie de verificación.</li>
              <li><strong style={{ color: '#111' }}>Alcance:</strong> La verificación confirma la identidad del usuario, pero <strong>no otorga prioridad en las búsquedas</strong> ni ventajas de posicionamiento dentro del directorio.</li>
              <li><strong style={{ color: '#111' }}>Distintivo:</strong> Los perfiles verificados mostrarán una insignia de verificación visible para otros usuarios.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>4. Niveles de Cuenta</h2>
            <p className="mb-2">La Plataforma dispone de los siguientes niveles de suscripción:</p>
            <ul className="list-disc list-inside space-y-2" style={{ color: '#222' }}>
              <li>
                <strong style={{ color: '#111' }}>Promesa (Gratuito):</strong> Perfil básico con funcionalidades limitadas. Requiere 500 votos de la comunidad para ascender a Profesional. Periodo de prueba de 15 días con acceso a funcionalidades Pro.
              </li>
              <li>
                <strong style={{ color: '#111' }}>Pase Diario (4,99 €):</strong> Posicionamiento destacado durante 24 horas.
              </li>
              <li>
                <strong style={{ color: '#111' }}>Pase Weekend (8,99 €):</strong> Posicionamiento destacado durante el fin de semana (viernes a domingo).
              </li>
              <li>
                <strong style={{ color: '#111' }}>Profesional / Pro (29,99 €/mes):</strong> Perfil completo, sesiones ilimitadas, acceso a Flash Jobs y estadísticas avanzadas. Descuento del 30% en facturación anual.
              </li>
              <li>
                <strong style={{ color: '#111' }}>Business (59,99 €/mes):</strong> Todas las funcionalidades Pro más herramientas de gestión empresarial, soporte prioritario y analíticas avanzadas. Descuento del 30% en facturación anual.
              </li>
              <li>
                <strong style={{ color: '#111' }}>Agency (99,99 €/mes):</strong> Gestión de múltiples perfiles profesionales, panel de control centralizado, reportes personalizados y acceso API. Descuento del 30% en facturación anual.
              </li>
            </ul>
            <p className="mt-2">XPEAK no cobra comisiones por contrato, únicamente por suscripción y pases.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>5. Pagos y Derecho de Desistimiento</h2>
            <p>Todos los pagos se procesan de forma segura a través de Stripe. XPEAK no almacena datos de tarjetas de crédito en sus servidores. Las suscripciones se renuevan automáticamente salvo cancelación previa. El usuario puede cancelar en cualquier momento desde su panel de configuración.</p>
            <p className="mt-2"><strong style={{ color: '#111' }}>Derecho de desistimiento (Directiva 2011/83/UE · TRLGDCU art. 102):</strong> El usuario consumidor dispone de un plazo de <strong style={{ color: '#111' }}>14 días naturales</strong> desde la contratación para desistir del servicio sin necesidad de justificación y sin penalización, siempre que no haya comenzado la prestación efectiva del servicio digital con su consentimiento expreso. Para ejercer este derecho, comuníquelo a <span style={{ color: '#D4AF37' }}>info@xpeak.es</span> indicando su nombre, email de registro y el servicio contratado. El reembolso se realizará en el mismo medio de pago en un plazo máximo de 14 días.</p>
            <p className="mt-2 text-sm" style={{ color: '#222' }}>El derecho de desistimiento no aplica a contenidos digitales que el usuario haya comenzado a utilizar con su consentimiento previo y renuncia expresa al desistimiento (art. 103.m TRLGDCU).</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>6. Descuentos</h2>
            <ul className="list-disc list-inside space-y-1" style={{ color: '#222' }}>
              <li><strong style={{ color: '#111' }}>Facturación anual:</strong> 30% de descuento sobre el precio mensual.</li>
              <li><strong style={{ color: '#111' }}>Cumpleaños:</strong> 40% de descuento aplicable durante el mes de cumpleaños del usuario (requiere fecha de nacimiento verificada en el perfil).</li>
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
            <p className="mb-2">Al subir sesiones de audio, mezclas, vídeos o cualquier contenido a la Plataforma, el usuario declara, garantiza y acepta que:</p>
            <ul className="list-disc list-inside space-y-1" style={{ color: '#222' }}>
              <li>Es el único autor y titular del contenido subido, <strong style={{ color: '#111' }}>o bien cuenta con todas las licencias, permisos y autorizaciones necesarias</strong> de los titulares de los derechos sobre las obras incorporadas (incluyendo, sin limitación, las entidades de gestión SGAE, AIE, AGEDI o equivalentes extranjeras).</li>
              <li>En el caso de mezclas o sesiones que incorporen grabaciones de terceros (tracks, fonogramas, interpretaciones), el usuario es el único responsable de haber obtenido las autorizaciones oportunas de los titulares de los derechos de reproducción y comunicación pública antes de publicar dicho contenido.</li>
              <li>Es el único responsable del cumplimiento de la normativa de propiedad intelectual aplicable, incluida la Ley 21/2022 de transposición de la Directiva (UE) 2019/790 sobre derechos de autor en el mercado único digital (DSM).</li>
              <li>XPEAK actúa exclusivamente como prestador de servicios de alojamiento (<em>hosting</em>) conforme al art. 14 de la Directiva 2000/31/CE y al art. 17 de la Directiva (UE) 2019/790, y <strong style={{ color: '#111' }}>no adquiere responsabilidad alguna</strong> sobre las infracciones cometidas por los usuarios, siempre que actúe con diligencia en la retirada de contenidos infractores una vez notificada.</li>
            </ul>
            <p className="mt-3 mb-2"><strong style={{ color: '#fff' }}>Indemnización.</strong> El usuario se compromete a <strong style={{ color: '#111' }}>mantener indemne a XPEAK</strong>, sus administradores, empleados y colaboradores frente a cualquier reclamación, demanda, sanción, coste o gasto (incluidos honorarios de abogado) derivados de: (i) el incumplimiento por el usuario de las declaraciones contenidas en esta cláusula; (ii) cualquier infracción de derechos de propiedad intelectual cometida mediante el contenido subido por el usuario; o (iii) cualquier reclamación de un tercero titular de derechos sobre dicho contenido.</p>
            <p className="mt-2">XPEAK dispone de un procedimiento de notificación y retirada de contenidos infractores (<em>notice and takedown</em>). Las solicitudes deben enviarse a <span style={{ color: '#D4AF37' }}>legal@xpeak.es</span> indicando el contenido infractor, la titularidad acreditada y los datos de contacto del solicitante. XPEAK procederá a la retirada cautelar en un plazo razonable desde la recepción de la notificación.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>10. Naturaleza Jurídica de la Intermediación — XPEAK no es Empleador</h2>
            <p className="mb-2">
              <strong style={{ color: '#fff' }}>XPEAK opera exclusivamente como plataforma de intermediación tecnológica</strong> entre profesionales del sector del eventos y entretenimiento y los empresarios o entidades que requieren sus servicios. A todos los efectos legales:
            </p>
            <ul className="list-disc list-inside space-y-2" style={{ color: '#222' }}>
              <li><strong style={{ color: '#111' }}>XPEAK no es empleador</strong> de ningún profesional registrado en la Plataforma, ni existe relación laboral, mercantil de dependencia ni vínculo de ajenidad entre XPEAK y los usuarios profesionales.</li>
              <li>XPEAK no fija las tarifas de los profesionales, no asigna trabajos, no controla el modo de prestación de los servicios ni impone exclusividad.</li>
              <li>La relación contractual derivada de un acuerdo entre un profesional y un empresario es <strong style={{ color: '#111' }}>exclusiva entre dichas partes</strong>. XPEAK no es parte de dicho contrato.</li>
              <li>Los profesionales actúan como trabajadores autónomos o mediante su propia estructura empresarial, siendo responsables de sus obligaciones fiscales (IVA, IRPF) y de Seguridad Social.</li>
              <li>XPEAK percibe una comisión de intermediación por las transacciones realizadas a través de la Plataforma, en calidad de mandatario o agente tecnológico, de conformidad con el art. 1.709 y ss. del Código Civil.</li>
              <li>Esta cláusula no resulta de aplicación a la eventual relación laboral que XPEAK pudiera mantener con su propio personal empleado.</li>
            </ul>
            <p className="mt-2" style={{ color: '#222' }}>
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
            <ul className="list-disc list-inside space-y-1" style={{ color: '#222' }}>
              <li><strong style={{ color: '#111' }}>Acceso</strong> a sus datos personales tratados por XPEAK.</li>
              <li><strong style={{ color: '#111' }}>Rectificación</strong> de datos inexactos o incompletos.</li>
              <li><strong style={{ color: '#111' }}>Supresión</strong> ("derecho al olvido") mediante la función "Eliminar cuenta" disponible en Ajustes.</li>
              <li><strong style={{ color: '#111' }}>Portabilidad</strong> mediante la función "Exportar mis datos" disponible en Ajustes (formato JSON).</li>
              <li><strong style={{ color: '#111' }}>Oposición</strong> y <strong style={{ color: '#111' }}>limitación del tratamiento</strong>, dirigiéndose a <span style={{ color: '#D4AF37' }}>legal@xpeak.es</span>.</li>
            </ul>
            <p className="mt-2">Puede presentar reclamación ante la Agencia Española de Protección de Datos (AEPD) en <em>www.aepd.es</em>.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>13. Limitación de Responsabilidad</h2>
            <p className="mb-2">En la máxima medida permitida por la legislación española aplicable:</p>
            <ul className="list-disc list-inside space-y-2" style={{ color: '#222' }}>
              <li>XPEAK <strong style={{ color: '#111' }}>no garantiza</strong> la disponibilidad, idoneidad, calidad ni legalidad de los servicios ofrecidos por los profesionales registrados.</li>
              <li>XPEAK <strong style={{ color: '#111' }}>no es responsable</strong> de los daños directos, indirectos, incidentales, especiales o consecuentes derivados del uso de la Plataforma o de los servicios contratados entre usuarios.</li>
              <li>La responsabilidad máxima de XPEAK frente a cualquier usuario, por cualquier concepto, quedará limitada al importe efectivamente abonado por dicho usuario a XPEAK durante los <strong style={{ color: '#111' }}>3 meses anteriores</strong> al hecho causante del daño.</li>
              <li>XPEAK no responde por incumplimientos, cancelaciones, accidentes, daños materiales o personales ocurridos durante la prestación del servicio entre profesional y cliente. Dicha responsabilidad recae exclusivamente sobre las partes contratantes.</li>
              <li>XPEAK no garantiza que la Plataforma esté libre de interrupciones, errores o virus, aunque aplica medidas razonables de seguridad.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>14. Política de Cancelaciones y Disputas entre Usuarios</h2>
            <p className="mb-2">Las condiciones de cancelación y devolución son pactadas <strong style={{ color: '#111' }}>directamente entre el profesional y el cliente</strong>. XPEAK no interviene en dichos acuerdos ni actúa como árbitro. No obstante:</p>
            <ul className="list-disc list-inside space-y-2" style={{ color: '#222' }}>
              <li>Cada profesional debe indicar en su perfil su política de cancelación (sin penalización / 50% si cancela con menos de 48h / 100% si cancela el día del evento, u otras condiciones acordadas libremente).</li>
              <li>En caso de disputa entre usuarios, XPEAK podrá actuar como mediador informal a petición de ambas partes, sin que ello suponga asumir responsabilidad alguna sobre el resultado.</li>
              <li>Cualquier conflicto no resuelto entre las partes deberá ventilarse ante los tribunales competentes, sin perjuicio del derecho de los consumidores a acudir a la plataforma de resolución de litigios en línea de la UE (<em>ec.europa.eu/consumers/odr</em>).</li>
              <li>XPEAK se reserva el derecho de suspender o eliminar los perfiles de usuarios que incumplan reiteradamente sus compromisos o acumulen valoraciones negativas fundadas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>15. Conducta Prohibida</h2>
            <p className="mb-2">Queda expresamente prohibido el uso de la Plataforma para:</p>
            <ul className="list-disc list-inside space-y-1" style={{ color: '#222' }}>
              <li>Publicar información falsa, engañosa o suplantando la identidad de terceros.</li>
              <li>Contactar a otros usuarios con fines distintos a la contratación de servicios profesionales (spam, acoso, publicidad no solicitada).</li>
              <li>Eludir el sistema de la Plataforma para evitar el cumplimiento de estos Términos.</li>
              <li>Realizar actividades ilegales, discriminatorias o que atenten contra los derechos de terceros.</li>
              <li>Acceder a datos de otros usuarios sin su consentimiento o mediante técnicas de scraping automatizado.</li>
            </ul>
            <p className="mt-2">El incumplimiento de estas normas faculta a XPEAK para suspender o eliminar la cuenta del usuario de forma inmediata y sin derecho a reembolso.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#D4AF37' }}>15 bis. Prohibición Expresa de Raspado de Datos (Data Scraping)</h2>
            <p className="mb-2">
              La base de datos de profesionales de XPEAK — incluyendo nombres, fotografías, tarifas, ubicaciones, especialidades, biografías y cualquier otro dato identificativo — constituye un activo empresarial propio protegido por la normativa de propiedad intelectual e industrial y por la <strong>Directiva 96/9/CE sobre protección jurídica de bases de datos</strong>, transpuesta al ordenamiento español mediante el Real Decreto Legislativo 1/1996, de 12 de abril, que aprueba el Texto Refundido de la Ley de Propiedad Intelectual (TRLPI).
            </p>
            <p className="mb-2">
              Queda <strong>expresamente prohibido, sin autorización escrita previa de XPEAK</strong>, todo acceso, extracción, reutilización, copia, publicación o redistribución de la base de datos o de partes sustanciales de la misma, así como cualquier actuación que tenga por efecto eludir las medidas técnicas de protección habilitadas en la Plataforma. En particular, se prohíbe:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-2" style={{ color: '#222' }}>
              <li>El uso de programas automatizados, robots, arañas (crawlers), scripts u otras herramientas técnicas para acceder, recopilar o indexar datos de la Plataforma.</li>
              <li>La copia masiva, total o parcial, del directorio de profesionales con fines comerciales, competitivos o de cualquier otra naturaleza.</li>
              <li>La reventa, transferencia o publicación de los datos de los perfiles de profesionales en otras plataformas, bases de datos, directorios o servicios de terceros.</li>
              <li>El acceso a la Plataforma mediante identidades falsas, VPN, proxies u otras técnicas con el objeto de eludir limitaciones de acceso.</li>
              <li>El almacenamiento sistemático de datos con fines de inteligencia competitiva, análisis de mercado o entrenamiento de modelos de inteligencia artificial.</li>
            </ul>
            <p className="mb-2">
              XPEAK implanta medidas técnicas y organizativas (limitación de peticiones, detección de bots, bloqueo de IP, honeypots y monitorización del tráfico) para detectar y prevenir el scraping no autorizado. La vulneración de estas medidas podrá ser constitutiva de delito informático en virtud del artículo 197 bis del Código Penal español.
            </p>
            <p>
              Las infracciones de esta cláusula facultan a XPEAK para exigir la cesación inmediata de la actividad prohibida, el borrado de los datos extraídos, y una indemnización por daños y perjuicios no inferior a <strong>50.000 € por infracción</strong>, sin perjuicio de las acciones penales y civiles que correspondan.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>16. Modificaciones</h2>
            <p>XPEAK se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios serán notificados a los usuarios registrados por correo electrónico y/o mediante aviso en la Plataforma con un mínimo de 15 días de antelación para cambios sustanciales.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>17. Legislación Aplicable</h2>
            <p>Los presentes Términos se rigen por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de Madrid (España), con renuncia expresa a cualquier otro fuero que pudiera corresponderles.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>Contacto</h2>
            <p>Consultas generales: <span style={{ color: '#D4AF37' }}>info@xpeak.es</span></p>
            <p className="mt-1">Asuntos legales y protección de datos: <span style={{ color: '#D4AF37' }}>legal@xpeak.es</span></p>
          </section>
        </div>
      </div>

      <LegalFooter />
    </div>
  );
};

export default Terminos;
