package com.xpeak.app;

import android.os.Bundle;
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
    }
}
