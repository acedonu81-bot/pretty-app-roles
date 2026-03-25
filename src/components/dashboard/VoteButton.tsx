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
}

const VoteButton = ({ profileId, voteCount, hasVotedToday: initialVoted, category }: VoteButtonProps) => {
  const [voted, setVoted] = useState(initialVoted);
  const [count, setCount] = useState(voteCount);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  if (category !== 'rookie') return null;

  const handleVote = async () => {
    if (!user) { toast.error('Inicia sesión para votar'); return; }
    if (voted) return;
    setLoading(true);
    const { error } = await supabase.from('community_votes').insert({
      voter_id: user.id,
      profile_id: profileId,
    } as any);
    if (error) {
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        toast.error('Ya has votado hoy');
        setVoted(true);
      } else {
        toast.error('Error al votar');
      }
    } else {
      setVoted(true);
      setCount(c => c + 1);
      toast.success('¡Apoyo registrado!');
    }
    setLoading(false);
  };

  const progress = Math.min((count / 500) * 100, 100);

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #D4AF37, #22c55e)' }} />
        </div>
        <span className="text-[0.55rem] font-bold" style={{ color: '#D4AF37' }}>{count}/500</span>
      </div>
      <button onClick={handleVote} disabled={voted || loading}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition-all disabled:opacity-50"
        style={{
          background: voted ? 'rgba(255,255,255,0.03)' : 'rgba(212,175,55,0.08)',
          border: `1px solid ${voted ? 'rgba(255,255,255,0.1)' : 'rgba(212,175,55,0.2)'}`,
          color: voted ? '#8E8EA0' : '#D4AF37',
        }}>
        <Heart size={12} fill={voted ? '#8E8EA0' : 'none'} />
        {voted ? 'Votado (24h)' : loading ? 'Votando...' : 'Apoyar Talento'}
      </button>
    </div>
  );
};

export default VoteButton;
