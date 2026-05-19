# XPEAK Landing Hero Reel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear una composición HyperFrames de 28s que se renderiza a MP4 y se embebe en la landing de XPEAK como nueva sección entre el atmosphere strip y el bento grid.

**Architecture:** La composición vive en `video/landing-hero/index.html` — HTML puro con GSAP y clips de HyperFrames. Se renderiza con `npx hyperframes render` a `public/video/landing-hero.mp4`. La landing embebe ese MP4 con `<video autoPlay loop muted playsInline>`. El vídeo tiene 3 actos: headline (0–5s), cards de profesionales (5–22s), cierre de marca (22–28s).

**Tech Stack:** HyperFrames CLI (npx), GSAP 3.14.2 (CDN), CSS + HTML, Pexels CDN para fotos, Vite (asset estático en public/), React (integración en Landing.tsx)

---

## Task 1: Setup de directorios y design.md

**Files:**
- Create: `video/landing-hero/` (directorio)
- Create: `video/landing-hero/design.md` (copia del DESIGN.md raíz)
- Create: `public/video/` (directorio para el MP4)

- [ ] **Step 1: Crear los directorios**

```bash
cd /Users/danielacedonunez/pretty-app-roles
mkdir -p video/landing-hero
mkdir -p public/video
```

Expected: sin errores, directorios creados.

- [ ] **Step 2: Copiar el DESIGN.md al directorio de la composición**

HyperFrames busca `design.md` o `DESIGN.md` en el directorio de trabajo para extraer colores y tipografía.

```bash
cp DESIGN.md video/landing-hero/design.md
```

- [ ] **Step 3: Verificar que npx hyperframes funciona**

```bash
cd video/landing-hero
npx hyperframes --version
```

Expected: imprime la versión (ej. `hyperframes/x.y.z`). Si falla con "command not found", ejecutar `npm install -g hyperframes` y reintentar.

- [ ] **Step 4: Commit de setup**

```bash
cd /Users/danielacedonunez/pretty-app-roles
git add video/ public/video/
git commit -m "chore: scaffold hyperframes video directory"
```

---

## Task 2: Composición HyperFrames — Acto 1 (Headline)

**Files:**
- Create: `video/landing-hero/index.html`

- [ ] **Step 1: Crear index.html con el esqueleto y el Acto 1**

Crear `video/landing-hero/index.html` con el siguiente contenido completo:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Syne:wght@700;900&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body { background: #1A1816; overflow: hidden; }

    [data-composition-id="root"] {
      width: 1920px;
      height: 1080px;
      position: relative;
      background: #1A1816;
      overflow: hidden;
    }

    /* Grain texture atmosférico */
    [data-composition-id="root"]::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.028;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
      background-repeat: repeat;
      background-size: 128px 128px;
    }

    /* Todos los clips ocupan el frame completo */
    .clip {
      position: absolute;
      inset: 0;
      width: 1920px;
      height: 1080px;
    }

    /* ── Acto 1: Headline ── */
    #act1 {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 0 160px;
      gap: 28px;
    }

    #act1-badge {
      position: absolute;
      top: 52px;
      right: 80px;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 22px;
      color: #D4AF37;
      letter-spacing: 0.25em;
    }

    #act1-headline {
      font-family: 'Syne', sans-serif;
      font-weight: 900;
      font-size: 96px;
      color: rgba(255,255,255,0.95);
      line-height: 1.05;
      max-width: 860px;
    }

    #act1-subtitle {
      font-family: 'Inter', sans-serif;
      font-weight: 400;
      font-size: 28px;
      color: rgba(255,255,255,0.55);
      letter-spacing: 0.08em;
    }

    /* ── Acto 2: Cards ── */
    .card-scene {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .card {
      width: 600px;
      height: 600px;
      border-radius: 16px;
      border: 1px solid rgba(212,175,55,0.25);
      box-shadow: 0 20px 60px rgba(0,0,0,0.80);
      overflow: hidden;
      position: relative;
      background: rgba(14,14,14,0.90);
    }

    .card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: saturate(0.8) brightness(0.9);
    }

    .card-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20px 24px 24px;
      background: rgba(0,0,0,0.72);
      backdrop-filter: blur(8px);
    }

    .card-role {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 28px;
      color: #D4AF37;
      margin-bottom: 6px;
    }

    .card-name {
      font-family: 'Inter', sans-serif;
      font-weight: 400;
      font-size: 22px;
      color: rgba(255,255,255,0.80);
    }

    .card-badge {
      position: absolute;
      top: 20px;
      right: 20px;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 13px;
      color: #D4AF37;
      letter-spacing: 0.18em;
      background: rgba(0,0,0,0.65);
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid rgba(212,175,55,0.30);
    }

    /* ── Acto 3: Cierre ── */
    #act3 {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 24px;
    }

    #act3-logo {
      font-family: 'Syne', sans-serif;
      font-weight: 900;
      font-size: 120px;
      color: #D4AF37;
      letter-spacing: 0.25em;
      text-shadow: 0 0 40px rgba(212,175,55,0.45);
    }

    #act3-tagline {
      font-family: 'Inter', sans-serif;
      font-weight: 300;
      font-size: 28px;
      color: rgba(255,255,255,0.55);
      letter-spacing: 0.12em;
    }
  </style>
