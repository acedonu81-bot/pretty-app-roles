interface Condiciones {
  hourly_rate?: number | null;
  min_hours?: number | null;
  overtime_after_hours?: number | null;
  overtime_surcharge_pct?: number | null;
  night_surcharge_pct?: number | null;
  holiday_surcharge_pct?: number | null;
  payment_days_max?: number | null;
  travel_free_km?: number | null;
  travel_fee?: number | null;
  excluded_services?: string[] | null;
  uniform_provided_by?: string | null;
  available_weekdays?: number[] | null;
  min_notice_hours?: number | null;
  conditions_note?: string | null;
}

/**
 * Las condiciones del profesional, en su ficha pública.
 *
 * Es la otra mitad de "Mis condiciones": sin esto, el profesional las escribe
 * y nadie las lee, así que la promesa ("quien te escriba las habrá leído")
 * no se cumple y volvería a negociar cada vez desde cero.
 *
 * Se muestra ANTES del botón de contactar a propósito: quien escribe ya sabe a
 * qué atenerse, y quien no acepte estas condiciones no le hace perder el tiempo.
 *
 * Si no hay ninguna declarada, no se pinta nada — nunca un bloque vacío ni un
 * valor inventado para rellenar.
 */
export default function CondicionesPublicas({ p, nombre }: { p: Condiciones; nombre: string }) {
  const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const tiene = (v: any) => v !== null && v !== undefined && v !== '';

  const lineas: { texto: React.ReactNode; fuerte?: boolean }[] = [];

  if (tiene(p.min_hours)) {
    lineas.push({
      texto: <>Mínimo <strong>{p.min_hours} horas</strong> por servicio</>,
      fuerte: true,
    });
  }
  if (tiene(p.overtime_surcharge_pct)) {
    lineas.push({
      texto: <>A partir de la {p.overtime_after_hours ?? 8}ª hora: <strong>+{p.overtime_surcharge_pct}%</strong></>,
    });
  }
  if (tiene(p.night_surcharge_pct)) lineas.push({ texto: <>Recargo nocturno: +{p.night_surcharge_pct}%</> });
  if (tiene(p.holiday_surcharge_pct)) lineas.push({ texto: <>Festivos: +{p.holiday_surcharge_pct}%</> });
  if (tiene(p.payment_days_max)) {
    lineas.push({
      texto: <>Cobro máximo a <strong>{p.payment_days_max} días</strong></>,
      fuerte: true,
    });
  }
  if (tiene(p.uniform_provided_by)) {
    lineas.push({
      texto: <>Uniforme: {p.uniform_provided_by === 'propio' ? 'lo aporta el profesional'
        : p.uniform_provided_by === 'cliente' ? 'lo aporta el cliente' : 'indiferente'}</>,
    });
  }
  if (tiene(p.travel_free_km)) {
    lineas.push({
      texto: <>Desplazamiento incluido hasta {p.travel_free_km} km
        {tiene(p.travel_fee) && <> · después +{p.travel_fee} €</>}</>,
    });
  }
  if (tiene(p.min_notice_hours)) {
    lineas.push({ texto: <>Reserva con {p.min_notice_hours} h de antelación mínima</> });
  }
  if (p.available_weekdays?.length) {
    lineas.push({
      texto: <>Disponible: {p.available_weekdays.map(d => DIAS[d - 1]).join(' · ')}</>,
    });
  }

  const excluidos = p.excluded_services?.length ? p.excluded_services : null;
  const nota = p.conditions_note?.trim() || null;

  if (lineas.length === 0 && !excluidos && !nota) return null;

  return (
    <section className="rounded-2xl p-5 sm:p-6" style={{ background: '#0a0908' }}>
      <p className="text-[0.65rem] font-black uppercase tracking-widest mb-1" style={{ color: '#D4AF37' }}>
        Condiciones de {nombre}
      </p>
      <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Las fija el profesional. Léelas antes de escribirle.
      </p>

      {lineas.length > 0 && (
        <ul className="space-y-2.5 text-sm">
          {lineas.map((l, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: l.fuerte ? '#D4AF37' : 'rgba(255,255,255,0.35)' }} />
              <span style={{ color: l.fuerte ? '#fff' : 'rgba(255,255,255,0.8)' }}>{l.texto}</span>
            </li>
          ))}
        </ul>
      )}

      {excluidos && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-[0.65rem] font-black uppercase tracking-wider mb-2"
            style={{ color: 'rgba(255,255,255,0.45)' }}>No incluye</p>
          <div className="flex flex-wrap gap-1.5">
            {excluidos.map(s => (
              <span key={s} className="px-2 py-1 rounded text-[0.7rem] font-bold"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {nota && (
        <p className="mt-4 pt-4 text-xs leading-relaxed"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
          {nota}
        </p>
      )}
    </section>
  );
}
