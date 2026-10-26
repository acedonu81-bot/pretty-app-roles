import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Precios de las páginas públicas (26 oct 2026, decisión del usuario: "no
// inventes datos"). Solo salen de las tarifas que los profesionales han escrito
// en su perfil; si no hay bastantes, la página no da cifra.

// Tarifas de 0 o 1 € son perfiles sin rellenar, y 40 €/h es el valor por
// defecto que muchos perfiles nunca tocaron: ninguna de las tres es un precio.
export const precioValido = (h: number | null | undefined): h is number =>
  typeof h === 'number' && h >= 10 && h <= 2000 && h !== 40;

export type EstadPrecio = { n: number; min: number; max: number; p25: number; p75: number; tipico: number };

// Con menos de 5 tarifas no se da rango: con 2 o 3 sería la tarifa de una persona.
export function estadisticasPrecio(tarifas: (number | null | undefined)[]): EstadPrecio | null {
  const xs = tarifas.filter(precioValido).sort((a, b) => a - b);
  if (xs.length < 5) return null;
  const q = (f: number) => { const i = (xs.length - 1) * f; const lo = Math.floor(i); return xs[lo] + (xs[Math.ceil(i)] - xs[lo]) * (i - lo); };
  const r5 = (n: number) => Math.round(n / 5) * 5;
  return { n: xs.length, min: xs[0], max: xs[xs.length - 1], p25: r5(q(0.25)), p75: r5(q(0.75)), tipico: r5(q(0.5)) };
}

export const esPreguntaPrecio = (q: string) => /^¿Cuánto (cuesta|cobra|cobran)/.test(q);

export function respuestaPrecio(keyword: string, donde: string, st: EstadPrecio | null): string {
  return st
    ? `En XPEAK, ${st.n} perfiles de ${keyword} en ${donde} tienen su precio publicado: la mitad cobra entre ${st.p25} y ${st.p75} € por hora y el precio mediano ronda los ${st.tipico} €. Cada perfil muestra su tarifa antes de contactar.`
    : `Cada profesional publica su precio en su perfil de XPEAK y el precio final depende de las horas, el tipo de evento y el desplazamiento. Todavía no hay suficientes perfiles de ${keyword} con precio en ${donde} para dar un rango fiable, así que lo mejor es pedir presupuesto a varios y comparar.`;
}

export const valorPrecio = (st: EstadPrecio | null) =>
  st ? `${st.p25}-${st.p75} €/h (la mitad de ${st.n} perfiles)` : 'En el perfil de cada profesional';

// Tarifas reales de un oficio (función tarifas_publicas: sin cuentas propias ni
// demo, semillas, rechazados ni tarifas por defecto). null mientras carga o si
// la función no existe todavía: en ese caso la página no da cifra.
export function useTarifasReales(roles: string[]): Map<string, number> | null {
  const [tarifas, setTarifas] = useState<Map<string, number> | null>(null);
  const clave = roles.join(',');
  useEffect(() => {
    if (!clave) return;
    let vivo = true;
    const sb = supabase as unknown as {
      rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: { user_id: string; hourly_rate: number }[] | null; error: unknown }>;
    };
    sb.rpc('tarifas_publicas', { p_roles: clave.split(',') }).then(({ data, error }) => {
      if (vivo && !error && data) setTarifas(new Map(data.map(t => [t.user_id, Number(t.hourly_rate)])));
    });
    return () => { vivo = false; };
  }, [clave]);
  return tarifas;
}

// Todo el país (páginas /contratar-<oficio>).
export function usePrecioReal(roles: string[]): EstadPrecio | null {
  const tarifas = useTarifasReales(roles);
  return tarifas ? estadisticasPrecio([...tarifas.values()]) : null;
}
