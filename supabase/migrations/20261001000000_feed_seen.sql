-- Aviso de "algo nuevo en tu feed" — mismo patrón que admin_activity_seen:
-- corte temporal por usuario en vez de un contador total de pendientes.
create table public.feed_seen (
  user_id uuid primary key references auth.users(id) on delete cascade,
  seen_at timestamptz not null default now()
);

alter table public.feed_seen enable row level security;

create policy "Users manage own feed_seen"
  on public.feed_seen for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Cuenta profile_posts nuevos (desde el último "visto") de profesionales a
-- los que el usuario sigue. No cuenta fotos de portfolio como "nuevo": no
-- tienen fecha real de subida individual (se usa profiles.updated_at como
-- aproximación en el feed, poco fiable para decidir un aviso).
create or replace function public.feed_nuevos()
returns integer
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_desde timestamptz;
  v_n integer;
begin
  select seen_at into v_desde from public.feed_seen where user_id = auth.uid();

  if v_desde is null then
    v_desde := now() - interval '7 days';
    insert into public.feed_seen (user_id, seen_at)
    values (auth.uid(), v_desde)
    on conflict (user_id) do nothing;
  end if;

  select count(*) into v_n
  from public.profile_posts pp
  join public.follows f on f.followed_user_id = pp.user_id
  where f.follower_id = auth.uid() and pp.created_at > v_desde;

  return coalesce(v_n, 0);
end;
$$;

create or replace function public.feed_marcar_visto()
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  insert into public.feed_seen (user_id, seen_at)
  values (auth.uid(), now())
  on conflict (user_id) do update set seen_at = now();
end;
$$;

revoke execute on function public.feed_nuevos() from public, anon;
revoke execute on function public.feed_marcar_visto() from public, anon;
grant execute on function public.feed_nuevos() to authenticated;
grant execute on function public.feed_marcar_visto() to authenticated;
