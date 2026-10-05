import { useState, useEffect } from 'react';
import { Disc3, X, Plus, Link, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { type ProductionType, PRODUCTION_PLATFORM_LABEL, detectProductionType, buildProductionEmbedSrc } from '@/lib/productions';

const MAX_PRODUCTIONS = 15;

interface Production {
  url: string;
  type: ProductionType;
}

function ProductionCard({ production, onRemove }: { production: Production; onRemove: () => void }) {
  const embedSrc = buildProductionEmbedSrc(production.url, production.type);
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}>
        <Disc3 size={14} style={{ color: '#2563EB' }} />
        <span className="text-xs font-medium flex-1 truncate opacity-70">{PRODUCTION_PLATFORM_LABEL[production.type]}</span>
        <a href={production.url} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100">
          <ExternalLink size={13} />
        </a>
        <button onClick={onRemove}><X size={14} className="text-muted-foreground hover:text-white" /></button>
      </div>
      {embedSrc ? (
        <iframe
          src={embedSrc}
          width="100%"
          height={production.type === 'youtube' ? 180 : 152}
          allow="autoplay; encrypted-media"
          className="rounded-lg"
          style={{ border: 'none' }}
        />
      ) : (
        <a
          href={production.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--nightlife-border)', color: '#8A6D0F' }}>
          Abrir en {PRODUCTION_PLATFORM_LABEL[production.type]} <ExternalLink size={13} />
        </a>
      )}
    </div>
  );
}

const ProductionsUpload = () => {
  const [productions, setProductions] = useState<Production[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data: prof } = await supabase.from('profiles')
        .select('production_urls').eq('user_id', user.id).maybeSingle();
      const urls: string[] = (prof as any)?.production_urls ?? [];
      const loaded = urls.map(url => ({ url, type: detectProductionType(url) })).filter((p): p is Production => !!p.type);
      setProductions(loaded);
      setLoaded(true);
    };
    load();
  }, [user]);

  const persist = async (next: Production[]) => {
    const { error } = await supabase.from('profiles')
      .update({ production_urls: next.map(p => p.url) } as any).eq('user_id', user!.id);
    return error;
  };

  const handleAddLink = async () => {
    const url = linkInput.trim();
    if (!url) return;
    const type = detectProductionType(url);
    if (!type) {
      toast.error('Pega un link de Spotify, Apple Music, YouTube, Bandcamp, Beatport o Patreon');
      return;
    }
    if (productions.length >= MAX_PRODUCTIONS) {
      toast.error(`Máximo ${MAX_PRODUCTIONS} producciones permitidas.`);
      return;
    }
    const next = [...productions, { url, type }];
    const error = await persist(next);
    if (error) {
      toast.error('No se pudo añadir la producción. Inténtalo de nuevo.');
      return;
    }
    setProductions(next);
    setLinkInput('');
    setShowLinkInput(false);
    toast.success('Producción añadida correctamente.');
  };

  const removeProduction = async (production: Production) => {
    const next = productions.filter(p => p !== production);
    const error = await persist(next);
    if (error) {
      toast.error('No se pudo eliminar de tu perfil. Inténtalo de nuevo.');
      return;
    }
    setProductions(next);
    toast.info('Producción eliminada.');
  };

  const canAdd = productions.length < MAX_PRODUCTIONS;

  return (
    <div className="glass-panel p-4">
      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
        <Disc3 size={16} style={{ color: '#2563EB' }} /> Producciones
        <span className="text-xs text-muted-foreground ml-auto">
          {productions.length}/{MAX_PRODUCTIONS}
        </span>
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        Enlaza tus lanzamientos: pega un link de Spotify, Apple Music, YouTube, Bandcamp, Beatport o Patreon
      </p>

      {productions.length > 0 && (
        <div className="space-y-3 mb-3">
          {productions.map((p, i) => (
            <ProductionCard key={i} production={p} onRemove={() => removeProduction(p)} />
          ))}
        </div>
      )}

      {canAdd && showLinkInput && (
        <div className="flex gap-2 mb-3">
          <input
            type="url"
            value={linkInput}
            onChange={e => setLinkInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddLink()}
            placeholder="https://open.spotify.com/... · music.apple.com/... · youtube.com/... · bandcamp.com/... · beatport.com/... · patreon.com/..."
            className="nightlife-input text-base flex-1"
          />
          <button onClick={handleAddLink}
            className="px-3 py-2 rounded-lg text-xs font-bold"
            style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.3)' }}>
            Añadir
          </button>
          <button onClick={() => setShowLinkInput(false)}
            className="px-2 py-2 rounded-lg"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid var(--nightlife-border)' }}>
            <X size={14} className="text-muted-foreground" />
          </button>
        </div>
      )}

      {canAdd && !showLinkInput && (
        <button
          onClick={() => setShowLinkInput(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed transition-all hover:scale-[1.01]"
          style={{ borderColor: 'rgba(37,99,235,0.2)', color: '#2563EB', background: 'rgba(37,99,235,0.03)' }}>
          <Link size={16} />
          <span className="text-sm font-bold">Añadir enlace</span>
        </button>
      )}
    </div>
  );
};

export default ProductionsUpload;
