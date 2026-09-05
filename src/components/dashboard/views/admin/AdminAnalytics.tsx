import { useEffect, useState, useCallback } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { RefreshCw, Eye, Users, UserPlus, Send, Clock, Globe, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Analítica propia de XPEAK, leída de la base de datos del proyecto.
 *
 * Existe porque las dos alternativas fallan para este caso: Vercel Analytics
 * devuelve 404 (exige plan Pro) y GA4, aun teniendo los datos, es una
 * herramienta que cuesta leer cuando lo que quieres es "cuánta gente entró
 * ayer y a qué hora". Aquí eso son dos gráficas.
 *
 * Las cifras excluyen el tráfico de cuentas admin: con GA4 ya pasó que 454
 * sesiones brutas incluían ~85 propias (previews de Vercel y logins de
 * prueba), y eso hace tomar decisiones sobre humo.
 */

type Dia = { dia: string; visitas: number; sesiones: number; registros: number };
type Hora = { hora: number; visitas: number };
type Top = { tipo: string; valor: string; visitas: number };
type Negocio = { dia: string; altas: number; solicitudes: number; mensajes: number };
type Busqueda = { termino: string; veces: number; sin_resultados: number };
type Afiliado = { producto: string; clics: number; desde: string };
type Blog = { articulo: string; visitas: number; sesiones: number; desde_buscador: number };
type Embudo = { paso: string; orden: number; cantidad: number };

const GOLD = '#B8941E';
const RANGOS = [7, 30, 90];

const fmtDia = (d: string) => {
  const date = new Date(d + 'T00:00:00');
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const Kpi = ({ icon: Icon, label, valor, sub }: {
  icon: typeof Eye; label: string; valor: string | number; sub?: string;
}) => (
  <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid rgba(10,9,8,0.08)' }}>
    <div className="flex items-center gap-1.5 mb-2">
      <Icon size={13} style={{ color: GOLD }} />
      <span className="text-[0.65rem] font-extrabold uppercase tracking-wider" style={{ color: 'rgba(10,9,8,0.45)' }}>
        {label}
      </span>
    </div>
    <p className="text-2xl font-black leading-none" style={{ color: '#0a0908' }}>{valor}</p>
    {sub && <p className="text-[0.7rem] mt-1.5" style={{ color: 'rgba(10,9,8,0.45)' }}>{sub}</p>}
  </div>
);

const Panel = ({ title, hint, children }: {
  title: string; hint?: string; children: React.ReactNode;
}) => (
  <div className="rounded-2xl p-4 sm:p-5 mb-4" style={{ background: '#fff', border: '1px solid rgba(10,9,8,0.08)' }}>
    <h3 className="text-sm font-black mb-0.5" style={{ color: '#0a0908' }}>{title}</h3>
    {hint && <p className="text-[0.7rem] mb-4" style={{ color: 'rgba(10,9,8,0.45)' }}>{hint}</p>}
    {children}
  </div>
);

export default function AdminAnalytics() {
  const [dias, setDias] = useState(30);
  const [porDia, setPorDia] = useState<Dia[]>([]);
  const [porHora, setPorHora] = useState<Hora[]>([]);
  const [top, setTop] = useState<Top[]>([]);
  const [negocio, setNegocio] = useState<Negocio[]>([]);
  const [busquedas, setBusquedas] = useState<Busqueda[]>([]);
  const [afiliados, setAfiliados] = useState<Afiliado[]>([]);
  const [blog, setBlog] = useState<Blog[]>([]);
  const [embudo, setEmbudo] = useState<Embudo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    const [d, h, t, n, bus, afi, blg, emb] = await Promise.all([
      sb.rpc('panel_analytics_dia', { p_dias: dias }),
      sb.rpc('panel_analytics_hora', { p_dias: Math.min(dias, 30) }),
      sb.rpc('panel_analytics_top', { p_dias: dias, p_limite: 8 }),
      sb.rpc('panel_analytics_negocio', { p_dias: dias }),
      sb.rpc('panel_analytics_busquedas', { p_dias: dias, p_limite: 15 }),
      sb.rpc('panel_analytics_afiliados', { p_dias: dias, p_limite: 15 }),
      sb.rpc('panel_analytics_blog', { p_dias: dias, p_limite: 15 }),
      sb.rpc('panel_analytics_embudo', { p_dias: dias }),
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
    setBlog((blg.data as Blog[]) ?? []);
    setEmbudo((emb.data as Embudo[]) ?? []);
    setCargando(false);
  }, [dias]);

  useEffect(() => { cargar(); }, [cargar]);

  const totalVisitas = porDia.reduce((s, d) => s + Number(d.visitas || 0), 0);
  const totalSesiones = porDia.reduce((s, d) => s + Number(d.sesiones || 0), 0);
  const totalAltas = negocio.reduce((s, d) => s + Number(d.altas || 0), 0);
  const totalSolicitudes = negocio.reduce((s, d) => s + Number(d.solicitudes || 0), 0);

  const horaPunta = porHora.length
    ? porHora.reduce((max, h) => (Number(h.visitas) > Number(max.visitas) ? h : max), porHora[0])
    : null;

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
        {RANGOS.map(r => (
          <button key={r} onClick={() => setDias(r)}
            className="text-xs font-bold px-3 py-1.5 rounded-full transition-all"
            style={{
              background: dias === r ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${dias === r ? 'rgba(212,175,55,0.4)' : 'rgba(0,0,0,0.08)'}`,
              color: dias === r ? '#8A6D0F' : '#444',
            }}>
            {r} días
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Kpi icon={Eye} label="Visitas" valor={totalVisitas} sub={`en ${dias} días`} />
        <Kpi icon={Users} label="Sesiones" valor={totalSesiones} sub="personas distintas" />
        <Kpi icon={UserPlus} label="Altas" valor={totalAltas} sub="perfiles nuevos" />
        <Kpi icon={Send} label="Solicitudes" valor={totalSolicitudes} sub="Flash Booking" />
      </div>

      {/* Tráfico por día */}
      <Panel title="Tráfico por día" hint="Visitas y sesiones. Excluye tu propio tráfico de admin.">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={porDia}>
            <defs>
              <linearGradient id="gVisitas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,9,8,0.06)" vertical={false} />
            <XAxis dataKey="dia" tickFormatter={fmtDia} tick={{ fontSize: 10, fill: 'rgba(10,9,8,0.45)' }}
              axisLine={false} tickLine={false} minTickGap={20} />
            <YAxis tick={{ fontSize: 10, fill: 'rgba(10,9,8,0.45)' }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
            <Tooltip labelFormatter={fmtDia}
              contentStyle={{ borderRadius: 12, border: '1px solid rgba(10,9,8,0.1)', fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="visitas" name="Visitas" stroke={GOLD} strokeWidth={2} fill="url(#gVisitas)" />
            <Area type="monotone" dataKey="sesiones" name="Sesiones" stroke="#4285F4" strokeWidth={1.5} fill="none" />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      {/* Por hora */}
      <Panel
        title="¿A qué hora entra tu gente?"
        hint={horaPunta && Number(horaPunta.visitas) > 0
          ? `Hora punta: ${horaPunta.hora}:00 h. Es cuándo publicar y cuándo lanzar campañas.`
          : 'Hora local de España. Se llena a medida que entren visitas.'}
      >
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={porHora}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,9,8,0.06)" vertical={false} />
            <XAxis dataKey="hora" tickFormatter={(h: number) => `${h}h`}
              tick={{ fontSize: 10, fill: 'rgba(10,9,8,0.45)' }} axisLine={false} tickLine={false} interval={1} />
            <YAxis tick={{ fontSize: 10, fill: 'rgba(10,9,8,0.45)' }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
            <Tooltip labelFormatter={(h) => `${h}:00 h`}
              contentStyle={{ borderRadius: 12, border: '1px solid rgba(10,9,8,0.1)', fontSize: 12 }} />
            <Bar dataKey="visitas" name="Visitas" fill={GOLD} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {/* Actividad de negocio — tiene histórico completo, no depende del tracking nuevo */}
      <Panel title="Actividad de la plataforma" hint="Altas, solicitudes y mensajes. Con histórico desde el inicio del proyecto.">
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

      {/* EMBUDO — la cifra que dice si el tráfico sirve para algo. 400 visitas
          con 0 solicitudes es un problema distinto de 40 con 4, y la gráfica
          de tráfico sola no los distingue. */}
      {embudo.length > 0 && embudo.some(e => Number(e.cantidad) > 0) && (
        <Panel title="Embudo" hint="De la visita al contacto. Cada paso son personas distintas, no clics.">
          <div className="flex flex-col gap-2">
            {embudo.map(e => {
              const max = Math.max(...embudo.map(x => Number(x.cantidad) || 0), 1);
              const pct = (Number(e.cantidad) / max) * 100;
              const primero = Number(embudo[0]?.cantidad) || 0;
              const conv = primero > 0 ? ((Number(e.cantidad) / primero) * 100).toFixed(1) : '0';
              return (
                <div key={e.paso} className="flex items-center gap-3">
                  <span className="text-[0.75rem] font-bold w-44 flex-shrink-0" style={{ color: 'rgba(10,9,8,0.7)' }}>
                    {e.paso}
                  </span>
                  <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ background: 'rgba(10,9,8,0.04)' }}>
                    <div className="h-full rounded-lg flex items-center px-2 transition-all"
                      style={{ width: `${Math.max(pct, 3)}%`, background: 'linear-gradient(90deg,#E0BC4B,#B8941E)' }}>
                      <span className="text-[0.7rem] font-black" style={{ color: '#1a1208' }}>{e.cantidad}</span>
                    </div>
                  </div>
                  <span className="text-[0.7rem] font-bold w-12 text-right flex-shrink-0" style={{ color: 'rgba(10,9,8,0.45)' }}>
                    {conv}%
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      {/* BÚSQUEDAS INTERNAS — lo que la gente pide dentro de XPEAK. Las que dan
          0 resultados son literalmente la lista de qué inventario falta. */}
      <Panel
        title="Qué buscan dentro de XPEAK"
        hint="Términos escritos en el buscador. Los marcados en rojo no devolvieron ningún resultado: eso es inventario que te piden y no tienes."
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

      {/* BLOG — ~380 URLs escritas a ciegas hasta ahora. */}
      <Panel
        title="Artículos del blog que funcionan"
        hint="Visitas por artículo y cuántas vienen de un buscador. Lo que no aparece aquí, no lo lee nadie."
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
