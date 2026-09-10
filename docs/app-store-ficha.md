# XPEAK — Ficha para App Store Connect

Borrador para cuando se cree la cuenta de Apple Developer. Nada de esto se sube todavía — es preparación.

## Riesgo de review: Guideline 4.2 (Minimum Functionality)

Apple rechaza apps que son solo un sitio web envuelto sin valor añadido sobre
Safari. Argumento preparado para justificar que XPEAK no lo es, si la review
lo cuestiona: **notificaciones push nativas** (`@capacitor/push-notifications`,
ya integrado y con `UIBackgroundModes: remote-notification` declarado) —
funcionalidad que un simple acceso directo de Safari no ofrece. Verificar en
el momento de publicar que las push realmente disparan en un dispositivo real
antes de enviar a review, porque si Apple las prueba y no llegan, el
argumento se cae.

## Identidad

- **Nombre de la app**: XPEAK
- **Categoría primaria**: Lifestyle (Estilo de vida)
- **Categoría secundaria**: Business (Negocios) — App Store permite dos
- **Bundle ID**: com.xpeak.app (ya configurado en capacitor.config.ts)

## Subtítulo (máx. 30 caracteres)

```
DJs y Staff para tu Evento
```
(26 caracteres — cuenta espacios y tildes)

## Palabras clave (máx. 100 caracteres, separadas por comas, sin espacios tras la coma)

```
dj,boda,evento,camarero,fotografo,staff,fiesta,contratar,comunion,festival,animador,mago
```

Nota: no repetir palabras ya usadas en el nombre/subtítulo ("XPEAK", "DJs", "Staff", "Evento") — Apple las indexa igual desde ahí y gastar caracteres en ellas es desperdiciarlos.

## Descripción (máx. 4000 caracteres, se ve completa solo si el usuario despliega "más")

```
XPEAK conecta organizadores de bodas, comuniones y eventos con profesionales verificados en toda España: DJs, fotógrafos, camareros, maquilladoras, magos, animadores y mucho más.

CONTRATA SIN INTERMEDIARIOS
Busca por ciudad, precio y disponibilidad. Cada perfil muestra su tarifa real, portfolio y valoraciones de eventos anteriores. Contacta directamente — sin comisiones, sin sorpresas.

FLASH BOOKING PARA URGENCIAS
¿Necesitas cubrir un evento con pocas horas de antelación? Publica tu petición y recibe respuestas de profesionales disponibles en tu zona en menos de 1 hora.

CONTRATOS DIGITALES
Cierra el trato con un contrato digital automático: precio, horario y condiciones claras desde el primer momento.

PARA PROFESIONALES
¿Eres DJ, camarero, fotógrafo o cualquier otro profesional del sector eventos? Crea tu perfil, publica tu portfolio y recibe ofertas directamente. Sin comisiones sobre tus ingresos.

¿QUÉ PUEDES CONTRATAR?
• DJs y artistas en directo
• Grupos musicales
• Camareros y personal de sala
• Fotógrafos y videógrafos
• Maquilladoras y peluqueras
• Azafatas y promotores
• Magos, humoristas y animadores
• Bailarines y speakers
• Técnicos de sonido y montaje
• Y mucho más

100% gratuito para organizadores. Sin tarjeta de crédito, sin permanencia.
```

## Novedades de la versión (What's New — se actualiza en cada release)

```
Primera versión de XPEAK para iPhone. Contrata DJs, fotógrafos, camareros y profesionales verificados para tu evento, o crea tu perfil profesional y recibe ofertas.
```

## Textos de soporte

- **URL de soporte**: https://xpeak.es/sobre-nosotros — verificado, incluye email de contacto real (info@xpeak.es)
- **URL de marketing**: https://xpeak.es/
- **Política de privacidad**: https://xpeak.es/privacidad ✅ ya existe públicamente

## Clasificación de contenido (Age Rating)

Sin contenido para adultos, violencia ni apuestas — clasificación esperada: **4+**. Revisar en el cuestionario de App Store Connect que ningún ítem (referencias a alcohol en categoría "camareros/bares", por ejemplo) suba la clasificación por encima de 12+; probablemente no aplica pero conviene comprobarlo en el momento.

## Privacidad — datos que la app recoge (para el cuestionario "App Privacy" de Apple)

Basado en lo que existe hoy en el código:

