# XPEAK Landing Hero Reel — Design Spec

> **For agentic workers:** Use superpowers:writing-plans to create the implementation plan from this spec.

**Goal:** Crear una composición HyperFrames de 28s (loop silencioso) que se renderiza a MP4 y se embebe en la landing de XPEAK como nueva sección entre el hero y el bento grid. El vídeo comunica: "Somos la plataforma donde contratas los mejores profesionales para tu boda o evento."

**Proyecto activo:** `/Users/danielacedonunez/pretty-app-roles`

---

## 1. Arquitectura e integración

### Estructura de archivos

```
pretty-app-roles/
  video/
    landing-hero/
      index.html        ← composición HyperFrames (fuente de verdad)
      design.md         ← copia del DESIGN.md raíz (para que HyperFrames lo lea)
  public/
    video/
      landing-hero.mp4  ← output del render (generado, no editar)
  src/
    pages/
      Landing.tsx       ← añadir nueva sección con el <video>
```

### Flujo de trabajo

1. Editar `video/landing-hero/index.html`
2. `cd video/landing-hero && npx hyperframes render --output ../../public/video/landing-hero.mp4`
3. El archivo `.mp4` queda en `public/video/` y Vite lo sirve como asset estático
4. Deploy normal a Vercel — el vídeo va incluido en el bundle

### Integración en Landing.tsx

Nueva sección insertada entre el hero (`<header>`) y el bento grid. Hereda `data-landing="true"` del wrapper padre. Fondo `#1A1816` para crear contraste con el cemento claro `#C4C2BF` del resto de la landing — transición oscura intencional que prepara al usuario para el interior del dashboard.

```tsx
<section style={{ background: '#1A1816', padding: '72px 0' }}>
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
    <video
      autoPlay
      loop
      muted
      playsInline
      src="/video/landing-hero.mp4"
      style={{
        width: '100%',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.80)',
        display: 'block',
      }}
    />
  </div>
</section>
```

---

## 2. Composición HyperFrames

### Especificaciones técnicas

| Propiedad | Valor |
|---|---|
| Dimensiones | 1920 × 1080 px (16:9) |
| Duración | 28 segundos |
| Audio | Ninguno |
| Loop | Sí — el `<video>` hace loop, la composición termina en fade a negro |
| Formato output | MP4 (H.264) |
| Fuente de diseño | `design.md` en el mismo directorio |

### Tipografía

- **Headlines:** Syne 900 — declarada con `@font-face` apuntando a Google Fonts CDN; el compilador de HyperFrames la embebe al renderizar
- **Body/labels:** Inter 400–600 — ídem
- Tamaños mínimos para vídeo: headlines ≥ 60px, labels ≥ 20px

### Paleta de colores

Extraída del `DESIGN.md`:

```
Fondo principal     #1A1816    — fondo de toda la composición
Card background     rgba(14,14,14,0.90)
Gold primario       #D4AF37
Gold oscuro         #B8941E
Border gold         rgba(212,175,55,0.25)
Gold glow           rgba(212,175,55,0.50)
Texto principal     rgba(255,255,255,0.95)
Texto secundario    rgba(255,255,255,0.60)
```

---

## 3. Estructura de escenas

### Acto 1 — Headline (0s – 5s)

**Objetivo:** establecer propuesta de valor en 5 segundos.

**Elementos:**
- Fondo liso `#1A1816` con grain texture (SVG feTurbulence, opacity 0.028)
- Badge "XPEAK" esquina superior derecha: Syne 700, `#D4AF37`, 24px, `letter-spacing: 0.2em` — entra con `opacity 0→1` en t=0.2s
- Headline principal: Syne 900, 96px, `rgba(255,255,255,0.95)` — texto: *"Tu evento merece los mejores"* — entra con `gsap.from({ y: 60, opacity: 0, duration: 0.7, ease: 'power3.out' })` en t=0.3s
- Subtexto: Inter 400, 28px, `rgba(255,255,255,0.60)` — texto: *"DJ · Fotógrafo · Maquillaje · Staff · Catering"* — entra con `gsap.from({ y: 40, opacity: 0, duration: 0.5, ease: 'power2.out' })` en t=0.7s

**Sin exit tweens** — la transición crossfade al Acto 2 actúa como salida.

