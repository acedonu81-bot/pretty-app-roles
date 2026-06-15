import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AmbientBackground from '@/components/AmbientBackground';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#D4AF37' }}>{title}</h2>
    <div className="space-y-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
      {children}
    </div>
  </div>
);

const AvisoLegal = () => (
  <div className="min-h-screen relative grain-overlay" style={{ background: '#060606' }}>
    <Helmet>
      <title>Aviso Legal | XPEAK</title>
      <meta name="robots" content="noindex, follow" />
    </Helmet>
    <AmbientBackground />
    <div className="relative z-10 max-w-3xl mx-auto px-4 py-16">
      <Link to="/" className="inline-block mb-8 text-xs font-bold tracking-widest hover:opacity-70 transition-opacity"
        style={{ color: '#D4AF37' }}>← XPEAK</Link>
      <h1 className="text-3xl font-black tracking-tight mb-2">Aviso Legal</h1>
      <p className="text-xs text-muted-foreground mb-10">En cumplimiento del art. 10 de la Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI-CE)</p>

      <Section title="1. Datos identificativos del titular">
        <p><span className="font-bold text-white">Denominación:</span> XPEAK</p>
        <p><span className="font-bold text-white">NIF/CIF:</span> <span style={{ color: '#D4AF37' }}>Pendiente de actualización — contactar: info@xpeak.site</span></p>
        <p><span className="font-bold text-white">Domicilio:</span> España</p>
        <p><span className="font-bold text-white">Email:</span> info@xpeak.site</p>
        <p><span className="font-bold text-white">Contacto legal:</span> legal@xpeak.es</p>
        <p><span className="font-bold text-white">Web:</span> https://xpeak.es</p>
      </Section>

      <Section title="2. Objeto y naturaleza del servicio">
        <p>XPEAK es una plataforma de intermediación técnica que opera como directorio profesional para el sector de eventos y eventos y entretenimiento en España.</p>
        <p>XPEAK actúa exclusivamente como intermediario tecnológico conforme al artículo 14 de la Directiva 2000/31/CE y la LSSI-CE. XPEAK <span className="font-bold text-white">no es agencia de empleo</span>, empresa de trabajo temporal (ETT) ni actúa como empleador de los profesionales registrados.</p>
        <p>Los contratos de prestación de servicios se celebran directamente entre empresarios y profesionales. XPEAK no es parte de dichos contratos.</p>
      </Section>

      <Section title="3. Propiedad intelectual e industrial">
        <p>El diseño, código fuente, logotipos, marcas y contenidos propios de XPEAK están protegidos por la legislación española e internacional sobre propiedad intelectual e industrial (Real Decreto Legislativo 1/1996, Ley de Marcas 17/2001).</p>
        <p>Los contenidos generados por los usuarios (mezclas, fotografías, vídeos, textos) son responsabilidad exclusiva de quien los publica. XPEAK no asume responsabilidad sobre posibles infracciones de derechos de terceros realizadas por los usuarios.</p>
        <p>Para notificaciones de infracción de derechos de autor: <span className="font-bold text-white">legal@xpeak.es</span> (procedimiento notice &amp; takedown conforme al art. 14 Dir. 2000/31/CE y Ley 21/2022 de servicios de comunicación audiovisual).</p>
      </Section>

      <Section title="4. Protección de datos personales">
        <p>El responsable del tratamiento de datos personales es XPEAK (datos identificativos en el apartado 1).</p>
        <p>El tratamiento se realiza conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).</p>
        <p>Para más información consulta nuestra{' '}
          <Link to="/privacidad" className="underline font-bold" style={{ color: '#D4AF37' }}>Política de Privacidad</Link>.
        </p>
        <p><span className="font-bold text-white">Contacto para ejercicio de derechos RGPD:</span> admin@xpeak.es</p>
      </Section>

      <Section title="5. Cookies">
        <p>Este sitio web utiliza cookies propias de carácter técnico imprescindibles para el funcionamiento de la plataforma, así como cookies opcionales de analítica y personalización con consentimiento previo del usuario.</p>
        <p>Consulta nuestra{' '}
          <Link to="/cookies" className="underline font-bold" style={{ color: '#D4AF37' }}>Política de Cookies</Link>{' '}
          para más información y opciones de configuración.
        </p>
      </Section>

      <Section title="6. Limitación de responsabilidad">
        <p>XPEAK no garantiza la disponibilidad continua e ininterrumpida de la plataforma y no se responsabiliza de los daños producidos por interrupciones o fallos técnicos ajenos a su control.</p>
        <p>XPEAK no verifica la situación legal, fiscal, laboral ni la identidad real de los usuarios registrados, salvo en el proceso de verificación voluntaria de perfil. La plataforma actúa como un directorio de referencia.</p>
        <p>Los enlaces a sitios web de terceros son meramente informativos. XPEAK no se responsabiliza del contenido de dichos sitios.</p>
      </Section>

      <Section title="7. Legislación aplicable y jurisdicción">
        <p>Este aviso legal se rige por la legislación española. Para la resolución de cualquier controversia derivada del acceso o uso de este sitio web, las partes se someten a los Juzgados y Tribunales de Madrid, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.</p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Normativa aplicable: RGPD (UE) 2016/679 · LOPDGDD (LO 3/2018) · LSSI-CE (Ley 34/2002) · Ley 21/2022 · Código Civil · Real Decreto-ley 9/2021
        </p>
      </Section>

      <div className="mt-12 pt-6 flex gap-4 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>
        <Link to="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
        <Link to="/terminos" className="hover:text-white transition-colors">Términos</Link>
        <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
      </div>
    </div>
  </div>
);

export default AvisoLegal;
