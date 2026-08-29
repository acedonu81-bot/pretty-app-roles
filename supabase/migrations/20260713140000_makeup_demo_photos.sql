-- ════════════════════════════════════════════════════════════════
-- Sustituye las fotos genéricas de retrato de los 2 perfiles demo
-- de maquillaje/peluquería por fotos de Pexels que muestran el
-- oficio en acción (maquillando / lavando cabello), siguiendo el
-- mismo patrón de URL que el resto de perfiles seed.
-- ════════════════════════════════════════════════════════════════

UPDATE public.profiles SET
  photo_url = 'https://images.pexels.com/photos/3813896/pexels-photo-3813896.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
WHERE id = '76a055b4-ddd2-43a9-b8cd-bb03e4344ccf'; -- Ana Morales

UPDATE public.profiles SET
  photo_url = 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
WHERE id = '72d19730-ec69-4059-b14b-51617293dac7'; -- Lucía Peña
