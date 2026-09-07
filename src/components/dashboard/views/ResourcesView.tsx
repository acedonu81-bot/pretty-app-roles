import { useEffect, useState } from 'react';
import { ExternalLink, ShoppingBag, BookOpen, Calculator, FileText, ArrowUpRight, Handshake, GraduationCap, Sparkles, ChevronDown } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { logAffiliateClick, logEvent } from '@/lib/track';
import {
  AFFILIATE_CATALOG, resolveAffiliateKey, hexToRgba, partnersForRole,
} from '@/lib/affiliate';

/**
 * Panel de RECURSOS del profesional.
 *
 * Existía ya un catálogo de equipo por oficio con enlaces de afiliado
 * (tag xpeak-21), pero SOLO se renderizaba al final de los artículos del blog
 * público: ningún profesional logueado lo veía jamás. Esta vista lo pone donde
 * el profesional pasa el tiempo, junto a las guías y plantillas del propio
 * XPEAK que también estaban enterradas en el blog.
 *
 * Orden deliberado: primero lo que es de XPEAK y no cobra comisión (guías del
 * oficio, contratos, calculadora) y después el equipo con afiliación. Al revés
 * el panel parece una tienda; así parece lo que es — herramientas del oficio,
 * de las cuales algunas se compran.
 *
 * "Recursos" es una entrada genérica del sidebar (grupo Herramientas, junto a
 * Calendario y Contratos) — cualquiera puede llegar aquí sin pasar por su
 * propio directorio. Antes el panel asumía SIEMPRE el rol de la cuenta, así
 * que un DJ que entraba desde el sidebar veía "Todo lo que necesitas para
 * trabajar de DJ" igual que si hubiera venido de su ficha — el hero forzaba
 * un oficio en un sitio pensado como neutral. Ahora el rol de la cuenta solo
 * PRESELECCIONA el selector (comodidad: la mayoría quiere ver lo suyo), pero
 * el usuario elige explícitamente qué oficio consultar y puede quitarlo para
 * quedarse con la vista universal. El banner dorado de la propia ficha
 * (ResourcesBanner) no cambia: sigue siendo automático ahí porque el usuario
 * ya está en su directorio, no en un sitio genérico.
 */

type Guide = { title: string; desc: string; href: string };

