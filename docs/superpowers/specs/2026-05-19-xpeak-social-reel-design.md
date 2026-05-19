# XPEAK Social Reel — Design Spec

> **For agentic workers:** Use superpowers:writing-plans to create the implementation plan from this spec.

**Goal:** Crear una composición HyperFrames de 20s (1080×1920, 9:16) que se renderiza a 7 MP4s — uno por categoría de rol — para publicar en Instagram Reels y TikTok como contenido de marca de XPEAK. Un único template con sistema de variables; cada render recibe datos distintos vía `--variables-file`.

**Proyecto activo:** `/Users/danielacedonunez/pretty-app-roles`

---

## 1. Arquitectura e integración

### Estructura de archivos

```
pretty-app-roles/
  video/
    social-reel/
      index.html          ← composición HyperFrames (fuente de verdad)
      design.md           ← copia del DESIGN.md raíz
      vars/
        dj.json
        fotografia.json
        maquillaje.json
        staff.json
        catering.json
        vestuario.json
        media.json
  public/
    video/
      reels/
        dj.mp4
        fotografia.mp4
        maquillaje.mp4
        staff.mp4
        catering.mp4
        vestuario.mp4
        media.mp4
```

### Flujo de render

```bash
# Render individual
cd video/social-reel
npx hyperframes render --variables-file vars/dj.json --output ../../public/video/reels/dj.mp4

# Render batch (los 7 clips)
for role in dj fotografia maquillaje staff catering vestuario media; do
  npx hyperframes render \
    --variables-file vars/$role.json \
    --output ../../public/video/reels/$role.mp4
done
```

### Diferencias clave respecto al landing hero

| Propiedad | Landing hero | Social reel |
|---|---|---|
| Dimensiones | 1920×1080 | 1080×1920 |
| Duración | 28s | 20s |
| Renders | 1 | 7 (uno por rol) |
| Variables | Ninguna | 6 por render |
| Uso | Sección web | Instagram Reels / TikTok |

---

## 2. Sistema de variables

### Schema declarado en `data-composition-variables`

```json
{
  "role":   "DJ & Artistas",
  "name":   "Alejandro M.",
  "rating": "4.9",
  "events": "84",
  "tag1":   "Bodas",
  "tag2":   "Corporativos"
}
```

### Valores por rol

| Archivo | role | name | rating | events | tag1 | tag2 |
|---|---|---|---|---|---|---|
| `dj.json` | DJ & Artistas | Alejandro M. | 4.9 | 84 | Bodas | Corporativos |
| `fotografia.json` | Fotografía | Sara V. | 5.0 | 112 | Bodas | Quinceañeras |
| `maquillaje.json` | Maquillaje | Laura G. | 4.8 | 67 | Bodas | Desfiles |
| `staff.json` | Staff & Protocolo | Carlos R. | 4.7 | 203 | Corporativos | Bodas |
| `catering.json` | Catering | Elena P. | 4.9 | 56 | Bodas | Eventos |
| `vestuario.json` | Vestuario | Nuria T. | 4.8 | 39 | Bodas | Teatro |
| `media.json` | Media & Contenido | David K. | 4.9 | 91 | Bodas | Corporativos |

### Inyección en DOM (antes de que arranque el timeline)

```js
const vars = window.__hyperframes.getVariables();
document.getElementById('card-role').textContent   = vars.role;
document.getElementById('card-name').textContent   = vars.name;
document.getElementById('card-rating').textContent = `★★★★★ ${vars.rating}`;
document.getElementById('card-events').textContent = `· ${vars.events} eventos`;
document.getElementById('card-tag1').textContent   = vars.tag1;
document.getElementById('card-tag2').textContent   = vars.tag2;
```

### Lookup de fotos

Las 7 fotos se embeben como data URIs en el HTML (constantes JS al inicio del script). No hay requests de red durante el render.

```js
const PHOTOS = {
  'DJ & Artistas':    DJ_DATA_URI,
  'Fotografía':       FOTO_DATA_URI,
  'Maquillaje':       MAQUILLAJE_DATA_URI,
  'Staff & Protocolo': STAFF_DATA_URI,
  'Catering':         CATERING_DATA_URI,
  'Vestuario':        VESTUARIO_DATA_URI,
  'Media & Contenido': MEDIA_DATA_URI,
};
document.getElementById('card-img').src = PHOTOS[vars.role] ?? DJ_DATA_URI;
```

---

## 3. Composición HyperFrames

### Especificaciones técnicas

| Propiedad | Valor |
|---|---|
| Dimensiones | 1080×1920 px (9:16) |
| Duración | 20 segundos |
| Audio | Ninguno |
| Loop | No — clip lineal con fade a negro al final |
| Formato output | MP4 (H.264) |
| Tracks | 3 (uno por acto) |

### Tipografía

- **Headlines:** Syne 900 — `@font-face` vía Google Fonts CDN, embedido por el compilador HyperFrames
- **Body/labels:** Inter 400–600
- Tamaños mínimos para vídeo vertical: headlines ≥ 56px, labels ≥ 18px

### Paleta de colores

