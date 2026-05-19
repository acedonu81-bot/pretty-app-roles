# XPEAK Social Reel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear una composición HyperFrames 1080×1920 de 20s con sistema de variables que genera 7 clips MP4 (uno por rol profesional) para Instagram Reels y TikTok.

**Architecture:** Un único `index.html` con `data-composition-variables` declara los defaults; al renderizar, `--variables-file vars/<rol>.json` sobreescribe los valores. Las fotos se embeben como data URIs (sin requests de red) mediante un script Python que procesa el HTML antes del render. Tres actos: headline (0–5s), card profesional (5–15s), CTA (15–20s).

**Tech Stack:** HyperFrames 0.6.26, GSAP 3.14.2, Python 3 (embed script), ffprobe (verificación)

---

## Mapa de archivos

```
video/
  social-reel/
    index.html          ← CREAR (generado por embed.py desde index.template.html)
    index.template.html ← CREAR (fuente de verdad — photo tokens como placeholder)
    embed.py            ← CREAR (reemplaza tokens con data URIs base64)
    design.md           ← CREAR (copia de DESIGN.md raíz)
    photos/             ← CREAR (copia de video/landing-hero/photos/)
      dj.jpg
      fotografia.jpg
      maquillaje.jpg
      staff.jpg
      catering.jpg
      vestuario.jpg
      media.jpg
    vars/               ← CREAR
      dj.json
      fotografia.json
      maquillaje.json
      staff.json
      catering.json
      vestuario.json
      media.json

public/
  video/
    reels/              ← CREAR directorio
      dj.mp4            ← generado en Task 7
      fotografia.mp4    ← generado en Task 7
      maquillaje.mp4    ← generado en Task 7
      staff.mp4         ← generado en Task 7
      catering.mp4      ← generado en Task 7
      vestuario.mp4     ← generado en Task 7
      media.mp4         ← generado en Task 7
```

---

### Task 1: Directorios, fotos y design.md

**Files:**
- Create: `video/social-reel/` (directorio)
- Create: `video/social-reel/photos/` (copiar de landing-hero)
- Create: `video/social-reel/design.md`
- Create: `public/video/reels/`

- [ ] **Step 1: Crear directorios**

Desde la raíz del proyecto (`/Users/danielacedonunez/pretty-app-roles`):

```bash
mkdir -p video/social-reel/photos video/social-reel/vars public/video/reels
```

- [ ] **Step 2: Copiar fotos desde landing-hero**

Las fotos ya existen en `video/landing-hero/photos/`. Las copiamos para que `embed.py` pueda leerlas desde el mismo directorio que el template:

```bash
cp video/landing-hero/photos/*.jpg video/social-reel/photos/
ls video/social-reel/photos/
```

Expected output:
```
catering.jpg  dj.jpg  fotografia.jpg  maquillaje.jpg  media.jpg  staff.jpg  vestuario.jpg
```

- [ ] **Step 3: Crear design.md**

```bash
cp DESIGN.md video/social-reel/design.md
```

- [ ] **Step 4: Commit**

```bash
git add video/social-reel/ public/video/reels/
git commit -m "chore: scaffold social-reel directory structure"
```

---

### Task 2: Variable JSON files (7 roles)

**Files:**
- Create: `video/social-reel/vars/dj.json`
- Create: `video/social-reel/vars/fotografia.json`
- Create: `video/social-reel/vars/maquillaje.json`
- Create: `video/social-reel/vars/staff.json`
- Create: `video/social-reel/vars/catering.json`
- Create: `video/social-reel/vars/vestuario.json`
- Create: `video/social-reel/vars/media.json`

- [ ] **Step 1: Crear los 7 archivos JSON**

