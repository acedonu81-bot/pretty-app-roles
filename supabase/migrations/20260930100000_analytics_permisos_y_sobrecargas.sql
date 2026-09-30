-- 1) Las migraciones del 28-29 sep recrearon funciones de analítica y
--    volvieron al EXECUTE a PUBLIC por defecto, deshaciendo el endurecimiento
--    del 23 sep (20260923110406): cualquier visitante sin sesión podía llamar
--    a analytics_usuarios_unicos por /rest/v1/rpc (verificado 30 sep: devolvía
--    el número de usuarios únicos). Las analytics_* en bruto no se exponen; las
--    panel_* solo a authenticated (y dentro exigen admin: "Solo admin").
--
-- 2) 20260929090000 añadió p_desde_medianoche con CREATE OR REPLACE, que con
--    otra firma CREA una segunda función: quedaron dos versiones con DEFAULT
--    y cualquier llamada con solo p_dias falla con "is not unique". Nada usa
--    ya la de un parámetro (AdminAnalytics pasa los dos): se eliminan.

DROP FUNCTION IF EXISTS public.panel_analytics_usuarios_unicos(integer);
DROP FUNCTION IF EXISTS public.analytics_usuarios_unicos(integer);

REVOKE ALL ON FUNCTION public.analytics_usuarios_unicos(integer, boolean) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.analytics_quien_online() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.analytics_online_ahora() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.panel_analytics_usuarios_unicos(integer, boolean) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.panel_analytics_quien_online() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.panel_analytics_usuarios_unicos(integer, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.panel_analytics_quien_online() TO authenticated;