```
Fondo principal     #1A1816
Card background     rgba(14,14,14,0.90)
Gold primario       #D4AF37
Gold gradient       linear-gradient(160deg, #F5D77A 0%, #D4AF37 55%, #B8941E 100%)
Border gold         rgba(212,175,55,0.30)
Texto principal     rgba(255,255,255,0.95)
Texto secundario    rgba(255,255,255,0.55)
```

---

## 4. Estructura de escenas

### Acto 1 — Headline (0s – 5s)

**Objetivo:** Identidad de plataforma en los primeros 5 segundos.

**Elementos:**
- Fondo `#1A1816` con grain texture (SVG feTurbulence, opacity 0.028)
- Badge "XPEAK" centrado arriba: Syne 700, `#D4AF37`, 20px, `letter-spacing: 0.25em` — entra `opacity 0→1`, duration 0.5s, t=0.3s
- Headline: Syne 900, 72px, `rgba(255,255,255,0.95)` — texto: *"Contrata los mejores para tu evento"* — `gsap.from({ y: 50, opacity: 0, duration: 0.7, ease: 'power3.out' })` en t=0.5s
- Subtexto: Inter 400, 22px, `rgba(255,255,255,0.50)` — texto: *"DJ · Fotografía · Catering · y más"* — `gsap.from({ y: 30, opacity: 0, duration: 0.5, ease: 'power2.out' })` en t=1.0s

**Sin exit tweens** — la transición de HyperFrames entre tracks actúa como salida.

---

### Acto 2 — Card profesional (5s – 15s)

**Objetivo:** Mostrar un profesional real de la plataforma con datos concretos.

**Dimensiones del card:** 840×1400px, centrado en el frame 1080×1920 (ocupa el 77% del ancho y 73% del alto — foto área 840×1100, footer 300px).

**Anatomía del card:**

```
┌────────────────────────────────────┐
│  [foto 840×1080, sat(0.80) bri(0.85), object-cover]  │
│                                     │
│                          [XPEAK]   │  ← badge esquina superior derecha
│                                     │
│   [gradient overlay: transp→negro] │
│                                     │
│  ★★★★★ 4.9  ·  84 eventos         │
│  DJ & ARTISTAS                      │  ← vars.role, Syne 700, #D4AF37
│  Alejandro M.                       │  ← vars.name, Inter 400
│  [Bodas] [Corporativos]            │  ← vars.tag1, vars.tag2
└────────────────────────────────────┘
```

**CSS del card:**
- `border-radius: 20px`
- `border: 1px solid rgba(212,175,55,0.30)`
- `box-shadow: 0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(212,175,55,0.08)`
- Overlay: `linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.60) 40%, transparent 72%)`

**Animación entrada:**
```js
gsap.from('#card', { x: -60, opacity: 0, duration: 0.6, ease: 'power3.out' }, 5.2)
```

---

### Acto 3 — CTA (15s – 20s)

**Objetivo:** Brand recall + cierre limpio.

**Elementos:**
- Fondo `#1A1816`
- Logo "XPEAK": Syne 900, 100px, gradient text `linear-gradient(160deg, #F5D77A, #D4AF37, #B8941E)` con `-webkit-background-clip: text` — entra `y: 40, opacity: 0, duration: 0.7, ease: 'power3.out'` en t=15.3s
- URL "xpeak.es": Inter 300, 22px, `rgba(255,255,255,0.50)`, `letter-spacing: 0.12em` — entra en t=16.0s
- Fade out final: `gsap.to(['#act3-logo', '#act3-url'], { opacity: 0, duration: 0.8, ease: 'power2.in' })` en t=19.0s — único exit tween permitido

---

## 5. Reglas HyperFrames aplicables

- `repeat: -1` **prohibido** — composición lineal de 20s
- Timelines: `{ paused: true }`, registrados en `window.__timelines['root']`
- Sin `Math.random()` ni `Date.now()` — determinista
- Sin exit tweens excepto el fade final del Acto 3
- `data-composition-variables` declarado en el `<div id="root">` con todos los defaults
- Variables inyectadas al DOM **antes** de construir el timeline GSAP
- Fotos: data URIs embebidas en el HTML — sin requests de red durante render
- Selector raíz: `#root` (no `[data-composition-id="root"]` — regla lint HF)

---

## 6. Verificación post-render

```bash
cd video/social-reel
npx hyperframes lint
```

Criterios de aceptación:
- `lint` pasa sin errores (el warning `timeline_track_too_dense` es aceptable si tiene 3 tracks)
- Los 7 MP4s se generan sin errores de render
- En cada clip: el texto del rol, nombre y tags refleja correctamente los valores del JSON
- El fade final es suave — no hay salto al loop (el clip no hace loop, termina en negro)
- Resolución correcta: 1080×1920 (verificar con `ffprobe public/video/reels/dj.mp4`)

---

## 7. Lo que NO incluye este spec

- Integración en la web (estos clips son para redes sociales, no para embeber en Landing.tsx)
- Audio/música
- Subtítulos o captions
- Versión landscape (1920×1080) — eso es el spec #1 ya completado
- Spec #3: Flash Booking animated cards (siguiente spec independiente)
