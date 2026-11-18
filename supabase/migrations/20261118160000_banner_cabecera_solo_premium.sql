-- Banner de la cabecera de artista del DJ: solo Premium (18 nov 2026, decisión de Daniel).
-- Sustituye al "vídeo de fondo" que figuraba en el plan Premium y que no existe.
-- - Poner o cambiar el banner: solo con Premium (o antes del lanzamiento).
-- - Verlo en la ficha pública: solo si su dueño tiene Premium (o antes del lanzamiento).
--   Al bajar de plan no se borra: se oculta y vuelve al subir.
-- - El dueño siempre ve y puede quitar el suyo.
-- Fundadores: como Profesional, es decir, sin banner (los 8 DJ con banner lo conservan
-- guardado pero oculto, igual que con cualquier perfil de Esencial o Profesional).

CREATE OR REPLACE FUNCTION public.banner_permitido(p_user uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT coalesce(
    (SELECT public.plan_para_limites(p.id, p.subscription_tier) IN ('business', 'pre')
       FROM public.profiles p
      WHERE p.user_id = p_user
      ORDER BY p.is_primary DESC, p.created_at
      LIMIT 1),
    false);
$$;
REVOKE ALL ON FUNCTION public.banner_permitido(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.banner_permitido(uuid) TO anon, authenticated;

DROP POLICY IF EXISTS "Banners visibles para todos" ON public.dj_banners;
CREATE POLICY "Banners visibles si el dueño tiene Premium"
  ON public.dj_banners FOR SELECT TO anon, authenticated
  USING (public.banner_permitido(user_id) OR (SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "El DJ pone su banner" ON public.dj_banners;
CREATE POLICY "El DJ Premium pone su banner"
  ON public.dj_banners FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id AND public.banner_permitido(user_id));

DROP POLICY IF EXISTS "El DJ cambia su banner" ON public.dj_banners;
CREATE POLICY "El DJ Premium cambia su banner"
  ON public.dj_banners FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id AND public.banner_permitido(user_id));
-- "El DJ quita su banner" (DELETE) se queda como está: quitarlo siempre se puede.
