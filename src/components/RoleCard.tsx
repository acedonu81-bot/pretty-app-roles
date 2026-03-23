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
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -12;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
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
      className="glass-panel p-8 text-left cursor-pointer relative overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate('/dashboard', { state: { view: role } })}
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(135deg, rgba(140,82,255,0.1) 0%, transparent 100%)' }}
      />
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative z-10"
        style={{
          background: 'rgba(140,82,255,0.1)',
          border: '1px solid rgba(140,82,255,0.2)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2) inset',
          color: 'var(--nightlife-primary)',
        }}
      >
        {icon}
      </div>
      <h4 className="text-xl font-semibold mb-3 relative z-10">{title}</h4>
      <p className="text-muted-foreground leading-relaxed relative z-10">{description}</p>
    </div>
  );
};

export default RoleCard;
