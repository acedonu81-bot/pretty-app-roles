-- email_logs solo tenía un índice normal (user_id, type), no UNIQUE. El
-- patrón de dedupe en profile-incomplete-reminder y review-reminder era
-- SELECT existing -> si no hay -> enviar -> INSERT log, sin transacción ni
-- lock: dos invocaciones de la función (doble clic, test manual, reintento)
-- pueden pasar el SELECT antes de que cualquiera inserte, y ambas envían.
-- Caso real (25-26 sep 2026): djjhosval@gmail.com recibió 4 copias de
-- "Tu plantilla de contrato DJ" en 9 min; acedonu81@gmail.com recibió 4
-- copias de "pedir_valoracion" en 19 min durante pruebas manuales del cron.
--
-- El constraint es (user_id, type, sent_day) y no (user_id, type) a secas:
-- review-reminder ya mete el sufijo de evento dentro de `type`
-- (review_reminder_<bookingId>_<suffix>), así que ahí un mismo user_id+type
-- literal solo debía darse una vez de todos modos. Pero
-- profile-incomplete-reminder reutiliza el mismo `type` fijo
-- ('profile_incomplete_reminder') en cada envío diario a propósito — ahora
-- permite hasta MAX_REMINDERS envíos, uno por día — así que el corte tiene
-- que ser "no más de uno por día", no "no más de uno nunca".
alter table public.email_logs add column if not exists sent_day date
  generated always as ((sent_at at time zone 'utc')::date) stored;

-- Limpiar duplicados existentes (incl. los ya generados por el bug) antes
-- de crear el constraint: quedarse con la fila más antigua de cada
-- user_id+type+día.
delete from public.email_logs a
using public.email_logs b
where a.user_id = b.user_id
  and a.type = b.type
  and a.sent_day = b.sent_day
  and a.sent_at > b.sent_at;

alter table public.email_logs
  add constraint email_logs_user_type_day_unique unique (user_id, type, sent_day);
