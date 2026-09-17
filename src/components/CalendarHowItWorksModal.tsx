import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  audience: 'profesional' | 'organizador';
  onClose: () => void;
}

const COPY = {
  profesional: {
    title: 'Así funciona tu calendario',
    steps: [
      'Marca en verde los días que tienes libres y en rojo los que ya están ocupados.',
      'Cuando un organizador vea tu ficha, solo podrá solicitar los días que marques en verde.',
      'Cada solicitud llega a tu pestaña "Solicitudes" — tú decides si la aceptas o la rechazas.',
    ],
  },
  organizador: {
    title: 'Así reservas una fecha',
    steps: [
      'Los días en verde están libres; los días en rojo ya están ocupados.',
      'Pulsa un día libre para abrir la solicitud de Flash Booking con esa fecha ya rellenada.',
      'El profesional recibirá tu solicitud y decidirá si la acepta — la fecha no queda confirmada hasta entonces.',
    ],
  },
};

const CalendarHowItWorksModal = ({ audience, onClose }: Props) => {
  const copy = COPY[audience];
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-5"
          style={{ background: '#ffffff', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold" style={{ color: '#111' }}>{copy.title}</p>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5">
              <X size={14} style={{ color: '#222' }} />
            </button>
          </div>
          <ol className="space-y-3">
            {copy.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm" style={{ color: '#333' }}>
                <span className="font-bold flex-shrink-0" style={{ color: '#8A6D0F' }}>{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CalendarHowItWorksModal;
