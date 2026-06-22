import { useState } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface VoteButtonProps {
  profileId: string;
  voteCount: number;
  hasVotedToday: boolean;
  category: string;
  onVoted?: () => void;
}

const VoteButton = ({ profileId, voteCount, hasVotedToday, category, onVoted }: VoteButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  if (category !== 'rookie' && category !== 'promesa') return null;

  const handleVote = async () => {
    if (!user) { toast.error('Inicia sesión para votar'); return; }
    if (hasVotedToday) return;
    setLoading(true);
    const { error } = await supabase.from('votes' as any).insert({
      voter_id: user.id,
      profile_id: profileId,
    } as any);
    if (error) {
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        toast.error('Ya has votado hoy');
        onVoted?.();
      } else {
        toast.error('Error al votar');
      }
    } else {
      onVoted?.();
      toast.success('¡Apoyo registrado!');
    }
    setLoading(false);
  };

  const progress = Math.min((voteCount / 500) * 100, 100);

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.05)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #D4AF37, #22c55e)' }} />
        </div>
        <span className="text-[0.75rem] font-bold" style={{ color: '#D4AF37' }}>{voteCount}/500</span>
      </div>
      <button onClick={handleVote} disabled={hasVotedToday || loading}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition-all disabled:opacity-50"
        style={{
          background: hasVotedToday ? 'rgba(0,0,0,0.03)' : 'rgba(212,175,55,0.08)',
          border: `1px solid ${hasVotedToday ? 'rgba(0,0,0,0.08)' : 'rgba(212,175,55,0.2)'}`,
          color: hasVotedToday ? '#3d3d4e' : '#D4AF37',
        }}>
        <Heart size={12} fill={hasVotedToday ? '#3d3d4e' : 'none'} />
        {hasVotedToday ? 'Votado' : loading ? 'Votando...' : 'Apoyar Promesa'}
      </button>
    </div>
  );
};

export default VoteButton;
