-- "Mis condiciones": el profesional fija las reglas, no las acepta.
--
-- Un camarero de eventos hoy no controla casi nada: le dicen la tarifa, el
-- turno, cuánto dura y cuándo cobra, y si rechaza dos servicios dejan de
-- llamarle. XPEAK le da la vuelta: publica sus condiciones y quien contrata las
-- lee ANTES de escribirle. Deja de negociar desde abajo.
--
-- Fase A (esta): declarativo. Las condiciones se muestran en la ficha y quien
-- contacta las ve. Fase B (cuando exista retención de pagos): vinculantes,
-- incorporadas al contrato PDF.
--
-- Todo opcional: un perfil sin condiciones sigue siendo válido y no debe
-- mostrar nada inventado (regla del proyecto: sin dato real, sin cifra).

-- ── Dinero ──────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  -- El abuso más citado del sector: que te llamen para 2 horas sueltas.
  ADD COLUMN IF NOT EXISTS min_hours              smallint,
  -- A partir de qué hora se considera extra, y cuánto recarga.
  ADD COLUMN IF NOT EXISTS overtime_after_hours   smallint,
  ADD COLUMN IF NOT EXISTS overtime_surcharge_pct smallint,
  ADD COLUMN IF NOT EXISTS night_surcharge_pct    smallint,
  ADD COLUMN IF NOT EXISTS holiday_surcharge_pct  smallint,
  -- La queja número uno: cobrar a 30-60 días. Que lo diga él por delante.
  ADD COLUMN IF NOT EXISTS payment_days_max       smallint,
  -- Desplazamiento: gratis hasta X km, después un fijo.
  ADD COLUMN IF NOT EXISTS travel_free_km         smallint,
  ADD COLUMN IF NOT EXISTS travel_fee             numeric(6,2),

-- ── Lo que hace y lo que NO ────────────────────────────────────────────────
  -- excluded_services es la columna con más valor de todas: poder decir "no
  -- monto sillas ni friego" por escrito y por adelantado.
  ADD COLUMN IF NOT EXISTS excluded_services      text[],
  -- 'propio' | 'cliente' | 'ambos'
  ADD COLUMN IF NOT EXISTS uniform_provided_by    text,

-- ── Disponibilidad ─────────────────────────────────────────────────────────
  -- Días de la semana que trabaja: 1=lunes … 7=domingo.
  ADD COLUMN IF NOT EXISTS available_weekdays     smallint[],
  -- Fechas que no acepta ni preguntando (Nochevieja, Navidad...).
  ADD COLUMN IF NOT EXISTS blocked_dates          date[],
  -- Con cuánta antelación mínima hay que reservarle.
  ADD COLUMN IF NOT EXISTS min_notice_hours       smallint,

-- ── Nota libre ─────────────────────────────────────────────────────────────
  ADD COLUMN IF NOT EXISTS conditions_note        text;

COMMENT ON COLUMN public.profiles.min_hours IS
  'Mínimo de horas por servicio. NULL = sin mínimo declarado.';
COMMENT ON COLUMN public.profiles.excluded_services IS
  'Lo que el profesional NO hace (montaje, limpieza, office...). Se muestra al que contrata antes de escribirle.';
COMMENT ON COLUMN public.profiles.payment_days_max IS
  'Plazo máximo de cobro que acepta, en días.';

-- Rangos sensatos: evitan tanto el error de tecleo como la cifra absurda que
-- restaría credibilidad a la ficha.
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS chk_condiciones_rangos;
ALTER TABLE public.profiles
  ADD CONSTRAINT chk_condiciones_rangos CHECK (
    (min_hours              IS NULL OR min_hours              BETWEEN 1 AND 24)  AND
    (overtime_after_hours   IS NULL OR overtime_after_hours   BETWEEN 1 AND 24)  AND
    (overtime_surcharge_pct IS NULL OR overtime_surcharge_pct BETWEEN 0 AND 200) AND
    (night_surcharge_pct    IS NULL OR night_surcharge_pct    BETWEEN 0 AND 200) AND
    (holiday_surcharge_pct  IS NULL OR holiday_surcharge_pct  BETWEEN 0 AND 200) AND
    (payment_days_max       IS NULL OR payment_days_max       BETWEEN 0 AND 120) AND
    (travel_free_km         IS NULL OR travel_free_km         BETWEEN 0 AND 500) AND
    (travel_fee             IS NULL OR travel_fee             BETWEEN 0 AND 999) AND
    (min_notice_hours       IS NULL OR min_notice_hours       BETWEEN 0 AND 2160) AND
    (uniform_provided_by    IS NULL OR uniform_provided_by IN ('propio','cliente','ambos'))
  );

-- Las columnas nuevas necesitan su GRANT explícito: los permisos de esta tabla
-- son por columna desde la auditoría de seguridad del 1 sep (el GRANT de tabla
-- entera filtraba emails a anon). Sin esto, las condiciones no se leerían en la
-- ficha pública.
GRANT SELECT (
  min_hours, overtime_after_hours, overtime_surcharge_pct, night_surcharge_pct,
  holiday_surcharge_pct, payment_days_max, travel_free_km, travel_fee,
  excluded_services, uniform_provided_by, available_weekdays, blocked_dates,
  min_notice_hours, conditions_note
) ON public.profiles TO anon, authenticated;
