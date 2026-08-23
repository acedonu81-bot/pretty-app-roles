package com.xpeak.app;

import android.os.Bundle;
import android.webkit.CookieManager;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Android 15 (SDK 35+) dibuja de borde a borde por defecto. Usamos la API
        // moderna WindowCompat en lugar de los flags de systemUiVisibility obsoletos
        // que Play Console marca. El contenido web gestiona los insets vía CSS
        // env(safe-area-inset-*) + viewport-fit=cover (ya presente en index.html).
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        // El WebView de Android bloquea cookies de terceros por defecto — sin
        // esto, el iframe de Cloudflare Turnstile (challenges.cloudflare.com,
        // usado en el captcha de login/registro) nunca completa su verificación
        // y el widget se queda en blanco para siempre, bloqueando el login.
        // No afecta a la web (xpeak.es en navegador normal), solo a esta app.
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(bridge.getWebView(), true);
    }
}
