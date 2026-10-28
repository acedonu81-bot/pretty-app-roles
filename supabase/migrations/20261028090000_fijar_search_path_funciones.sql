-- Aviso de seguridad de Supabase "function_search_path_mutable" (28 oct 2026).
-- Sin search_path fijo, una función resuelve los nombres según el search_path
-- de quien la llama, y alguien podría colarle un objeto con el mismo nombre en
-- otro esquema. Ninguna de estas cinco es SECURITY DEFINER, así que el riesgo
-- es bajo; se fija igualmente para dejar el informe limpio.
-- Son validaciones de texto y fechas sin dependencias de otras tablas:
-- public, pg_catalog y extensions cubren lo que usan.

alter function public.solicitud_texto_basura(text) set search_path = public, extensions, pg_catalog;
alter function public.solicitud_fecha_valida(text) set search_path = public, extensions, pg_catalog;
alter function public.solicitud_contacto_valido(text) set search_path = public, extensions, pg_catalog;
alter function public.fecha_legible(text) set search_path = public, extensions, pg_catalog;
alter function private.extraer_timestamp_storage(text) set search_path = public, extensions, pg_catalog;
