# ReelsFeed: carrusel horizontal de vídeos por perfil

Fecha: 2026-08-25

## Problema

El feed swipe (`/descubrir`, `ReelsFeed.tsx`) es hoy un scroll vertical entre
perfiles distintos. Cada tarjeta muestra un único fondo: el `bio_video_url`
del profesional si existe (reproducible), o su foto. Un usuario que quiere
ver más de un profesional (por ejemplo, varios vídeos cortos de actuación de
un mismo DJ) no tiene forma de hacerlo sin salir del feed y entrar al perfil
completo.

Además, cada profesional ya puede subir varias "Sesiones de Vídeo"
(`video_session_urls`, gestionadas en `FichaView.tsx`, hasta 10 clips de 60s)
que hoy solo se muestran en la sección "Clips" del perfil público — nunca en
el feed swipe.

## Objetivo

Dentro de cada tarjeta del feed vertical, permitir un gesto horizontal
independiente que recorra todo el contenido de vídeo de ese profesional
(vídeo principal + sesiones), sin interferir con el gesto vertical que
cambia de profesional. Aplica a todos los roles del directorio por igual —
`ReelsFeed` ya es agnóstico de rol, no se introduce ninguna rama por
categoría.

## Diseño

### Estructura de slides por tarjeta

Cada perfil pasa de tener un único fondo a una lista de slides, calculada al
vuelo (no se persiste, no se toca el esquema de `profiles`):

```
slides[0] = foto (siempre existe — o inicial si no hay foto)
slides[1] = bio_video_url, si es un archivo reproducible (mp4/webm/mov/m4v)
slides[2..n] = cada URL de video_session_urls, en orden
```

Si el perfil no tiene ni `bio_video_url` reproducible ni sesiones, la lista
tiene un único slide (comportamiento actual, sin cambios).

### Fuente de datos

`ReelsProfile` (interfaz en `ReelsFeed.tsx`) gana el campo opcional
`video_session_urls?: string[] | null`. La query que arma los perfiles del
feed (`fetchDirectorioProfiles` en `DirectorioPublico.tsx`, reutilizada por
`Descubrir.tsx`) añade esa columna al `select` — ya existe en `profiles`, no
hace falta migración.

### Gestos anidados

- **Vertical** (ya existente, sin cambios de comportamiento): scroll-snap-y
  en el contenedor principal, cambia de perfil. Funciona sin importar en qué
  slide horizontal esté el usuario dentro de la tarjeta actual.
- **Horizontal** (nuevo): cada tarjeta individual contiene su propio
  scroll-snap-x independiente para recorrer sus slides. Al montar una tarjeta
  nueva (tras scroll vertical), su carrusel horizontal arranca siempre en el
  slide 0 — se consigue gratis porque cada tarjeta es una instancia nueva del
  componente con su `scrollLeft` en 0 por defecto.

### Overlay de información

- **Slide 0 (foto)**: overlay inferior igual que hoy — badges, nombre,
  specialty, zona, precio, bio, y los tres botones (Añadir/Ver perfil/
  Contactar). Sin cambios.
- **Slides 1+ (vídeo)**: pantalla completa, sin overlay. El usuario vuelve al
  slide 0 (deslizando a la izquierda) para ver esa información y contactar.

### Indicador de "hay más contenido"

Flecha pequeña en el borde derecho del slide 0, con animación de pulso/parpadeo
CSS (no JS), visible únicamente cuando `slides.length > 1`. No aparece en
perfiles sin vídeo reproducible. Desaparece en los slides 1+ (no hace falta
indicar más contenido a la derecha cuando ya se está navegando entre vídeos —
el propio gesto de deslizar es descubrible en ese punto).

### Indicador de posición horizontal

Un segundo indicador tipo "stories", más pequeño que el vertical existente
(que representa el perfil dentro de la lista), aparece solo dentro de la
tarjeta activa cuando tiene más de un slide. Muestra la posición dentro de
`slides` (ej. 3 segmentos si hay foto + vídeo principal + 1 sesión).

### Reproducción/pausa de vídeo

Mismo patrón que ya usa `ReelMedia` hoy (IntersectionObserver +
`preload="none"` + play/pause por visibilidad), pero el observer se ata al
slide horizontal individual, no a la tarjeta completa. Solo el vídeo del
slide horizontal activo (y visible verticalmente) reproduce; el resto no
carga. No cambia el criterio de rendimiento actual: nunca se cargan vídeos
fuera de pantalla en ninguna dirección de scroll.

### Sonido global

Sin cambios de comportamiento — el toggle de sonido (mudo por defecto) sigue
aplicando a cualquier vídeo que se reproduzca, sea `bio_video_url` o una
sesión.

## Fuera de alcance

- No se toca `SwipeDirectory.tsx` (el carrusel embebido en el directorio
  clásico, distinto componente) — solo `ReelsFeed.tsx`.
- No se añade ninguna UI nueva de subida de vídeo — se reutiliza
  `video_session_urls` tal cual ya lo gestiona `FichaView.tsx`.
- No se cambia el límite de sesiones de vídeo (10) ni su duración (60s).
- No se persiste el slide/posición horizontal entre sesiones — cada vez que
  se entra a `/descubrir` cada tarjeta arranca en su slide 0.

## Testing

- Perfil sin vídeo: comportamiento idéntico al actual (foto, sin flecha, sin
  indicador horizontal).
- Perfil con solo `bio_video_url`: 2 slides, flecha visible en slide 0.
- Perfil con `bio_video_url` + N sesiones: `2 + N` slides.
- Perfil con solo sesiones (sin `bio_video_url` reproducible, ej. enlace de
  YouTube no soportado en este contexto): slides = foto + sesiones.
- Scroll vertical desde un slide horizontal no-0 lleva al slide 0 del
  siguiente perfil.
- Solo el vídeo visible (perfil activo verticalmente + slide activo
  horizontalmente) reproduce; verificar que los demás no cargan (Network
  tab / atributo preload).
