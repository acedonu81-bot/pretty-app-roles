-- La política "Receiver can mark as read" (UPDATE) no tiene with_check,
-- así que solo restringe QUIÉN puede hacer el UPDATE (cualquier
-- participante de la conversación), no QUÉ columnas puede tocar. Postgres
-- combina las políticas UPDATE del mismo comando con OR junto a "Sender
-- can soft-delete own message" (que sí exige sender_id = auth.uid()), así
-- que en la práctica cualquier participante — no solo el emisor — puede
-- ejecutar deleteMessage() (update({deleted_at: ...})) sobre un mensaje
-- ajeno vía API directa, aunque la UI del frontend no lo permita.
-- RLS por sí sola no puede restringir QUÉ COLUMNAS toca un UPDATE (solo
-- qué filas), así que se usa un trigger BEFORE UPDATE que valida: el
-- receptor (no emisor) solo puede tocar `read`, nunca `deleted_at`/`content`.
create or replace function public.enforce_message_update_scope()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- El propio emisor puede tocar lo que la política "Sender can soft-delete
  -- own message" ya permite (deleted_at) — este trigger no le añade límites.
  if old.sender_id = auth.uid() then
    return new;
  end if;

  -- Cualquier otro participante (el receptor) solo puede cambiar `read`.
  -- Si intenta tocar content o deleted_at, se bloquea.
  if new.content is distinct from old.content
    or new.deleted_at is distinct from old.deleted_at
    or new.sender_id is distinct from old.sender_id
    or new.conversation_id is distinct from old.conversation_id then
    raise exception 'not_allowed: el receptor solo puede marcar el mensaje como leído'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists messages_update_scope on public.messages;
create trigger messages_update_scope
  before update on public.messages
  for each row
  execute function public.enforce_message_update_scope();
