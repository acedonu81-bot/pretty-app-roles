import { type ReactNode, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface RoleCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  role: string;
}

const RoleCard = ({ icon, title, description, role }: RoleCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01,1.01,1.01)`;
    card.style.transition = 'none';
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    card.style.transition = 'transform 0.4s cubic-bezier(0.2,0.8,0.2,1)';
  };

  return (
    <div
      ref={cardRef}
      className="glass-panel p-6 text-left cursor-pointer relative overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate('/dashboard', { state: { view: role } })}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, transparent 100%)' }}
      />
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 relative z-10"
        style={{
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.15)',
          color: '#D4AF37',
        }}
      >
        {icon}
      </div>
      <h4 className="text-base font-bold mb-2 relative z-10">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed relative z-10">{description}</p>
    </div>
  );
};

export default RoleCard;
