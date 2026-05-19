# Auth Conversion Redesign — Mayo 2026

## Objetivo
Aumentar la tasa de conversión de visitantes a registrados. Target primario: profesionales buscando trabajo (DJs, camareros, fotógrafos, staff).

Problema actual: formulario de 3 pasos con fricción alta + tono visual de discoteca que no conecta con el tráfico real (bodas y eventos).

---

## Decisiones de diseño

### 1. Estructura: un solo paso

El formulario de registro colapsa a una única pantalla:

```
[ Logo XPEAK ]
[ Tagline: "Publica tu perfil. Consigue trabajo en eventos." ]

[ 3 micro-bullets ]
  ✓ Gratis · sin comisiones
  ✓ Flash Booking — trabajos en menos de 1h
  ✓ Visible en toda España

[ Botón Google Sign-In — primario, ancho completo ]
─── o ───
[ Email ]
[ Contraseña + show/hide ]
[ Checkbox legal compacto — una sola línea ]
[ CTA: "Crear cuenta gratis" ]

[ Toggle login/registro ]
[ ¿Olvidaste tu contraseña? ]
```

Login mantiene la misma estructura simplificada (Google + email/pass).

### 2. Datos que se mueven al dashboard

Role, ciudad y tarifa se recogen en el onboarding post-registro, no en el formulario. Razón: el usuario no tiene confianza suficiente para dar esos datos antes de ver el producto.

### 3. Legal (LOPDGDD — obligatorio)

Los dos checkboxes se mantienen separados (LOPDGDD exige consentimientos independientes) pero se presentan más compactos: sin espacio entre ellos, texto en `text-[0.65rem]`, eliminando el padding extra actual.

```
☐  Tengo 14 años o más (LOPDGDD Art. 7)
☐  Acepto Privacidad · Términos · Cookies
```

Dos estados booleanos, mismo valor legal, menor espacio visual.

### 4. Paleta visual — solo /auth en esta iteración

| Token | Valor actual | Valor nuevo |
|-------|-------------|-------------|
| Fondo página | `#060606` (negro frío) | `#141210` (gris cálido matte) |
| Fondo card | glass-panel (translúcido sobre negro) | `#1E1C1A` sólido con border sutil |
| Dorado | `#D4AF37` | `#D4AF37` (sin cambios) |
| Texto secundario | `rgba(255,255,255,0.45)` | `rgba(255,255,255,0.45)` (sin cambios) |

`AmbientBackground` (orbes flotantes + olas SVG animadas) se elimina del /auth. Reemplazado por un único orbe estático centrado, sin animación, muy baja opacidad:

```css
background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 65%);
filter: blur(80px);
width: 500px; height: 500px;
```

### 5. Copy

| Elemento | Antes | Después |
|----------|-------|---------|
| Subtítulo bajo logo | "Directorio Profesional · España" | "Publica tu perfil. Consigue trabajo en eventos." |
| CTA registro | "Continuar" (paso 1 de 3) | "Crear cuenta gratis" |
| CTA Google registro | "Registrarse con Google" | "Continuar con Google" |
| Meta title | sin cambios | sin cambios |

---

## Componente nuevo: DashboardOnboarding

Banner persistente en `/dashboard` para usuarios con perfil incompleto.

**Trigger:** `profile.role === null || profile.city === null`

**UI:**
```
┌─────────────────────────────────────────────────────────────┐
│ ⚠ Tu perfil está incompleto — no apareces en búsquedas aún  │
│ [Completar perfil →]                              [✕ ahora no] │
└─────────────────────────────────────────────────────────────┘
```

Al hacer click en "Completar perfil", abre un modal con 3 campos:
1. ¿Cuál es tu rol? (grid de roles, igual que el paso 2 actual)
2. ¿En qué ciudad trabajas? (selector)
3. Tarifa por hora (número, opcional para empresarios)

Botón final: "Guardar y publicar perfil" → hace PATCH a Supabase profiles, cierra el modal, oculta el banner.

El banner NO es un bloqueo. El usuario puede usar el dashboard sin completarlo.

---

## Archivos afectados

- `src/pages/Auth.tsx` — reescritura del JSX (lógica Supabase intacta)
- `src/components/AmbientBackground.tsx` — no se toca, simplemente no se importa en Auth
- `src/components/DashboardOnboarding.tsx` — componente nuevo
- `src/pages/Dashboard.tsx` — añadir `<DashboardOnboarding />` al layout

## Archivos NO afectados

- Lógica de autenticación Supabase (handleSubmit, handleGoogleSignIn, rate limiting, validaciones)
- Landing.tsx, BodasLanding.tsx, PresupuestoBoda.tsx
- Paleta global (tailwind.config, variables CSS) — solo sobreescritura inline en Auth.tsx

---

## Criterio de éxito

- Tiempo medio hasta primer click en CTA baja (medible via Vercel Analytics)
- Ratio visitas /auth → /dashboard sube por encima del actual (estimado <5%)
- Perfil completion rate en dashboard onboarding >40% en primeras 2 semanas