```bash
cat > video/social-reel/vars/dj.json << 'EOF'
{
  "role":   "DJ & Artistas",
  "name":   "Alejandro M.",
  "rating": "4.9",
  "events": "84",
  "tag1":   "Bodas",
  "tag2":   "Corporativos"
}
EOF

cat > video/social-reel/vars/fotografia.json << 'EOF'
{
  "role":   "Fotografía",
  "name":   "Sara V.",
  "rating": "5.0",
  "events": "112",
  "tag1":   "Bodas",
  "tag2":   "Quinceañeras"
}
EOF

cat > video/social-reel/vars/maquillaje.json << 'EOF'
{
  "role":   "Maquillaje",
  "name":   "Laura G.",
  "rating": "4.8",
  "events": "67",
  "tag1":   "Bodas",
  "tag2":   "Desfiles"
}
EOF

cat > video/social-reel/vars/staff.json << 'EOF'
{
  "role":   "Staff & Protocolo",
  "name":   "Carlos R.",
  "rating": "4.7",
  "events": "203",
  "tag1":   "Corporativos",
  "tag2":   "Bodas"
}
EOF

cat > video/social-reel/vars/catering.json << 'EOF'
{
  "role":   "Catering",
  "name":   "Elena P.",
  "rating": "4.9",
  "events": "56",
  "tag1":   "Bodas",
  "tag2":   "Eventos"
}
EOF

cat > video/social-reel/vars/vestuario.json << 'EOF'
{
  "role":   "Vestuario",
  "name":   "Nuria T.",
  "rating": "4.8",
  "events": "39",
  "tag1":   "Bodas",
  "tag2":   "Teatro"
}
EOF

cat > video/social-reel/vars/media.json << 'EOF'
{
  "role":   "Media & Contenido",
  "name":   "David K.",
  "rating": "4.9",
  "events": "91",
  "tag1":   "Bodas",
  "tag2":   "Corporativos"
}
EOF
```

- [ ] **Step 2: Verificar**

```bash
for f in video/social-reel/vars/*.json; do echo "--- $f ---"; cat "$f"; done
```

Expected: 7 bloques JSON, uno por rol, sin errores de sintaxis.

- [ ] **Step 3: Commit**

```bash
git add video/social-reel/vars/
git commit -m "feat: add variable json files for 7 professional roles"
```

---

### Task 3: Composición HTML (index.template.html)

**Files:**
- Create: `video/social-reel/index.template.html`

Las fotos se referencian como tokens `__PHOTO_DJ__`, `__PHOTO_FOTOGRAFIA__`, etc. El script `embed.py` (Task 4) los reemplaza con los data URIs base64 reales para generar `index.html`.

- [ ] **Step 1: Escribir index.template.html**

Crear el archivo `/Users/danielacedonunez/pretty-app-roles/video/social-reel/index.template.html` con el contenido siguiente:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>XPEAK — Social Reel</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Syne:wght@700;900&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body { background: #1A1816; overflow: hidden; }

    #root {
      width: 1080px;
      height: 1920px;
      position: relative;
      background: #1A1816;
      overflow: hidden;
    }

    #root::after {
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

    .clip {
      position: absolute;
      inset: 0;
      width: 1080px;
      height: 1920px;
    }

    /* ── Act 1: Headline ── */
    #act1 {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 80px;
      gap: 32px;
      text-align: center;
    }

    #act1-badge {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 20px;
      color: #D4AF37;
      letter-spacing: 0.25em;
    }

    #act1-headline {
      font-family: 'Syne', sans-serif;
      font-weight: 900;
      font-size: 72px;
      color: rgba(255,255,255,0.95);
      line-height: 1.05;
    }

    #act1-subtitle {
      font-family: 'Inter', sans-serif;
      font-weight: 400;
      font-size: 22px;
      color: rgba(255,255,255,0.50);
      letter-spacing: 0.10em;
    }

    /* ── Act 2: Card ── */
    .card-scene {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .card {
      width: 840px;
      height: 1400px;
      border-radius: 20px;
      border: 1px solid rgba(212,175,55,0.30);
      box-shadow: 0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(212,175,55,0.08);
      overflow: hidden;
      position: relative;
      background: #0E0E0E;
    }

    .card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: saturate(0.80) brightness(0.85);
      display: block;
    }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.60) 28%, transparent 55%);
      pointer-events: none;
    }

    .card-badge {
      position: absolute;
      top: 24px;
      right: 24px;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 12px;
      color: #D4AF37;
      letter-spacing: 0.22em;
      background: rgba(0,0,0,0.60);
      padding: 6px 14px;
      border-radius: 6px;
      border: 1px solid rgba(212,175,55,0.35);
      z-index: 2;
    }

    .card-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0 36px 48px;
      z-index: 2;
    }

    .card-rating {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }

    .card-stars { font-size: 18px; color: #D4AF37; letter-spacing: 1px; }
    .card-score { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 16px; color: #D4AF37; }
    .card-events-count { font-family: 'Inter', sans-serif; font-weight: 400; font-size: 15px; color: rgba(255,255,255,0.45); }

    .card-role {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 36px;
      color: #D4AF37;
      letter-spacing: 0.02em;
      margin-bottom: 8px;
    }

    .card-name {
      font-family: 'Inter', sans-serif;
      font-weight: 400;
      font-size: 24px;
      color: rgba(255,255,255,0.80);
      margin-bottom: 20px;
    }

    .card-tags { display: flex; gap: 10px; }

    .card-tag {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: rgba(255,255,255,0.55);
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12);
      padding: 6px 14px;
      border-radius: 4px;
      letter-spacing: 0.04em;
    }

    /* ── Act 3: CTA ── */
    #act3 {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
    }

    #act3-logo {
      font-family: 'Syne', sans-serif;
      font-weight: 900;
      font-size: 100px;
      letter-spacing: 0.30em;
      background: linear-gradient(160deg, #F5D77A 0%, #D4AF37 55%, #B8941E 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 0 24px rgba(212,175,55,0.40));
    }

    #act3-divider {
      width: 60px;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(212,175,55,0.60), transparent);
    }

    #act3-url {
      font-family: 'Inter', sans-serif;
      font-weight: 300;
      font-size: 22px;
      color: rgba(255,255,255,0.50);
      letter-spacing: 0.12em;
    }
  </style>
