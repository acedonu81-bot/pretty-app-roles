import { Toaster as Sonner } from "sonner";

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="8.5" stroke="#22c55e" strokeWidth="1"/>
    <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="8.5" stroke="#ef4444" strokeWidth="1"/>
    <path d="M6 6l6 6M12 6l-6 6" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="8.5" stroke="#D4AF37" strokeWidth="1"/>
    <path d="M9 8v5" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="9" cy="5.5" r="0.75" fill="#D4AF37"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2L16.5 15.5H1.5L9 2Z" stroke="#f59e0b" strokeWidth="1" strokeLinejoin="round"/>
    <path d="M9 8v3.5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="9" cy="13.5" r="0.75" fill="#f59e0b"/>
  </svg>
);

const Toaster = () => {
  return (
    <Sonner
      position="top-center"
      gap={10}
      icons={{
        success: <CheckIcon />,
        error: <ErrorIcon />,
        info: <InfoIcon />,
        warning: <WarningIcon />,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgba(10, 10, 10, 0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: '14px',
          padding: '14px 18px 14px 20px',
          color: '#f0f0f0',
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          fontWeight: '500',
          letterSpacing: '0.01em',
          boxShadow: '0 16px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)',
          minWidth: '340px',
          maxWidth: '420px',
        },
        classNames: {
          toast: 'xpeak-toast',
          title: 'xpeak-toast-title',
          description: 'xpeak-toast-desc',
          success: 'xpeak-toast-success',
          error: 'xpeak-toast-error',
          info: 'xpeak-toast-info',
          warning: 'xpeak-toast-warning',
        },
      }}
    />
  );
};

export { Toaster };
export { toast } from "sonner";
