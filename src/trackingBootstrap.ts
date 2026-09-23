type Consent = { analytics?: boolean; marketing?: boolean };
type TrackingWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  __xpeakTracking?: (fn: () => void) => void;
  requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
};

const w = window as TrackingWindow;
w.dataLayer = w.dataLayer ?? [];
w.gtag = (...args) => w.dataLayer!.push(args);

let consent: Consent | null = null;
try {
  consent = JSON.parse(localStorage.getItem('xpeak-cookie-consent') ?? 'null') as Consent | null;
} catch {
  consent = null;
}
w.gtag('consent', 'default', {
  ad_storage: consent?.marketing ? 'granted' : 'denied',
  ad_user_data: consent?.marketing ? 'granted' : 'denied',
  ad_personalization: consent?.marketing ? 'granted' : 'denied',
  analytics_storage: consent?.analytics ? 'granted' : 'denied',
});

let started = false;
let pending: Array<() => void> = [];
const localHost = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(location.hostname)
  || location.hostname.endsWith('.local') || location.protocol === 'file:';
w.__xpeakTracking = fn => { if (!localHost) pending.push(fn); };

const start = () => {
  if (started) return;
  started = true;
  for (const event of events) window.removeEventListener(event, start, { passive: true });
  for (const callback of pending) {
    try { callback(); } catch { /* A tracker must not interrupt the app. */ }
  }
  pending = [];
};
const events: Array<keyof WindowEventMap> = ['pointerdown', 'touchstart', 'keydown', 'scroll'];
for (const event of events) window.addEventListener(event, start, { passive: true, once: true });
setTimeout(() => {
  if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 3000 });
  else start();
}, 4000);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') start();
});

w.__xpeakTracking(() => {
  const layer = w.dataLayer!;
  layer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const firstScript = document.getElementsByTagName('script')[0];
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-PHXTFGXK';
  firstScript?.parentNode?.insertBefore(script, firstScript);
});

w.__xpeakTracking(() => {
  let currentConsent: Consent | null = null;
  try { currentConsent = JSON.parse(localStorage.getItem('xpeak-cookie-consent') ?? 'null') as Consent | null; } catch { /* no consent */ }
  if (!currentConsent?.marketing || (window as Window & { fbq?: unknown }).fbq) return;

  const facebook = window as Window & { fbq?: (...args: unknown[]) => void; _fbq?: unknown };
  const fbq = (...args: unknown[]) => {
    if ((fbq as unknown as { callMethod?: (...args: unknown[]) => void }).callMethod) {
      (fbq as unknown as { callMethod: (...args: unknown[]) => void }).callMethod(...args);
    } else {
      ((fbq as unknown as { queue: unknown[][] }).queue).push(args);
    }
  };
  (fbq as unknown as { queue: unknown[][]; loaded: boolean; version: string }).queue = [];
  (fbq as unknown as { loaded: boolean }).loaded = true;
  (fbq as unknown as { version: string }).version = '2.0';
  facebook.fbq = fbq;
  facebook._fbq = fbq;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  fbq('init', '2436920620126360');
  fbq('track', 'PageView');
});