| Dato | ¿Se recoge? | Uso | Vinculado a la identidad |
|---|---|---|---|
| Email | Sí (registro) | Funcionalidad de la app, autenticación | Sí |
| Nombre | Sí (perfil) | Funcionalidad de la app | Sí |
| Foto | Sí (perfil, opcional) | Funcionalidad de la app | Sí |
| Ubicación aproximada (ciudad/zona) | Sí (perfil, elegida a mano) | Funcionalidad de la app | Sí |
| Datos de uso (analítica propia) | Sí (analytics_events) | Analítica | No (sesión anónima salvo login) |
| Identificadores publicitarios | No detectado en el código | — | — |
| Pagos | No — no hay checkout ni Stripe activo en la app | — | — |

**Importante**: verificar esta tabla contra el código real en el momento de rellenar el formulario de Apple — puede haber cambiado entre esta preparación y la publicación real.

## Compras integradas / suscripciones

Ninguna — la plataforma es 100% gratuita (decisión de producto ya tomada, ver commit "Pivot: eliminar suscripciones/pagos"). El formulario de App Store Connect debe marcar "No hay compras integradas".

## Permisos nativos usados (Capacitor)

Verificado directamente en `ios/App/App/Info.plist` (8 sep 2026):

- **Cámara** (`NSCameraUsageDescription`): declarado — "XPEAK necesita acceso a tu cámara para subir fotos a tu perfil profesional." Ojo: **no hay plugin `@capacitor/camera` instalado ni SDK nativo de cámara en el código**. El permiso salta porque el `<input type="file">` estándar del WebView, en iOS, ofrece "Tomar foto" como una de las opciones del selector del sistema — es Apple quien exige el permiso aunque la app no llame a ninguna API de cámara propia. Declarar tal cual en el formulario de privacidad: "acceso a cámara", uso "funcionalidad de la app" (subir foto de perfil).
- **Fotos** (`NSPhotoLibraryUsageDescription`, `NSPhotoLibraryAddUsageDescription`): declarados, mismo motivo — el selector de archivos del sistema.
- **Notificaciones push** (`UIBackgroundModes: remote-notification`, plugin `@capacitor/push-notifications`): sí se usan de verdad. Declarar el propósito en el formulario de Apple.
- **Audio en segundo plano** (`UIBackgroundModes: audio`): declarado en el Info.plist — revisar en el momento de publicar si sigue siendo necesario (reproducción de mixes/audio de perfiles) o es un remanente sin uso; si no se usa, quitarlo simplifica la revisión de Apple.
- No se detecta ubicación GPS nativa ni acceso a contactos en el código.

## Cómo se sirve el contenido — importante para el flujo de release

La app NO carga xpeak.es en vivo por red: `capacitor.config.ts` empaqueta
`dist/` (el build estático) dentro del propio binario. Los datos dinámicos
(login, perfiles, mensajes) sí van por red contra Supabase, pero el HTML/CSS/JS
del sitio queda congelado en el momento de compilar.

**Consecuencia práctica**: cada vez que xpeak.es cambie de verdad (una
categoría nueva, un rediseño), hay que reconstruir y sincronizar antes de
subir un build nuevo a TestFlight/App Store — si no, la app muestra una
versión vieja de la web aunque el backend ya esté actualizado:

```
npm run build:ios   # ya existe en package.json: build + cap sync ios
```

Si en algún momento se decide cargar xpeak.es en vivo por red en vez de
empaquetar (más simple de mantener, pero depende de que el sitio esté siempre
arriba — y ya sabemos que el firewall de Vercel lo tumba a veces), habría que
añadir `server.url` en `capacitor.config.ts`. Decisión pendiente, no tomada
todavía.

## Estado del build

Versión `1.0`, build `1` — nunca se ha publicado a TestFlight ni App Store,
correcto para un primer envío. `ITSAppUsesNonExemptEncryption: false` ya
declarado en Info.plist (sin cifrado propio más allá del HTTPS estándar) —
evita el cuestionario de exportación de cifrado en cada subida.

## Pendiente de decidir/crear antes de subir

1. **Capturas de pantalla** — 3 a 10 por tamaño de dispositivo (obligatorio 6.7" y recomendado 6.5"/5.5"). Se generan navegando la app real una vez esté verificada de punta a punta.
2. **Vídeo de preview** (opcional, máx. 30s) — no imprescindible para el primer envío.
3. **Confirmar la URL de soporte real** — si `/sobre-nosotros` no sirve como página de contacto, crear una específica.
4. **Revisar el cuestionario de privacidad contra el código en el momento real** de publicar, no confiar en esta tabla si ha pasado tiempo.
