import { Link } from 'react-router-dom';
import { cobrosActivos } from '@/lib/pagos';

// Textos legales que cambian cuando se activan los cobros (18 nov 2026).
// Viven aquí, una sola vez, porque las páginas públicas (/terminos, /privacidad) y las
// versiones del panel (legalContent/*) repetían el texto a mano y ya divergieron antes.
// Con VITE_COBROS_ACTIVOS apagado se dice lo de siempre (sin pagos); encendido, lo
// definitivo. Texto pendiente de revisión por la gestoría antes de pasar Stripe a real.

const fuerte = { color: '#222' } as const;

// ── Términos ─────────────────────────────────────────────────────────────────

/** Sección 3: condiciones económicas del Servicio. */
export const TerminosEconomicas = () => cobrosActivos() ? (
  <>
    <p>El acceso a XPEAK, con perfil en el directorio, mensajes y reseñas, se ofrece sin cuota a profesionales y a empresarios/organizadores. Además, XPEAK ofrece planes de pago opcionales para profesionales (Profesional y Premium), cuyo precio, renovación, cancelación y derecho de desistimiento se detallan en las{' '}
      <Link to="/condiciones-suscripcion" className="underline font-bold" style={{ color: '#8B6A00' }}>Condiciones de suscripción</Link>, que forman parte de estos Términos para quien contrate un plan.</p>
    <p className="mt-2">Los pagos se tramitan a través de Stripe, que actúa como procesador de pagos: XPEAK no recibe ni almacena los datos de la tarjeta. XPEAK actúa como intermediario tecnológico: el precio de los servicios que profesionales y empresarios pacten entre sí se acuerda y se paga directamente entre ellos, no a través de XPEAK.</p>
    <p className="mt-2">XPEAK puede modificar los precios de los planes avisando por correo con 30 días de antelación, conforme a las Condiciones de suscripción y a la sección 13 (Modificaciones). Quien no esté de acuerdo puede cancelar antes de que el nuevo precio se aplique.</p>
  </>
) : (
  <>
    <p>El acceso y uso actual de XPEAK no requiere el pago de ninguna cuota o suscripción, tanto para profesionales como para empresarios/organizadores. No existe actualmente ningún sistema de pago, pasarela de cobro ni procesador de tarjetas integrado en XPEAK.</p>
    <p className="mt-2">XPEAK se reserva el derecho de introducir en el futuro servicios, funcionalidades o modelos de cobro (incluyendo, entre otros, suscripciones o comisiones sobre transacciones). En tal caso, se actualizarán estos Términos y se informará a los usuarios con antelación suficiente antes de su entrada en vigor, conforme a la sección 13 (Modificaciones).</p>
  </>
);

/** Sección 4 / 10: limitación de responsabilidad, viñeta sobre el acceso a la Plataforma. */
export const TerminosLimitacion = () => cobrosActivos() ? (
  <>Para los servicios de pago (planes Profesional y Premium), la responsabilidad de XPEAK se limita, como máximo, al importe efectivamente abonado por el usuario en los 12 meses anteriores al hecho que dé lugar a la reclamación, sin perjuicio de los derechos irrenunciables que la legislación reconoce a los consumidores y usuarios. Para el resto del uso de la Plataforma, que no tiene cuota (sección 3), la responsabilidad de XPEAK se limita a lo estrictamente exigido por la legislación española aplicable.</>
) : (
  <>Dado que el acceso a la Plataforma es gratuito (sección 3), la responsabilidad de XPEAK frente a cualquier usuario, por cualquier concepto derivado del uso del servicio, se limita a lo estrictamente exigido por la legislación española aplicable.</>
);

// ── Privacidad ───────────────────────────────────────────────────────────────

/** Sección 2: datos que recopilamos (viñeta nueva; nada si no hay cobros). */
export const PrivacidadDatosPago = () => cobrosActivos() ? (
  <li><strong style={fuerte}>Datos de suscripción y facturación:</strong> plan contratado, ciclo, importe, estado del pago y los datos de facturación que facilites en el pago (nombre, NIF y dirección). Los datos completos de la tarjeta los trata Stripe: XPEAK no los recibe ni los conserva.</li>
) : null;

/** Sección 3: finalidad (viñeta nueva; nada si no hay cobros). */
export const PrivacidadFinalidadPago = () => cobrosActivos() ? (
  <li>Gestionar la contratación, el cobro, la facturación y la cancelación de los planes de pago, y cumplir las obligaciones fiscales y contables asociadas.</li>
) : null;

/** Sección 4: base legal (frase añadida; nada si no hay cobros). */
export const PrivacidadBasePago = () => cobrosActivos() ? (
  <> Para los planes de pago, la base legal es la ejecución del contrato de suscripción (art. 6.1.b RGPD) y el cumplimiento de las obligaciones legales fiscales y contables (art. 6.1.c RGPD).</>
) : null;

/** Sección 5: conservación (frase añadida; nada si no hay cobros). */
export const PrivacidadConservacionPago = () => cobrosActivos() ? (
  <> Los datos de facturación y pago se conservan durante los plazos que exige la normativa fiscal y mercantil (con carácter general, seis años), bloqueados y solo para atender requerimientos de las autoridades y la defensa de reclamaciones.</>
) : null;

/** Sección 6: destinatarios (viñeta nueva; nada si no hay cobros). */
export const PrivacidadDestinatarioStripe = () => cobrosActivos() ? (
  <li><strong style={fuerte}>Stripe Payments Europe, Ltd. (pagos):</strong> procesa los cobros, las suscripciones y las facturas de los planes de pago y trata los datos de pago y facturación. Puede transferir datos a Stripe, Inc. en EE. UU., con las garantías del Marco de Privacidad de Datos UE-EE. UU. y cláusulas contractuales tipo. Más información en stripe.com/es/privacy.</li>
) : null;
