-- The hardened RPC allowlist revoked this SECURITY DEFINER function even
-- though the public landing page uses it for anonymized, recent event roles
-- and dates. Restore only this reviewed, read-only function for client roles.
REVOKE EXECUTE ON FUNCTION public.bolos_recientes_publico() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bolos_recientes_publico() TO anon, authenticated;
