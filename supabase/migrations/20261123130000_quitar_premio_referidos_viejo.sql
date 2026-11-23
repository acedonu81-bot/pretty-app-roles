-- Lanzamiento de cobros (23 nov 2026). El premio viejo por invitar (6 meses de
-- insignia de prioridad al completar el perfil el invitado) lo sustituye el
-- descuento por amigos que pagan (20261118210000_referidos_descuento.sql).
-- El 23 nov había 0 invitaciones del sistema viejo: no se le quita nada a nadie.
DROP TRIGGER IF EXISTS trg_reward_referral ON public.profiles;