// Guías del blog de XPEAK relevantes para CADA oficio. Todas verificadas como
// rutas vivas en App.tsx — un enlace roto aquí es peor que no poner nada.
const GUIDES_BY_ROLE: Record<string, Guide[]> = {
  dj: [
    { title: 'Cómo conseguir bolos como DJ', desc: 'De dónde salen los bolos y cómo encadenarlos.', href: '/blog/como-conseguir-bolos-dj' },
    { title: 'Cuánto cobra un DJ en España', desc: 'Tarifas reales por tipo de evento y zona.', href: '/blog/cuanto-cobra-un-dj-en-espana' },
    { title: 'Calculadora de tarifa DJ', desc: 'Calcula tu caché según horas, desplazamiento y equipo.', href: '/blog/calculadora-tarifa-dj' },
    { title: 'Qué debe incluir un contrato de DJ', desc: 'Las cláusulas que evitan el bolo que no te pagan.', href: '/blog/contrato-dj-que-debe-incluir' },
  ],
  camareros: [
    { title: 'Cómo trabajar de camarero de eventos', desc: 'Cómo entrar en el circuito de bodas y caterings.', href: '/blog/como-trabajar-de-camarero-eventos' },
    { title: 'Cuánto cobra un camarero de eventos', desc: 'Precio por hora y por servicio, con datos por comunidad.', href: '/blog/cuanto-cobra-un-camarero-de-eventos' },
    { title: 'Contrato con proveedores de eventos', desc: 'Qué firmar antes de un servicio.', href: '/blog/contrato-proveedores-eventos' },
  ],
  staff: [
    { title: 'Staff de discoteca: funciones y salario', desc: 'Qué se espera de cada puesto y qué se paga.', href: '/blog/staff-de-discoteca-funciones-y-salario' },
    { title: 'Cómo trabajar de RRPP de discoteca', desc: 'Cómo empezar y cuánto se saca de verdad.', href: '/blog/como-trabajar-de-rrpp-discoteca' },
    { title: 'Contrato con proveedores de eventos', desc: 'Qué firmar antes de un servicio.', href: '/blog/contrato-proveedores-eventos' },
  ],
  media: [
    { title: 'Fotógrafo: cómo conseguir clientes', desc: 'Captar bodas y eventos sin depender del boca a boca.', href: '/blog/fotografo-como-conseguir-clientes' },
    { title: 'Precio de un videógrafo de bodas', desc: 'Qué se cobra por un aftermovie y por cobertura completa.', href: '/blog/videografo-bodas-precio' },
    { title: 'Contrato con proveedores de eventos', desc: 'Qué firmar antes de un servicio.', href: '/blog/contrato-proveedores-eventos' },
  ],
  fotografo: [
    { title: 'Fotógrafo: cómo conseguir clientes', desc: 'Captar bodas y eventos sin depender del boca a boca.', href: '/blog/fotografo-como-conseguir-clientes' },
    { title: 'Precio de un videógrafo de bodas', desc: 'Qué se cobra por un aftermovie y por cobertura completa.', href: '/blog/videografo-bodas-precio' },
  ],
  maquillaje: [
    { title: 'Maquilladora: cómo conseguir clientes', desc: 'Llenar la agenda de novias y eventos.', href: '/blog/maquilladora-conseguir-clientes' },
    { title: 'Precio de maquilladora para eventos', desc: 'Tarifas de novia, invitada y prueba.', href: '/blog/maquilladora-para-eventos-precio' },
    { title: 'Cuánto cobra un estilista de eventos', desc: 'Referencias de precio por servicio.', href: '/blog/cuanto-cobra-un-estilista-de-eventos' },
  ],
  azafata: [
    { title: 'Precio de azafatas para eventos', desc: 'Tarifas por jornada de feria, congreso y promoción.', href: '/blog/precio-azafatas-eventos-espana' },
    { title: 'Cuánto cobra un promotor / RRPP', desc: 'Fijo, comisión y mixto: cómo se paga de verdad.', href: '/blog/cuanto-cobra-un-promotor-rrpp' },
    { title: 'Contrato con proveedores de eventos', desc: 'Qué firmar antes de un servicio.', href: '/blog/contrato-proveedores-eventos' },
  ],
  'grupo-musical': [
    { title: 'Precio de un grupo musical para boda', desc: 'Qué se cobra por formación y duración.', href: '/blog/grupo-musical-para-boda-precio' },
    { title: 'Cuánto cobra un speaker de eventos', desc: 'Referencia para presentadores y maestros de ceremonia.', href: '/blog/cuanto-cobra-un-speaker-de-eventos' },
    { title: 'Contrato con proveedores de eventos', desc: 'Qué firmar antes de un servicio.', href: '/blog/contrato-proveedores-eventos' },
  ],
  catering: [
    { title: 'Precio de catering de boda por persona', desc: 'Rangos por menú y por formato de servicio.', href: '/blog/catering-boda-precio-por-persona' },
    { title: 'Contrato con proveedores de eventos', desc: 'Qué firmar antes de un servicio.', href: '/blog/contrato-proveedores-eventos' },
  ],
  bailarin: [
    { title: 'Precio de bailarín e instructor', desc: 'Tarifas de clase, animación y actuación.', href: '/blog/precio-bailarin-instructor-salsa-bachata' },
    { title: 'Contrato con proveedores de eventos', desc: 'Qué firmar antes de un servicio.', href: '/blog/contrato-proveedores-eventos' },
  ],
  mago: [
    { title: 'Precio de un mago para eventos', desc: 'Qué se cobra por close-up y por escenario.', href: '/blog/mago-precio-eventos-espana' },
    { title: 'Cuánto cobra un humorista de eventos', desc: 'Referencia para espectáculo y cena de empresa.', href: '/blog/cuanto-cobra-un-humorista-eventos' },
    { title: 'Contrato con proveedores de eventos', desc: 'Qué firmar antes de un servicio.', href: '/blog/contrato-proveedores-eventos' },
  ],
  vestuario: [
    { title: 'Cuánto cobra un estilista de eventos', desc: 'Referencias de precio por servicio.', href: '/blog/cuanto-cobra-un-estilista-de-eventos' },
    { title: 'Contrato con proveedores de eventos', desc: 'Qué firmar antes de un servicio.', href: '/blog/contrato-proveedores-eventos' },
  ],
};

