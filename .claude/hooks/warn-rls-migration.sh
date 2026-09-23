#!/bin/bash
FILE_PATH=$(cat | jq -r '.tool_input.file_path // empty')
[ -z "$FILE_PATH" ] && exit 0
case "$FILE_PATH" in
  */supabase/migrations/*) ;;
  *) exit 0 ;;
esac
if grep -qiE 'create (or replace )?view|alter table|create policy' "$FILE_PATH" 2>/dev/null; then
  echo '{"systemMessage":"Migración SQL con VIEW/ALTER TABLE/POLICY detectada. Antes de cerrar: invocar el skill audit-rls-supabase y cruzar contra pg_policies/information_schema real, no solo leer el SQL."}'
fi
