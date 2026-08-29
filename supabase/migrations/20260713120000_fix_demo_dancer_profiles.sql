-- ════════════════════════════════════════════════════════════════
-- Reparación de 4 perfiles demo de bailarines creados vía registro
-- normal en producción. Los primeros 3 quedaron corrompidos por una
-- race condition real en useProfile.tsx (guardar antes de que
-- profileId se resuelva) — ya arreglada en el código, pendiente de
-- deploy. Kike quedó limpio (solo registro, sin guardar formulario).
-- Todos marcados is_seed_profile = true.
-- ════════════════════════════════════════════════════════════════

UPDATE public.profiles SET
  display_name = 'Yara Salsa Madrid',
  role = 'bailarin',
  zone = 'Madrid, España',
  specialty = 'Instructora de salsa cubana y bachata sensual',
  bio = 'Instructora de salsa y bachata con estudio propio en Madrid. Clases particulares, shows de exhibición para bodas y eventos, y talleres en congresos.',
  genres = ARRAY['Salsa','Salsa cubana','Bachata sensual'],
  offers_classes = true,
  class_styles = ARRAY['Salsa','Bachata'],
  class_price = 35,
  is_seed_profile = true
WHERE id = 'ad66e5a6-35dd-4c13-a0de-d20bbaae2370';

UPDATE public.profiles SET
  display_name = 'Marcos Kizomba Valencia',
  role = 'bailarin',
  zone = 'Valencia, España',
  specialty = 'Instructor de kizomba y semba',
  bio = 'Instructor de kizomba y semba formado en Lisboa. Clases particulares y grupales, shows para eventos y socials semanales en Valencia.',
  genres = ARRAY['Kizomba','Zouk'],
  offers_classes = true,
  class_styles = ARRAY['Kizomba'],
  class_price = 30,
  is_seed_profile = true
WHERE id = 'b4431cf8-42ed-43e7-88b3-e4b79e2676fe';

UPDATE public.profiles SET
  display_name = 'Elena Salsa On2',
  role = 'bailarin',
  zone = 'Sevilla, España',
  specialty = 'Bailarina de salsa on2 y son cubano',
  bio = 'Bailarina de salsa on2 (estilo neoyorquino). Disponible para shows y clases particulares. Busco compañero de baile fijo para congresos y socials.',
  genres = ARRAY['Salsa','Salsa en línea'],
  offers_classes = false,
  seeking_dance_partner = true,
  dance_role = 'follow',
  dance_level = 'Avanzado',
  is_seed_profile = true
WHERE id = '4054f6c5-6d30-4cde-9589-033ed3122c0e';

UPDATE public.profiles SET
  display_name = 'Kike Bachata Barcelona',
  role = 'bailarin',
  zone = 'Barcelona, España',
  specialty = 'Bailarín de bachata sensual',
  bio = 'Bailarín de bachata sensual con 6 años de experiencia en congresos. Busco compañera de baile fija para exhibiciones y socials en Barcelona.',
  genres = ARRAY['Bachata','Bachata sensual'],
  offers_classes = false,
  seeking_dance_partner = true,
  dance_role = 'lead',
  dance_level = 'Avanzado',
  is_seed_profile = true
WHERE id = '9bf7c5e7-68fd-472f-843d-5bed981701ae';
