# XPEAK App nativa en condiciones — Fase 1 (Capacitor)

## Contexto

La app iOS/Android actual es la web de XPEAK envuelta en Capacitor sin diferenciación: misma landing pública, mismas rutas SEO (`/contratar-*`, `/p/:slug`, blog, legal), mismo router web con transición fade/reload, mismo sistema visual. Se nota inmediatamente que es "la web metida en un WebView" y eso puede hacer que Apple/Google la rechace en revisión, además de dar una sensación de producto pobre a los usuarios.

Se descartó una reescritura 100% nativa (React Native o Swift/Kotlin) por coste: 2-4 meses, doble mantenimiento de UI, y reinicio del proceso de revisión, sin volumen de usuarios que lo justifique todavía. Esa opción queda como proyecto futuro aparte.

Esta fase reconstruye la app sobre **Capacitor + React existente**, pero tratando la capa nativa como su propio producto: navegación con transiciones y gestos reales, estilo visual propio (claymorphism), y sin ningún rastro de la landing/SEO web dentro del build nativo.

**Prioridad: calidad sobre fecha.** No hay plazo duro; se recorta alcance solo si el propio desarrollo revela que algo no aporta valor suficiente para su coste, no por prisa.

## Objetivo

Que un usuario que abre la app no pueda notar, ni por asomo, que es una web envuelta: navegación, gestos, transiciones y estética deben sentirse de una app nativa construida a propósito.

## Alcance

### 1. Entrada de la app
- Guard por `Capacitor.isNativePlatform()` en el router (`src/App.tsx`): el build nativo nunca monta `Landing`, `Blog*`, `CategoryLanding`, `CityLanding`, ni ninguna ruta SEO pública.
- Con sesión activa → splash de marca → dashboard del rol, sin pantallas intermedias.
- Sin sesión → splash de marca → `/auth`.
- Las páginas legales y de soporte (privacidad, términos, eliminar cuenta, soporte) dejan de ser rutas web sueltas dentro del build nativo: pasan a ser pantallas internas accesibles desde Ajustes del dashboard, con el header/nav nativo de la app (obligatorio para cumplir requisitos de Apple de que estén accesibles sin salir de la app).

### 2. Navegación nativa real
- Sustituir la transición de React Router (fade/reload tipo web) por transiciones de stack nativas: slide horizontal al entrar, slide-back al volver. Implementación vía capa de transición sobre el stack de navegación (evaluar Framer Motion `AnimatePresence` configurado como stack vs. adoptar el motor de navegación de Ionic React solo si aporta más solidez que mantener una capa propia — decisión técnica a tomar en el plan de implementación tras un spike corto).
- Gesto de swipe-back desde el borde izquierdo de pantalla (iOS) para retroceder, coherente con el botón físico de Android (ya gestionado por `initCapacitor`'s `backButton` listener en `src/lib/capacitor.ts`).
- Pull-to-refresh en listados clave: directorio/descubrir, feed de actividad, mensajes.
- Haptics (`@capacitor/haptics`) en acciones clave: confirmar reserva, enviar solicitud Flash Booking, dar like/voto. Vibración sutil, nunca en cada tap — reservado a acciones con intención clara de confirmación.

### 3. Sistema visual claymorphism
- Nuevo set de tokens CSS activos solo bajo `body.is-native-app`, sin tocar los tokens `--nightlife-*` que usa la web.
- Paleta: la actual de marca (crema/blanco de fondo, dorado, verde y azul de acento) — **no negro puro**, corrige la desactualización de `DESIGN.md`.
- Formas: radios generosos (20-28px), componentes con volumen (botones/cards "inflados").
- Sombras: doble sombra suave (clara arriba-izquierda, oscura abajo-derecha) sobre la paleta de marca, sin saturación añadida ni colores nuevos.
- Componentes shadcn/ui compartidos con la web no se duplican: reciben las variantes clay vía clases condicionadas a `.is-native-app`, mismo patrón ya usado para el safe-area nativo.

### 4. Navegación de la app (tabs)
- Se conserva y rediseña visualmente `MobileBottomNav` (ya existe) con el estilo clay.
- Se elimina cualquier chrome heredado de la web dentro del flujo nativo: topbar de landing, footer, menú hamburguesa — quedan sin montar gracias al guard del punto 1, no hace falta ocultarlos con CSS.

## Fuera de alcance (esta fase)

- Reescritura 100% nativa (React Native / Swift+Kotlin) — proyecto futuro aparte, sin fecha.
- Rediseño del estilo visual de la web — los tokens `--nightlife-*` actuales no se tocan.
- Nuevas features de producto — esta fase es de experiencia/arquitectura de la app, no de funcionalidad nueva.

## Testing y verificación

- Los gestos, transiciones y haptics **no se pueden verificar en Chrome DevTools** (el guard `isNative` siempre es `false` en navegador) — requieren `npx cap sync ios/android` + prueba en simulador o dispositivo físico para cada uno.
- Skill `verify-flows` para los flujos críticos que toque el cambio (registro, directorio, Flash Booking, perfil público) tras cada bloque de cambios.
- Antes de enviar a revisión: pasada completa manual en dispositivo físico real (no solo simulador) de: apertura fría de la app, login, navegación entre las pantallas principales de cada rol, swipe-back, pull-to-refresh, y al menos una acción con haptic.

## Riesgos / decisiones abiertas para el plan de implementación

- Elegir motor de transición de stack (Framer Motion vs Ionic React) — spike corto antes de comprometerse.
- Definir en qué listados exactos entra pull-to-refresh (evitar aplicarlo donde no aporte, ej. formularios).
- Alcance exacto de haptics: lista cerrada de acciones antes de implementar, para no caer en vibrar en exceso.
