import { useEffect, useState, useCallback } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { RefreshCw, Eye, Users, UserPlus, Send, Clock, Globe, Smartphone, HelpCircle, ChevronDown, Monitor, User as UserIcon, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AFFILIATE_CATALOG, resolveAffiliateKey } from '@/lib/affiliate';
import { agruparInstalacionesPwa, type EventoPwa } from '@/lib/pwaInstalaciones';

/**
 * Analítica propia de XPEAK, leída de la base de datos del proyecto.
 *
 * Existe porque las dos alternativas fallan para este caso: Vercel Analytics
 * devuelve 404 (exige plan Pro) y GA4, aun teniendo los datos, es una
 * herramienta que cuesta leer cuando lo que quieres es "cuánta gente entró
 * ayer y a qué hora". Aquí eso son dos gráficas.
 *
 * Las cifras excluyen el tráfico propio —cuentas admin y las demo @xpeak.es,
 * ver es_trafico_propio() en la base de datos—: con GA4 ya pasó que 454
 * sesiones brutas incluían ~85 propias (previews de Vercel y logins de
 * prueba), y eso hace tomar decisiones sobre humo.
 */

type Dia = { dia: string; visitas: number; sesiones: number; registros: number };
type Hora = { hora: number; visitas: number };
type Top = { tipo: string; valor: string; visitas: number };
type Negocio = { dia: string; altas: number; solicitudes: number; mensajes: number };
type Busqueda = { termino: string; veces: number; sin_resultados: number };
type Afiliado = { producto: string; clics: number; desde: string };
type ClicRed = { cuando: string; red: string; origen: string; profesional: string | null; profesional_user_id: string | null; quien: string | null; session_id: string | null; device: string | null };
type ClicBanner = { cuando: string; banner: string; origen: string | null; path: string; device: string | null; session_id: string | null; quien: string | null };
type Blog = { articulo: string; visitas: number; sesiones: number; desde_buscador: number };
type Embudo = { paso: string; orden: number; cantidad: number };
type Recurso = { oficio: string; visitas: number; sesiones: number };
type QuienOnline = {
  session_id: string; ultima_pagina: string | null; device: string | null;
  hace_segundos: number; display_name: string | null; rol: string | null;
  detalle: string | null;
};
const GOLD = '#B8941E';

/**
 * Explicación al pasar el ratón. Un panel de analítica sin esto obliga a
 * recordar qué significa cada métrica: "sesiones" no es "visitas", y la
 * diferencia entre ambas es justo lo que dice si la gente vuelve o no.
 *
 * Se usa <details>/CSS puro y no una librería de tooltip para que también
 * funcione con toque en móvil, donde no hay hover.
 */
