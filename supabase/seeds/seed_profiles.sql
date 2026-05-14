-- ══════════════════════════════════════════════════════════════════════
-- XPEAK — Perfiles de demostración (seed data)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Estos perfiles son ficticios y solo sirven para poblar el directorio.
-- ══════════════════════════════════════════════════════════════════════

-- Paso 1: Añadir columna de marca si no existe
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_seed_profile boolean NOT NULL DEFAULT false;

-- Paso 2: Desactivar triggers de la sesión para evitar duplicados
--         (session_replication_role = replica suprime triggers de usuario)
SET session_replication_role = 'replica';

-- Paso 3: Usuarios ficticios en auth.users
-- Las contraseñas son hashes no válidos → nadie puede hacer login con estos usuarios
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, role, aud
) VALUES
  ('11111111-1111-1111-1111-000000000001','00000000-0000-0000-0000-000000000000',
   'seed_dj_marco@xpeak-demo.internal','$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   now(),now(),now(),'{"provider":"email","providers":["email"]}','{"role":"dj"}',false,'authenticated','authenticated'),
  ('11111111-1111-1111-1111-000000000002','00000000-0000-0000-0000-000000000000',
   'seed_dj_alex@xpeak-demo.internal','$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   now(),now(),now(),'{"provider":"email","providers":["email"]}','{"role":"dj"}',false,'authenticated','authenticated'),
  ('11111111-1111-1111-1111-000000000003','00000000-0000-0000-0000-000000000000',
   'seed_dj_laura@xpeak-demo.internal','$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   now(),now(),now(),'{"provider":"email","providers":["email"]}','{"role":"dj"}',false,'authenticated','authenticated'),
  ('11111111-1111-1111-1111-000000000004','00000000-0000-0000-0000-000000000000',
   'seed_dj_carlos@xpeak-demo.internal','$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   now(),now(),now(),'{"provider":"email","providers":["email"]}','{"role":"dj"}',false,'authenticated','authenticated'),
  ('11111111-1111-1111-1111-000000000005','00000000-0000-0000-0000-000000000000',
   'seed_dj_ivan@xpeak-demo.internal','$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   now(),now(),now(),'{"provider":"email","providers":["email"]}','{"role":"dj"}',false,'authenticated','authenticated'),
  ('11111111-1111-1111-1111-000000000006','00000000-0000-0000-0000-000000000000',
   'seed_dj_nadia@xpeak-demo.internal','$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   now(),now(),now(),'{"provider":"email","providers":["email"]}','{"role":"dj"}',false,'authenticated','authenticated'),
  ('11111111-1111-1111-1111-000000000007','00000000-0000-0000-0000-000000000000',
   'seed_dj_ruben@xpeak-demo.internal','$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   now(),now(),now(),'{"provider":"email","providers":["email"]}','{"role":"dj"}',false,'authenticated','authenticated'),
  ('11111111-1111-1111-1111-000000000008','00000000-0000-0000-0000-000000000000',
   'seed_dj_sofia@xpeak-demo.internal','$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   now(),now(),now(),'{"provider":"email","providers":["email"]}','{"role":"dj"}',false,'authenticated','authenticated'),
  ('11111111-1111-1111-1111-000000000009','00000000-0000-0000-0000-000000000000',
   'seed_staff_paula@xpeak-demo.internal','$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   now(),now(),now(),'{"provider":"email","providers":["email"]}','{"role":"staff"}',false,'authenticated','authenticated'),
  ('11111111-1111-1111-1111-000000000010','00000000-0000-0000-0000-000000000000',
   'seed_staff_elena@xpeak-demo.internal','$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   now(),now(),now(),'{"provider":"email","providers":["email"]}','{"role":"staff"}',false,'authenticated','authenticated'),
  ('11111111-1111-1111-1111-000000000011','00000000-0000-0000-0000-000000000000',
   'seed_staff_jorge@xpeak-demo.internal','$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   now(),now(),now(),'{"provider":"email","providers":["email"]}','{"role":"staff"}',false,'authenticated','authenticated'),
  ('11111111-1111-1111-1111-000000000012','00000000-0000-0000-0000-000000000000',
   'seed_staff_carmen@xpeak-demo.internal','$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   now(),now(),now(),'{"provider":"email","providers":["email"]}','{"role":"staff"}',false,'authenticated','authenticated'),
  ('11111111-1111-1111-1111-000000000013','00000000-0000-0000-0000-000000000000',
   'seed_makeup_ana@xpeak-demo.internal','$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   now(),now(),now(),'{"provider":"email","providers":["email"]}','{"role":"makeup"}',false,'authenticated','authenticated'),
  ('11111111-1111-1111-1111-000000000014','00000000-0000-0000-0000-000000000000',
   'seed_makeup_lucia@xpeak-demo.internal','$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   now(),now(),now(),'{"provider":"email","providers":["email"]}','{"role":"makeup"}',false,'authenticated','authenticated'),
  ('11111111-1111-1111-1111-000000000015','00000000-0000-0000-0000-000000000000',
   'seed_promotor_david@xpeak-demo.internal','$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   now(),now(),now(),'{"provider":"email","providers":["email"]}','{"role":"promotor"}',false,'authenticated','authenticated')
ON CONFLICT (id) DO NOTHING;

-- Paso 4: Identidades requeridas por Supabase Auth
INSERT INTO auth.identities (
  id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, provider_id
) VALUES
  (gen_random_uuid(),'11111111-1111-1111-1111-000000000001','{"sub":"11111111-1111-1111-1111-000000000001","email":"seed_dj_marco@xpeak-demo.internal"}','email',now(),now(),now(),'seed_dj_marco@xpeak-demo.internal'),
  (gen_random_uuid(),'11111111-1111-1111-1111-000000000002','{"sub":"11111111-1111-1111-1111-000000000002","email":"seed_dj_alex@xpeak-demo.internal"}','email',now(),now(),now(),'seed_dj_alex@xpeak-demo.internal'),
  (gen_random_uuid(),'11111111-1111-1111-1111-000000000003','{"sub":"11111111-1111-1111-1111-000000000003","email":"seed_dj_laura@xpeak-demo.internal"}','email',now(),now(),now(),'seed_dj_laura@xpeak-demo.internal'),
  (gen_random_uuid(),'11111111-1111-1111-1111-000000000004','{"sub":"11111111-1111-1111-1111-000000000004","email":"seed_dj_carlos@xpeak-demo.internal"}','email',now(),now(),now(),'seed_dj_carlos@xpeak-demo.internal'),
  (gen_random_uuid(),'11111111-1111-1111-1111-000000000005','{"sub":"11111111-1111-1111-1111-000000000005","email":"seed_dj_ivan@xpeak-demo.internal"}','email',now(),now(),now(),'seed_dj_ivan@xpeak-demo.internal'),
  (gen_random_uuid(),'11111111-1111-1111-1111-000000000006','{"sub":"11111111-1111-1111-1111-000000000006","email":"seed_dj_nadia@xpeak-demo.internal"}','email',now(),now(),now(),'seed_dj_nadia@xpeak-demo.internal'),
  (gen_random_uuid(),'11111111-1111-1111-1111-000000000007','{"sub":"11111111-1111-1111-1111-000000000007","email":"seed_dj_ruben@xpeak-demo.internal"}','email',now(),now(),now(),'seed_dj_ruben@xpeak-demo.internal'),
  (gen_random_uuid(),'11111111-1111-1111-1111-000000000008','{"sub":"11111111-1111-1111-1111-000000000008","email":"seed_dj_sofia@xpeak-demo.internal"}','email',now(),now(),now(),'seed_dj_sofia@xpeak-demo.internal'),
  (gen_random_uuid(),'11111111-1111-1111-1111-000000000009','{"sub":"11111111-1111-1111-1111-000000000009","email":"seed_staff_paula@xpeak-demo.internal"}','email',now(),now(),now(),'seed_staff_paula@xpeak-demo.internal'),
  (gen_random_uuid(),'11111111-1111-1111-1111-000000000010','{"sub":"11111111-1111-1111-1111-000000000010","email":"seed_staff_elena@xpeak-demo.internal"}','email',now(),now(),now(),'seed_staff_elena@xpeak-demo.internal'),
  (gen_random_uuid(),'11111111-1111-1111-1111-000000000011','{"sub":"11111111-1111-1111-1111-000000000011","email":"seed_staff_jorge@xpeak-demo.internal"}','email',now(),now(),now(),'seed_staff_jorge@xpeak-demo.internal'),
  (gen_random_uuid(),'11111111-1111-1111-1111-000000000012','{"sub":"11111111-1111-1111-1111-000000000012","email":"seed_staff_carmen@xpeak-demo.internal"}','email',now(),now(),now(),'seed_staff_carmen@xpeak-demo.internal'),
  (gen_random_uuid(),'11111111-1111-1111-1111-000000000013','{"sub":"11111111-1111-1111-1111-000000000013","email":"seed_makeup_ana@xpeak-demo.internal"}','email',now(),now(),now(),'seed_makeup_ana@xpeak-demo.internal'),
  (gen_random_uuid(),'11111111-1111-1111-1111-000000000014','{"sub":"11111111-1111-1111-1111-000000000014","email":"seed_makeup_lucia@xpeak-demo.internal"}','email',now(),now(),now(),'seed_makeup_lucia@xpeak-demo.internal'),
  (gen_random_uuid(),'11111111-1111-1111-1111-000000000015','{"sub":"11111111-1111-1111-1111-000000000015","email":"seed_promotor_david@xpeak-demo.internal"}','email',now(),now(),now(),'seed_promotor_david@xpeak-demo.internal')
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Paso 5: Perfiles en public.profiles
INSERT INTO public.profiles (
  user_id, display_name, role, specialty, zone, hourly_rate,
  bio, genres, instagram, photo_url,
  subscription_tier, is_verified, is_live, is_flash_active,
  validation_status, category, score, is_seed_profile
) VALUES

-- ── DJs ──────────────────────────────────────────────────────────────────────
(
  '11111111-1111-1111-1111-000000000001',
  'Marco Delgado', 'dj', 'Tech House / Melodic Techno', 'Madrid Centro', 120,
  'DJ residente con más de 8 años en la escena electrónica de Madrid. Especializado en sets de larga duración para afterparties y clubs de aforo medio-alto. Equipo Pioneer CDJ-3000 completo.',
  ARRAY['Tech House','Melodic Techno','Deep House'],
  '@marcodelgado.dj', 'https://i.pravatar.cc/300?img=11',
  'elite', true, true, true, 'approved', 'professional', 95, true
),
(
  '11111111-1111-1111-1111-000000000002',
  'Alex Vidal', 'dj', 'Deep House / Minimal', 'Barcelona Eixample', 90,
  'Productor y DJ con base en Barcelona. Sonido oscuro y progresivo. Residencias en clubs de referencia. Disponible para eventos privados, corporativos y clubs.',
  ARRAY['Deep House','Minimal','Techno'],
  '@alexvidal.music', 'https://i.pravatar.cc/300?img=12',
  'premium', true, true, false, 'approved', 'professional', 82, true
),
(
  '11111111-1111-1111-1111-000000000003',
  'Laura Montés', 'dj', 'Commercial / Top 40', 'Valencia', 70,
  'DJ comercial especializada en bodas, eventos de empresa y celebraciones. Más de 200 eventos en 2025. Repertorio amplio adaptado a cada público.',
  ARRAY['Commercial','Top 40','Reggaeton'],
  '@lauradj_valencia', 'https://i.pravatar.cc/300?img=5',
  'premium', true, false, true, 'approved', 'professional', 78, true
),
(
  '11111111-1111-1111-1111-000000000004',
  'Carlos Reyes', 'dj', 'Afro House / Tribal', 'Sevilla', 85,
  'Pionero del Afro House en Andalucía. Sonido afrobeat, tribal y world music para clubes de ambiente íntimo. Giras por el sur de España.',
  ARRAY['Afro House','Tribal','Organic House'],
  '@dj_carlosreyes', 'https://i.pravatar.cc/300?img=15',
  'premium', true, false, false, 'approved', 'professional', 74, true
),
(
  '11111111-1111-1111-1111-000000000005',
  'Iván Tormos', 'dj', 'Hard Techno / Industrial', 'Madrid Sur', 65,
  'DJ emergente especializado en hard techno y sonidos industriales. Sets de alta energía. Equipo Denon DJ y sistema de luces propio disponible.',
  ARRAY['Hard Techno','Industrial','Techno'],
  '@ivantormos.hard', 'https://i.pravatar.cc/300?img=17',
  'free', false, false, true, 'approved', 'professional', 58, true
),
(
  '11111111-1111-1111-1111-000000000006',
  'Nadia Ferrer', 'dj', 'Nu Disco / Funk', 'Barcelona Gràcia', 80,
  'Especialista en nu disco, boogie y funk para locales con ambiente desenfadado. Sets llenos de energía positiva. Colaboraciones con marcas y agencias de eventos en Cataluña.',
  ARRAY['Nu Disco','Funk','Soul'],
  '@nadiaferrer.dj', 'https://i.pravatar.cc/300?img=44',
  'premium', true, true, true, 'approved', 'professional', 86, true
),
(
  '11111111-1111-1111-1111-000000000007',
  'Rubén Castillo', 'dj', 'Reggaeton / Urbano', 'Madrid Norte', 75,
  'Referente del reggaeton y música urbana en Madrid. Bodas latinas, quince años y eventos privados. Repertorio actualizado semanalmente.',
  ARRAY['Reggaeton','Dembow','Salsa'],
  '@rubencastillo.dj', 'https://i.pravatar.cc/300?img=13',
  'premium', true, false, false, 'approved', 'professional', 71, true
),
(
  '11111111-1111-1111-1111-000000000008',
  'Sofía Ruiz', 'dj', 'Techno / Warehouse', 'Bilbao', 100,
  'DJ y productora con residencias en el circuito techno del País Vasco. Sets duros e hipnóticos para warehouse parties y festivales. Disponible para salidas nacionales.',
  ARRAY['Techno','Industrial Techno','EBM'],
  '@sofiaruiz.techno', 'https://i.pravatar.cc/300?img=45',
  'elite', true, true, false, 'approved', 'professional', 91, true
),

-- ── Staff ─────────────────────────────────────────────────────────────────────
(
  '11111111-1111-1111-1111-000000000009',
  'Paula Navarro', 'staff', 'Azafata / Promotora', 'Madrid', 18,
  'Azafata profesional con 5 años en ferias (IFEMA), congresos y eventos corporativos. Inglés y francés. Alta presencia y dinamismo. Referencias acreditables.',
  ARRAY[]::text[],
  '@paulanavarro.events', 'https://i.pravatar.cc/300?img=46',
  'premium', true, false, true, 'approved', 'professional', 80, true
),
(
  '11111111-1111-1111-1111-000000000010',
  'Elena Soto', 'staff', 'Camarera de sala / Barra', 'Barcelona', 16,
  'Camarera con experiencia en bodas y eventos premium. Servicio de mesa, barra libre y coctelería. Uniforme propio incluido. Disponible fines de semana.',
  ARRAY[]::text[],
  '@elenasoto.staff', 'https://i.pravatar.cc/300?img=47',
  'premium', true, false, false, 'approved', 'professional', 72, true
),
(
  '11111111-1111-1111-1111-000000000011',
  'Jorge Méndez', 'staff', 'Camarero / Barman', 'Málaga', 17,
  'Camarero y barman para eventos al aire libre y fincas. Coctelería clásica y gin tonics. 4 años de experiencia en bodas en la Costa del Sol.',
  ARRAY[]::text[],
  '@jorgemendez.bar', 'https://i.pravatar.cc/300?img=18',
  'free', false, false, false, 'approved', 'professional', 55, true
),
(
  '11111111-1111-1111-1111-000000000012',
  'Carmen Blanco', 'staff', 'RRPP / Hostess', 'Valencia', 20,
  'Relaciones públicas y hostess para discotecas y eventos nocturnos. Gestión de listas, control de puerta y recepción VIP. Red de contactos sólida en Valencia.',
  ARRAY[]::text[],
  '@carmenblanco.rrpp', 'https://i.pravatar.cc/300?img=48',
  'premium', true, true, true, 'approved', 'professional', 83, true
),

-- ── Maquillaje ────────────────────────────────────────────────────────────────
(
  '11111111-1111-1111-1111-000000000013',
  'Ana Morales', 'makeup', 'Maquillaje nupcial', 'Madrid', 95,
  'Maquilladora nupcial especializada en looks naturales, glam y editorial. Más de 150 novias en 2025. Incluye prueba previa y día de la boda.',
  ARRAY[]::text[],
  '@anamorales.makeup', 'https://i.pravatar.cc/300?img=49',
  'elite', true, false, true, 'approved', 'professional', 93, true
),
(
  '11111111-1111-1111-1111-000000000014',
  'Lucía Peña', 'makeup', 'Maquillaje artístico / Eventos', 'Sevilla', 60,
  'Maquilladora de eventos, fotografía y teatro. Maquillaje artístico y caracterización. Disponible para eventos de día y noche en Andalucía.',
  ARRAY[]::text[],
  '@luciapena.art', 'https://i.pravatar.cc/300?img=50',
  'premium', true, false, false, 'approved', 'professional', 68, true
),

-- ── Promotor ──────────────────────────────────────────────────────────────────
(
  '11111111-1111-1111-1111-000000000015',
  'David Fuentes', 'promotor', 'Eventos electrónicos / Festivales', 'Madrid', 200,
  'Promotor con más de 10 años organizando eventos de música electrónica en Madrid. Gestión de artistas internacionales y coordinación de producción técnica.',
  ARRAY[]::text[],
  '@davidfuentes.events', 'https://i.pravatar.cc/300?img=19',
  'elite', true, false, false, 'approved', 'professional', 88, true
)

ON CONFLICT (user_id) DO UPDATE SET
  display_name    = EXCLUDED.display_name,
  bio             = EXCLUDED.bio,
  score           = EXCLUDED.score,
  is_seed_profile = true;

-- Paso 6: Roles de usuario para los seeds
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'user'::app_role
FROM auth.users u
WHERE u.email LIKE '%@xpeak-demo.internal'
ON CONFLICT (user_id, role) DO NOTHING;

-- Paso 7: Restaurar modo de replicación
SET session_replication_role = 'origin';

-- ── Verificación ──────────────────────────────────────────────────────────────
SELECT display_name, role, zone, subscription_tier, score, is_verified, is_seed_profile
FROM public.profiles
WHERE is_seed_profile = true
ORDER BY role, score DESC;
