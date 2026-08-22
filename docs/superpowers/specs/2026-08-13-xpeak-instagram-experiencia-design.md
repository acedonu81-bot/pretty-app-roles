# Diseño — XPEAK "Instagram": experiencia de feed vertical

**Fecha:** 2026-08-13
**Objetivo:** Convertir XPEAK de web estática a una experiencia tipo Instagram/Reels para el usuario logueado, sin perder la capa pública indexable (SEO/GEO). Motivación del usuario: "es el formato definitivo que todo el mundo quiere; da vida a la web; contenido inacabable".

---

## Contexto verificado (competencia + tendencia)

- **Vendorspace** = "Tinder para organizadores de eventos": swipe de proveedores con foto, vídeo 360°, ratings, filtro por servicio/fecha. Valida el formato.
- **Swipecast** = marketplace de swipe para bookear creativos.
- **Tendencia 2026:** el feed vertical tipo TikTok es el estándar de descubrimiento en marketplaces. TikTok Shop $66B (2025) → $87B proyectado (2026). Clave: contenido + acción en el MISMO feed, sin sacar al usuario.

Aprendizajes aplicados:
1. Cada tarjeta necesita foto/vídeo + **rating visible** → sube prioridad del flujo de reseñas.
2. Acciones ("Mi evento", reservar) DENTRO del feed, sin cambiar de pantalla.
3. Filtro de rol visible pero no obligatorio (no rompe el descubrimiento).

## Principio rector: arquitectura de DOS CAPAS

| Capa | Quién la ve | Estado |
|---|---|---|
| **Pública (SEO/GEO)** | Visitantes nuevos + Google + IAs | Landing, blogs, 26 landings ocasión×rol, perfiles /p/. **Indexable. Se mantiene.** |
| **App "Instagram"** | Solo usuarios logueados | Feed vertical, menú ☰, rol por tipo de cuenta. **Recompensa de registrarse.** |

Esta separación PROTEGE todo el trabajo SEO/GEO ya hecho. El feed dinámico no lo leen las IAs, por eso vive detrás de login.

## Decisiones del usuario (recogidas en brainstorming)

- Feed Instagram **solo para logueados**.
- Logueado que vuelve → **salta landing y login** → directo a su experiencia según tipo de cuenta.
- **Organizador** → feed vertical de profesionales. **Profesional** → su dashboard actual (Fase 1).
- **Fase 2 (no ahora):** feed del profesional con ofertas/eventos deslizables; y feed "todo mezclado" (variedad de profesionales para el organizador; variedad de ofertas para el profesional — nunca mezclar los dos mundos).
- Feed = **scroll vertical tipo Reels** (no swipe horizontal), en **bucle infinito**.
- Landing **ligera**: un solo camino claro (un CTA primario dominante).
- Menú **☰** en esquina → selector de rol vistoso.
- Orden de construcción: **de abajo hacia arriba** = primero el feed (cimiento), luego landing y login.

## Alcance Fase 1 (lo que se construye)

### 1. Feed vertical (el corazón) — evolución de /descubrir
- Scroll vertical infinito (deslizar arriba = siguiente profesional).
- Cada profesional a pantalla completa: foto/vídeo de fondo, nombre, rol, zona, precio, ⭐ rating, bio corta.
- Acciones superpuestas: añadir a "Mi evento", ver perfil, reservar/contactar.
- Bucle: al acabar la lista, vuelve a empezar (feed inacabable).
- Solo accesible logueado (o con CTA de registro si entra sin sesión).

### 2. Menú ☰ (esquina superior)
- Panel deslizable con selector de rol VISTOSO (iconos grandes / foto por categoría, más rico que las tarjetas actuales de /descubrir).
- Elegir rol → filtra el feed a ese rol.
- Incluye: "Mi evento" (carrito), cuenta, salir.

### 3. Landing ligera
- Un titular potente + UN CTA primario dominante ("Descubrir profesionales" → feed/registro).
- Enlace secundario pequeño "Soy profesional".
- FAQ/categorías/blogs → footer o menú, fuera de la primera pantalla.
- Regla: un CTA primario por pantalla, resto subordinado.

### 4. Login inteligente
- Sesión activa → salta landing + login → feed (organizador) o dashboard (profesional), según tipo de cuenta.
- Sin sesión → landing ligera → registro/login → entra.
- Se apoya en useAuth existente.

## No-objetivos (YAGNI / Fase 2+)

- Feed del profesional (ofertas deslizables) — se diseña en Fase 2.
- Feed "todo mezclado" — Fase 2.
- Vídeo autoplay en el feed (empezar con foto; vídeo si el profesional lo tiene, sin autoplay pesado).
- No tocar la capa pública/SEO ni el dashboard del profesional.

## Arquitectura técnica (reutilización)

- Base: el componente de swipe actual (`SwipeDirectory`) ya soporta fullscreen, acciones (onAddToCart/onOpenProfile/onBookNow), bucle circular y (recién añadido) bloqueo de scroll del body + touch-action. Se **evoluciona** a scroll vertical, no se reescribe.
- Datos: `fetchDirectorioProfiles(dbRole, city)` ya exportado. Se reutiliza.
- Roles: `ROLE_CONFIG` / `ALL_ROLES` ya exportados.
- Carrito: `eventCart` (`addToCart`, `useEventCart`) ya existe.
- Auth: `useAuth` para el login inteligente.
- Rol por tipo de cuenta: leer el `role` del perfil logueado (organizador → feed; profesional → dashboard).

## Riesgos / tensiones

- **SEO vs Instagram:** resuelto con las dos capas. El feed NO sustituye la landing pública indexable.
- **Pocos profesionales reales (≈3 DJs):** el bucle infinito lo disimula, pero el feed luce con volumen → captar oferta sigue importando. Verificar sensación con datos reales antes de dar por bueno.
- **Reseudas vacías:** el feed necesita ⭐ para competir con Vendorspace → el flujo de reseñas ligadas a profesional pasa a ser dependencia, no opcional.

## Verificación (regla falsable del usuario)

- Cada pieza verificada en navegador móvil real (skill verify-flows) antes de dar por buena.
- Feed: deslizar arriba pasa de profesional, en bucle, sin bloqueo de gesto.
- Login: logueado entra directo (medir que no ve landing ni login).
- Landing: un visitante nuevo identifica el CTA primario en <3 s (test con el usuario / su pareja).

## Plan de ejecución (de abajo hacia arriba)

1. **Feed vertical** (evolucionar /descubrir a scroll Reels + menú ☰). Verificar en móvil.
2. **Login inteligente** (logueado → directo según tipo de cuenta).
3. **Landing ligera** (un CTA primario, resto al footer/menú).
4. (Dependencia recomendada en paralelo) **Flujo de reseñas** para poblar ⭐ en el feed.
