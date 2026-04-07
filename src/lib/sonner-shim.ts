/**
 * Drop-in replacement for 'sonner' — all toast calls go through XPeakToastProvider.
 * Vite alias redirects: 'sonner' → this file.
 */
import * as XPeakToast from './xpeak-toast';

type Opts = { description?: string; duration?: number };

function toast(title: string, opts?: Opts) {
  XPeakToast._add({ type: 'info', title, ...opts });
}
toast.success = (t: string, o?: Opts) => XPeakToast._add({ type: 'success', title: t, ...o });
toast.error   = (t: string, o?: Opts) => XPeakToast._add({ type: 'error',   title: t, ...o });
toast.info    = (t: string, o?: Opts) => XPeakToast._add({ type: 'info',    title: t, ...o });
toast.warning = (t: string, o?: Opts) => XPeakToast._add({ type: 'warning', title: t, ...o });

/** Noop — rendering handled by XPeakToastProvider in App.tsx */
export const Toaster = () => null;

export { toast };
export default toast;
