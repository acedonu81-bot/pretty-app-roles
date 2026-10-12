/**
 * Salida del navegador integrado de Instagram/Facebook/TikTok.
 *
 * Dentro de esos webviews no se puede entrar ni registrarse: Turnstile no
 * resuelve y Google bloquea OAuth con "disallowed_useragent". Pedir "copia el
 * enlace y pégalo en Chrome" no lo hace casi nadie (10 oct 2026), así que se
 * intenta abrir la misma URL en el navegador del móvil con un toque.
 *
 * Ninguno de estos esquemas está documentado y Meta los cambia sin avisar:
 * - Android: intent:// con el paquete de Chrome.
 * - iOS Instagram: instagram://extbrowser/ (abre el navegador predeterminado).
 *   x-safari-https:// dejó de ser fiable en los webviews de Meta a mediados
 *   de 2025, pero sigue sirviendo en Facebook/TikTok/Line como segundo intento.
 * Por eso el aviso con "Copiar enlace" se mantiene siempre como último recurso.
 */

const IN_APP_UA = /TikTok|musical_ly|Instagram|FBAN|FBAV|FB_IAB|Line\//i;

export function isInAppBrowser(ua: string = navigator.userAgent): boolean {
  return IN_APP_UA.test(ua);
}

function escapeUrls(url: string, ua: string): string[] {
  if (/Android/i.test(ua)) {
    const u = new URL(url);
    // El fragmento (#...) no cabe: en un intent:// el # abre la parte Intent.
    return [`intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;package=com.android.chrome;end`];
  }
  const safari = `x-safari-${url}`;
  if (/Instagram/i.test(ua)) return [`instagram://extbrowser/?url=${encodeURIComponent(url)}`, safari];
  return [safari];
}

/**
 * Intento manual (tras un toque del usuario). Si el primer esquema se ignora,
 * se prueba el siguiente; si la página ya pasó a segundo plano es que el
 * navegador se abrió y no se insiste.
 */
export function openInExternalBrowser(url: string = window.location.href) {
  const [first, ...rest] = escapeUrls(url, navigator.userAgent);
  window.location.href = first;
  rest.forEach((next, i) => {
    window.setTimeout(() => {
      if (document.visibilityState === 'visible') window.location.href = next;
    }, 700 * (i + 1));
  });
}

/**
 * Intento automático al llegar, una vez por sesión. Va por <meta refresh> y no
 * por window.location: el webview de Instagram en iOS descarta en silencio las
 * navegaciones por script sin toque del usuario, pero sí sigue un refresh
 * declarativo. Si tampoco funciona no pasa nada: queda el botón.
 */
export function tryAutoEscapeInAppBrowser(url: string = window.location.href) {
  const KEY = 'xpeak_inapp_escape_tried';
  try {
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, '1');
  } catch {
    return;
  }
  const meta = document.createElement('meta');
  meta.httpEquiv = 'refresh';
  meta.content = `0;url=${escapeUrls(url, navigator.userAgent)[0]}`;
  document.head.appendChild(meta);
  window.setTimeout(() => meta.remove(), 1500);
}
