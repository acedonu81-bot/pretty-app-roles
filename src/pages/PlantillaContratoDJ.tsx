import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogEmailCapture from '@/components/BlogEmailCapture';

const CLAUSULAS = [
  'Datos completos de ambas partes (DJ y organizador)',
  'Fecha, hora exacta y dirección del evento',
  'Duración del servicio + horas extra',
  'Caché total, señal y forma de pago',
  'Equipo incluido (CDJs, altavoces, luces)',
  'Cláusula de cancelación con porcentajes',
  'Lista de canciones prohibidas y obligatorias',
  'Cláusula de fuerza mayor',
  'Rider técnico del DJ',
  'Firma de ambas partes + fecha',
];

export default function PlantillaContratoDJ() {
  return (
    <>
      <Helmet>
        <title>Plantilla Contrato DJ Gratis 2026 | Descarga Word y PDF — XPEAK</title>
        <meta name="description" content="Descarga gratis la plantilla de contrato para DJ. Formato Word editable con todas las cláusulas legales para eventos y bodas en España. Actualizado 2026." />
        <link rel="canonical" href="https://xpeak.es/plantilla-contrato-dj" />
        <meta property="og:title" content="Plantilla Contrato DJ Gratis 2026 — XPEAK" />
        <meta property="og:description" content="Plantilla de contrato DJ para eventos y bodas. Word editable, con cláusulas de cancelación, rider técnico e IVA/IRPF. Gratis." />
        <meta property="og:url" content="https://xpeak.es/plantilla-contrato-dj" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'Cómo redactar un contrato para DJ',
          description: 'Guía paso a paso para crear un contrato DJ válido en España con todas las cláusulas necesarias.',
          step: CLAUSULAS.map((c, i) => ({ '@type': 'HowToStep', position: i + 1, name: c })),
        })}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>
            ← Todos los artículos
          </a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>
              DJ · Recurso gratuito · XPEAK
            </p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              Plantilla de contrato para DJ: descarga gratis en Word y PDF (2026)
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>
              Plantilla de contrato DJ editable con todas las cláusulas necesarias para eventos y bodas en España. Válida legalmente, con IVA, IRPF y cláusula de cancelación incluidos.
            </p>
          </div>

          {/* CTA principal — email capture */}
          <BlogEmailCapture variant="plantilla" intent="contratar-dj" articlePath="/plantilla-contrato-dj" />

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Qué incluye la plantilla de contrato DJ</h2>
              <div className="space-y-2">
                {CLAUSULAS.map((c, i) => (
                  <div key={c} className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span className="font-black text-xs shrink-0 mt-0.5" style={{ color: '#D4AF37' }}>{i + 1}.</span>
                    <p className="text-xs font-medium">{c}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Cómo usar la plantilla</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { paso: '1. Descarga', desc: 'Introduce tu email arriba y recibe el Word editable al instante.' },
                  { paso: '2. Rellena', desc: 'Añade los datos del evento, precio y condiciones pactadas.' },
                  { paso: '3. Firma', desc: 'Imprime y firma en papel o usa la firma digital de XPEAK.' },
                ].map(p => (
                  <div key={p.paso} className="p-4 rounded-xl text-center"
                    style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
                    <p className="text-xs font-black mb-1" style={{ color: '#D4AF37' }}>{p.paso}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-3">¿Por qué necesitas un contrato con tu DJ?</h2>
              <div className="space-y-3">
                {[
                  { t: 'Protege tu dinero', d: 'Un contrato con cláusula de cancelación evita que pierdas la señal si el DJ no aparece.' },
                  { t: 'Evita sorpresas de precio', d: 'Sin contrato, el DJ puede añadir extras (horas, equipo) el día del evento.' },
                  { t: 'Garantiza la actuación prometida', d: 'Playlist, equipo, hora de inicio y fin — todo queda por escrito.' },
                  { t: 'Obligatorio para facturar', d: 'Si el DJ emite factura (IVA + IRPF), necesitas el contrato para la deducción.' },
                ].map(item => (
                  <div key={item.t} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-xs font-bold mb-1">{item.t}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.d}</p>
                  </div>
                ))}
              </div>
            </section>

            <BlogEmailCapture variant="plantilla" intent="contratar-dj" articlePath="/plantilla-contrato-dj" />

            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/contrato-dj-que-debe-incluir', cat: 'DJ', title: 'Contrato para DJ: qué debe incluir y cómo redactarlo' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0"
                      style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </main>
        <FooterPublic />
      </div>
    </>
  );
}
