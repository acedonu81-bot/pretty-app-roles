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
      position="bottom-center"
      gap={6}
      icons={{
        success: <CheckIcon />,
        error: <ErrorIcon />,
        info: <InfoIcon />,
        warning: <WarningIcon />,
      }}
      toastOptions={{
        duration: 2800,
        style: {
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(212,175,55,0.12)',
          borderRadius: '10px',
          padding: '9px 14px 9px 12px',
          color: '#f0f0f0',
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          fontWeight: '500',
          letterSpacing: '0.01em',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          minWidth: '0',
          maxWidth: '300px',
          width: 'auto',
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
