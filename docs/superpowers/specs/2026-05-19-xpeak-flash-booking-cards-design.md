# XPEAK Flash Booking Portrait Cards — Design Spec

> **For agentic workers:** Use superpowers:writing-plans to create the implementation plan from this spec.

**Goal:** Redesign the `OfertaTab.tsx` card grid from compact horizontal cards to animated portrait photo cards with Framer Motion stagger entrance, maintaining the same visual language as the HyperFrames video compositions. A single file change — no new dependencies.

**Proyecto activo:** `/Users/danielacedonunez/pretty-app-roles`

---

## 1. Arquitectura

### Archivos afectados

```
src/
  components/
    dashboard/
      views/
        flashbooking/
          OfertaTab.tsx    ← único archivo modificado
```

### Lo que NO cambia

- Lógica de fetch Supabase (`profiles` where `is_flash_active = true`)
- Canal realtime `flash_profiles_realtime` (Supabase `postgres_changes`)
- Toggle de disponibilidad para profesionales (arriba del grid)
- Banner informativo para empresarios
- `FlashBookingRequestModal` y `selectedPro` state
- Lógica de precios visibles solo para empresarios
- `useProfile` hook y check `isEmpresario`

### Dependencias

Framer Motion ya instalada: `"framer-motion": "^12.38.0"` — sin nuevas deps.

---

## 2. Diseño del card

### Anatomía visual

```
┌──────────────────────────┐
│                          │  ← foto full-bleed (object-cover, w-full h-full)
│                          │     filter: saturate(0.75) brightness(0.85)
│  [XPEAK] ●               │  ← badge + punto pulsante esquina superior
│                          │
│  ░░░░░░░░ gradient ░░░░  │  ← overlay transp→negro
│  DJ & ARTISTAS           │  ← role, Syne 700, 13px, #D4AF37
│  Alejandro M.            │  ← name, Inter 600, 15px, rgba(255,255,255,0.95)
│  📍 Madrid  · Ahora      │  ← zone + clock, Inter 400, 11px, muted
│  ─────────────────────── │
│  €120/h    [⚡ Solicitar] │  ← precio + CTA dorado
└──────────────────────────┘
```

### CSS del card

```css
aspect-ratio: 3 / 4;
border-radius: 16px;
border: 1px solid rgba(212,175,55,0.25);
box-shadow: 0 24px 56px rgba(0,0,0,0.70);
overflow: hidden;
position: relative;
cursor: pointer;
```

Hover state (via `whileHover` Framer Motion):
```css
scale: 1.02;
border-color: rgba(212,175,55,0.50);
transition: 200ms ease;
```

### Overlay

```css
background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.50) 45%, transparent 70%);
position: absolute; inset: 0;
```

### Foto

```tsx
<img
  src={p.photo || '/placeholder-pro.jpg'}
  alt={p.name}
  className="w-full h-full object-cover absolute inset-0"
  style={{ filter: 'saturate(0.75) brightness(0.85)' }}
/>
```

Si no hay foto: fondo `linear-gradient(135deg, #D4AF37, #B8941E)` con inicial del nombre centrada.

### Badge XPEAK + punto pulsante

```tsx
<div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 10, color: '#D4AF37', letterSpacing: '0.15em' }}>
    XPEAK
  </span>
  <motion.span
    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4AF37',
             boxShadow: '0 0 6px rgba(212,175,55,0.8)', display: 'inline-block' }}
  />
</div>
```

Sin CSS global — la animación del punto usa Framer Motion para que el componente sea self-contained.

### Footer del card

```tsx
<div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
  {/* role */}
  <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: '#D4AF37',
               letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
    {p.role}
  </p>
  {/* name */}
  <p style={{ fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.95)', marginBottom: 6 }}>
    {p.name}
  </p>
  {/* zone + clock */}
  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'rgba(255,255,255,0.50)', marginBottom: 12 }}>
    <span>📍 {p.zone}</span>
    <span>· Ahora</span>
  </div>
  {/* divider */}
  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    {/* price */}
    <span style={{ fontWeight: 700, fontSize: 14, color: '#D4AF37' }}>
      {isEmpresario
        ? (p.price > 0 ? `€${p.price}${p.priceUnit}` : 'A consultar')
        : <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>Tarifa privada</span>}
    </span>
    {/* CTA */}
    {isEmpresario ? (
      <button onClick={() => setSelectedPro(p)}
        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px',
                 borderRadius: 8, fontWeight: 700, fontSize: 12,
                 background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000',
                 border: 'none', cursor: 'pointer' }}>
        <Zap size={11} /> Solicitar
      </button>
    ) : (
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 500,
                     padding: '4px 10px', borderRadius: 6,
                     background: 'rgba(255,255,255,0.04)',
                     border: '1px solid rgba(255,255,255,0.08)' }}>
        Solo empresarios
      </span>
    )}
  </div>
</div>
```

---

## 3. Grid responsive

```tsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="show"
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
>
```

| Breakpoint | Columnas |
|---|---|
| mobile (default) | 1 |
| sm (≥640px) | 2 |
| lg (≥1024px) | 3 |
| xl (≥1280px) | 4 |

---

## 4. Sistema de animación

### Variants

```ts
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { y: 32, opacity: 0 },
  show:   { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:   { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};
```

### AnimatePresence

`AnimatePresence` wrappea el grid para que las salidas (cuando un profesional desactiva flash en tiempo real) tengan exit animation:

```tsx
<AnimatePresence mode="popLayout">
  {flashProfiles.map(p => (
    <motion.div
      key={p.id}
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      layout
    >
      {/* card content */}
    </motion.div>
  ))}
</AnimatePresence>
```

`mode="popLayout"` + `layout` prop: cuando la lista cambia (realtime update), el grid reordena con animación fluida en lugar de salto brusco.

### Skeleton con animación

El loading skeleton mantiene el mismo aspect-ratio 3/4 para evitar layout shift:

```tsx
<div style={{ aspectRatio: '3/4', borderRadius: 16 }} className="glass-panel animate-pulse" />
```

---

## 5. Estado vacío

Sin cambios funcionales. El empty state actual (card centrado con Zap icon) se mantiene igual, solo se coloca dentro del `<AnimatePresence>` también.

---

## 6. Criterios de aceptación

- Los cards muestran foto full-bleed con overlay y footer dorado
- El stagger de entrada es visible (80ms entre cards)
- Hover escala 1.02 sin layout shift
- El punto pulsante es visible y anima correctamente
- En tiempo real: si un profesional desactiva flash, su card hace exit fade antes de desaparecer
- La lógica de negocio es idéntica (precios ocultos para no-empresarios, modal Solicitar solo para empresarios)
- Sin regresiones en el toggle, banner empresario, o modal de solicitud

---

## 7. Lo que NO incluye este spec

- Cambios en `DemandaTab.tsx` o `SolicitudesTab.tsx`
- Filtros por categoría o zona
- Paginación
- Integración con Stripe o pagos
