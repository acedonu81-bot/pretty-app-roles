import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

const slug = 'calculadora-tarifa-dj';

const BASES: Record<string, number> = {
  boda: 1000,
  empresa: 800,
  comunion: 600,
  cumpleanos: 400,
  fiesta_privada: 350,
  discoteca: 300,
};

const MULTIPLICADORES_CIUDAD: Record<string, number> = {
  madrid: 1.25,
  barcelona: 1.25,
  sevilla: 1.0,
  valencia: 1.05,
  bilbao: 1.15,
  malaga: 1.1,
  otras: 0.9,
};

export default function BlogCalculadoraTarifaDJ() {
  const [tipoEvento, setTipoEvento] = useState('boda');
  const [ciudad, setCiudad] = useState('otras');
  const [horas, setHoras] = useState(6);
  const [experiencia, setExperiencia] = useState('medio');
  const [luces, setLuces] = useState(false);

  const base = BASES[tipoEvento] ?? 500;
  const multCiudad = MULTIPLICADORES_CIUDAD[ciudad] ?? 0.9;
  const multHoras = horas <= 4 ? 0.8 : horas <= 6 ? 1 : horas <= 8 ? 1.2 : 1.4;
  const multExp = experiencia === 'junior' ? 0.7 : experiencia === 'medio' ? 1 : 1.4;
  const extraLuces = luces ? 200 : 0;
  const precio = Math.round((base * multCiudad * multHoras * multExp + extraLuces) / 50) * 50;
  const rango = `${Math.round(precio * 0.8)}€ – ${Math.round(precio * 1.2)}€`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: "Calculadora de tarifa DJ 2026: precio estimado para tu evento",
    description: "Calcula cuánto cuesta un DJ para tu evento. Introduce el tipo de evento, ciudad y horas y obtén un precio estimado real para 2026.",
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '2026-06-07',
    dateModified: '2026-06-07',
    url: "https://xpeak.es/blog/calculadora-tarifa-dj",
    mainEntityOfPage: { '@type': 'WebPage', '@id': "https://xpeak.es/blog/calculadora-tarifa-dj" },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
      { '@type': 'ListItem', position: 3, name: "Calculadora de tarifa DJ 2026: precio estimado para tu evento", item: "https://xpeak.es/blog/calculadora-tarifa-dj" },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Calculadora de tarifa DJ 2026: precio estimado para tu evento | XPEAK</title>
        <meta name="description" content="Calcula cuánto cuesta un DJ para tu evento. Introduce el tipo de evento, ciudad y horas y obtén un precio estimado real para 2026." />
        <link rel="canonical" href={`https://xpeak.es/blog/${slug}`} />
        <meta property="og:title" content="Calculadora tarifa DJ 2026 — XPEAK" />
        <meta property="og:description" content="Calcula el precio de un DJ para tu boda, empresa o fiesta privada. Estimación real 2026." />
        <meta property="og:url" content={`https://xpeak.es/blog/${slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>Blog</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#8E8EA0' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>DJ · Herramienta · XPEAK</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">Calculadora de tarifa DJ 2026: ¿cuánto cuesta tu evento?</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#8E8EA0' }}>Introduce los datos de tu evento y obtén un precio estimado real. Basado en tarifas reales de DJs en España en 2026.</p>
          </div>

          {/* CALCULADORA */}
          <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <h2 className="text-base font-black mb-5" style={{ color: '#D4AF37' }}>Calculadora de precio DJ</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Tipo de evento</label>
                <select value={tipoEvento} onChange={e => setTipoEvento(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}>
                  <option value="boda">Boda</option>
                  <option value="empresa">Evento de empresa</option>
                  <option value="comunion">Comunión</option>
                  <option value="cumpleanos">Cumpleaños</option>
                  <option value="fiesta_privada">Fiesta privada</option>
                  <option value="discoteca">Discoteca / club</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Ciudad</label>
                <select value={ciudad} onChange={e => setCiudad(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}>
                  <option value="madrid">Madrid</option>
                  <option value="barcelona">Barcelona</option>
                  <option value="bilbao">Bilbao / País Vasco</option>
                  <option value="valencia">Valencia</option>
                  <option value="malaga">Málaga / Costa del Sol</option>
                  <option value="sevilla">Sevilla / Andalucía</option>
                  <option value="otras">Otras ciudades</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Horas de servicio: <span style={{ color: '#D4AF37' }}>{horas}h</span>
                </label>
                <input type="range" min={2} max={12} value={horas} onChange={e => setHoras(Number(e.target.value))}
                  className="w-full accent-[#D4AF37]" />
                <div className="flex justify-between text-[0.6rem] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <span>2h</span><span>6h</span><span>12h</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Nivel del DJ</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ v: 'junior', l: 'Junior', s: '< 2 años' }, { v: 'medio', l: 'Medio', s: '2-5 años' }, { v: 'senior', l: 'Senior', s: '5+ años' }].map(opt => (
                    <button key={opt.v} onClick={() => setExperiencia(opt.v)}
                      className="p-2.5 rounded-lg text-center transition-all"
                      style={{
                        background: experiencia === opt.v ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${experiencia === opt.v ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      }}>
                      <p className="text-xs font-bold" style={{ color: experiencia === opt.v ? '#D4AF37' : '#fff' }}>{opt.l}</p>
                      <p className="text-[0.6rem]" style={{ color: 'rgba(255,255,255,0.6)' }}>{opt.s}</p>
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={luces} onChange={e => setLuces(e.target.checked)} className="w-4 h-4 accent-[#D4AF37]" />
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Incluir equipo de luces (+150-300€)</span>
              </label>
            </div>

            {/* Resultado */}
            <div className="mt-6 p-5 rounded-xl text-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(212,175,55,0.7)' }}>Precio estimado</p>
              <p className="text-4xl font-black mb-1" style={{ color: '#D4AF37' }}>{rango}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Sin IVA · Orientativo · Basado en tarifas reales 2026</p>
            </div>
          </div>

          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath={`/blog/${slug}`} />

          <div className="space-y-6 mt-6">
            <section>
              <h2 className="text-base font-black mb-3">¿Cómo consigo presupuestos reales?</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                La calculadora da una estimación orientativa. Para tener presupuestos reales de DJs verificados en tu zona, usa XPEAK: introduce los detalles de tu evento y recibes 3 propuestas en menos de 24h, gratis y sin compromiso.
              </p>
            </section>

            <section className="mt-4">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/como-contratar-un-dj', cat: 'Guía', title: 'Cómo contratar un DJ: guía completa' },
                  { href: '/plantilla-contrato-dj', cat: 'Recurso', title: 'Plantilla contrato DJ gratis — Word y PDF' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </main>
        <BlogAuthor />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_calculadora_dj" />
      </div>
    </>
  );
}
