-- ════════════════════════════════════════════════════════════════
-- Corrección v2: el primer intento usó por error el user_id de Yara
-- como si fuera el id de la fila de profiles (son columnas distintas),
-- así que su UPDATE no coincidió con ninguna fila. Aquí se usan los
-- id reales verificados vía API. Marcos/Elena/Kike ya quedaron bien
-- en el intento anterior salvo seeking_dance_partner/dance_role/
-- dance_level, que también se completan aquí.
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
WHERE id = 'dc52a1e1-16e3-47b0-8ad4-46eb6346c922';

UPDATE public.profiles SET
  seeking_dance_partner = true,
  dance_role = 'follow',
  dance_level = 'Avanzado',
  zone = 'Sevilla, España',
  is_seed_profile = true
WHERE id = 'af973a46-514d-498f-8e2b-121c5653ffc2';

UPDATE public.profiles SET
  seeking_dance_partner = true,
  dance_role = 'lead',
  dance_level = 'Avanzado',
  zone = 'Barcelona, España',
  specialty = 'Bailarín de bachata sensual',
  bio = 'Bailarín de bachata sensual con 6 años de experiencia en congresos. Busco compañera de baile fija para exhibiciones y socials en Barcelona.',
  genres = ARRAY['Bachata','Bachata sensual'],
  is_seed_profile = true
WHERE id = '9693c2e4-7d39-41a4-abcb-5ff4f4481b00';
