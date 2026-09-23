---
name: audit-rls-supabase
description: Auditar RLS, vistas y permisos de Supabase en XPEAK antes de dar por cerrada una auditoría de seguridad o un cambio en policies/vistas/migraciones. Usar tras tocar cualquier CREATE POLICY, CREATE OR REPLACE VIEW, ALTER TABLE, o al pedir "auditoría de seguridad" / "auditoría RLS" en este proyecto — no solo cuando se pide explícitamente.
---

# Auditoría RLS/Supabase — XPEAK

Este proyecto (`ddrqhwravupjzysriblq`) ha sufrido el mismo tipo de bug de seguridad/datos
varias veces, siempre por revisar el código de la policy pero no su efecto real en `pg_policies`
ni los GRANT resultantes. Antes de decir "auditado" o "arreglado", comprobar los 4 patrones
de abajo contra el estado REAL de la base de datos (vía Supabase MCP o `execute_sql`), nunca
solo leyendo el SQL de la migración.

## 1. RLS "dueño o implicado" que olvida admin

Las policies que permiten ver una fila "si eres el dueño o la otra parte implicada" (reviews,
mensajes, contratos) casi nunca incluyen `OR es_admin()`. Resultado: paneles de admin muestran
0 filas aunque existan datos, en silencio, sin error.

**Comprobar**: `SELECT policyname, qual FROM pg_policies WHERE tablename = '<tabla>'` y verificar
que cualquier policy de SELECT usada también por vistas de admin incluye `es_admin()` en el OR.
Ya ha pasado 3 veces (09, 12, 13 sep 2026).

## 2. Políticas RLS zombie / múltiples caminos de entrada

Un fix de RLS en una tabla no cierra el mismo dato expuesto por otra vía: una vista, una función
`SECURITY DEFINER`, o una policy antigua que quedó activa tras un `CREATE OR REPLACE`.

**Comprobar**: tras cualquier `CREATE OR REPLACE VIEW` o nueva policy, listar TODAS las policies
de la tabla afectada (no solo la que se acaba de tocar) y buscar vistas/funciones que expongan
las mismas columnas por otro camino: `SELECT * FROM pg_views WHERE definition ILIKE '%<tabla>%'`.

## 3. GRANT olvidado tras ALTER TABLE / columna nueva

Una columna nueva en una tabla con grants por columna (no `SELECT *`) no hereda SELECT
automáticamente. Causó un 401 en todo `/p/:id` el 16 sep 2026.

**Comprobar**: tras cualquier `ALTER TABLE ... ADD COLUMN`, revisar
`SELECT grantee, privilege_type FROM information_schema.column_privileges WHERE table_name = '<tabla>'`
y confirmar que la columna nueva tiene los mismos GRANT que el resto.

## 4. Vistas `admin_*` con fuga de emails/PII

Vistas cuyo nombre empieza por `admin_` deben ir detrás de RPC + `es_admin()`, nunca expuestas
directamente vía PostgREST a `anon`/`authenticated`. Ya se cerró una fuga real de 5 vistas (09 sep).

**Comprobar**: `SELECT table_name, grantee FROM information_schema.role_table_grants WHERE table_name ILIKE 'admin_%'`
— `anon` o `authenticated` con acceso directo es la fuga.

## 5. Recursión entre policies de dos tablas

Una policy de la tabla A que hace `EXISTS (SELECT ... FROM B)` mientras la policy de B hace
`EXISTS (SELECT ... FROM A)` provoca `infinite recursion detected in policy` y TODA lectura
autenticada de A falla. Pasó el 23 sep 2026 con `event_requests` ↔ `event_request_responses`:
el panel admin de contratos, las solicitudes del organizador y las ofertas del profesional
quedaron rotos a la vez.

**Comprobar**: si una policy nueva consulta otra tabla, mirar las policies de esa otra tabla.
Si hay ciclo, romperlo con un helper `SECURITY DEFINER` (ej. `contratado_en_solicitud(id)`).
Validar simulando la sesión: `set local role authenticated` + `request.jwt.claims` con un `sub`
real, dentro de `begin; ... rollback;`.

## 6. REVOKE masivo de EXECUTE sobre funciones

Revocar EXECUTE a todas las `SECURITY DEFINER` y re-otorgar solo una lista "auditada" rompe
cualquier RPC que falte en la lista. El 23 sep 2026 la lista se hizo con un grep de
`.rpc('nombre')` y dejó fuera todas las llamadas `(supabase.rpc as any)('nombre')`: cayeron
el escudo de actividad admin, el detalle de contratos, "última contratación", etc.

**Comprobar**: antes de revocar, buscar CADA función por nombre (`grep -rlw nombre src supabase/functions`),
no por patrón de llamada. Después, revisar logs de Postgres buscando `permission denied for function`.
Las funciones usadas dentro de policies (`es_admin`, `has_role`) necesitan EXECUTE también para `anon`
si la policy se evalúa para anon.

## Regla general

No aplicar SQL de seguridad generado por un agente (Codex, subagente, etc.) sin cruzarlo primero
contra `pg_policies` real del proyecto. Un fix que "parece correcto" leyendo el código puede dejar
exactamente el mismo dato expuesto por el camino 2 o 3.
