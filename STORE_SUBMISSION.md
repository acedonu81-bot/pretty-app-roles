# XPEAK — App Store & Google Play Submission Guide

**App ID:** `com.xpeak.app`  
**Version:** 1.0.0 (versionCode 1)  
**Framework:** Capacitor 8 (Vite/React SPA wrapped in native shell)

---

## Workflow (siempre que hagas cambios)

```bash
# 1. Build web
npm run build

# 2. Sync assets a ambos proyectos nativos
npx cap sync

# 3. Abrir en Xcode (iOS)
npm run cap:open:ios

# 4. Abrir en Android Studio (Android)
npm run cap:open:android
```

---

## iOS — App Store Connect

### Requisitos previos
- [ ] **Apple Developer account** — $99/año — developer.apple.com
- [ ] **Xcode 16+** instalado en Mac
- [ ] **Bundle ID registrado** en Apple Developer Portal: `com.xpeak.app`
- [ ] **Certificado de distribución** + **Provisioning Profile** (App Store Distribution)

### Iconos requeridos (iOS)
Genera todos los tamaños con [makeappicon.com](https://makeappicon.com) o Figma exportando desde 1024x1024px:

| Tamaño | Uso |
|--------|-----|
| 1024x1024 | App Store listing |
| 180x180 | iPhone @3x |
| 120x120 | iPhone @2x |
| 167x167 | iPad Pro |
| 152x152 | iPad @2x |
| 76x76 | iPad @1x |

Coloca los PNGs en: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Screenshots requeridos (App Store)
- iPhone 6.9" (iPhone 16 Pro Max): 1320×2868px — **mínimo 3**
- iPhone 6.7" (iPhone 14 Plus): 1290×2796px
- iPad 13" Pro (M4): 2064×2752px — si quieres soporte iPad

### Pasos en Xcode
1. Abrir `ios/App/App.xcworkspace` (siempre `.xcworkspace`, nunca `.xcodeproj`)
2. Seleccionar target `App` → General:
   - Display Name: `XPEAK`
   - Bundle Identifier: `com.xpeak.app`
   - Version: `1.0.0`
   - Build: `1`
3. Signing & Capabilities:
   - Team: seleccionar tu Apple Developer account
   - Signing Certificate: Apple Distribution
   - Provisioning Profile: el que creaste en Developer Portal
4. Capabilities añadir si no están: Push Notifications, Background Modes (Remote notifications + Audio)
5. Product → Archive → Validate → Distribute App → App Store Connect

### App Store Connect — ficha de la app
- **Nombre:** XPEAK
- **Subtítulo:** Red profesional del ocio nocturno
- **Categoría principal:** Business
- **Categoría secundaria:** Social Networking
- **Descripción (ES):** *(ver abajo)*
- **Keywords:** DJ, staff discoteca, booking, ocio nocturno, RRPP, promotor, artistas
- **URL de soporte:** https://xpeak.es/contacto
- **URL de privacidad:** https://xpeak.es/privacidad
- **Precio:** Gratis (con compras integradas — si añades Stripe IAP en futuro)
- **Rating:** 12+ (alcohol references)

#### Descripción App Store (ES)
```
XPEAK es la primera red profesional del ocio nocturno en España. Conecta DJs, artistas, staff, RRPP, maquillaje, fotografía y empresarios de sala en un solo lugar.

✦ PARA PROFESIONALES
Crea tu perfil, sube tu portafolio y activa el Flash Booking para recibir ofertas urgentes de trabajo. Streaming en directo desde el Escenario Virtual.

✦ PARA EMPRESARIOS Y SALAS
Encuentra talento verificado al instante. Publica Flash Jobs para cubrir urgencias. Accede a riders técnicos y tarifas reales.

✦ FUNCIONALIDADES
• Flash Booking — contratación urgente en minutos
• Directorio profesional con filtros por zona y especialidad
• Mensajería directa con contratos y acuerdos
• Estadísticas de perfil y visibilidad
• Fan Club — monetización para artistas

La plataforma que faltaba en la industria del ocio nocturno español.
```

---

## Android — Google Play Console

### Requisitos previos
- [ ] **Google Play Developer account** — $25 (pago único) — play.google.com/console
- [ ] **Android Studio** instalado
- [ ] **Keystore para firma** (¡guardar de forma segura, sin esto no puedes actualizar la app nunca!)

### Generar Keystore de firma (solo una vez)
```bash
keytool -genkey -v \
  -keystore xpeak-release.keystore \
  -alias xpeak \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```
**IMPORTANTE:** Guarda `xpeak-release.keystore` + contraseña en lugar seguro (1Password, etc.). Si lo pierdes, no podrás publicar actualizaciones.

### Configurar firma en build.gradle
Añadir en `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('/ruta/a/xpeak-release.keystore')
            storePassword 'TU_STORE_PASSWORD'
            keyAlias 'xpeak'
            keyPassword 'TU_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
        }
    }
}
```

### Iconos requeridos (Android)
Genera todos los tamaños con Android Studio Image Asset Studio o makeappicon.com:

| Carpeta | Tamaño |
|---------|--------|
| mipmap-mdpi | 48x48 |
| mipmap-hdpi | 72x72 |
| mipmap-xhdpi | 96x96 |
| mipmap-xxhdpi | 144x144 |
| mipmap-xxxhdpi | 192x192 |
| (Play Store listing) | 512x512 |

Ruta: `android/app/src/main/res/mipmap-*/ic_launcher.png`

### Build APK/AAB para Play Store
```bash
# En Android Studio:
# Build → Generate Signed Bundle/APK → Android App Bundle → elegir keystore → Release

# O por CLI:
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```
Play Store **requiere AAB** (no APK) para nuevas apps desde 2021.

### Screenshots requeridos (Play Store)
- Teléfono: mínimo 2, máximo 8 — 1080x1920px o 1080x2340px
- Tablet 7": opcional
- Icono de funcionalidad (Feature Graphic): 1024x500px

### Google Play Console — ficha de la app
- **Nombre:** XPEAK
- **Descripción corta (80 chars):** La red profesional del ocio nocturno en España
- **Categoría:** Empresa / Profesional
- **Email de contacto:** acedonu81@gmail.com
- **URL de privacidad:** https://xpeak.es/privacidad
- **Tipo de contenido:** Para todos (con mención a temática de ocio nocturno)

---

## Assets a preparar (ambas plataformas)

### Splash Screen
- Archivo: imagen centrada con logo XPEAK sobre fondo `#080808`
- iOS: coloca en `ios/App/App/Assets.xcassets/Splash.imageset/`
- Android: coloca en `android/app/src/main/res/drawable-*/splash.png`

El plugin `@capacitor/splash-screen` ya está configurado en `capacitor.config.ts`:
```
launchShowDuration: 2000
backgroundColor: '#080808'
spinnerColor: '#D4AF37'
```

### Dimensiones recomendadas splash
| Carpeta Android | Tamaño |
|-----------------|--------|
| drawable-mdpi | 320x480 |
| drawable-hdpi | 480x800 |
| drawable-xhdpi | 720x1280 |
| drawable-xxhdpi | 960x1600 |
| drawable-xxxhdpi | 1280x1920 |

---

## Deep Linking (Universal Links / App Links)

Para que `https://xpeak.es/...` abra la app en lugar del navegador:

### iOS — Associated Domains
1. En Xcode → Signing & Capabilities → + Capability → Associated Domains
2. Añadir: `applinks:xpeak.es`
3. Crear `/.well-known/apple-app-site-association` en xpeak.es:
```json
{
  "applinks": {
    "apps": [],
    "details": [{
      "appID": "TEAMID.com.xpeak.app",
      "paths": ["*"]
    }]
  }
}
```
*(Reemplazar TEAMID con tu Apple Team ID)*

### Android — App Links
Añadir en `AndroidManifest.xml` dentro del `<activity>`:
```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="xpeak.es" />
</intent-filter>
```
Y crear `/.well-known/assetlinks.json` en xpeak.es.

---

## Checklist final antes de subir

### iOS
- [ ] Iconos en todos los tamaños en xcassets
- [ ] Splash screen configurado
- [ ] Bundle ID `com.xpeak.app` coincide con Developer Portal
- [ ] Certificado de distribución válido
- [ ] Push Notifications capability activada
- [ ] `ITSAppUsesNonExemptEncryption = false` en Info.plist ✅ (ya añadido)
- [ ] Permisos NSCamera/NSPhotoLibrary/NSMicrophone con descripciones ✅ (ya añadido)
- [ ] Probado en dispositivo real (no solo simulador)
- [ ] Archive → Validate → sin errores
- [ ] Screenshots en App Store Connect

### Android  
- [ ] Iconos en todos los mipmap folders
- [ ] Keystore generado y guardado de forma segura
- [ ] build.gradle con signingConfig release
- [ ] AAB generado con `./gradlew bundleRelease`
- [ ] Permisos correctos en AndroidManifest.xml ✅ (ya añadido)
- [ ] targetSdkVersion ≥ 34 (requisito Play Store 2024)
- [ ] Probado en dispositivo real
- [ ] Screenshots + Feature Graphic en Play Console

---

## Notas importantes

1. **Revisión Apple:** puede tardar 1-7 días. Primera revisión suele ser más lenta.
2. **Revisión Google:** generalmente 1-3 días para nuevas apps.
3. **Actualizaciones:** siempre `npm run build && npx cap sync` antes de abrir Xcode/Android Studio.
4. **Versión:** incrementar `versionCode` (Android) y `Build number` (iOS) en cada actualización.
5. **Stripe en iOS:** si añades pagos in-app, Apple cobra 30% de comisión. Considera usar el flujo web (Safari) para suscripciones.
