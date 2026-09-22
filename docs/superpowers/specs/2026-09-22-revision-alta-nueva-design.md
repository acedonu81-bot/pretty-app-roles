# Revisión de altas nuevas con gate de visibilidad

## Contexto

Hoy `profiles.validation_status` existe (`pending`/`approved`/`rejected`/`awaiting_admin`/`rookie`)
pero no bloquea nada: un perfil `pending` ya es visible en el directorio público,
búsqueda y ficha pública igual que uno `approved`. El panel admin solo lo usa
para atenuar visualmente las filas `rejected` en `AdminUserManagement`.

El aviso verde de "alta nueva" (`AdminNewProfileAlert`) es un mecanismo
paralelo basado en `admin_seen_at`, sin relación con `validation_status`, que
solo muestra datos resumidos (nombre, rol, zona) sin la ficha completa.

Diagnóstico del icono verde persistente reportado: en base de datos,
`admin_seen_at` está limpio (0 filas NULL) — el "marcar como visto" ya
funciona en el backend. Lo que se reporta como bug es, con alta probabilidad,
una build cacheada (navegador o CDN) sirviendo el estado anterior. No requiere
cambio de código; se confirma con hard-refresh antes de investigar más.

## Objetivo

Un alta nueva queda **oculta al público** hasta que un admin la revisa desde
el panel, ve la ficha pública real (no un resumen de datos) y da el visto
bueno. Al aprobar, pasa a visible. Al rechazar, queda oculta con motivo.

## Cambios

### 1. Gate de visibilidad — RLS en `profiles`

Las dos policies de SELECT actuales son totalmente abiertas:
- `Anon can view basic profiles` (rol `anon`, `qual: true`)
- `Authenticated users can view profiles` (rol `authenticated`, `qual: true`)

Se sustituyen por una condición que exige `validation_status = 'approved'`,
salvo para el propio dueño de la fila o un admin:

```sql
USING (
  validation_status = 'approved'
  OR user_id = (select auth.uid())
  OR has_role((select auth.uid()), 'admin')
)
```

Efecto: sin tocar ninguno de los ~15 componentes de frontend que leen
`profiles` (directorio, ficha pública, búsqueda, landings), Postgres deja de
devolver filas no aprobadas a nadie que no sea el dueño o un admin. Esto
también hace que el admin, autenticado, SÍ pueda abrir `/p/{user_id}` de un
perfil `pending` para revisarlo.

### 2. Migración de datos de los 34 `pending` existentes

Se marcan `approved` en la misma migración — llevan tiempo visibles sin que
nadie los haya revisado nunca; el gate nuevo aplica solo hacia adelante, a
altas futuras. No se tocan los `rejected` ni `awaiting_admin`/`rookie`
existentes.

### 3. Panel admin — flujo de revisión con ficha completa

Se extiende `AdminNewProfileAlert.tsx` (o un nuevo componente hermano en la
misma carpeta `admin/`, según cómo quede de claro al escribirlo) para que la
fuente de la lista sea `validation_status = 'pending'` en vez de
`admin_seen_at IS NULL` — es el estado que ahora sí importa.

Cada fila del aviso obtiene:
- Botón **"Ver ficha completa →"**: abre `/p/{user_id}` en pestaña nueva.
  Reutiliza el componente `PublicProfile` real (que ya acepta un UUID como
  slug) en vez de construir una vista resumida paralela — el admin ve
  exactamente lo que verá un empresario.
- Botón **Aprobar**: `UPDATE profiles SET validation_status = 'approved'`.
  Dispara email al profesional reutilizando la plantilla `perfil_visible_disculpa`
  (ya dice "hemos terminado de validar tu ficha y está publicada").
- Botón **Rechazar**: abre un campo de motivo (texto libre), hace
  `UPDATE profiles SET validation_status = 'rejected'` y dispara `admin_rejected`
  (plantilla ya existente) con el motivo.

El "Marcar como visto" actual (`admin_seen_at`) se mantiene tal cual para no
romper el otro consumo de esa columna (`AdminActivity`, vistas SQL que
reportan `pendiente`), pero deja de ser el gate — pasa a ser solo lo que ya
es: un tracking de "lo vi" independiente de si se aprobó.

### 4. Email de bienvenida al registrarse

La plantilla `welcome` dice hoy "tu perfil ya está activo en XPEAK", lo cual
pasa a ser falso mientras está `pending`. Se cambia el texto para avisar que
el perfil está en revisión por política de verificación, y que se publicará
en el directorio en cuanto se apruebe (en vez de invitar a "completar tu
perfil" como paso siguiente inmediato).

No se toca `profesional_registered` (el aviso al admin) más allá de lo que ya
dice — ya incluye el link al panel admin.

## Fuera de alcance

- No se cambia el significado de `rejected`, `awaiting_admin` ni `rookie`.
- No se añade un estado nuevo — se reutiliza `pending`/`approved`/`rejected`
  ya existentes en la columna.
- No se toca la lógica de `is_verified` (Sello Dorado) ni `is_early_adopter`,
  que son mecanismos de reputación distintos y posteriores a la aprobación.
