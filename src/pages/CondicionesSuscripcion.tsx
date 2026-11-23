import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AmbientBackground from '@/components/AmbientBackground';
import { PRECIOS_ANUALES, PRECIOS_BLACK_FRIDAY } from '@/lib/subscriptions';

const euros = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#8B6A00' }}>{title}</h2>
    <div className="space-y-2 text-sm leading-relaxed" style={{ color: '#374151' }}>
      {children}
    </div>
  </div>
);

const B = ({ children }: { children: React.ReactNode }) => <span className="font-bold text-[#111]">{children}</span>;

const CondicionesSuscripcion = () => (
  <div className="min-h-screen relative grain-overlay" style={{ background: '#FFFFFF' }}>
    <Helmet>
      <title>Condiciones de suscripción | XPEAK</title>
      <meta name="description" content="Condiciones de contratación de los planes de pago de XPEAK: precios con IVA, renovación, cancelación y desistimiento." />
      <link rel="canonical" href="https://xpeak.es/condiciones-suscripcion" />
      <meta name="robots" content="noindex, follow" />
    </Helmet>
    <AmbientBackground />
    <div className="relative z-10 max-w-3xl mx-auto px-4 py-16">
      <Link to="/" className="inline-block mb-8 text-xs font-bold tracking-widest hover:opacity-70 transition-opacity"
        style={{ color: '#8B6A00' }}>← XPEAK</Link>
      <h1 className="text-3xl font-black tracking-tight mb-2">Condiciones de suscripción</h1>
      <p className="text-xs text-muted-foreground mb-10">Planes de pago para profesionales de XPEAK</p>

      <Section title="1. Quién vende">
        <p><B>Titular:</B> Daniel Acedo Núñez</p>
        <p><B>NIF:</B> 53022503M</p>
        <p><B>Contacto:</B> info@xpeak.site</p>
        <p>Más datos del titular en el <Link to="/aviso-legal" className="underline">Aviso Legal</Link>.</p>
      </Section>

      <Section title="2. Qué se contrata">
        <p>Una suscripción de pago a XPEAK, el directorio profesional de eventos, con las ventajas del plan elegido. Las ventajas de cada plan se detallan en la pantalla "Mi plan" antes de pagar.</p>
      </Section>

      <Section title="3. Precios">
        <p>Todos los precios incluyen IVA y se muestran antes de pagar, en el pago seguro de Stripe.</p>
        <p><B>Profesional:</B> 6,99 € al mes, o {euros(PRECIOS_ANUALES.starter)} al año si se paga por años, también en las renovaciones. IVA incluido.</p>
        <p><B>Premium:</B> 14,99 € al mes, o {euros(PRECIOS_ANUALES.business)} al año si se paga por años, también en las renovaciones. IVA incluido.</p>
        <p>El precio anual equivale a diez mensualidades: pagando por años se ahorran dos meses.</p>
        <p><B>Black Friday 2026:</B> del 27 al 30 de noviembre de 2026, hasta las 23:59 hora de Madrid, el primer año del plan anual tiene un 35 % de descuento: {euros(PRECIOS_BLACK_FRIDAY.starter)} en Profesional y {euros(PRECIOS_BLACK_FRIDAY.business)} en Premium. Después se renueva al precio anual de este apartado. Solo en la primera suscripción de cada persona.</p>
        <p><B>Regalo de bienvenida:</B> quien contrata un plan anual por primera vez recibe un detalle de merchandising de XPEAK en la dirección que indique al pagar. Solo envíos a España.</p>
        <p><B>Descuento por amigos:</B> cada persona que se suscriba con tu enlace de invitación y pague te descuenta un 10 % de tu cuota, hasta un máximo del 20 % con dos o más, mientras sigan suscritas. Se aplica desde tu siguiente cobro, en Profesional o Premium, mensual o anual. Si aún no pagas un plan, se guarda y se aplica cuando te suscribas. Solo cuentan los amigos directos, no los amigos de tus amigos, y no cuenta quien pague con tu misma tarjeta. Si un amigo se da de baja, el descuento baja en tu siguiente cobro. No se suma a otros descuentos en la misma factura.</p>
      </Section>

      <Section title="4. Renovación automática">
        <p>La suscripción se renueva sola cada mes o cada año, según el ciclo elegido, hasta que se cancele. El cobro se hace en la tarjeta indicada, a través de Stripe. XPEAK no guarda los datos de la tarjeta.</p>
      </Section>

      <Section title="5. Cómo cancelar">
        <p>Se puede cancelar en cualquier momento desde "Mi plan", en el portal de cliente, sin permanencia. La cancelación surte efecto al final del periodo ya pagado: hasta ese último día se mantienen las ventajas del plan. No hay devolución proporcional del periodo ya iniciado.</p>
        <p>Al terminar, el perfil pierde las ventajas del plan. Lo que el plan ya no incluye se oculta, no se borra, y reaparece si se vuelve a suscribir.</p>
      </Section>

      <Section title="6. Derecho de desistimiento">
        <p>Quien contrata como consumidor tiene derecho a desistir en 14 días naturales desde la contratación, sin dar explicaciones (texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios).</p>
        <p>Al pagar, la persona solicita que el servicio empiece de inmediato y reconoce que, una vez prestado por completo, pierde el derecho de desistimiento. Si desiste dentro de los 14 días con el servicio ya iniciado, se descuenta la parte proporcional ya disfrutada y se devuelve el resto. Para desistir basta con escribir a info@xpeak.site.</p>
        <p>Esta renuncia se acepta marcando de forma expresa la casilla del pago, que enlaza con esta página.</p>
      </Section>

      <Section title="7. Cambios de precio">
        <p>Si XPEAK cambia el precio de un plan, avisa por correo con 30 días de antelación. Quien no esté de acuerdo puede cancelar antes de que el nuevo precio se aplique. Quien se suscribió con precio de fundador lo mantiene en las condiciones que se indicaron al contratar.</p>
      </Section>

      <Section title="8. Impago">
        <p>Si un cobro falla, Stripe lo reintenta varias veces. Si finalmente no se cobra, la suscripción se cancela y el perfil pierde las ventajas del plan, con lo que no incluye oculto, nunca borrado.</p>
      </Section>

      <Section title="9. Intermediación">
        <p>La suscripción da acceso a ventajas de visibilidad y herramientas dentro de XPEAK. No garantiza contrataciones ni un número de contactos: XPEAK es un intermediario tecnológico y los contratos se celebran entre empresarios y profesionales, como indica el Aviso Legal.</p>
      </Section>

      <Section title="10. Cómo se ordena el directorio y la posición destacada">
        <p>El directorio de XPEAK ordena los perfiles así: primero los que tienen foto (y, entre los DJ, los de sets más escuchados del podio); entre ellos, los perfiles del plan Premium, que se muestran con un aro dorado y la etiqueta "Destacado" para que se vea que es una posición incluida en ese plan; después, los perfiles con insignia de prioridad por invitar a amigos; y a continuación el resto, de más a menos completos.</p>
        <p>Dentro de cada grupo el orden rota cada día, de forma que ningún perfil se queda siempre en la misma posición. La valoración de los clientes no se compra ni se altera con ningún plan.</p>
      </Section>

      <Section title="11. Contacto y reclamaciones">
        <p>Para cualquier duda o reclamación: info@xpeak.site. Resolvemos lo antes posible. El consumidor también puede acudir a los servicios de consumo de su comunidad autónoma.</p>
      </Section>

      <div className="mt-12 pt-6 flex gap-4 text-xs" style={{ borderTop: '1px solid rgba(122,98,22,0.16)', color: '#6b7280' }}>
        <Link to="/privacidad" className="hover:text-[#8B6A00] transition-colors">Privacidad</Link>
        <Link to="/terminos" className="hover:text-[#8B6A00] transition-colors">Términos</Link>
        <Link to="/aviso-legal" className="hover:text-[#8B6A00] transition-colors">Aviso legal</Link>
      </div>
    </div>
  </div>
);

export default CondicionesSuscripcion;
