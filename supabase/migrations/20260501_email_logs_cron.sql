-- email_logs: tracks sent automated emails to avoid duplicates
create table if not exists email_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  type       text not null,
  sent_at    timestamptz not null default now()
);

create index if not exists email_logs_user_type on email_logs (user_id, type);

-- RLS: only service role can access
alter table email_logs enable row level security;
create policy "service role only" on email_logs using (false);

-- pg_cron: run anniversary-emails every day at 10:00 UTC
-- Requires pg_cron extension enabled in Supabase Dashboard > Database > Extensions
select cron.schedule(
  'xpeak-anniversary-emails',
  '0 10 * * *',
  $$
    select net.http_post(
      url    := current_setting('app.supabase_url') || '/functions/v1/anniversary-emails',
      headers := '{"Authorization":"Bearer ' || current_setting('app.service_role_key') || '","Content-Type":"application/json"}'::jsonb,
      body   := '{}'::jsonb
    );
  $$
);
