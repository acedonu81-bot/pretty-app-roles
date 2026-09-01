import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Encuesta de salida. Se muestra una sola vez, entre el borrado de datos y el
// cierre de sesión: hace falta que la sesión siga viva porque record_exit_survey
// comprueba auth.uid() contra el claim de la baja.
//
// Responder es opcional a propósito — obligar a rellenarla para poder salir
// sería retener a alguien que ya ha ejercido su derecho de supresión. Por eso
// "Prefiero no decirlo" cierra igual.
//
// Las opciones apuntan a la hipótesis real del negocio (falta de liquidez: pocos
// empresarios buscando), no a un cuestionario genérico de producto: lo que hay
// que poder distinguir es "esto no funciona" de "aquí no hay trabajo".

export const EXIT_REASONS = [
  { id: 'no_work',        label: 'No encontré trabajo' },
  { id: 'few_employers',  label: 'Hay pocos empresarios buscando' },
  { id: 'no_contact',     label: 'Nadie me contactó' },
  { id: 'confusing',      label: 'No entendía cómo funciona' },
  { id: 'price',          label: 'El precio no me compensa' },
  { id: 'other_platform', label: 'Uso otra plataforma' },
  { id: 'technical',      label: 'Problemas técnicos' },
  { id: 'other',          label: 'Otro motivo' },
] as const;

export const EXIT_REASON_LABELS: Record<string, string> =
  Object.fromEntries(EXIT_REASONS.map(r => [r.id, r.label]));

interface Props {
  onDone: () => void;
}

const ExitSurveyModal = ({ onDone }: Props) => {
  const [reason, setReason] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!reason) return;
    setSending(true);
    try {
      const { data: deletionId } = await (supabase.rpc as any)('latest_deletion_id');
      if (deletionId) {
        await (supabase.rpc as any)('record_exit_survey', {
          p_deletion_id: deletionId,
          p_reason: reason,
          p_comment: comment.trim() || null,
        });
      }
    } catch {
      // Si la encuesta falla no se puede bloquear la salida: los datos ya están
      // borrados y la persona tiene derecho a irse.
    }
    onDone();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-survey-title"
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 animate-[fadeIn_0.2s_ease]"
        style={{ background: '#141312', border: '1px solid rgba(212,175,55,0.25)' }}
      >
        <h2 id="exit-survey-title" className="text-lg font-black mb-1" style={{ color: '#F5F5F0' }}>
          Antes de irte
        </h2>
        <p className="text-xs mb-4" style={{ color: 'rgba(245,245,240,0.55)' }}>
          Tus datos ya se han eliminado. Si nos dices qué ha fallado, nos ayudas a arreglarlo.
          Es anónimo y opcional.
        </p>

        <div className="space-y-1.5 mb-4">
          {EXIT_REASONS.map(r => (
            <button
              key={r.id}
              onClick={() => setReason(r.id)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{
                background: reason === r.id ? 'rgba(212,175,55,0.14)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${reason === r.id ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.07)'}`,
                color: reason === r.id ? '#D4AF37' : 'rgba(245,245,240,0.8)',
                fontWeight: reason === r.id ? 700 : 400,
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {reason && (
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value.slice(0, 1000))}
            placeholder="¿Quieres contarnos algo más? (opcional)"
            rows={3}
            className="w-full rounded-lg px-3 py-2 text-sm mb-4 resize-none"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: '#F5F5F0',
            }}
          />
        )}

        <div className="flex gap-2">
          <button
            onClick={onDone}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(245,245,240,0.6)' }}
          >
            Prefiero no decirlo
          </button>
          <button
            onClick={submit}
            disabled={!reason || sending}
            className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-opacity disabled:opacity-30"
            style={{ background: '#D4AF37', color: '#0a0908' }}
          >
            {sending ? 'Enviando…' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitSurveyModal;
