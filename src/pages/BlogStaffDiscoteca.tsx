import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const PERFILES = [
  { perfil: 'Hostess / Azafata', tarifa: '15€ – 22€/h', turno: '40€ – 80€/noche', nota: 'Recepción, lista de invitados, mesa VIP' },
  { perfil: 'Relaciones Públicas (RRPP)', tarifa: '80€ – 300€/noche', turno: '+ % taquilla', nota: 'Captación de público con lista propia' },
  { perfil: 'Camarero/a de sala', tarifa: '12€ – 18€/h', turno: '50€ – 90€/noche', nota: 'Barra y mesas VIP, servicio nocturno' },
  { perfil: 'Coordinador/a de sala', tarifa: '20€ – 35€/h', turno: '80€ – 150€/noche', nota: 'Gestión del personal y operativa del evento' },
  { perfil: 'Seguridad / Control de acceso', tarifa: '18€ – 28€/h', turno: '60€ – 120€/noche', nota: 'Requiere TIP (Tarjeta de Identificación Profesional)' },
  { perfil: 'Promotor/a de calle', tarifa: '10€ – 15€/h', turno: '30€ – 60€/noche', nota: 'Distribución de flyers y captación presencial' },
];

const FAQ = [
  { q: '¿Cuánto staff necesito para una discoteca con aforo de 500 personas?', a: 'Para 500 personas en un club nocturno necesitas aproximadamente: 2-3 hostesses en acceso, 6-8 camareros de sala, 1-2 coordinadores, 3-4 personas de seguridad y 1 bartender por cada 50 personas en la barra. Total estimado: 15-20 personas de staff.' },
  { q: '¿Los RRPPs de XPEAK tienen lista propia de clientes?', a: 'Sí. Los perfiles de relaciones públicas en XPEAK especifican el tipo de clientela que manejan, el historial de salas donde han trabajado y los resultados medibles (número de reservas, taquilla atribuida). Puedes filtrar por sala o tipo de evento.' },
  { q: '¿Puedo contratar staff de sala para un evento de una sola noche?', a: 'Sí. XPEAK permite contrataciones puntuales para una noche. El Flash Booking notifica al instante a los profesionales disponibles en tu ciudad. Ideal para eventos especiales, sustituciones de última hora o refuerzos de temporada.' },
];

export default function BlogStaffDiscoteca() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Staff de discoteca: funciones, sueldos y cómo contratar (2026)',
    description: 'Guía completa del personal de sala para discotecas y clubs: hostesses, RRPPs, camareros y coordinadores. Funciones, tarifas y cómo contratar.',
    author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-05-03',
    dateModified: '2026-05-03',
    url: 'https://xpeak.es/blog/staff-de-discoteca-funciones-y-salario',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://xpeak.es/blog/staff-de-discoteca-funciones-y-salario' },
  };

  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Staff de discoteca: funciones, sueldos y cómo contratar (2026)', item: 'https://xpeak.es/blog/staff-de-discoteca-funciones-y-salario' },
  ],
};