---

### Acto 2 — Cards de profesionales (5s – 22s)

**Objetivo:** mostrar la amplitud del directorio con foco en bodas+eventos.

**7 cards × ~2.4s cada una** con crossfade de 0.3s entre transiciones:

| # | Tiempo | Rol | Foto Pexels ID | Nombre ficticio |
|---|---|---|---|---|
| 1 | 5.0s | DJ & Artistas | 1540406 | Alejandro M. |
| 2 | 7.4s | Fotografía | 1024993 | Sara V. |
| 3 | 9.8s | Maquillaje | 3765114 | Laura G. |
| 4 | 12.2s | Staff & Protocolo | 2608517 | Carlos R. |
| 5 | 14.6s | Catering | 784633 | Elena P. |
| 6 | 17.0s | Vestuario | 1536619 | Nuria T. |
| 7 | 19.4s | Media & Contenido | 3944405 | David K. |

**Anatomía de cada card:**

```
┌─────────────────────────────────────────────┐
│  [foto 480×480, saturate(0.8) brightness(0.9), object-cover]  │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │  ROL EN DORADO  •  badge "XPEAK"    │   │  ← footer del card, bg rgba(0,0,0,0.7)
│  │  Nombre ficticio • Inter 400 blanco │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

- Card dimensions: 600×600px, centrada en el frame
- `border-radius: 16px`
- `border: 1px solid rgba(212,175,55,0.25)`
- `box-shadow: 0 20px 60px rgba(0,0,0,0.80)`
- Rol: Syne 700, 28px, `#D4AF37`
- Nombre: Inter 400, 22px, `rgba(255,255,255,0.80)`

**Animación entrada de cada card:**
```js
gsap.from(`#card-N`, { x: 80, opacity: 0, duration: 0.5, ease: 'power3.out' })
```

**Transición entre cards:** crossfade 0.3s — sin exit tweens en el contenido de cada card.

---

### Acto 3 — Cierre (22s – 28s)

**Objetivo:** Brand recall + loop suave.

**Elementos:**
- Fondo `#1A1816` (sin cards)
- Logo "XPEAK": Syne 900, 120px, `#D4AF37`, `letter-spacing: 0.2em` — entra con `gsap.from({ y: 50, opacity: 0, duration: 0.7, ease: 'power3.out' })` en t=22.3s
- `box-shadow: 0 0 30px rgba(212,175,55,0.50)` animado: `gsap.from({ opacity: 0, duration: 1.0 })` en t=22.5s
- Tagline: Inter 300, 28px, `rgba(255,255,255,0.60)` — texto: *"El Directorio Profesional de Eventos"* — entra en t=23.2s
- Fade out final: `gsap.to([logo, tagline], { opacity: 0, duration: 0.8, ease: 'power2.in' })` en t=27.0s — único uso de exit tween (escena final)

---

## 4. Reglas HyperFrames aplicables

- `repeat: -1` **prohibido** — el `<video>` hace loop, la composición es lineal de 28s
- Timelines: todos `{ paused: true }`, registrados en `window.__timelines`
- Sin `Math.random()` ni `Date.now()` — composición determinista
- Sin exit tweens excepto en el Acto 3 (escena final)
- Fotos: `crossorigin="anonymous"` en todos los `<img>`
- Video en composición: no aplica (composición 100% HTML/CSS/GSAP)

---

## 5. Verificación post-render

```bash
# En video/landing-hero/
npx hyperframes lint
npx hyperframes validate       # WCAG contrast check
npx hyperframes inspect        # layout overflow check
```

Criterios de aceptación:
- `lint` y `validate` pasan sin errores
- Contraste de texto: ratio ≥ 4.5:1 para texto normal, ≥ 3:1 para texto grande (≥24px)
- El vídeo renderizado hace loop sin salto visible (último frame ≈ primer frame en nivel de negro)
- La sección en Landing.tsx no rompe el scroll ni el layout en mobile (el `<video>` es responsive via `width: 100%`)

---

## 6. Lo que NO incluye este spec

- Sistema de variables HyperFrames (eso es el spec #2 — social media clips)
- Integración con datos reales de Supabase (eso es el spec #3 — Flash Booking cards)
- Audio/música
- Versión vertical 1080×1920 para mobile
