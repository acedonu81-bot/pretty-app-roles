-- Perfil de ejemplo (seed) para el rol local_eventos, para que la categoría
-- no aparezca vacía al lanzar. Reutiliza el user_id de la cuenta demo
-- existente (kike.bachata.demo@xpeak.es, is_seed_profile=true) como una
-- segunda fila independiente en profiles — el esquema soporta múltiples
-- perfiles por user_id (columna is_primary, índice no-único en user_id).
-- No se creó cuenta auth.users nueva por no tener acceso directo al Admin
-- API de Supabase Auth desde este entorno; crear una cuenta por SQL crudo
-- en auth.users es delicado (hash de contraseña, tokens) y se descartó tras
-- confirmación del usuario de reutilizar el patrón existente.
insert into public.profiles (
  user_id, display_name, role, roles, zone, specialty, bio,
  is_seed_profile, is_verified, is_primary, photo_url,
  venue_capacity, allows_overnight, price_per_hour, price_per_event, distance_from_madrid_km
)
values (
  '9bf7c5e7-68fd-472f-843d-5bed981701ae',
  'Sala Ejemplo XPEAK',
  'local_eventos',
  array['local_eventos'],
  'Madrid',
  'Sala de eventos',
  'Perfil de ejemplo para mostrar cómo se ve una ficha de Locales para eventos en XPEAK. No es un local real.',
  true,
  false,
  false,
  '/img/locales-madrid/generico-discoteca-1.jpg',
  200,
  true,
  null,
  1500,
  0
);
