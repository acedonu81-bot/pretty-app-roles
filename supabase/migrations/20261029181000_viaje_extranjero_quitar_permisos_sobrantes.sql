-- Los default privileges de Supabase dieron TRUNCATE/DELETE/REFERENCES/TRIGGER
-- a authenticated al crear viaje_extranjero. TRUNCATE se salta RLS, así que
-- cualquier usuario con sesión podía vaciar la tabla. Se deja solo lo que usa
-- la app (select/insert/update).
revoke truncate, delete, references, trigger on public.viaje_extranjero from authenticated;