const Ayuda = ({ texto }: { texto: string }) => (
  <span className="relative inline-flex group/ayuda align-middle ml-1">
    <HelpCircle
      size={12}
      className="cursor-help flex-shrink-0"
      style={{ color: 'rgba(10,9,8,0.3)' }}
      tabIndex={0}
      role="img"
      aria-label={texto}
    />
    <span
      role="tooltip"
      className="pointer-events-none absolute left-1/2 bottom-full z-50 mb-2 w-56 -translate-x-1/2 rounded-xl p-2.5 text-[0.7rem] leading-relaxed opacity-0 transition-opacity group-hover/ayuda:opacity-100 group-focus-within/ayuda:opacity-100"
      style={{ background: '#1a1208', color: 'rgba(255,255,255,0.92)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
    >
      {texto}
    </span>
  </span>
);
// 1 se muestra como "24 horas": los RPCs calculan la ventana con
// now() - interval 'X days' (hora exacta, no día de calendario), así que
// p_dias=1 son las últimas 24h reales, no "desde las 00:00 de hoy" — para
// eso existe el botón "Hoy" (estado `hoy`), aparte de este selector.
const RANGOS = [1, 7, 30, 90];
const labelRango = (r: number) => r === 1 ? '24 horas' : `${r} días`;

const fmtHaceSegundos = (s: number) => s < 60 ? `hace ${s}s` : `hace ${Math.round(s / 60)} min`;

/** Traduce el query string de /auth (mode/role) a algo legible junto a la ruta. */
function describirDetalleAuth(pagina: string | null, detalle: string | null): string {
  if (pagina !== '/auth' || !detalle) return '';
  const params = new URLSearchParams(detalle);
  const mode = params.get('mode') === 'register' ? 'Registro' : params.get('mode') === 'login' ? 'Login' : null;
  const rolLabel: Record<string, string> = { profesional: 'profesional', empresario: 'organizador' };
  const rol = rolLabel[params.get('role') ?? ''];
  const partes = [mode, rol].filter(Boolean);
  return partes.length ? ` · ${partes.join(' ')}` : '';
}

const fmtDia = (d: string) => {
  const date = new Date(d + 'T00:00:00');
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const Kpi = ({ icon: Icon, label, valor, sub, ayuda, live, onClick, abierto }: {
  icon: typeof Eye; label: string; valor: string | number; sub?: string; ayuda?: string;
  /** Punto verde pulsante junto al label — para datos que cambian solos, no
   *  solo al pulsar "Actualizar" (mismo estilo que el badge "en directo" del
   *  topbar: #22c55e con glow). */
  live?: boolean;
  /** Si se pasa, la tarjeta entera es un desplegable (flecha + hover). */
  onClick?: () => void;
  abierto?: boolean;
}) => {
  const Wrap = onClick ? 'button' : 'div';
  return (
    <Wrap
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className="rounded-2xl p-4 text-left w-full transition-colors"
      style={{
        background: '#fff',
        border: `1px solid ${abierto ? 'rgba(212,175,55,0.4)' : 'rgba(10,9,8,0.08)'}`,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Icon size={13} style={{ color: GOLD }} />
        <span className="text-[0.65rem] font-extrabold uppercase tracking-wider" style={{ color: 'rgba(10,9,8,0.45)' }}>
          {label}
        </span>
        {live && (
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
        )}
        {ayuda && <Ayuda texto={ayuda} />}
        {onClick && (
          <ChevronDown size={13} className="ml-auto transition-transform" style={{ color: 'rgba(10,9,8,0.3)', transform: abierto ? 'rotate(180deg)' : undefined }} />
        )}
      </div>
      <p className="text-2xl font-black leading-none" style={{ color: '#0a0908' }}>{valor}</p>
      {sub && <p className="text-[0.7rem] mt-1.5" style={{ color: 'rgba(10,9,8,0.45)' }}>{sub}</p>}
    </Wrap>
  );
};

const Panel = ({ title, hint, ayuda, children }: {
  title: string; hint?: string; ayuda?: string; children: React.ReactNode;
}) => (
  <div className="rounded-2xl p-4 sm:p-5 mb-4" style={{ background: '#fff', border: '1px solid rgba(10,9,8,0.08)' }}>
    <h3 className="text-sm font-black mb-0.5" style={{ color: '#0a0908' }}>
      {title}{ayuda && <Ayuda texto={ayuda} />}
    </h3>
    {hint && <p className="text-[0.7rem] mb-4" style={{ color: 'rgba(10,9,8,0.45)' }}>{hint}</p>}
    {children}
  </div>
);

export default function AdminAnalytics() {
  const [dias, setDias] = useState(7);
  // "Hoy" es un filtro aparte de `dias`: cuenta desde las 00:00 de hoy (hora
  // España), no una ventana móvil de 24h como dias=1. Antes no existía esta
  // distinción y la tarjeta "Usuarios" decía "hoy" con dias=1 aunque el dato
  // real fueran las últimas 24h — a las 00:30 seguía mostrando el tráfico de
  // ayer casi entero.
  const [hoy, setHoy] = useState(false);
  const [porDia, setPorDia] = useState<Dia[]>([]);
  const [porHora, setPorHora] = useState<Hora[]>([]);
  const [top, setTop] = useState<Top[]>([]);
  const [negocio, setNegocio] = useState<Negocio[]>([]);
  const [busquedas, setBusquedas] = useState<Busqueda[]>([]);
  const [afiliados, setAfiliados] = useState<Afiliado[]>([]);
  const [clicsBanner, setClicsBanner] = useState<ClicBanner[]>([]);
  const [clicsRedes, setClicsRedes] = useState<ClicRed[]>([]);
  const [blog, setBlog] = useState<Blog[]>([]);
  const [embudo, setEmbudo] = useState<Embudo[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState<number | null>(null);
  const [usuariosUnicos, setUsuariosUnicos] = useState<number | null>(null);
  const [quienOnline, setQuienOnline] = useState<QuienOnline[]>([]);
  const [onlineAbierto, setOnlineAbierto] = useState(false);
  const [instalaciones, setInstalaciones] = useState<EventoPwa[]>([]);
  const personasPwa = agruparInstalacionesPwa(instalaciones);
  // Lista de "App instalada": quien más abre la app, primero; a igualdad, el más reciente.
  // La fila de anónimos sin identificar va siempre al final y no suma al total.
  const personasPwaPorAperturas = [...personasPwa].sort(
    (a, b) => Number(!!a.sinIdentificar) - Number(!!b.sinIdentificar)
      || (b.aperturas || 0) - (a.aperturas || 0) || new Date(b.ultima).getTime() - new Date(a.ultima).getTime(),
  );
  const pwaSinIdentificar = personasPwa.find(p => p.sinIdentificar);
  const personasPwaReales = personasPwa.filter(p => !p.sinIdentificar);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    // Las cuatro llamadas son independientes: en paralelo, y si una falla se
    // muestran las demás en vez de dejar el panel entero en blanco.
    // Cast: types.ts no incluye todavía las funciones de analítica (mismo
    // desfase que contracts/leads en el resto del repo). El cast va sobre el
    // OBJETO y .rpc se llama sobre él: extraerlo a una variable suelta lo
    // desliga de su `this` y la llamada falla por dentro.
    const sb = supabase as unknown as {
      rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
    };

    // "Tráfico por hora" con el filtro Hoy activo necesita la serie real de
    // hoy (corta en la hora actual), no el patrón histórico agregado que da
    // panel_analytics_hora — ese sirve para "¿a qué hora entra tu gente?"
    // pero pintaba horas futuras del día como si ya hubieran pasado.
    const [d, h, t, n, bus, afi, blg, emb, rec, uu, pwa, ban, red] = await Promise.all([
      sb.rpc('panel_analytics_dia', { p_dias: dias }),
      dias === 1 && hoy
        ? sb.rpc('panel_analytics_hora_hoy', {})
        : sb.rpc('panel_analytics_hora', { p_dias: Math.min(dias, 30) }),
      sb.rpc('panel_analytics_top', { p_dias: dias, p_limite: 8 }),
      sb.rpc('panel_analytics_negocio', { p_dias: dias }),
      sb.rpc('panel_analytics_busquedas', { p_dias: dias, p_limite: 15 }),
      sb.rpc('panel_analytics_afiliados', { p_dias: dias, p_limite: 15 }),
      sb.rpc('panel_analytics_blog', { p_dias: dias, p_limite: 15 }),
      sb.rpc('panel_analytics_embudo', { p_dias: dias }),
      sb.rpc('panel_analytics_recursos', { p_dias: dias, p_limite: 20 }),
      // Personas distintas del PERIODO COMPLETO (no la suma día a día que ya
      // hace "sesiones" en panel_analytics_dia, que duplica a quien vuelve
      // varios días). Sustituye a "Visitas" (páginas vistas, no gente).
      sb.rpc('panel_analytics_usuarios_unicos', { p_dias: dias, p_desde_medianoche: hoy }),
      sb.rpc('panel_analytics_pwa_instalaciones', { p_dias: dias }),
      sb.rpc('panel_analytics_banners', { p_dias: dias }),
      sb.rpc('panel_analytics_redes', { p_dias: dias }),
    ]);

    const fallo = [d, h, t, n].find(r => r.error);
    if (fallo?.error) {
      // El caso esperado mientras la migración no esté aplicada: la función no
      // existe todavía. Se dice con todas las letras en vez de un error críptico.
      const msg = fallo.error.message ?? '';
      setError(
        /does not exist|not find the function|schema cache/i.test(msg)
          ? 'FALTA_MIGRACION'
          : msg
      );
    }

    setPorDia((d.data as Dia[]) ?? []);
    setPorHora((h.data as Hora[]) ?? []);
    setTop((t.data as Top[]) ?? []);
    setNegocio((n.data as Negocio[]) ?? []);
    // Las cuatro de abajo son de la segunda migración: si esa no está aplicada
    // todavía, se quedan vacías y sus paneles muestran su propio aviso, en vez
    // de tumbar el panel entero que sí funciona.
    setBusquedas((bus.data as Busqueda[]) ?? []);
    setAfiliados((afi.data as Afiliado[]) ?? []);
    setClicsBanner((ban.data as ClicBanner[]) ?? []);
    setClicsRedes((red.data as ClicRed[]) ?? []);
    setBlog((blg.data as Blog[]) ?? []);
    setEmbudo((emb.data as Embudo[]) ?? []);
    setRecursos((rec.data as Recurso[]) ?? []);
    const uuRow = (uu.data as { usuarios: number }[] | null)?.[0];
    setUsuariosUnicos(uuRow ? Number(uuRow.usuarios) : null);
    setInstalaciones((pwa.data as EventoPwa[]) ?? []);
    setCargando(false);
  }, [dias, hoy]);

  useEffect(() => { cargar(); }, [cargar]);

  // "Online ahora" se refresca solo, cada 30s, INDEPENDIENTE del resto del
  // panel: es un dato en vivo (sesiones activas en los últimos 5 min), no
  // histórico — recargarlo solo cuando cambia el rango de días lo dejaría
  // congelado la mayor parte del tiempo que alguien tiene la pestaña abierta.
  useEffect(() => {
    const sb = supabase as unknown as {
      rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
    };
    const cargarOnline = () => {
      sb.rpc('panel_analytics_online_ahora', {}).then(r => {
        const row = (r.data as { online: number }[] | null)?.[0];
        setOnline(row ? Number(row.online) : null);
      });
      // Va en la misma tanda que el contador, no solo cuando se despliega la
      // lista: si solo cargara al abrir, el primer vistazo mostraría datos de
      // hace hasta 30s, justo lo que este panel intenta evitar.
      sb.rpc('panel_analytics_quien_online', {}).then(r => {
        setQuienOnline((r.data as QuienOnline[] | null) ?? []);
      });
    };
    cargarOnline();
    const id = setInterval(cargarOnline, 30_000);
    return () => clearInterval(id);
  }, []);

  const totalSesiones = porDia.reduce((s, d) => s + Number(d.sesiones || 0), 0);
  const totalAltas = negocio.reduce((s, d) => s + Number(d.altas || 0), 0);
  const totalSolicitudes = negocio.reduce((s, d) => s + Number(d.solicitudes || 0), 0);

  // Media diaria en vez de suma acumulada: con 30-90 días seleccionados, sumar
  // todas las visitas de cada hora del rango entero infla las barras (una
  // hora con tráfico constante todos los días parece "más punta" solo por
  // acumular más días, no por ser realmente más fuerte). Al dividir entre el
  // número real de días consultados, la forma del gráfico deja de depender
  // del rango elegido. panel_analytics_hora topa en 30 días aunque el
  // selector pida 90 (línea de la llamada RPC más abajo) — el divisor debe
  // ser ese mismo tope, no `dias`, o la media saldría más baja de lo real.
  const diasHora = Math.min(dias, 30);
  const porHoraMedia = porHora.map(h => ({ ...h, visitas: Number(h.visitas || 0) / diasHora }));
  const horaPunta = porHora.length
    ? porHora.reduce((max, h) => (Number(h.visitas) > Number(max.visitas) ? h : max), porHora[0])
    : null;
  const totalPorHora = porHora.reduce((s, h) => s + Number(h.visitas || 0), 0);
  const pctHoraPunta = horaPunta && totalPorHora > 0
    ? Math.round((Number(horaPunta.visitas) / totalPorHora) * 100) : 0;
  // Franjas del día en vez de una sola hora: con poco volumen, una hora suelta
  // es ruidosa (una visita de más la cambia entera), pero la franja aguanta
  // mejor y es lo que de verdad hace falta para decidir cuándo publicar.
  const FRANJAS: { nombre: string; desde: number; hasta: number }[] = [
    { nombre: 'Madrugada (0-6h)', desde: 0, hasta: 6 },
    { nombre: 'Mañana (6-13h)', desde: 6, hasta: 13 },
    { nombre: 'Tarde (13-21h)', desde: 13, hasta: 21 },
    { nombre: 'Noche (21-24h)', desde: 21, hasta: 24 },
  ];
  const visitasEnFranja = (f: { desde: number; hasta: number }) =>
    porHora.filter(h => Number(h.hora) >= f.desde && Number(h.hora) < f.hasta)
      .reduce((s, h) => s + Number(h.visitas || 0), 0);
  const franjaPunta = totalPorHora > 0
    ? FRANJAS.reduce((max, f) => visitasEnFranja(f) > visitasEnFranja(max) ? f : max, FRANJAS[0])
    : null;
  const pctFranjaPunta = franjaPunta && totalPorHora > 0
    ? Math.round((visitasEnFranja(franjaPunta) / totalPorHora) * 100) : 0;

  const paginas = top.filter(t => t.tipo === 'pagina');
  const origenes = top.filter(t => t.tipo === 'origen');
  const dispositivos = top.filter(t => t.tipo === 'dispositivo');

  if (error === 'FALTA_MIGRACION') {
    return (
      <div className="rounded-2xl p-5" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.25)' }}>
        <h3 className="text-sm font-black mb-2" style={{ color: '#8A6D0F' }}>Falta aplicar la migración</h3>
        <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(10,9,8,0.65)' }}>
          Las funciones de analítica todavía no existen en la base de datos. Hay que ejecutar una vez el archivo
          <code className="mx-1 px-1.5 py-0.5 rounded" style={{ background: 'rgba(10,9,8,0.06)' }}>
            20260905130000_analytics_propia.sql
          </code>
          en el SQL Editor de Supabase.
        </p>
        <button onClick={cargar} className="text-xs font-bold px-3 py-2 rounded-full"
          style={{ background: 'rgba(212,175,55,0.15)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.3)' }}>
          Volver a comprobar
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Rango + refrescar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {/* "Hoy" solo afecta a la tarjeta "Usuarios" (única migrada a
            p_desde_medianoche); el resto del panel (gráficas, top, negocio...)
            sigue leyendo la ventana de `dias` normal mientras está activo. */}
        <button onClick={() => setHoy(h => !h)}
          className="text-xs font-bold px-3 py-1.5 rounded-full transition-all"
          style={{
            background: hoy ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.03)',
            border: `1px solid ${hoy ? 'rgba(212,175,55,0.4)' : 'rgba(0,0,0,0.08)'}`,
            color: hoy ? '#8A6D0F' : '#444',
          }}>
          Hoy
        </button>
        {RANGOS.map(r => (
          <button key={r} onClick={() => setDias(r)}
            className="text-xs font-bold px-3 py-1.5 rounded-full transition-all"
            style={{
              background: dias === r ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${dias === r ? 'rgba(212,175,55,0.4)' : 'rgba(0,0,0,0.08)'}`,
              color: dias === r ? '#8A6D0F' : '#444',
            }}>
            {labelRango(r)}
          </button>
        ))}
        <button onClick={cargar} disabled={cargando}
          className="ml-auto flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: '#444' }}>
          <RefreshCw size={12} className={cargando ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      {error && error !== 'FALTA_MIGRACION' && (
        <p className="text-xs mb-4 p-3 rounded-xl" style={{ background: 'rgba(220,38,38,0.06)', color: '#b91c1c' }}>
          {error}
        </p>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <Kpi icon={Users} label="Online ahora" valor={online ?? '—'} sub="últimos 5 min" live
          onClick={() => setOnlineAbierto(o => !o)} abierto={onlineAbierto}
          ayuda="Sesiones distintas con actividad en los últimos 5 minutos. Se actualiza sola cada 30s: no hace falta pulsar Actualizar. Excluye tu propio tráfico de admin y el de las cuentas demo. Toca la tarjeta para ver quién es y en qué página está." />
        <Kpi icon={Eye} label="Usuarios" valor={usuariosUnicos ?? '—'}
          sub={hoy ? 'hoy (desde 00:00)' : dias === 1 ? 'últimas 24h' : `en ${dias} días`}
          ayuda={hoy
            ? 'Personas distintas desde las 00:00 de hoy (hora España), sin duplicar a quien vuelve. Excluye tu propio tráfico de admin y el de las cuentas demo.'
            : 'Personas distintas que han entrado, sin duplicar a quien vuelve varios días dentro del periodo. Excluye tu propio tráfico de admin y el de las cuentas demo.'} />
        <Kpi icon={Users} label="Sesiones" valor={totalSesiones} sub="entradas por día, sumadas"
          ayuda="Personas distintas por día, sumadas: quien entra 3 días cuenta 3 veces (a diferencia de 'Usuarios', que no duplica). Útil para ver el pulso diario, no el total de gente real." />
        <Kpi icon={UserPlus} label="Altas" valor={totalAltas} sub="perfiles nuevos"
          ayuda="Perfiles creados en el periodo. Sale de la base de datos, así que tiene histórico completo desde el inicio del proyecto." />
        <Kpi icon={Send} label="Solicitudes" valor={totalSolicitudes} sub="Flash Booking"
          ayuda="Peticiones de contratación enviadas. Es la métrica que de verdad mide negocio: sin solicitudes, el tráfico no sirve de nada." />
      </div>

      {/* Quién está online: solo visible al desplegar el KPI de arriba. Sin
          nombre para el tráfico anónimo (la mayoría) porque no hay más dato
          que capturar sin guardar IP, que este proyecto decidió no hacer. */}
      {onlineAbierto && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.25)' }}>
          {quienOnline.length === 0 ? (
            <p className="text-xs" style={{ color: 'rgba(10,9,8,0.45)' }}>Nadie navegando ahora mismo.</p>
          ) : (
            <div className="flex flex-col divide-y" style={{ borderColor: 'rgba(10,9,8,0.06)' }}>
              {quienOnline.map(q => (
                <div key={q.session_id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className="flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{ width: 30, height: 30, background: q.display_name ? 'rgba(212,175,55,0.12)' : 'rgba(10,9,8,0.05)' }}>
                    <UserIcon size={14} style={{ color: q.display_name ? GOLD : 'rgba(10,9,8,0.35)' }} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: '#0a0908' }}>
                      {q.display_name || 'Visitante'}
                      {q.rol && <span className="font-normal" style={{ color: 'rgba(10,9,8,0.45)' }}> · {q.rol}</span>}
                    </p>
                    <p className="text-[0.7rem] truncate" style={{ color: 'rgba(10,9,8,0.5)' }}>
                      {q.ultima_pagina || '/'}{describirDetalleAuth(q.ultima_pagina, q.detalle)}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2 text-[0.65rem]" style={{ color: 'rgba(10,9,8,0.4)' }}>
                    <Monitor size={12} />
                    <span>{fmtHaceSegundos(q.hace_segundos)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tráfico por día (o por hora en la vista de 24h, donde "por día" solo
          tiene un punto y no dice nada) */}
      <Panel title={dias === 1 ? 'Tráfico por hora' : 'Tráfico por día'}
        hint="Visitas y sesiones. Excluye tu propio tráfico de admin y el de las cuentas demo."
        ayuda={dias === 1
          ? 'La línea dorada son páginas vistas por hora, hoy. Con solo 24h seleccionadas, agrupar por día daba un único punto sin información real.'
          : 'La línea dorada son páginas vistas; la azul, personas distintas. Empieza a contar desde que se instaló la analítica, así que los días anteriores salen a cero.'}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={dias === 1 ? porHora : porDia}>
            <defs>
              <linearGradient id="gVisitas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,9,8,0.06)" vertical={false} />
            {dias === 1 ? (
              <XAxis dataKey="hora" tickFormatter={(h: number) => `${h}h`} tick={{ fontSize: 10, fill: 'rgba(10,9,8,0.45)' }}
                axisLine={false} tickLine={false} interval={1} />
            ) : (
              <XAxis dataKey="dia" tickFormatter={fmtDia} tick={{ fontSize: 10, fill: 'rgba(10,9,8,0.45)' }}
                axisLine={false} tickLine={false} minTickGap={20} />
            )}
            <YAxis tick={{ fontSize: 10, fill: 'rgba(10,9,8,0.45)' }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
            <Tooltip labelFormatter={dias === 1 ? (h: number) => `${h}:00 h` : fmtDia}
              contentStyle={{ borderRadius: 12, border: '1px solid rgba(10,9,8,0.1)', fontSize: 12 }} />
            {dias !== 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
            <Area type="monotone" dataKey="visitas" name="Visitas" stroke={GOLD} strokeWidth={2} fill="url(#gVisitas)" />
            {/* panel_analytics_hora no distingue sesiones de visitas (a diferencia
                de panel_analytics_dia) — con dias===1 solo hay una serie que mostrar. */}
            {dias !== 1 && <Area type="monotone" dataKey="sesiones" name="Sesiones" stroke="#4285F4" strokeWidth={1.5} fill="none" />}
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      {/* Por hora */}
      <Panel
        title="¿A qué hora entra tu gente?"
        ayuda={`Media de visitas por hora del día (hora española), calculada sobre ${labelRango(diasHora)}${dias > 30 ? ' (máximo para esta gráfica)' : ''}. Sirve para decidir cuándo publicar en redes y cuándo lanzar campañas: publicar cuando tu gente duerme es tirar el alcance. La franja es más fiable que la hora exacta: con pocas visitas, una sola visita puede cambiar cuál es 'la hora punta', pero la franja aguanta mejor ese ruido.`}
        hint={franjaPunta && totalPorHora > 0
          ? `${franjaPunta.nombre} concentra el ${pctFranjaPunta}% de las visitas: es tu mejor franja para publicar y lanzar campañas. Dentro de ella, la hora más fuerte es las ${horaPunta?.hora}:00 h (${pctHoraPunta}% del total).`
          : 'Hora local de España. Se llena a medida que entren visitas.'}
      >
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={porHoraMedia}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,9,8,0.06)" vertical={false} />
            <XAxis dataKey="hora" tickFormatter={(h: number) => `${h}h`}
              tick={{ fontSize: 10, fill: 'rgba(10,9,8,0.45)' }} axisLine={false} tickLine={false} interval={1} />
            <YAxis tick={{ fontSize: 10, fill: 'rgba(10,9,8,0.45)' }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
            <Tooltip labelFormatter={(h) => `${h}:00 h`} formatter={(v: number) => [v.toFixed(1), 'Media de visitas']}
              contentStyle={{ borderRadius: 12, border: '1px solid rgba(10,9,8,0.1)', fontSize: 12 }} />
            <Bar dataKey="visitas" name="Media de visitas" fill={GOLD} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {/* Actividad de negocio — tiene histórico completo, no depende del tracking nuevo */}
      <Panel title="Actividad de la plataforma" hint="Altas, solicitudes y mensajes. Con histórico desde el inicio del proyecto."
        ayuda="Se lee de las tablas reales (perfiles, solicitudes, mensajes), no del tracking web. Por eso aquí sí hay histórico completo aunque la analítica sea reciente.">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={negocio}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,9,8,0.06)" vertical={false} />
            <XAxis dataKey="dia" tickFormatter={fmtDia} tick={{ fontSize: 10, fill: 'rgba(10,9,8,0.45)' }}
              axisLine={false} tickLine={false} minTickGap={20} />
            <YAxis tick={{ fontSize: 10, fill: 'rgba(10,9,8,0.45)' }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
            <Tooltip labelFormatter={fmtDia}
              contentStyle={{ borderRadius: 12, border: '1px solid rgba(10,9,8,0.1)', fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="altas" name="Altas" fill={GOLD} radius={[3, 3, 0, 0]} />
            <Bar dataKey="solicitudes" name="Solicitudes" fill="#4285F4" radius={[3, 3, 0, 0]} />
            <Bar dataKey="mensajes" name="Mensajes" fill="#34D399" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {/* INSTALACIONES PWA — dos señales distintas, no una:
          'pwa_installed' es el MOMENTO de instalar (evento 'appinstalled' del
          navegador, nunca en iOS, y solo existe desde el día en que se
          desplegó este tracking — no cuenta instalaciones anteriores).
          'pwa_session' es "esta sesión ya abre la web en modo app instalada",
          sin importar cuándo se instaló — sí incluye iOS y sí incluye a
          quien ya la tenía puesta antes de este despliegue. */}
      <Panel
        title="App instalada (PWA)"
        hint="Total de personas que tienen la app instalada y quién es."
        ayuda="Cada persona cuenta una vez, la abra las veces que la abra. Incluye a quien la instaló (Chrome/Edge, escritorio y Android) y a quien abre la web en modo app (también iOS). La fecha es la última vez que la usaron."
      >
        {instalaciones.length === 0 ? (
          <p className="text-[0.75rem]" style={{ color: 'rgba(10,9,8,0.4)' }}>
            Sin datos registrados todavía en este rango.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-3 flex-wrap">
              {(() => {
                const porDevice = personasPwaReales.reduce<Record<string, number>>((acc, p) => {
                  const d = p.sistema || p.device || 'desconocido';
                  acc[d] = (acc[d] || 0) + 1;
                  return acc;
                }, {});
                return (
                  <span className="flex items-center gap-1.5 text-[0.75rem] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(212,175,55,0.1)', color: '#8A6D0F' }}>
                    <Download size={12} /> Total con la app instalada: {personasPwaReales.length}
                    {personasPwaReales.length > 0 && <>{' '}({Object.entries(porDevice).map(([d, n]) => `${n} ${d}`).join(', ')})</>}
                    {pwaSinIdentificar && <>, más anónimos sin identificar</>}
                  </span>
                );
              })()}
            </div>
            <div className="flex flex-col divide-y" style={{ borderColor: 'rgba(10,9,8,0.06)' }}>
              {personasPwaPorAperturas.map((p, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                  <Monitor size={13} style={{ color: 'rgba(10,9,8,0.3)' }} />
                  <span className="text-[0.75rem] flex-1" style={{ color: 'rgba(10,9,8,0.7)' }}>
                    {p.display_name
                      ? <>{p.display_name}{p.rol && <span style={{ color: 'rgba(10,9,8,0.45)' }}> · {p.rol}</span>}</>
                      : p.sinIdentificar
                        ? <span style={{ color: 'rgba(10,9,8,0.4)' }} title="Aperturas de antes del 19 oct o de gente que no aceptó las cookies de analítica: no se puede saber si son la misma persona.">Anónimos sin identificar (pueden ser los mismos)</span>
                        : <span style={{ color: 'rgba(10,9,8,0.4)' }}>Visitante anónimo</span>}
                  </span>
                  {p.aperturas > 0 && (
                    <span className="text-[0.68rem]" style={{ color: 'rgba(10,9,8,0.45)' }}>
                      {p.aperturas === 1 ? '1 apertura' : `${p.aperturas} aperturas`}
                    </span>
                  )}
                  <span className="text-[0.68rem] font-bold" style={{ color: GOLD }}>{p.sistema || p.device}</span>
                  <span className="text-[0.68rem]" style={{ color: 'rgba(10,9,8,0.4)' }}>
                    {new Date(p.ultima).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </Panel>

      {/* EMBUDO — la cifra que dice si el tráfico sirve para algo. 400 visitas
          con 0 solicitudes es un problema distinto de 40 con 4, y la gráfica
          de tráfico sola no los distingue. */}
      {/* Desde el 28 oct cada paso es un subconjunto del anterior (misma
          sesión) y los registros van aparte (orden 99): antes mezclaba
          poblaciones y el último paso salía mayor que el anterior. */}
      {embudo.length > 0 && embudo.some(e => Number(e.cantidad) > 0) && (() => {
        const pasos = embudo.filter(e => e.orden < 90);
        const registros = embudo.find(e => e.orden === 99);
        // El paso con mayor caída es donde hay que trabajar; cada uno apunta
        // a un problema distinto y a un sitio distinto donde mirar.
        const QUE_SIGNIFICA: Record<number, string> = {
          2: 'La gente entra pero no abre fichas: la portada y el blog no llevan a los profesionales. Mira qué páginas reciben visitas y si tienen botón hacia el directorio.',
          3: 'Ven fichas pero no pulsan "Contactar": la ficha no convence (fotos, precio, reseñas) o el botón no se ve. Es lo primero a mejorar si es aquí.',
          4: 'Pulsan "Contactar" pero no envían: se caen en el registro obligatorio o en el formulario. Revisa ese paso en Clarity.',
        };
        let peor: { orden: number; caida: number } | null = null;
        pasos.forEach((e, i) => {
          if (i === 0) return;
          const ant = Number(pasos[i - 1].cantidad) || 0;
          if (ant === 0) return;
          const caida = Math.round(100 - (Number(e.cantidad) / ant) * 100);
          if (!peor || caida > peor.caida) peor = { orden: e.orden, caida };
        });
        const conclusion = peor as { orden: number; caida: number } | null;
        return (
        <Panel title="Embudo" hint="El camino de quien viene a contratar: entra, abre una ficha, pulsa Contactar y envía la solicitud. Cada paso cuenta solo a quien hizo también el anterior."
          ayuda="Barra: personas (sesiones) que llegaron a ese paso. % debajo del nombre: cuánto se cayó respecto al paso ANTERIOR, que es lo que señala dónde se pierde la gente. % a la derecha: lo que queda respecto a los que entraron. Los registros van aparte porque llegan sobre todo por la portada e Instagram, no por este camino. 'Pulsan Contactar' se mide desde el 28 oct: antes de esa fecha solo cuenta a quien envió la solicitud.">
          {conclusion && (
            <div className="mb-3 rounded-lg px-3 py-2 text-[0.75rem]" style={{ background: 'rgba(212,175,55,0.1)', color: 'rgba(10,9,8,0.75)' }}>
              <span className="font-bold">Dónde se pierde más gente: </span>
              {conclusion.caida}% se cae antes de "{pasos.find(p => p.orden === conclusion.orden)?.paso}". {QUE_SIGNIFICA[conclusion.orden]}
            </div>
          )}
          <div className="flex flex-col gap-2">
            {pasos.map((e, i) => {
              const embudo = pasos;
              const max = Math.max(...embudo.map(x => Number(x.cantidad) || 0), 1);
              const cantidad = Number(e.cantidad) || 0;
              const pct = (cantidad / max) * 100;
              const primero = Number(embudo[0]?.cantidad) || 0;
              const anterior = i > 0 ? Number(embudo[i - 1]?.cantidad) || 0 : null;
              const conv = primero > 0 ? ((cantidad / primero) * 100).toFixed(1) : '0';
              // Caída respecto al paso anterior: la cifra que de verdad dice
              // "aquí es donde se pierde la gente", frente al % acumulado de
              // la derecha, que mezcla todas las caídas anteriores en una.
              const caida = anterior !== null && anterior > 0
                ? Math.round(100 - (cantidad / anterior) * 100) : null;
              return (
                <div key={e.paso} className="flex items-center gap-3">
                  <div className="w-44 flex-shrink-0">
                    <span className="text-[0.75rem] font-bold block" style={{ color: 'rgba(10,9,8,0.7)' }}>
                      {e.paso}
                    </span>
                    {caida !== null && (
                      <span className="text-[0.65rem] font-bold" style={{ color: caida >= 50 ? '#dc2626' : 'rgba(10,9,8,0.4)' }}>
                        {caida > 0 ? `-${caida}% desde "${embudo[i - 1].paso}"` : 'sin caída'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ background: 'rgba(10,9,8,0.04)' }}>
                    <div className="h-full rounded-lg flex items-center px-2 transition-all"
                      style={{ width: `${Math.max(pct, 3)}%`, background: 'linear-gradient(90deg,#E0BC4B,#B8941E)' }}>
                      <span className="text-[0.7rem] font-black" style={{ color: '#1a1208' }}>{e.cantidad}</span>
                    </div>
                  </div>
                  <span className="text-[0.7rem] font-bold w-24 text-right flex-shrink-0" style={{ color: 'rgba(10,9,8,0.45)' }}>
                    {conv}% del total
                  </span>
                </div>
              );
            })}
          </div>
          {registros && (
            <p className="mt-3 text-[0.72rem]" style={{ color: 'rgba(10,9,8,0.5)' }}>
              Aparte: <span className="font-bold" style={{ color: 'rgba(10,9,8,0.75)' }}>{registros.cantidad}</span> personas se registraron en este periodo (portada, Instagram, campañas).
            </p>
          )}
        </Panel>
        );
      })()}

      {/* BÚSQUEDAS INTERNAS — lo que la gente pide dentro de XPEAK. Las que dan
          0 resultados son literalmente la lista de qué inventario falta. */}
      <Panel
        title="Qué buscan dentro de XPEAK"
        hint="Términos escritos en el buscador. Los marcados en rojo no devolvieron ningún resultado: eso es inventario que te piden y no tienes."
        ayuda="Búsquedas hechas DENTRO de XPEAK, no en Google. Este dato no lo da ni Google Analytics ni Search Console. Un término en rojo repetido es una categoría o zona que deberías cubrir."
      >
        {busquedas.length === 0 ? (
          <p className="text-[0.75rem]" style={{ color: 'rgba(10,9,8,0.4)' }}>
            Todavía nadie ha buscado (o falta aplicar la segunda migración).
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {busquedas.map(b => {
              const vacia = Number(b.sin_resultados) > 0;
              return (
                <div key={b.termino} className="flex items-center gap-2 py-1">
                  <span className="text-[0.78rem] flex-1 truncate" style={{ color: vacia ? '#b91c1c' : 'rgba(10,9,8,0.75)' }}>
                    {b.termino}
                  </span>
                  {vacia && (
                    <span className="text-[0.6rem] font-black px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: 'rgba(220,38,38,0.1)', color: '#b91c1c' }}>
                      {b.sin_resultados} sin resultados
                    </span>
                  )}
                  <span className="text-[0.75rem] font-black flex-shrink-0 w-8 text-right" style={{ color: GOLD }}>
                    {Number(b.veces) + Number(b.sin_resultados)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      {/* AFILIACIÓN — Amazon informa de ventas, nunca de clics por producto.
          Sin esto no se distingue "nadie lo pincha" de "lo pinchan y no
          compran", que son dos arreglos completamente distintos. */}
      <Panel
        title="Clics en enlaces de afiliado"
        hint="Qué producto se pincha y desde dónde. Amazon solo reporta ventas, así que este es el único sitio donde ves el clic."
        ayuda="Amazon informa de ventas pero nunca de clics por producto. Sin este dato no se distingue 'nadie lo pincha' (problema de visibilidad) de 'lo pinchan y no compran' (mal producto elegido): son dos arreglos distintos."
      >
        {afiliados.length === 0 ? (
          <p className="text-[0.75rem]" style={{ color: 'rgba(10,9,8,0.4)' }}>
            Sin clics todavía. Empieza a contar desde este despliegue.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {afiliados.map(a => (
              <div key={a.producto} className="flex items-center gap-2 py-1">
                <span className="text-[0.78rem] flex-1 truncate" style={{ color: 'rgba(10,9,8,0.75)' }}>{a.producto}</span>
                <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(10,9,8,0.05)', color: 'rgba(10,9,8,0.5)' }}>
                  {a.desde}
                </span>
                <span className="text-[0.75rem] font-black flex-shrink-0 w-8 text-right" style={{ color: GOLD }}>{a.clics}</span>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* BANNERS DE COLABORADORES — de momento solo Warm Up Academy. Es lo
          que se les puede enseñar a ellos: cuánta gente pasa a su web desde
          XPEAK y desde dónde (directorio de la app o /contratar-dj). */}
      <Panel
        title="Clics en banners"
        hint="Cada clic en un banner de colaborador, de dónde vino y quién fue (si tenía sesión). Cuenta desde el 25 oct a las 17:29."
        ayuda="'App' es el directorio de DJs dentro del panel; 'Pública' es la página /contratar-dj. Personas = sesiones distintas, así que alguien que pincha tres veces cuenta una."
      >
        {clicsBanner.length === 0 ? (
          <p className="text-[0.75rem]" style={{ color: 'rgba(10,9,8,0.4)' }}>
            Sin clics en este periodo.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-1.5 mb-3">
              {Object.entries(clicsBanner.reduce<Record<string, ClicBanner[]>>((acc, c) => {
                const k = `${c.banner}|${c.origen ?? ''}`;
                (acc[k] ||= []).push(c);
                return acc;
              }, {})).map(([k, filas]) => {
                const [banner, origen] = k.split('|');
                const personas = new Set(filas.map(f => f.session_id)).size;
                return (
                  <div key={k} className="flex items-center gap-2 py-1">
                    <span className="text-[0.78rem] flex-1 truncate font-bold" style={{ color: 'rgba(10,9,8,0.75)' }}>
                      {banner === 'warmup' ? 'Warm Up Academy' : banner}
                    </span>
                    <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: 'rgba(10,9,8,0.05)', color: 'rgba(10,9,8,0.5)' }}>
                      {origen === 'app' ? 'App' : origen === 'publica' ? 'Pública' : origen || 'sin origen'}
                    </span>
                    <span className="text-[0.65rem] flex-shrink-0" style={{ color: 'rgba(10,9,8,0.45)' }}>
                      {personas} {personas === 1 ? 'persona' : 'personas'}
                    </span>
                    <span className="text-[0.75rem] font-black flex-shrink-0 w-8 text-right" style={{ color: GOLD }}>{filas.length}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[0.65rem] font-bold uppercase tracking-wide mb-1" style={{ color: 'rgba(10,9,8,0.4)' }}>Registro</p>
            <div className="flex flex-col max-h-64 overflow-y-auto">
              {clicsBanner.slice(0, 50).map((c, i) => (
                <div key={i} className="flex items-center gap-2 py-1 text-[0.7rem]" style={{ borderTop: i ? '1px solid rgba(10,9,8,0.05)' : undefined }}>
                  <span className="flex-shrink-0 w-24" style={{ color: 'rgba(10,9,8,0.5)' }}>
                    {new Date(c.cuando).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="flex-1 truncate" style={{ color: 'rgba(10,9,8,0.75)' }}>{c.quien || 'Sin sesión'}</span>
                  <span className="flex-shrink-0" style={{ color: 'rgba(10,9,8,0.45)' }}>
                    {c.origen === 'app' ? 'App' : c.origen === 'publica' ? 'Pública' : c.origen}{c.device ? ` · ${c.device}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </Panel>

      {/* REDES DE LOS PROFESIONALES — se enseñan como escaparate (28 oct),
          pero cada clic es alguien que puede escribirle por fuera de XPEAK.
          Comparar con los mensajes del chat dice cuánto pesa esa fuga. */}
      <Panel
        title="Clics en redes de profesionales"
        hint="Quién pincha el Instagram o TikTok de cada profesional y desde dónde. Cuenta desde el 28 oct; no incluye a los admins."
        ayuda="'Perfil público' es la ficha /p/...; 'Panel' es la ficha dentro de la app (solo registrados). Personas = sesiones distintas, así que alguien que pincha tres veces cuenta una. Si esto crece mucho más que los mensajes del chat, el contacto se está yendo fuera."
      >
        {clicsRedes.length === 0 ? (
          <p className="text-[0.75rem]" style={{ color: 'rgba(10,9,8,0.4)' }}>
            Sin clics en este periodo.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-1.5 mb-3">
              {Object.entries(clicsRedes.reduce<Record<string, ClicRed[]>>((acc, c) => {
                const k = `${c.profesional ?? 'Perfil borrado'}|${c.red}`;
                (acc[k] ||= []).push(c);
                return acc;
              }, {})).sort((a, b) => b[1].length - a[1].length).map(([k, filas]) => {
                const [profesional, red] = k.split('|');
                const personas = new Set(filas.map(f => f.session_id)).size;
                return (
                  <div key={k} className="flex items-center gap-2 py-1">
                    <span className="text-[0.78rem] flex-1 truncate font-bold" style={{ color: 'rgba(10,9,8,0.75)' }}>
                      {profesional}
                    </span>
                    <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: 'rgba(10,9,8,0.05)', color: 'rgba(10,9,8,0.5)' }}>
                      {red === 'tiktok' ? 'TikTok' : 'Instagram'}
                    </span>
                    <span className="text-[0.65rem] flex-shrink-0" style={{ color: 'rgba(10,9,8,0.45)' }}>
                      {personas} {personas === 1 ? 'persona' : 'personas'}
                    </span>
                    <span className="text-[0.75rem] font-black flex-shrink-0 w-8 text-right" style={{ color: GOLD }}>{filas.length}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[0.65rem] font-bold uppercase tracking-wide mb-1" style={{ color: 'rgba(10,9,8,0.4)' }}>Registro</p>
            <div className="flex flex-col max-h-64 overflow-y-auto">
              {clicsRedes.slice(0, 50).map((c, i) => (
                <div key={i} className="flex items-center gap-2 py-1 text-[0.7rem]" style={{ borderTop: i ? '1px solid rgba(10,9,8,0.05)' : undefined }}>
                  <span className="flex-shrink-0 w-24" style={{ color: 'rgba(10,9,8,0.5)' }}>
                    {new Date(c.cuando).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="flex-1 truncate" style={{ color: 'rgba(10,9,8,0.75)' }}>
                    {c.quien || 'Sin sesión'} → {c.profesional ?? 'Perfil borrado'}
                  </span>
                  <span className="flex-shrink-0" style={{ color: 'rgba(10,9,8,0.45)' }}>
                    {c.origen === 'panel' ? 'Panel' : 'Perfil público'}{c.device ? ` · ${c.device}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </Panel>

      {/* BLOG — ~380 URLs escritas a ciegas hasta ahora. */}
      <Panel
        title="Artículos del blog que funcionan"
        hint="Visitas por artículo y cuántas vienen de un buscador. Lo que no aparece aquí, no lo lee nadie."
        ayuda="La etiqueta verde cuenta las visitas llegadas desde Google o Bing: ese es el SEO funcionando de verdad, frente a las que llegan navegando desde dentro."
      >
        {blog.length === 0 ? (
          <p className="text-[0.75rem]" style={{ color: 'rgba(10,9,8,0.4)' }}>
            Sin visitas a artículos registradas todavía.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {blog.map(b => (
              <div key={b.articulo} className="flex items-center gap-2 py-1">
                <span className="text-[0.78rem] flex-1 truncate" style={{ color: 'rgba(10,9,8,0.75)' }} title={b.articulo}>
                  {b.articulo.replace('/blog/', '')}
                </span>
                {Number(b.desde_buscador) > 0 && (
                  <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(52,211,153,0.12)', color: '#047857' }}>
                    {b.desde_buscador} de Google
                  </span>
                )}
                <span className="text-[0.75rem] font-black flex-shrink-0 w-8 text-right" style={{ color: GOLD }}>{b.visitas}</span>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* RECURSOS — el panel "Recursos" del sidebar (equipo + formación por
          oficio, ver ResourcesView.tsx) ya guardaba qué oficio consultaba cada
          visita (evento resources_view + detalle), pero no existía ninguna
          función que lo agregase: el dato estaba capturado y nadie lo veía
          aquí (9 sep 2026). */}
      <Panel
        title="Quién consulta el panel de Recursos"
        hint="Oficio elegido en el selector de Recursos. Dice qué gremios están mirando equipo y formación, más allá de su propio directorio."
        ayuda="Cada vez que alguien abre 'Recursos' desde el sidebar y elige un oficio en el selector, queda registrado aquí. Sirve para decidir a qué oficio añadir equipo o cursos nuevos primero: el que más se consulta."
      >
        {recursos.length === 0 ? (
          <p className="text-[0.75rem]" style={{ color: 'rgba(10,9,8,0.4)' }}>
            Sin visitas al panel de Recursos registradas todavía.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {recursos.map(r => {
              const key = r.oficio === 'sin-catalogo' ? null : resolveAffiliateKey(r.oficio);
              const label = r.oficio === 'sin-catalogo'
                ? 'Sin oficio elegido (vista universal)'
                : key ? AFFILIATE_CATALOG[key].label : r.oficio;
              return (
                <div key={r.oficio} className="flex items-center gap-2 py-1">
                  <span className="text-[0.78rem] flex-1 truncate" style={{ color: 'rgba(10,9,8,0.75)' }}>{label}</span>
                  <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(10,9,8,0.05)', color: 'rgba(10,9,8,0.5)' }}>
                    {r.sesiones} {Number(r.sesiones) === 1 ? 'persona' : 'personas'}
                  </span>
                  <span className="text-[0.75rem] font-black flex-shrink-0 w-8 text-right" style={{ color: GOLD }}>{r.visitas}</span>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      {/* Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {[
          { icon: Eye, title: 'Páginas más vistas', datos: paginas, vacio: 'Sin visitas registradas todavía.' },
          { icon: Globe, title: 'De dónde llegan', datos: origenes, vacio: 'Sin orígenes registrados.' },
          { icon: Smartphone, title: 'Dispositivo', datos: dispositivos, vacio: 'Sin datos.' },
        ].map(({ icon: Icon, title, datos, vacio }) => (
          <div key={title} className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid rgba(10,9,8,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-3">
              <Icon size={13} style={{ color: GOLD }} />
              <h3 className="text-xs font-black" style={{ color: '#0a0908' }}>{title}</h3>
            </div>
            {datos.length === 0 ? (
              <p className="text-[0.7rem]" style={{ color: 'rgba(10,9,8,0.4)' }}>{vacio}</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {datos.map(d => (
                  <div key={d.valor} className="flex items-center gap-2">
                    <span className="text-[0.72rem] truncate flex-1" style={{ color: 'rgba(10,9,8,0.7)' }} title={d.valor}>
                      {d.valor}
                    </span>
                    <span className="text-[0.72rem] font-black flex-shrink-0" style={{ color: GOLD }}>{d.visitas}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-[0.68rem] mt-4 flex items-center gap-1.5" style={{ color: 'rgba(10,9,8,0.4)' }}>
        <Clock size={11} /> Hora de España. Sin IP ni datos personales: solo ruta, origen y tipo de dispositivo.
      </p>
    </div>
  );
}
