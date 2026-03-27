import { PartyPopper } from 'lucide-react';

const HiringCongratsBanner = () => {
  // This will be dynamically shown when a booking is confirmed
  // For now it's a placeholder that can be toggled via state
  return (
    <div className="glass-panel p-5 mb-5 flex items-center gap-4 animate-[fadeIn_0.4s_ease]"
      style={{ border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.06)' }}>
      <PartyPopper size={28} style={{ color: '#D4AF37' }} />
      <div>
        <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>🎉 ¡Enhorabuena! ¡A reventarlo!</p>
        <p className="text-xs text-muted-foreground">Has sido contratado para un evento. Consulta tu calendario para más detalles.</p>
      </div>
    </div>
  );
};

export default HiringCongratsBanner;