// Herramientas de XPEAK válidas para cualquier oficio.
const UNIVERSAL_TOOLS: { icon: typeof FileText; title: string; desc: string; href: string }[] = [
  { icon: FileText, title: 'Plantilla de contrato', desc: 'Contrato de prestación de servicios listo para rellenar y firmar.', href: '/plantilla-contrato-dj' },
  { icon: Calculator, title: 'Calculadora de tarifa', desc: 'Pon precio a tu trabajo con horas, desplazamiento y equipo.', href: '/blog/calculadora-tarifa-dj' },
  { icon: BookOpen, title: 'Todas las guías del sector', desc: 'El blog completo de XPEAK: precios, contratos y captación.', href: '/blog' },
];

const GOLD = '#B8941E';

const SectionTitle = ({ icon: Icon, children, hint, color }: {
  icon: typeof BookOpen; children: React.ReactNode; hint?: string;
  /** Acento de la sección. Por defecto el dorado de marca; la formación usa
   *  azul para separarse visualmente del equipo (aprender vs. comprar). */
  color?: string;
}) => (
  <div className="mb-3">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={color
          ? { background: hexToRgba(color, 0.12), border: `1px solid ${hexToRgba(color, 0.25)}`, color }
          : { background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', color: GOLD }}>
        <Icon size={15} />
      </div>
      <h2 className="text-[0.95rem] font-black" style={{ color: '#0a0908' }}>{children}</h2>
    </div>
    {hint && <p className="text-xs mt-1.5 ml-9" style={{ color: 'rgba(10,9,8,0.5)' }}>{hint}</p>}
  </div>
);

// Oficios con catálogo de equipo, en el mismo orden que el wizard de alta —
// para que el selector no sea una bolsa desordenada de claves internas.
const ROLES_CON_CATALOGO = Object.keys(AFFILIATE_CATALOG);

export default function ResourcesView() {
  const { role, display_name } = useProfile();
  const propioKey = role ? resolveAffiliateKey(role) : null;

  // El rol de la cuenta solo PRESELECCIONA (comodidad); el usuario puede
  // quitarlo. Ver nota de arriba: el hero nunca fuerza un oficio de entrada.
  const [selected, setSelected] = useState<string | null>(propioKey);

  const key = selected;
  const cat = key ? AFFILIATE_CATALOG[key] : null;
  const guides = key ? GUIDES_BY_ROLE[key] ?? [] : [];
  const courses = key ? partnersForRole(key, 'formacion') : [];
  const shops = key ? partnersForRole(key, 'tienda') : [];
  const accent = cat?.accent ?? GOLD;

  // Cuánta gente abre de verdad el panel de Recursos: sin esto no se sabe si
  // el banner de la home funciona o si la sección está muerta.
  useEffect(() => { void logEvent('resources_view', '/recursos', key ?? 'sin-catalogo'); }, [key]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* HERO — siempre neutral, nunca nombra un oficio. El dorado sobre negro
          es el mismo lenguaje que la marca usa en la landing. */}
      <div className="rounded-3xl p-6 sm:p-8 mb-7 relative overflow-hidden"
        style={{
          background: 'linear-gradient(115deg, #1a1208 0%, #2d2110 45%, #3d2d15 100%)',
          border: '1px solid rgba(212,175,55,0.3)',
        }}>
        <span aria-hidden className="absolute pointer-events-none"
          style={{
            right: -80, top: -100, width: 320, height: 320, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0) 70%)',
          }} />
        <div className="relative">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles size={13} style={{ color: '#E0BC4B' }} />
            <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em]" style={{ color: '#E0BC4B' }}>
              Recursos XPEAK
            </span>
          </div>
          <h1 className="text-2xl sm:text-[2rem] font-black tracking-tight leading-tight" style={{ color: '#fff' }}>
            Todo lo que necesitas para trabajar en eventos
          </h1>
          <p className="text-sm mt-2.5 max-w-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Guías del sector, contrato listo para firmar y calculadora de tarifas para cualquier oficio.
            Elige tu categoría abajo para ver también el equipo y la formación recomendada.
          </p>

          {/* Selector de oficio: preseleccionado con el rol de la cuenta, pero
              siempre visible y cambiable — es una elección explícita, no un
              dato que el panel adivina por ti. */}
          <div className="relative mt-5 inline-block">
            <select
              value={selected ?? ''}
              onChange={e => setSelected(e.target.value || null)}
              className="appearance-none rounded-full pl-4 pr-9 py-2.5 text-xs font-bold cursor-pointer outline-none"
              style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)', color: '#E0BC4B' }}
            >
              <option value="" style={{ color: '#0a0908' }}>Ver equipo y guías de tu oficio…</option>
              {ROLES_CON_CATALOGO.map(k => (
                <option key={k} value={k} style={{ color: '#0a0908' }}>
                  {AFFILIATE_CATALOG[k].label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#E0BC4B' }} />
          </div>

          {/* Anclas a las secciones: en móvil el panel es largo y el usuario no
              sabe qué hay abajo si no se lo dices. */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <a href="#herramientas" className="px-3.5 py-2 rounded-full text-xs font-bold transition-all hover:scale-105"
              style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#E0BC4B' }}>
              Contrato y calculadora
            </a>
            {guides.length > 0 && (
              <a href="#guias" className="px-3.5 py-2 rounded-full text-xs font-bold transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#E0BC4B' }}>
                {guides.length} guías
              </a>
            )}
            {cat && (
              <a href="#equipo" className="px-3.5 py-2 rounded-full text-xs font-bold transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#E0BC4B,#B8941E)', color: '#1a1208' }}>
                Ver equipo →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* GUÍAS DEL OFICIO — solo si se ha elegido uno; primero lo que es
          nuestro y no cobra comisión */}
      {guides.length > 0 && (
        <section id="guias" className="mb-8 scroll-mt-4">
          <SectionTitle icon={BookOpen} hint="Escritas por XPEAK para tu oficio.">
            Guías para {cat?.label}
          </SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guides.map(g => (
              <a key={g.href} href={g.href}
                className="group flex flex-col rounded-2xl p-4 transition-all hover:shadow-sm"
                style={{ background: '#fff', border: '1px solid rgba(10,9,8,0.08)' }}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[0.88rem] font-bold leading-snug" style={{ color: '#0a0908' }}>{g.title}</p>
                  <ArrowUpRight size={15} className="flex-shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: 'rgba(10,9,8,0.3)' }} />
                </div>
                <p className="text-xs leading-relaxed mt-1.5" style={{ color: 'rgba(10,9,8,0.55)' }}>{g.desc}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* HERRAMIENTAS XPEAK */}
      <section id="herramientas" className="mb-8 scroll-mt-4">
        <SectionTitle icon={FileText} hint="Sirven para cualquier oficio del sector.">
          Herramientas
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {UNIVERSAL_TOOLS.map(t => {
            const Icon = t.icon;
            return (
              <a key={t.href} href={t.href}
                className="group flex flex-col rounded-2xl p-4 transition-all hover:shadow-sm"
                style={{ background: '#fff', border: '1px solid rgba(10,9,8,0.08)' }}>
                <Icon size={19} style={{ color: GOLD }} className="mb-2" />
                <p className="text-[0.88rem] font-bold leading-snug" style={{ color: '#0a0908' }}>{t.title}</p>
                <p className="text-xs leading-relaxed mt-1.5" style={{ color: 'rgba(10,9,8,0.55)' }}>{t.desc}</p>
              </a>
            );
          })}
        </div>
      </section>

      {/* ESCAPARATE DE EQUIPO — tarjeta alta con zona de imagen arriba.
          Amazon NO permite alojar ni hotlinkear sus fotos de producto: la vía
          legal es su Product Advertising API, que exige 3 ventas previas para
          dar acceso. Hasta entonces la zona de imagen lleva el icono del
          producto sobre color de marca — se lee como escaparate y no como una
          foto rota, y el día que haya API se sustituye solo este bloque. */}
      {cat && (
        <section id="equipo" className="mb-8 scroll-mt-4">
          <SectionTitle icon={ShoppingBag} hint="Material que usan profesionales del sector. Selección de XPEAK.">
            Equipo para {cat.label}
          </SectionTitle>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cat.items.map(r => {
              const Icon = r.icon;
              return (
                <a key={r.title} href={r.href} target="_blank" rel="sponsored noopener noreferrer"
                  onClick={() => logAffiliateClick(r.title)}
                  className="group flex flex-col rounded-2xl overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ background: '#fff', border: `1px solid ${hexToRgba(accent, 0.2)}` }}>
                  {/* Zona de imagen */}
                  <div className="flex items-center justify-center relative"
                    style={{ height: 104, background: hexToRgba(accent, 0.07) }}>
                    <Icon size={34} style={{ color: accent, opacity: 0.85 }} />
                  </div>

                  <div className="flex flex-col flex-1 p-3.5">
                    <p className="text-[0.82rem] font-bold leading-snug mb-1.5" style={{ color: '#0a0908' }}>{r.title}</p>
                    <p className="text-[0.72rem] leading-relaxed mb-3 flex-1" style={{ color: 'rgba(10,9,8,0.55)' }}>{r.desc}</p>
                    <span className="inline-flex items-center justify-center gap-1 text-[0.7rem] font-extrabold rounded-full py-2 transition-all"
                      style={{ background: hexToRgba(accent, 0.1), color: accent, border: `1px solid ${hexToRgba(accent, 0.2)}` }}>
                      Ver en Amazon <ExternalLink size={10} />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* FORMACIÓN — cursos y academias. Sección propia y no mezclada con
          tiendas: quien busca formarse no busca comprar un cable. */}
      {courses.length > 0 && (
        <section className="mb-8">
          {/* "Formación recomendada" y no "con acuerdo con XPEAK": es
              afiliación, no un acuerdo comercial, y decirlo de más resta
              credibilidad al resto del panel. */}
          <SectionTitle icon={GraduationCap} color="#2563EB" hint="Cursos y academias del sector para tu oficio.">
            Formación recomendada
          </SectionTitle>
          {/* Azul de marca y no blanco sobre blanco: al lado del escaparate
              dorado de productos, estas tarjetas eran invisibles —borde gris
              al 8%, sin icono ni llamada a la acción—. El azul las separa del
              equipo (comprar) y las agrupa como formación (aprender). */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {courses.map(p => (
              <a key={p.name} href={p.url!} target="_blank" rel="sponsored noopener noreferrer"
                className="group flex flex-col rounded-2xl p-4 transition-all hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.05), rgba(37,99,235,0.01))',
                  border: '1px solid rgba(37,99,235,0.22)',
                }}>
                {/* Brillo suave en la esquina: da profundidad sin tapar texto */}
                <span aria-hidden className="absolute pointer-events-none"
                  style={{
                    right: -40, top: -40, width: 130, height: 130, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0) 70%)',
                  }} />
                <div className="relative flex items-start gap-3">
                  <span className="flex items-center justify-center rounded-xl flex-shrink-0 transition-transform group-hover:scale-105"
                    style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#3B82F6,#2563EB)', color: '#fff' }}>
                    <GraduationCap size={19} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.88rem] font-black leading-snug" style={{ color: '#0a0908' }}>{p.name}</p>
                    <p className="text-xs leading-relaxed mt-1" style={{ color: 'rgba(10,9,8,0.6)' }}>{p.desc}</p>
                  </div>
                </div>
                <span className="relative inline-flex items-center gap-1 text-[0.72rem] font-black mt-3 self-start px-2.5 py-1.5 rounded-full transition-all"
                  style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.2)' }}>
                  Ver el curso <ExternalLink size={10} />
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* TIENDAS PARTNER */}
      {shops.length > 0 && (
        <section className="mb-8">
          <SectionTitle icon={Handshake} hint="Tiendas especializadas del sector.">
            Tiendas
          </SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shops.map(p => (
              <a key={p.name} href={p.url!} target="_blank" rel="sponsored noopener noreferrer"
                className="group flex flex-col rounded-2xl p-4 transition-all hover:shadow-sm"
                style={{ background: '#fff', border: '1px solid rgba(10,9,8,0.08)' }}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[0.88rem] font-bold leading-snug" style={{ color: '#0a0908' }}>{p.name}</p>
                  <ExternalLink size={13} className="flex-shrink-0 mt-1" style={{ color: 'rgba(10,9,8,0.3)' }} />
                </div>
                <p className="text-xs leading-relaxed mt-1.5" style={{ color: 'rgba(10,9,8,0.55)' }}>{p.desc}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Dos casos distintos sin catálogo: no se ha elegido oficio (estado por
          defecto, nada raro) vs. se eligió uno que aún no tiene selección de
          equipo (limitación real, se dice claramente). */}
      {!cat && key && (
        <p className="text-xs rounded-2xl p-4" style={{ background: 'rgba(10,9,8,0.03)', color: 'rgba(10,9,8,0.5)' }}>
          Todavía no tenemos una selección de equipo para esta categoría. Las herramientas de arriba te sirven igual,
          y estamos añadiendo oficios poco a poco.
        </p>
      )}

      <p className="text-[0.68rem] leading-relaxed mt-6" style={{ color: 'rgba(10,9,8,0.4)' }}>
        XPEAK puede recibir una comisión por las compras realizadas a través de los enlaces de esta página, sin coste
        adicional para ti{display_name ? '' : ''}. Solo recomendamos material que consideramos útil para profesionales del sector.
      </p>
    </div>
  );
}