</head>
<body>
  <div data-composition-id="root" data-width="1920" data-height="1080">

    <!-- ── Acto 1: Headline (0–5s) ── -->
    <div id="act1" class="clip" data-start="0" data-duration="5" data-track-index="1">
      <span id="act1-badge">XPEAK</span>
      <h1 id="act1-headline">Tu evento merece los mejores</h1>
      <p id="act1-subtitle">DJ · Fotógrafo · Maquillaje · Staff · Catering</p>
    </div>

    <!-- ── Acto 2: Cards (se añaden en Task 3) ── -->

    <!-- ── Acto 3: Cierre (se añade en Task 4) ── -->

    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });

      // ── Acto 1 ──
      tl.from('#act1-badge',    { opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.2);
      tl.from('#act1-headline', { y: 60, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.3);
      tl.from('#act1-subtitle', { y: 40, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.7);

      // ── Acto 2 (tweens se añaden en Task 3) ──

      // ── Acto 3 (tweens se añaden en Task 4) ──

      window.__timelines['root'] = tl;
    </script>
  </div>
</body>
</html>
```

- [ ] **Step 2: Previsualizar el Acto 1 en el navegador**

```bash
cd /Users/danielacedonunez/pretty-app-roles/video/landing-hero
npx hyperframes preview
```

Expected: abre una ventana en el navegador con la composición. A t=0 se ve el fondo `#1A1816`. A t=0.3s aparece el headline animado. Si el navegador no abre solo, visitar la URL que imprime en terminal (normalmente `http://localhost:3000`).

- [ ] **Step 3: Verificar lint inicial**

```bash
npx hyperframes lint
```

Expected: `✓ No lint errors`. Si hay errores, corregirlos antes de continuar.

---

## Task 3: Acto 2 — 7 cards de profesionales

**Files:**
- Modify: `video/landing-hero/index.html`

- [ ] **Step 1: Añadir los 7 clips de cards al HTML**

Reemplazar el comentario `<!-- ── Acto 2: Cards (se añaden en Task 3) ── -->` con:

```html
<!-- ── Acto 2: Cards (5–22s) ── -->
<div id="card1" class="clip card-scene" data-start="5.0" data-duration="2.3" data-track-index="2">
  <div class="card">
    <img src="https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop" crossorigin="anonymous" alt="" />
    <span class="card-badge">XPEAK</span>
    <div class="card-footer">
      <div class="card-role">DJ & Artistas</div>
      <div class="card-name">Alejandro M.</div>
    </div>
  </div>
</div>

<div id="card2" class="clip card-scene" data-start="7.4" data-duration="2.3" data-track-index="2">
  <div class="card">
    <img src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop" crossorigin="anonymous" alt="" />
    <span class="card-badge">XPEAK</span>
    <div class="card-footer">
      <div class="card-role">Fotografía</div>
      <div class="card-name">Sara V.</div>
    </div>
  </div>
</div>

<div id="card3" class="clip card-scene" data-start="9.8" data-duration="2.3" data-track-index="2">
  <div class="card">
    <img src="https://images.pexels.com/photos/3765114/pexels-photo-3765114.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop" crossorigin="anonymous" alt="" />
    <span class="card-badge">XPEAK</span>
    <div class="card-footer">
      <div class="card-role">Maquillaje</div>
      <div class="card-name">Laura G.</div>
    </div>
  </div>
</div>

<div id="card4" class="clip card-scene" data-start="12.2" data-duration="2.3" data-track-index="2">
  <div class="card">
    <img src="https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop" crossorigin="anonymous" alt="" />
    <span class="card-badge">XPEAK</span>
    <div class="card-footer">
      <div class="card-role">Staff & Protocolo</div>
      <div class="card-name">Carlos R.</div>
    </div>
  </div>
</div>

<div id="card5" class="clip card-scene" data-start="14.6" data-duration="2.3" data-track-index="2">
  <div class="card">
    <img src="https://images.pexels.com/photos/784633/pexels-photo-784633.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop" crossorigin="anonymous" alt="" />
    <span class="card-badge">XPEAK</span>
    <div class="card-footer">
      <div class="card-role">Catering</div>
      <div class="card-name">Elena P.</div>
    </div>
  </div>
</div>

<div id="card6" class="clip card-scene" data-start="17.0" data-duration="2.3" data-track-index="2">
  <div class="card">
    <img src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop" crossorigin="anonymous" alt="" />
    <span class="card-badge">XPEAK</span>
    <div class="card-footer">
      <div class="card-role">Vestuario</div>
      <div class="card-name">Nuria T.</div>
    </div>
  </div>
</div>

<div id="card7" class="clip card-scene" data-start="19.4" data-duration="2.5" data-track-index="2">
  <div class="card">
    <img src="https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop" crossorigin="anonymous" alt="" />
    <span class="card-badge">XPEAK</span>
    <div class="card-footer">
      <div class="card-role">Media & Contenido</div>
      <div class="card-name">David K.</div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Añadir los tweens de las cards al timeline**

Reemplazar el comentario `// ── Acto 2 (tweens se añaden en Task 3) ──` con:

```js
// ── Acto 2: Cards ──
tl.from('#card1', { x: 80, opacity: 0, duration: 0.5, ease: 'power3.out' }, 5.0);
tl.from('#card2', { x: 80, opacity: 0, duration: 0.5, ease: 'expo.out'   }, 7.4);
tl.from('#card3', { x: 80, opacity: 0, duration: 0.5, ease: 'power3.out' }, 9.8);
tl.from('#card4', { x: 80, opacity: 0, duration: 0.5, ease: 'expo.out'   }, 12.2);
tl.from('#card5', { x: 80, opacity: 0, duration: 0.5, ease: 'power3.out' }, 14.6);
tl.from('#card6', { x: 80, opacity: 0, duration: 0.5, ease: 'expo.out'   }, 17.0);
tl.from('#card7', { x: 80, opacity: 0, duration: 0.5, ease: 'power3.out' }, 19.4);
```

- [ ] **Step 3: Verificar en preview**

```bash
npx hyperframes preview
```

Arrastrar el scrubber hasta t=5s, t=7.4s, t=9.8s... verificar que cada card entra desde la derecha con fade. Si alguna foto no carga (CORS), verificar la URL en el navegador directamente.

- [ ] **Step 4: Lint**

```bash
npx hyperframes lint
```

Expected: `✓ No lint errors`.

---

## Task 4: Acto 3 — Cierre y timeline completo

**Files:**
- Modify: `video/landing-hero/index.html`

- [ ] **Step 1: Añadir el clip de cierre al HTML**

Reemplazar el comentario `<!-- ── Acto 3: Cierre (se añade en Task 4) ── -->` con:

```html
<!-- ── Acto 3: Cierre (22–28s) ── -->
<div id="act3" class="clip" data-start="22" data-duration="6" data-track-index="3">
  <h2 id="act3-logo">XPEAK</h2>
  <p id="act3-tagline">El Directorio Profesional de Eventos</p>
</div>
```

- [ ] **Step 2: Añadir los tweens del Acto 3 al timeline**

Reemplazar el comentario `// ── Acto 3 (tweens se añaden en Task 4) ──` con:

```js
// ── Acto 3: Cierre ──
tl.from('#act3-logo',    { y: 50, opacity: 0, duration: 0.7, ease: 'power3.out' }, 22.3);
tl.from('#act3-tagline', { y: 30, opacity: 0, duration: 0.5, ease: 'power2.out' }, 23.2);
// Único exit tween permitido — escena final
tl.to(['#act3-logo', '#act3-tagline'], { opacity: 0, duration: 0.8, ease: 'power2.in' }, 27.0);
```

- [ ] **Step 3: Verificar composición completa en preview**

```bash
npx hyperframes preview
```

Verificar:
- t=0s → fondo oscuro, badge XPEAK visible
- t=0.3s → headline entra desde abajo
- t=5s → card DJ entra desde la derecha
- t=22s → logo XPEAK grande en dorado
- t=27s → fade out suave a negro

- [ ] **Step 4: Commit de la composición completa**

```bash
cd /Users/danielacedonunez/pretty-app-roles
git add video/landing-hero/index.html
git commit -m "feat: add hyperframes landing hero composition"
```

---

## Task 5: Lint, validación y corrección

**Files:**
- Modify: `video/landing-hero/index.html` (si hay errores que corregir)

- [ ] **Step 1: Lint completo**

```bash
cd /Users/danielacedonunez/pretty-app-roles/video/landing-hero
npx hyperframes lint
```

Expected: `✓ No lint errors`. Si hay errores, leerlos y corregirlos en `index.html`.

- [ ] **Step 2: Validación WCAG contrast**

```bash
npx hyperframes validate
```

Expected: sin warnings de contraste. Si aparece algo como `⚠ WCAG AA contrast warnings (N)`, corregir el color hasta que el ratio sea ≥ 4.5:1 para texto normal (< 24px) o ≥ 3:1 para texto grande (≥ 24px). Los valores del design system ya están elegidos para pasar este check.

- [ ] **Step 3: Inspect de layout**

```bash
npx hyperframes inspect
```

Expected: sin overflow warnings. Si hay elementos que salen del frame (1920×1080), ajustar `max-width`, `font-size` o `padding` según el hint del error.

---

## Task 6: Render a MP4

**Files:**
- Create: `public/video/landing-hero.mp4`

- [ ] **Step 1: Renderizar**

```bash
cd /Users/danielacedonunez/pretty-app-roles/video/landing-hero
npx hyperframes render --output ../../public/video/landing-hero.mp4
```

Expected: progreso de render frame a frame, termina con `✓ Rendered to public/video/landing-hero.mp4`. El proceso puede tardar 1-3 minutos (28s × 30fps = 840 frames).

- [ ] **Step 2: Verificar el MP4**

```bash
ls -lh /Users/danielacedonunez/pretty-app-roles/public/video/landing-hero.mp4
```

Expected: archivo existe, tamaño razonable (típicamente 5–25 MB para 28s).

Abrir el archivo con QuickTime o VLC para verlo. Verificar:
- El vídeo dura ~28s
- El loop final (t=27-28s) termina en negro limpio
- Las fotos de Pexels aparecen correctamente

- [ ] **Step 3: Commit del MP4**

```bash
cd /Users/danielacedonunez/pretty-app-roles
git add public/video/landing-hero.mp4
git commit -m "feat: add rendered landing hero video"
```

> **Nota:** Si `public/video/landing-hero.mp4` supera 50MB GitHub lo rechazará. En ese caso, añadir `public/video/*.mp4` a `.gitignore` y subir el vídeo manualmente a Vercel como asset estático o a un CDN.

---

## Task 7: Integración en Landing.tsx

**Files:**
- Modify: `src/pages/Landing.tsx` (insertar después de línea 793)

- [ ] **Step 1: Añadir la sección de vídeo**

En `src/pages/Landing.tsx`, localizar el comentario `{/* ─ Mobile Categories ─ */}` (actualmente en línea ~795). Insertar el siguiente bloque **justo antes** de ese comentario:

```tsx
      {/* ─ Hero Reel ─ */}
      <FadeIn className="max-w-[1200px] mx-auto px-6 md:px-8 pb-12 md:pb-16">
        <video
          autoPlay
          loop
          muted
          playsInline
          src="/video/landing-hero.mp4"
          style={{
            width: '100%',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.50)',
            display: 'block',
          }}
        />
      </FadeIn>
```

- [ ] **Step 2: Verificar que el archivo compiló sin errores de TypeScript**

```bash
cd /Users/danielacedonunez/pretty-app-roles
npm run build 2>&1 | tail -20
```

Expected: build completa sin errores. Si hay errores de TypeScript, leerlos y corregirlos.

- [ ] **Step 3: Commit de la integración**

```bash
git add src/pages/Landing.tsx
git commit -m "feat: embed landing hero reel between atmosphere strip and bento grid"
```

---

## Task 8: Verificación visual en navegador

**Files:** ninguno (solo verificación)

- [ ] **Step 1: Arrancar el servidor de desarrollo**

```bash
cd /Users/danielacedonunez/pretty-app-roles
npm run dev
```

Expected: `VITE ready on http://localhost:8083` (o el puerto configurado en CLAUDE.md).

- [ ] **Step 2: Verificar en la landing**

Abrir `http://localhost:8083` en el navegador. Hacer scroll hasta pasar el atmosphere strip de 3 fotos. Verificar:
- El vídeo aparece correctamente en su sección
- Autoplay sin interacción del usuario
- Loop sin salto visible al reiniciar
- Bordes redondeados y sombra correctos
- En mobile (DevTools → responsive): el vídeo es responsive (`width: 100%`)

- [ ] **Step 3: Verificar que las secciones siguientes no se desplazaron**

Hacer scroll completo por la landing. Verificar que el bento grid, testimonios, FAQ y CTA dark siguen en el mismo orden y sin layout roto.

- [ ] **Step 4: Commit final**

```bash
git add -A
git commit -m "feat: xpeak landing hero reel complete — hyperframes 28s loop"
```

---

## Resultado esperado

Al terminar todos los tasks:

1. `video/landing-hero/index.html` — composición HyperFrames completa y validada
2. `public/video/landing-hero.mp4` — vídeo renderizado de 28s
3. `src/pages/Landing.tsx` — nueva sección con el `<video>` entre atmosphere strip y bento grid
4. La landing muestra el reel en loop silencioso al hacer scroll, sin romper el resto del layout
