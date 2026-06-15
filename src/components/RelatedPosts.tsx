import { ArrowRight } from 'lucide-react';

interface Post {
  slug: string;
  title: string;
  desc: string;
  tag: string;
  min: number;
}

const TAG_COLOR: Record<string, string> = {
  DJ: '#D4AF37', Bodas: '#f472b6', Fotografía: '#818cf8',
  Staff: '#34d399', Camareros: '#60a5fa', Catering: '#fbbf24',
  Maquillaje: '#f472b6', Eventos: '#a78bfa', default: '#8E8EA0',
};

const ALL_POSTS: Post[] = [
  { slug: '/blog/cuanto-cobra-un-dj-en-espana', title: '¿Cuánto cobra un DJ en España? Tarifas 2026', desc: 'Guía de precios por ciudad, experiencia y tipo de evento.', tag: 'DJ', min: 6 },
  { slug: '/blog/dj-bodas-madrid', title: 'DJ para bodas en Madrid: precio 2026', desc: 'Precios reales, zonas y cómo elegir el mejor DJ.', tag: 'DJ', min: 5 },
  { slug: '/blog/dj-bodas-barcelona', title: 'DJ para bodas en Barcelona: precio 2026', desc: 'Maresme, Penedès y cómo contratar en Cataluña.', tag: 'DJ', min: 5 },
  { slug: '/blog/dj-bodas-valencia', title: 'DJ para bodas en Valencia: precio 2026', desc: "L'Albufera, Marina Alta y precios reales.", tag: 'DJ', min: 5 },
  { slug: '/blog/dj-bodas-sevilla', title: 'DJ para bodas en Sevilla: precio 2026', desc: 'Haciendas y campiña andaluza — precios y consejos.', tag: 'DJ', min: 4 },
  { slug: '/blog/dj-bodas-malaga', title: 'DJ para bodas en Málaga: precio 2026', desc: 'Costa del Sol, temporada alta y precios.', tag: 'DJ', min: 4 },
  { slug: '/blog/dj-bodas-bilbao', title: 'DJ para bodas en Bilbao: precio 2026', desc: 'Caseríos vascos y bodegas de Rioja Alavesa.', tag: 'DJ', min: 4 },
  { slug: '/blog/dj-bodas-mallorca', title: 'DJ para bodas en Mallorca: precio 2026', desc: 'Fincas de lujo y temporada mayo-octubre.', tag: 'DJ', min: 4 },
  { slug: '/blog/contrato-dj-que-debe-incluir', title: 'Contrato DJ: qué debe incluir y cómo redactarlo', desc: 'Checklist legal completo. Cláusulas obligatorias y errores frecuentes.', tag: 'DJ', min: 5 },
  { slug: '/blog/dj-para-fiesta-privada-precio', title: 'DJ para fiesta privada: precios en España', desc: 'Precios según invitados, horas y equipo incluido.', tag: 'DJ', min: 4 },
  { slug: '/blog/dj-para-comunion-precio', title: 'DJ para comunión: precio y qué incluye', desc: 'Precios por horas y diferencias con la disco móvil.', tag: 'DJ', min: 4 },
  { slug: '/blog/dj-para-eventos-corporativos-precio', title: 'DJ para eventos corporativos: precio 2026', desc: 'Afterworks, galas y fiestas de empresa.', tag: 'DJ', min: 4 },
  { slug: '/blog/dj-para-cumpleanos-precio', title: 'DJ para cumpleaños: precios en España', desc: 'Precio por horas, equipo incluido y cómo elegir.', tag: 'DJ', min: 4 },
  { slug: '/blog/contratar-fotografo-de-bodas', title: 'Cómo contratar un fotógrafo de bodas: guía 2026', desc: 'Precios reales por ciudad y tipo de servicio.', tag: 'Fotografía', min: 5 },
  { slug: '/blog/fotografo-boda-madrid', title: 'Fotógrafo bodas en Madrid: precio 2026', desc: 'Precios y estilos de fotógrafos de boda en Madrid.', tag: 'Fotografía', min: 4 },
  { slug: '/blog/fotografo-boda-barcelona', title: 'Fotógrafo bodas en Barcelona: precio 2026', desc: 'Documental, editorial y cuándo reservar.', tag: 'Fotografía', min: 4 },
  { slug: '/blog/cuanto-cuesta-una-boda-en-espana', title: '¿Cuánto cuesta una boda en España en 2026?', desc: 'Desglose por partidas: catering, DJ, fotógrafo, flores...', tag: 'Bodas', min: 7 },
  { slug: '/blog/cuanto-cuesta-una-comunion-en-espana', title: '¿Cuánto cuesta una comunión? Presupuesto 2026', desc: 'Catering, DJ, fotógrafo y animación para 80-100 invitados.', tag: 'Bodas', min: 5 },
  { slug: '/blog/musica-para-bodas-guia', title: 'Música para bodas: DJ, banda o lista — guía 2026', desc: 'Comparativa con precios y ventajas de cada opción.', tag: 'Bodas', min: 5 },
  { slug: '/blog/catering-boda-precio-por-persona', title: 'Catering de boda: precio por persona 2026', desc: 'Por formato, qué incluye cada paquete y cómo ahorrar.', tag: 'Catering', min: 4 },
  { slug: '/blog/cuanto-cobra-un-camarero-de-eventos', title: 'Cuánto cobra un camarero de eventos en España', desc: 'Precios reales por horas, bodas y fiestas privadas.', tag: 'Camareros', min: 5 },
  { slug: '/blog/cuantos-camareros-necesito-para-mi-boda', title: 'Cuántos camareros necesito para mi boda', desc: 'Tabla de ratios por número de invitados y formato.', tag: 'Bodas', min: 4 },
  { slug: '/blog/flash-booking-como-funciona', title: 'Flash Booking: cómo funciona en XPEAK', desc: 'El sistema para encontrar profesionales disponibles hoy.', tag: 'Eventos', min: 3 },
  { slug: '/blog/como-conseguir-bolos-dj', title: 'Cómo conseguir bolos como DJ en España', desc: '8 estrategias para DJs freelance. Plataformas y precios.', tag: 'DJ', min: 5 },
  { slug: '/blog/wedding-planner-precio-espana', title: 'Wedding Planner: precio y qué hace en España', desc: 'Coordinador del día vs planificación integral.', tag: 'Bodas', min: 6 },
  { slug: '/blog/maquillaje-nupcial-precio-guia', title: 'Maquillaje nupcial: precios y cómo elegir', desc: 'Cuánto cuesta y qué incluye el servicio de novia.', tag: 'Maquillaje', min: 4 },
  { slug: '/blog/dj-residente-discoteca-precio', title: 'DJ residente de discoteca: precio 2026', desc: 'Tarifas por ciudad y diferencias con DJ invitado.', tag: 'DJ', min: 5 },
  { slug: '/blog/staff-de-discoteca-funciones-y-salario', title: 'Staff de discoteca: funciones y sueldos 2026', desc: 'Hostesses, RRPPs, camareros y coordinadores.', tag: 'Staff', min: 4 },
];

interface Props {
  currentSlug: string;
  tags?: string[];
  max?: number;
}

const RelatedPosts = ({ currentSlug, tags = [], max = 3 }: Props) => {
  const related = ALL_POSTS
    .filter(p => p.slug !== currentSlug)
    .sort((a, b) => {
      const aMatch = tags.some(t => a.tag === t || a.title.toLowerCase().includes(t.toLowerCase())) ? 1 : 0;
      const bMatch = tags.some(t => b.tag === t || b.title.toLowerCase().includes(t.toLowerCase())) ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, max);

  if (related.length === 0) return null;

  return (
    <section style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <h3 style={{ fontSize: 14, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
        Artículos relacionados
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {related.map(post => (
          <a key={post.slug} href={post.slug}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              padding: '14px 16px', borderRadius: 12, textDecoration: 'none',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                  background: `${TAG_COLOR[post.tag] ?? TAG_COLOR.default}18`,
                  color: TAG_COLOR[post.tag] ?? TAG_COLOR.default,
                  border: `1px solid ${TAG_COLOR[post.tag] ?? TAG_COLOR.default}30`,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {post.tag}
                </span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{post.min} min</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.4 }}>
                {post.title}
              </p>
            </div>
            <ArrowRight size={14} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
          </a>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