const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  const th = { padding: '10px 14px', textAlign: 'left' as const, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.5px', color: '#059669', borderBottom: '1px solid rgba(5,150,105,0.25)', background: 'rgba(5,150,105,0.04)' };
  const td = { padding: '10px 14px', borderBottom: '1px solid rgba(0,0,0,0.05)', color: '#111', fontSize: '0.87rem', verticalAlign: 'top' as const };

  return (
    <>
      <Helmet>
        <title>Staff discoteca: funciones y sueldos 2026 | XPEAK</title>
        <meta name="description" content="Guía completa del personal de sala para discotecas en España 2026: hostesses, RRPPs, camareros y coordinadores. Tarifas reales por perfil." />
        <meta name="keywords" content="staff discoteca España, hostess eventos nocturnos, relaciones públicas discoteca, personal sala nocturna, contratar staff sala" />
        <link rel="canonical" href="https://xpeak.es/blog/staff-de-discoteca-funciones-y-salario" />
        <meta property="og:title" content="Staff de discoteca: funciones y sueldos 2026" />
        <meta property="og:description" content="Guía completa del personal de sala: hostesses, RRPPs, camareros y coordinadores. Tarifas reales por perfil." />
        <meta property="og:url" content="https://xpeak.es/blog/staff-de-discoteca-funciones-y-salario" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Staff de discoteca: funciones y sueldos 2026" />
        <meta name="twitter:description" content="Hostesses, RRPPs, camareros y coordinadores. Tarifas reales por perfil en España." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#059669' }}>XPEAK</a>
          <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>
            Unirse gratis
          </a>
        </nav>
        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-3xl mx-auto text-xs" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24">
          <header className="mb-10">
            <time className="text-[0.65rem] font-bold uppercase tracking-wider" style={{ color: '#3d3d4e' }}>3 may 2026</time>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-2 mb-4 leading-tight">
              Staff de discoteca: funciones, sueldos y cómo contratar (2026)
            </h1>
            <p className="text-base leading-relaxed" style={{ color: '#222' }}>
              Montar el equipo humano correcto es lo que diferencia una noche memorable de una operación caótica. Esta guía cubre todos los perfiles, sus funciones reales y cuánto cobran en España.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-lg font-black mb-4">Tarifas por perfil de staff</h2>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <thead><tr><th style={th}>Perfil</th><th style={th}>Tarifa/hora</th><th style={th}>Por noche</th><th style={th}>Funciones</th></tr></thead>
                <tbody>
                  {PERFILES.map(r => (
                    <tr key={r.perfil}>
                      <td style={{ ...td, fontWeight: 600 }}>{r.perfil}</td>
                      <td style={{ ...td, color: '#059669', fontWeight: 700 }}>{r.tarifa}</td>
                      <td style={td}>{r.turno}</td>
                      <td style={td}>{r.nota}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2" style={{ color: '#3d3d4e' }}>Los RRPPs suelen cobrar fijo + porcentaje de la taquilla atribuida a su lista.</p>
          </section>

          <BlogInlineCTA role="staff" />

          <section className="mb-10">
            <h2 className="text-lg font-black mb-4">Funciones de cada perfil</h2>
            <div className="space-y-3">
              {[
                { rol: 'Hostess / Azafata', funciones: 'Control de acceso, verificación de listas VIP, asignación de zonas reservadas, primera imagen del club frente al cliente.' },
                { rol: 'Relaciones Públicas (RRPP)', funciones: 'Gestión de lista de invitados, captación de reservas de mesa, fidelización de clientes premium y coordinación con marketing del club.' },
                { rol: 'Camarero/a de sala', funciones: 'Servicio en mesa y barra, atención VIP, preparación de botellas y mixología básica. Requiere resistencia en entornos con ruido y ritmo alto.' },
                { rol: 'Coordinador/a de sala', funciones: 'Supervisión del personal, gestión de incidencias en tiempo real, coordinación con el equipo técnico y reporte al responsable del evento.' },
              ].map(item => (
                <div key={item.rol} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <p className="text-sm font-bold mb-1" style={{ color: '#059669' }}>{item.rol}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{item.funciones}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {FAQ.map(f => (
                <div key={f.q} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <p className="text-sm font-bold mb-2">{f.q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/cuanto-cobra-un-camarero-de-eventos', cat: 'Staff', title: 'Cuánto cobra un camarero de eventos 2026' },
                  { href: '/blog/precio-azafatas-eventos-espana', cat: 'Staff', title: 'Precio azafatas para eventos España 2026' },
                  { href: '/blog/contratar-barman-evento-privado', cat: 'Staff', title: 'Barman evento privado: precio 2026' },
                  { href: '/blog/como-contratar-personal-para-un-evento', cat: 'Guía', title: 'Contratar personal para un evento: guía 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(5,150,105,0.1)', color: '#059669', border: '1px solid rgba(5,150,105,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.15)' }}>
            <p className="text-sm font-black mb-1">Encuentra staff verificado para tu sala</p>
            <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>Hostesses, RRPPs, camareros y coordinadores. Flash Booking en menos de 1h.</p>
            <a href="/contratar-staff" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#059669,#B8941E)', color: '#000' }}>
              Ver staff disponible →
            </a>
          </div>
          <BlogAuthor />
          <BlogShare />
        </article>
          <BlogEmailCapture variant="presupuestos" intent="contratar-staff" articlePath="/blog/staff-de-discoteca-funciones-y-salario" />
      <BlogRelatedPosts currentSlug='/blog/staff-de-discoteca-funciones-y-salario' tag='Staff' />
        <FooterPublic />
      <BlogScrollCTA role="staff" storageKey="xpeak_scrollcta_staff_discoteca" />
      </div>
    </>
  );
}