</head>
<body>

<div id="root"
     data-composition-id="root"
     data-start="0"
     data-width="1080"
     data-height="1920"
     data-composition-variables='{"role":"DJ & Artistas","name":"Alejandro M.","rating":"4.9","events":"84","tag1":"Bodas","tag2":"Corporativos"}'>

  <!-- Act 1: Headline (0–5s) -->
  <div id="act1" class="clip" data-start="0" data-duration="5" data-track-index="1">
    <span id="act1-badge">XPEAK</span>
    <h1 id="act1-headline">Contrata los mejores para tu evento</h1>
    <p id="act1-subtitle">DJ · Fotografía · Catering · y más</p>
  </div>

  <!-- Act 2: Card profesional (5–15s) -->
  <div id="act2" class="clip card-scene" data-start="5" data-duration="10" data-track-index="2">
    <div class="card">
      <img id="card-img" src="" alt="" />
      <div class="card-overlay"></div>
      <span class="card-badge">XPEAK</span>
      <div class="card-footer">
        <div class="card-rating">
          <span class="card-stars">★★★★★</span>
          <span id="card-score" class="card-score">4.9</span>
          <span id="card-events" class="card-events-count">· 84 eventos</span>
        </div>
        <div id="card-role" class="card-role">DJ & Artistas</div>
        <div id="card-name" class="card-name">Alejandro M.</div>
        <div class="card-tags">
          <span id="card-tag1" class="card-tag">Bodas</span>
          <span id="card-tag2" class="card-tag">Corporativos</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Act 3: CTA (15–20s) -->
  <div id="act3" class="clip" data-start="15" data-duration="5" data-track-index="3">
    <h2 id="act3-logo">XPEAK</h2>
    <div id="act3-divider"></div>
    <p id="act3-url">xpeak.es</p>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <script>
    // ── Photos lookup (tokens reemplazados por embed.py) ──
    const PHOTOS = {
      'DJ & Artistas':     '__PHOTO_DJ__',
      'Fotografía':        '__PHOTO_FOTOGRAFIA__',
      'Maquillaje':        '__PHOTO_MAQUILLAJE__',
      'Staff & Protocolo': '__PHOTO_STAFF__',
      'Catering':          '__PHOTO_CATERING__',
      'Vestuario':         '__PHOTO_VESTUARIO__',
      'Media & Contenido': '__PHOTO_MEDIA__',
    };

    // ── Inyectar variables al DOM (ANTES de construir el timeline) ──
    const vars = window.__hyperframes.getVariables();
    document.getElementById('card-img').src           = PHOTOS[vars.role] ?? PHOTOS['DJ & Artistas'];
    document.getElementById('card-score').textContent  = vars.rating;
    document.getElementById('card-events').textContent = `· ${vars.events} eventos`;
    document.getElementById('card-role').textContent   = vars.role;
    document.getElementById('card-name').textContent   = vars.name;
    document.getElementById('card-tag1').textContent   = vars.tag1;
    document.getElementById('card-tag2').textContent   = vars.tag2;

    // ── Timeline ──
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });

    // Act 1
    tl.from('#act1-badge',    { opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.3);
    tl.from('#act1-headline', { y: 50, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.5);
    tl.from('#act1-subtitle', { y: 30, opacity: 0, duration: 0.5, ease: 'power2.out' }, 1.0);

    // Act 2
    tl.from('#act2', { x: -60, opacity: 0, duration: 0.6, ease: 'power3.out' }, 5.2);

    // Act 3
    tl.from('#act3-logo',    { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out' }, 15.3);
    tl.from('#act3-divider', { scaleX: 0, opacity: 0, duration: 0.5, ease: 'power2.out' }, 15.9);
    tl.from('#act3-url',     { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, 16.2);
    // Único exit tween permitido — escena final
    tl.to(['#act3-logo', '#act3-divider', '#act3-url'], { opacity: 0, duration: 0.8, ease: 'power2.in' }, 19.0);

    window.__timelines['root'] = tl;
  </script>
</div>

</body>
</html>
```

- [ ] **Step 2: Verificar que el archivo existe**

```bash
wc -c video/social-reel/index.template.html
```

Expected: el archivo existe y pesa > 5000 bytes.

- [ ] **Step 3: Commit**

```bash
git add video/social-reel/index.template.html
git commit -m "feat: add social-reel composition template (photo tokens pending embed)"
```

---

### Task 4: Script embed.py — embeber fotos como data URIs

**Files:**
- Create: `video/social-reel/embed.py`
- Create (generated): `video/social-reel/index.html`

`embed.py` lee `index.template.html`, sustituye los 7 tokens `__PHOTO_*__` con los data URIs base64 de las fotos, y escribe `index.html`. El resultado es una composición autocontenida que no hace requests de red durante el render headless.

- [ ] **Step 1: Crear embed.py**

Crear el archivo `video/social-reel/embed.py`:

```python
import base64

TOKENS = {
    '__PHOTO_DJ__':          'photos/dj.jpg',
    '__PHOTO_FOTOGRAFIA__':  'photos/fotografia.jpg',
    '__PHOTO_MAQUILLAJE__':  'photos/maquillaje.jpg',
    '__PHOTO_STAFF__':       'photos/staff.jpg',
    '__PHOTO_CATERING__':    'photos/catering.jpg',
    '__PHOTO_VESTUARIO__':   'photos/vestuario.jpg',
    '__PHOTO_MEDIA__':       'photos/media.jpg',
}

with open('index.template.html', 'r') as f:
    html = f.read()

for token, path in TOKENS.items():
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    data_uri = f'data:image/jpeg;base64,{b64}'
    html = html.replace(token, data_uri)
    print(f'  ✓ {token} → {len(data_uri)//1024}KB')

with open('index.html', 'w') as f:
    f.write(html)

print(f'\nindex.html generado — {len(html)//1024}KB total')
```

- [ ] **Step 2: Ejecutar embed.py desde el directorio de la composición**

```bash
cd video/social-reel && python3 embed.py
```

Expected output:
```
  ✓ __PHOTO_DJ__ → 111KB
  ✓ __PHOTO_FOTOGRAFIA__ → 103KB
  ✓ __PHOTO_MAQUILLAJE__ → 132KB
  ✓ __PHOTO_STAFF__ → 118KB
  ✓ __PHOTO_CATERING__ → 101KB
  ✓ __PHOTO_VESTUARIO__ → 99KB
  ✓ __PHOTO_MEDIA__ → 60KB

index.html generado — ~724KB total
```

- [ ] **Step 3: Verificar que index.html no contiene ningún token sin reemplazar**

```bash
grep -c '__PHOTO_' index.html && echo "ERROR: tokens sin reemplazar" || echo "OK: todos los tokens reemplazados"
```

Expected: `OK: todos los tokens reemplazados`

- [ ] **Step 4: Commit**

```bash
cd ../..
git add video/social-reel/embed.py video/social-reel/index.html
git commit -m "feat: embed.py generates index.html with base64 photo data URIs"
```

---

### Task 5: Lint de la composición

**Files:**
- Read: `video/social-reel/index.html` (ya generado)

- [ ] **Step 1: Ejecutar lint**

```bash
cd video/social-reel && npx hyperframes lint
```

Expected output:
```
◆  Linting social-reel/index.html

◇  0 error(s), 0 warning(s)
```

Si hay un warning `timeline_track_too_dense` es aceptable (advisory, no bloquea el render). Si hay **errores**, corregir antes de continuar:

| Error | Causa probable | Fix |
|---|---|---|
| `composition_self_attribute_selector` | CSS usa `[data-composition-id="root"]` en vez de `#root` | Cambiar selector a `#root` en el CSS |
| `root_composition_missing_data_start` | Falta `data-start="0"` en el div raíz | Añadir el atributo |

- [ ] **Step 2: Commit (solo si se hicieron correcciones)**

```bash
cd ../..
git add video/social-reel/index.html video/social-reel/index.template.html
git commit -m "fix: resolve hyperframes lint errors in social-reel composition"
```

---

### Task 6: Render de prueba — clip DJ

**Files:**
- Read: `video/social-reel/vars/dj.json`
- Create: `public/video/reels/dj.mp4`

- [ ] **Step 1: Render el clip de DJ**

```bash
cd video/social-reel
npx hyperframes render \
  --variables-file vars/dj.json \
  --output ../../public/video/reels/dj.mp4
```

Expected output final:
```
◇  /Users/danielacedonunez/pretty-app-roles/public/video/reels/dj.mp4
   X.X MB · ~20s · completed
```

No debe haber mensajes de `Failed to load resource` (las fotos están embebidas como data URIs).

- [ ] **Step 2: Verificar dimensiones y duración con ffprobe**

```bash
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,duration \
  -of default=noprint_wrappers=1 \
  ../../public/video/reels/dj.mp4
```

Expected:
```
width=1080
height=1920
duration=20.XXXXXX
```

- [ ] **Step 3: Verificar que los datos del DJ aparecen correctamente**

```bash
npx hyperframes snapshot \
  --variables-file vars/dj.json \
  --times 8 \
  --output ../../public/video/reels/dj-frame8.png 2>/dev/null || \
  echo "snapshot no disponible en esta versión — verificar visualmente en el browser"
```

Si `snapshot` no está disponible, abrir `http://localhost:8083` (o el puerto donde corra el dev server de pretty-app-roles), navegar a la landing, e inspeccionar visualmente que el video del reel en la sección correspondiente se ve bien.

- [ ] **Step 4: Commit**

```bash
cd ../..
git add public/video/reels/dj.mp4
git commit -m "feat: render social-reel dj clip — 1080x1920 verified"
```

---

### Task 7: Batch render — los 7 clips

**Files:**
- Create: `public/video/reels/fotografia.mp4`
- Create: `public/video/reels/maquillaje.mp4`
- Create: `public/video/reels/staff.mp4`
- Create: `public/video/reels/catering.mp4`
- Create: `public/video/reels/vestuario.mp4`
- Create: `public/video/reels/media.mp4`

- [ ] **Step 1: Render los 6 clips restantes**

```bash
cd video/social-reel
for role in fotografia maquillaje staff catering vestuario media; do
  echo "Rendering $role..."
  npx hyperframes render \
    --variables-file vars/${role}.json \
    --output ../../public/video/reels/${role}.mp4
done
```

Expected: 6 renders completados, cada uno con `completed` en el output.

- [ ] **Step 2: Verificar que existen los 7 MP4s**

```bash
ls -lh ../../public/video/reels/
```

Expected: 7 archivos `.mp4`, cada uno entre 3–8 MB.

- [ ] **Step 3: Verificar dimensiones de todos**

```bash
for f in ../../public/video/reels/*.mp4; do
  dims=$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height \
    -of csv=p=0 "$f" 2>/dev/null)
  echo "$f: $dims"
done
```

Expected: todos muestran `1080,1920`.

- [ ] **Step 4: Commit final**

```bash
cd ../..
git add public/video/reels/
git commit -m "feat: social-reel batch render complete — 7 clips 1080x1920 por rol"
```

---

## Criterios de aceptación globales

- `npx hyperframes lint` → 0 errores
- Los 7 MP4s existen en `public/video/reels/`
- `ffprobe` confirma 1080×1920, ~20s en todos
- Cada clip: el texto de rol, nombre y tags refleja los valores del JSON correspondiente
- El Act 3 hace fade a negro suave — no hay salto al loop (el clip es lineal, no hace loop)
- Sin mensajes `Failed to load resource` en los render logs
