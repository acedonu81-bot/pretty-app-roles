import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Gift, ChevronRight, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const CANCELLATION_REASONS = [
  { id: 'too_expensive', label: 'El precio es demasiado alto para mí' },
  { id: 'not_using', label: 'No estoy usando la plataforma lo suficiente' },
  { id: 'missing_features', label: 'Faltan funcionalidades que necesito' },
  { id: 'bad_experience', label: 'La experiencia de usuario no me convence' },
  { id: 'found_alternative', label: 'He encontrado una alternativa mejor' },
  { id: 'temporary', label: 'Es temporal, volveré más adelante' },
  { id: 'other', label: 'Otro motivo' },
];

interface CancellationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  planName: string;
}

type Step = 'reason' | 'offer' | 'confirm' | 'done';

const CancellationModal = ({ open, onOpenChange, planId, planName }: CancellationModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('reason');
  const [selectedReason, setSelectedReason] = useState('');
  const [comment, setComment] = useState('');
  const [discountUsed, setDiscountUsed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      setStep('reason');
      setSelectedReason('');
      setComment('');
      // Check if retention discount already used for this plan
      supabase
        .from('retention_discounts' as any)
        .select('id')
        .eq('user_id', user.id)
        .eq('plan', planId)
        .then(({ data }) => {
          setDiscountUsed(!!data && data.length > 0);
        });
    }
  }, [open, user, planId]);

  const handleSubmitReason = () => {
    if (!selectedReason) return;
    if (discountUsed) {
      setStep('confirm');
    } else {
      setStep('offer');
    }
  };

  const handleAcceptOffer = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await (supabase.from('retention_discounts' as any) as any).insert({
        user_id: user.id,
        plan: planId,
        discount_percent: 30,
        duration_months: 3,
      });

      await (supabase.from('cancellation_surveys' as any) as any).insert({
        user_id: user.id,
        plan: planId,
        reason: selectedReason,
        comment: comment || null,
        retention_accepted: true,
      });

      toast.success('¡Genial! Tu descuento del 30% se aplicará durante los próximos 3 meses.');
      onOpenChange(false);
    } catch {
      toast.error('Error al aplicar el descuento. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await (supabase.from('cancellation_surveys' as any) as any).insert({
        user_id: user.id,
        plan: planId,
        reason: selectedReason,
        comment: comment || null,
        retention_accepted: false,
      });

      toast.success('Tu suscripción será cancelada al final del periodo actual.');
      setStep('done');
    } catch {
      toast.error('Error al procesar la cancelación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-[hsl(var(--gold))]/20 bg-background">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {step === 'reason' && 'Antes de irte...'}
            {step === 'offer' && '¡Espera! Tenemos algo para ti'}
            {step === 'confirm' && 'Confirmar cancelación'}
            {step === 'done' && 'Suscripción cancelada'}
          </DialogTitle>
        </DialogHeader>

        {step === 'reason' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Nos encantaría saber por qué quieres cancelar tu plan <span className="font-bold text-[hsl(var(--gold))]">{planName}</span>. Tu opinión nos ayuda a mejorar.
            </p>
            <div className="space-y-2">
              {CANCELLATION_REASONS.map(reason => (
                <button
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                    selectedReason === reason.id
                      ? 'border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/10 text-foreground'
                      : 'border-border/30 hover:border-border/60 text-muted-foreground'
                  }`}
                >
                  {reason.label}
                </button>
              ))}
            </div>
            {selectedReason === 'other' && (
              <Textarea
                placeholder="Cuéntanos más..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="text-sm"
              />
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Volver
              </Button>
              <Button
                disabled={!selectedReason}
                onClick={handleSubmitReason}
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Continuar <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}

        {step === 'offer' && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl border border-[hsl(var(--gold))]/30 bg-[hsl(var(--gold))]/5 text-center space-y-3">
              <Gift size={32} className="mx-auto text-[hsl(var(--gold))]" />
              <h3 className="text-base font-bold text-[hsl(var(--gold))]">
                30% de descuento durante 3 meses
              </h3>
              <p className="text-sm text-muted-foreground">
                Queremos que sigas con nosotros. Te ofrecemos un <span className="font-bold text-foreground">30% de descuento</span> en tu plan <span className="font-bold text-[hsl(var(--gold))]">{planName}</span> durante los próximos 3 meses.
              </p>
              <p className="text-[0.65rem] text-muted-foreground">
                Esta oferta solo es válida una vez por plan.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={() => setStep('confirm')}
              >
                No, cancelar igualmente
              </Button>
              <Button
                onClick={handleAcceptOffer}
                disabled={loading}
                className="flex-1 bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 font-bold"
              >
                {loading ? 'Aplicando...' : '¡Acepto el descuento!'}
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 flex items-start gap-3">
              <AlertTriangle size={20} className="text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-destructive">¿Estás seguro?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Al cancelar tu plan <span className="font-bold">{planName}</span> perderás acceso a: posicionamiento prioritario, sello dorado, estadísticas avanzadas y alertas prioritarias de Flash Booking.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Mantener plan
              </Button>
              <Button
                onClick={handleConfirmCancel}
                disabled={loading}
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {loading ? 'Cancelando...' : 'Confirmar cancelación'}
              </Button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="space-y-5 text-center">
            <CheckCircle size={40} className="mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm font-bold">Tu suscripción ha sido cancelada</p>
              <p className="text-xs text-muted-foreground mt-2">
                Tu acceso al plan {planName} se mantendrá hasta el final del periodo de facturación actual. Después pasarás automáticamente al plan gratuito.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Siempre puedes volver a suscribirte cuando quieras.
              </p>
            </div>
            <Button className="w-full" onClick={() => onOpenChange(false)}>
              Entendido
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CancellationModal;
