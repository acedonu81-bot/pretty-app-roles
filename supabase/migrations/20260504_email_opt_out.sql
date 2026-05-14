-- Email opt-out preference (RGPD compliance)
alter table public.profiles
  add column if not exists email_opt_out boolean not null default false;

comment on column public.profiles.email_opt_out is
  'User has unsubscribed from XPEAK emails. Transactional emails (password reset) still allowed.';
