-- Advisor de seguridad (11 sep 2026): la vista admin_active_flash_jobs es
-- SECURITY DEFINER (se ejecuta con permisos del creador, ignorando las RLS
-- de flash_jobs/profiles) y encima tenía SELECT abierto a `authenticated`.
-- Cualquier usuario logueado podía consultarla directamente por la API REST,
-- sin pasar por el WHERE es_admin() de la propia vista si es_admin() fallase
-- o cambiara — mismo patrón de fuga ya cerrado en otras 5 vistas el 9 sep
-- 2026 (fuga_admin_views). El panel admin no la usa: AdminBusinesses.tsx
-- consulta flash_jobs directamente, así que quitar el permiso no rompe nada.
revoke select on public.admin_active_flash_jobs from authenticated;
