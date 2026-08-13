import { Helmet } from 'react-helmet-async';
import { Zap, Shield, ArrowRight, FileText, Search, Wallet, Calendar, MessageSquare, CheckCircle } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';

const H1 = 'Organizar Eventos en España — Gestiona Todo desde un Solo Panel';
const DESC = 'Organiza bodas, eventos de empresa y celebraciones con XPEAK: compara profesionales verificados, publica necesidades puntuales con Flash Booking y firma contratos digitales automáticos. Sin comisión.';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: H1,
  provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  areaServed: { '@type': 'Country', name: 'España' },
  description: DESC,
  url: 'https://xpeak.es/organizar-eventos',
  serviceType: 'Gestión y organización de eventos',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', description: 'Registro gratuito para organizadores y empresas' },
};

const FAQS = [
  { q: '¿XPEAK cobra comisión por organizar un evento?', a: 'No. XPEAK es completamente gratuito para organizadores, empresas y particulares. El trato y el pago se cierran directamente con el profesional, sin intermediarios ni porcentajes sobre el presupuesto.' },
  { q: '¿Qué es el Flash Booking y cómo me ayuda a organizar un evento?', a: 'Flash Booking es el sistema de XPEAK para cubrir necesidades puntuales: publicas qué necesitas (DJ, camareros, fotógrafo...) y los profesionales disponibles en tu zona pueden responder directamente. Útil para bajas de última hora o eventos con poca antelación, aunque la disponibilidad depende de cada categoría y ciudad.' },
  { q: '¿Puedo gestionar varios proveedores del mismo evento desde XPEAK?', a: 'Sí. Puedes añadir DJ, staff, catering, fotógrafo y cualquier otro perfil a un mismo evento desde el carrito "Mi evento", comparar presupuestos y contactarlos todos con un único mensaje.' },
  { q: '¿Los contratos que genera XPEAK son legales?', a: 'Sí. Los contratos digitales de XPEAK incluyen los datos fiscales de ambas partes, cláusulas de cancelación y condiciones del servicio. Se descargan en PDF listos para tu gestoría o contabilidad.' },
  { q: '¿Necesito ser una empresa para usar XPEAK como organizador?', a: 'No. Puedes usar XPEAK como particular organizando tu propia boda o celebración, o como empresa/agencia gestionando eventos para terceros. El registro y las herramientas son las mismas.' },
];

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

const breadcrumbData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: H1, item: 'https://xpeak.es/organizar-eventos' },
  ],
};

const HERRAMIENTAS = [
  { icon: <Search size={18} />, title: 'Directorio verificado', body: 'Busca por rol, ciudad y precio entre cientos de profesionales de eventos con tarifas públicas y portfolio real.' },
  { icon: <Zap size={18} />, title: 'Flash Booking', body: 'Publica una necesidad puntual y recibe respuestas de los profesionales disponibles en tu zona para esa fecha.' },
  { icon: <FileText size={18} />, title: 'Contratos digitales', body: 'Genera y firma contratos con un clic, con datos fiscales y cláusulas de cancelación incluidas. PDF listo para tu gestoría.' },
  { icon: <Wallet size={18} />, title: 'Panel de gastos', body: 'Controla el presupuesto de cada evento por proveedor, con exportación a CSV para tu contabilidad o la de tu agencia.' },
  { icon: <Calendar size={18} />, title: 'Calendario de eventos', body: 'Organiza todas tus fechas y proveedores contratados en un único calendario, sin depender de hojas de cálculo sueltas.' },
  { icon: <MessageSquare size={18} />, title: 'Mensajería directa', body: 'Habla directamente con cada profesional sin intermediarios, con historial de conversación por evento.' },
];

const PARA_QUIEN = [
  { title: 'Particulares', body: 'Organizas tu propia boda, comunión o fiesta privada y quieres comparar precios reales sin llamar a diez sitios distintos.' },
  { title: 'Empresas', body: 'Gestionas eventos corporativos, presentaciones o team buildings y necesitas proveedores fiables con factura correcta.' },
  { title: 'Agencias y wedding planners', body: 'Coordinas varios eventos a la vez y necesitas un panel único para comparar, contratar y controlar gastos de cada proveedor.' },
  { title: 'Salas y discotecas', body: 'Buscas DJs, staff y promotores de forma recurrente y quieres un directorio con disponibilidad real, sin comisión por contratación.' },
];

