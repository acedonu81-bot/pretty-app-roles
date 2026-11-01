-- Perfil de DJ tipo Hearthis, fase 2 (1 nov 2026): comentarios en el segundo
-- exacto del set y forma de onda real de los archivos subidos a XPEAK.
-- Primero archivos de XPEAK y SoundCloud (21 de 26 sets); Mixcloud y hearthis
-- después si sus reproductores dejan leer el segundo.

-- ── Comentarios ──────────────────────────────────────────────────────────
create table public.set_comentarios (
  id uuid primary key default gen_random_uuid(),
  set_url text not null check (char_length(set_url) <= 1000),
  -- Dueño del set (el DJ): quien recibe el aviso y puede borrar o silenciar.
  dj_user_id uuid not null references auth.users(id) on delete cascade,
  autor_id uuid not null references auth.users(id) on delete cascade,
  segundo integer not null check (segundo between 0 and 21600),
  texto text not null check (char_length(btrim(texto)) between 1 and 280),
  created_at timestamptz not null default now()
);

create index set_comentarios_set_idx on public.set_comentarios (dj_user_id, set_url, segundo);
create index set_comentarios_autor_idx on public.set_comentarios (autor_id, created_at desc);

-- El DJ silencia a alguien en todos sus sets: no puede volver a comentarle.
create table public.set_silenciados (
  dj_user_id uuid not null references auth.users(id) on delete cascade,
  autor_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (dj_user_id, autor_id)
);

-- ¿Es esta URL una sesión publicada de ese DJ? Security definer para que no
-- dependa de si quien comenta puede leer ese perfil por RLS.
create or replace function public.set_es_del_dj(p_dj uuid, p_url text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = p_dj and p_url = any (p.audio_session_urls)
  );
$$;

revoke all on function public.set_es_del_dj(uuid, text) from public;
grant execute on function public.set_es_del_dj(uuid, text) to authenticated;

-- Quien comenta no puede leer los silenciados del DJ (RLS): sin security
-- definer la comprobación vería la tabla vacía y dejaría pasar a todos.
create or replace function public.set_silenciado(p_dj uuid, p_autor uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.set_silenciados s where s.dj_user_id = p_dj and s.autor_id = p_autor
  );
$$;

revoke all on function public.set_silenciado(uuid, uuid) from public;
grant execute on function public.set_silenciado(uuid, uuid) to authenticated;

alter table public.set_comentarios enable row level security;
alter table public.set_silenciados enable row level security;

create policy "Comentarios de sets visibles para todos"
  on public.set_comentarios for select
  to anon, authenticated
  using (true);

-- Solo en sets que de verdad son de ese DJ, nunca en los propios (el DJ no
-- se comenta a sí mismo para inflar) y nunca si el DJ le ha silenciado.
create policy "Comentar sets de otros"
  on public.set_comentarios for insert
  to authenticated
  with check (
    (select auth.uid()) = autor_id
    and autor_id <> dj_user_id
    and public.set_es_del_dj(dj_user_id, set_url)
    and not public.set_silenciado(dj_user_id, autor_id)
  );

create policy "Borra el autor o el DJ"
  on public.set_comentarios for delete
  to authenticated
  using ((select auth.uid()) in (autor_id, dj_user_id));

create policy "El DJ ve a quién ha silenciado"
  on public.set_silenciados for select
  to authenticated
  using ((select auth.uid()) = dj_user_id);

create policy "El DJ silencia"
  on public.set_silenciados for insert
  to authenticated
  with check ((select auth.uid()) = dj_user_id and autor_id <> dj_user_id);

create policy "El DJ quita el silencio"
  on public.set_silenciados for delete
  to authenticated
  using ((select auth.uid()) = dj_user_id);

grant select on public.set_comentarios to anon, authenticated;
grant insert, delete on public.set_comentarios to authenticated;
grant select, insert, delete on public.set_silenciados to authenticated;

-- Freno contra ráfagas: 1 comentario cada 10 s y 30 al día por persona.
create or replace function public.set_comentarios_freno()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.set_comentarios
    where autor_id = new.autor_id and created_at > now() - interval '10 seconds'
  ) then
    raise exception 'Espera unos segundos antes de volver a comentar' using errcode = 'P0001';
  end if;
  if (select count(*) from public.set_comentarios
      where autor_id = new.autor_id and created_at > now() - interval '1 day') >= 30 then
    raise exception 'Has llegado al máximo de comentarios de hoy' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger set_comentarios_freno
  before insert on public.set_comentarios
  for each row execute function public.set_comentarios_freno();

-- Aviso al DJ en la campana de notificaciones del panel.
create or replace function public.set_comentarios_avisar_dj()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nombre text;
  v_texto text := new.texto;
  v_min text := (new.segundo / 60)::text || ':' || lpad((new.segundo % 60)::text, 2, '0');
begin
  -- Los empresarios no tienen exposición pública: su nombre no sale ni en el aviso.
  select case when p.role = 'empresario' then null else p.display_name end
    into v_nombre
    from public.profiles p where p.user_id = new.autor_id
    order by p.created_at limit 1;
  if length(v_texto) > 80 then v_texto := left(v_texto, 80) || '…'; end if;
  insert into public.notifications (user_id, type, title, body, link)
  values (new.dj_user_id, 'comentario_set',
    coalesce(v_nombre, 'Alguien') || ' ha comentado tu set en el ' || v_min,
    -- /p/<user_id> redirige al perfil público del DJ, donde está el set comentado.
    v_texto, '/p/' || new.dj_user_id::text);
  return new;
end;
$$;

create trigger set_comentarios_avisar_dj
  after insert on public.set_comentarios
  for each row execute function public.set_comentarios_avisar_dj();

revoke all on function public.set_comentarios_freno() from public, anon, authenticated;
revoke all on function public.set_comentarios_avisar_dj() from public, anon, authenticated;

-- ── Forma de onda ────────────────────────────────────────────────────────
-- Picos (0-100) ya calculados del archivo, para pintar la onda sin descargar
-- ni decodificar el audio en cada visita. Se calculan al subir el archivo.
create table public.set_ondas (
  set_url text primary key check (char_length(set_url) <= 1000),
  user_id uuid not null references auth.users(id) on delete cascade,
  duracion integer not null check (duracion between 1 and 21600),
  picos smallint[] not null check (cardinality(picos) between 20 and 600),
  created_at timestamptz not null default now()
);

alter table public.set_ondas enable row level security;

create policy "Ondas visibles para todos"
  on public.set_ondas for select
  to anon, authenticated
  using (true);

create policy "El DJ guarda la onda de sus archivos"
  on public.set_ondas for insert
  to authenticated
  -- Solo archivos de su propia carpeta: nadie puede "reservar" la onda de un archivo ajeno.
  with check ((select auth.uid()) = user_id and set_url like 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/public/audio-sessions/' || (select auth.uid())::text || '/%');

create policy "El DJ actualiza la onda de sus archivos"
  on public.set_ondas for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id and set_url like 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/public/audio-sessions/' || (select auth.uid())::text || '/%');

create policy "El DJ borra la onda de sus archivos"
  on public.set_ondas for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select on public.set_ondas to anon, authenticated;
grant insert, update, delete on public.set_ondas to authenticated;
