-- analytics_por_hora_hoy() quedó ejecutable por anon/authenticated al
-- crearla (igual que analytics_por_hora): la función interna debe llamarse
-- solo a través de panel_analytics_hora_hoy(), que sí comprueba es_admin().
-- Sin este REVOKE, cualquiera sin sesión podía saltarse el check de admin
-- llamando a la interna directamente.
REVOKE EXECUTE ON FUNCTION public.analytics_por_hora_hoy() FROM PUBLIC, anon, authenticated;