export default function OrganizadoresLanding() {
  return (
    <>
      <Helmet>
        <title>{H1} | XPEAK</title>
        <meta name="description" content={DESC} />
        <meta name="keywords" content="organizar eventos España, gestión de eventos, software para organizar eventos, herramienta gestión bodas, cómo organizar un evento de empresa, panel de gestión de proveedores eventos" />
        <link rel="canonical" href="https://xpeak.es/organizar-eventos" />
        <meta property="og:title" content={`${H1} — XPEAK`} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content="https://xpeak.es/organizar-eventos" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbData)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>

        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="/blog" className="text-xs font-bold hidden sm:block transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/precios" className="text-xs font-bold hidden sm:block transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>Precios</a>
            <a href="/auth?mode=register&role=empresario"
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12 sm:pb-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
              <Calendar size={16} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
              España · Panel de Gestión de Eventos
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">{H1}</h1>
          <p className="text-sm sm:text-lg mb-3 max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Compara profesionales verificados, publica necesidades puntuales con Flash Booking y firma contratos digitales automáticos — todo desde un único panel, sin comisión.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <a href="/auth?mode=register&role=empresario"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Empezar gratis <ArrowRight size={14} />
            </a>
            <a href="/directorio/dj"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
              Ver directorio de profesionales
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(212,175,55,0.03)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
            {[
              { label: 'Comisión XPEAK', value: '0€ siempre', icon: <Shield size={16} /> },
              { label: 'Flash Booking', value: 'Para necesidades urgentes', icon: <Zap size={16} /> },
              { label: 'Contrato digital', value: 'Listo en 1 clic', icon: <FileText size={16} /> },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                  <p className="text-sm font-black">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Herramientas */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black mb-2">Todo lo que necesitas para organizar un evento</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Sin hojas de cálculo sueltas ni cadenas de WhatsApp con diez proveedores distintos.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HERRAMIENTAS.map(h => (
              <div key={h.title} className="p-5 rounded-xl flex gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                  {h.icon}
                </div>
                <div>
                  <p className="text-sm font-black mb-1.5">{h.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{h.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Para quién */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
          <h2 className="text-xl sm:text-2xl font-black mb-6">¿Quién organiza eventos con XPEAK?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PARA_QUIEN.map(p => (
              <div key={p.title} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={15} style={{ color: '#D4AF37' }} />
                  <p className="text-sm font-black">{p.title}</p>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categorías disponibles */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
          <h2 className="text-xl sm:text-2xl font-black mb-2">Contrata cualquier perfil desde un mismo panel</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Añade varios profesionales a tu evento y compara presupuestos en conjunto.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'DJ', href: '/contratar-dj' },
              { name: 'Camareros', href: '/contratar-camareros' },
              { name: 'Fotógrafo', href: '/contratar-fotografo' },
              { name: 'Staff', href: '/contratar-staff' },
              { name: 'Catering', href: '/contratar-catering' },
              { name: 'Maquillaje', href: '/contratar-maquillaje' },
              { name: 'Promotores', href: '/contratar-promotores' },
              { name: 'Disco Móvil', href: '/contratar-disco-movil' },
            ].map(c => (
              <a key={c.href} href={c.href}
                className="flex items-center justify-center p-4 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {c.name}
              </a>
            ))}
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
          <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8">Cómo organizar tu evento con XPEAK</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: 'Busca y compara', body: 'Filtra profesionales por ciudad, precio y disponibilidad en el directorio. Añade varios a tu evento para comparar.' },
              { title: 'Contrata sin esperas', body: 'Contacta directamente o publica un Flash Booking para necesidades puntuales, según la disponibilidad de cada zona.' },
              { title: 'Firma y controla gastos', body: 'Genera el contrato digital con un clic y sigue el presupuesto de todo el evento desde tu panel.' },
            ].map((s, i) => (
              <div key={s.title} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-3xl font-black mb-3" style={{ color: 'rgba(212,175,55,0.25)' }}>0{i + 1}</p>
                <p className="text-sm font-bold mb-1.5">{s.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {FAQS.map(faq => (
              <div key={faq.q} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-sm font-bold mb-2">{faq.q}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 text-center">
          <div className="rounded-2xl p-7 sm:p-10" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h2 className="text-xl sm:text-3xl font-black mb-3">¿Organizas un evento en España?</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Únete gratis — sin comisión, contratos automáticos y Flash Booking para necesidades puntuales.
            </p>
            <a href="/auth?mode=register&role=empresario"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Empezar gratis <ArrowRight size={14} />
            </a>
          </div>
        </section>

        <FooterPublic />
      </div>
    </>
  );
}
