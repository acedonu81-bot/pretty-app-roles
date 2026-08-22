-- Fixes de auditoría de seguridad extensiva (18 ago 2026)

-- 1. Log genérico de uso por IP para rate-limiting de edge functions
-- públicas sin sesión — reutilizable por chat-ai (coste directo de API
-- Anthropic) y send-email (spam a terceros), ambas invocables por
-- cualquiera con el anon key público (visible en cualquier bundle JS),
-- sin freno alguno hasta ahora.
create table if not exists public.edge_function_rate_limit_log (
  id bigint generated always as identity primary key,
  endpoint text not null,
  client_ip text not null,
  created_at timestamptz not null default now()
);

create index if not exists edge_function_rate_limit_log_idx
  on public.edge_function_rate_limit_log(endpoint, client_ip, created_at desc);

alter table public.edge_function_rate_limit_log enable row level security;

-- Solo las propias edge functions (service role) acceden a esta tabla.
create policy "edge_function_rate_limit_log_no_direct_access" on public.edge_function_rate_limit_log
  for all using (false) with check (false);

-- Housekeeping: sin esto la tabla crece sin límite. Barato con el índice
-- ya existente, se ejecuta como efecto colateral de cada insert nuevo.
create or replace function public.cleanup_edge_function_rate_limit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.edge_function_rate_limit_log where created_at < now() - interval '1 day';
  return new;
end;
$$;

drop trigger if exists edge_function_rate_limit_log_cleanup on public.edge_function_rate_limit_log;
create trigger edge_function_rate_limit_log_cleanup
  after insert on public.edge_function_rate_limit_log
  for each statement
  execute function public.cleanup_edge_function_rate_limit_log();

-- 2. Rate-limit en profile_business_views — la política de INSERT abierta a
-- anon+authenticated (añadida hoy para que el contador de vistas del perfil
-- público cuente cualquier visita real) permite floodear el contador de
-- cualquier perfil, ya que el user_id es público (visible en cada URL /p/).
-- Límite por viewed_user_id + ventana corta — no evita todo abuso pero sí
-- un flood trivial, mismo espíritu que enforce_flash_booking_rate_limit.
create or replace function public.enforce_profile_view_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count int;
begin
  select count(*) into recent_count
  from public.profile_business_views
  where viewed_user_id = new.viewed_user_id
    and created_at > now() - interval '1 minute';

  if recent_count >= 20 then
    raise exception 'rate_limit_exceeded: demasiadas vistas registradas para este perfil, espera un momento'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists profile_business_views_rate_limit on public.profile_business_views;
create trigger profile_business_views_rate_limit
  before insert on public.profile_business_views
  for each row
  execute function public.enforce_profile_view_rate_limit();

-- 3. Política RLS de messages UPDATE demasiado permisiva — "Participants
-- can update own messages" permitía a CUALQUIERA de los dos participantes
-- modificar cualquier campo (incluido content) de mensajes ajenos, no solo
-- marcar como leído. El código actual solo hace update({read:true}), pero
-- la política en sí lo permitía vía API directa (Postman/curl con JWT
-- propio). Ya existen dos políticas más estrictas que cubren los casos de
-- uso reales sin este hueco: "Receiver can mark as read" (cualquier
-- participante, sin with_check porque solo se usa para el campo read) y
-- "Sender can soft-delete own message" (sender_id = auth.uid()). Basta con
-- eliminar la permisiva — Postgres evalúa políticas del mismo cmd con OR,
-- así que dejarla activa anulaba la protección de las otras dos.
drop policy if exists "Participants can update own messages" on public.messages;
