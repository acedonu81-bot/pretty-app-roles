import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ContactModal = ({ open, onClose }: Props) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const send = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Rellena nombre, email y mensaje.');
      return;
    }
    setSending(true);
    const { error } = await supabase.functions.invoke('send-email', {
      body: { type: 'contact_form', data: form },
    });
    setSending(false);
    if (error) { toast.error('Error al enviar. Inténtalo de nuevo.'); return; }
    toast.success('Mensaje enviado. Te responderemos pronto.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)' }}
          >
            <div className="flex items-center gap-3 px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
                <Mail size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Contacto</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>info@xpeak.site</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">
                <X size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: 'rgba(255,255,255,0.4)' }}>Nombre *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="Tu nombre" className="nightlife-input text-sm !py-2 w-full" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: 'rgba(255,255,255,0.4)' }}>Email *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="tu@email.com" className="nightlife-input text-sm !py-2 w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: 'rgba(255,255,255,0.4)' }}>Teléfono</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="+34 600..." className="nightlife-input text-sm !py-2 w-full" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: 'rgba(255,255,255,0.4)' }}>Asunto</label>
                  <input value={form.subject} onChange={e => set('subject', e.target.value)}
                    placeholder="Consulta, soporte..." className="nightlife-input text-sm !py-2 w-full" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: 'rgba(255,255,255,0.4)' }}>Mensaje *</label>
                <textarea value={form.message} onChange={e => set('message', e.target.value)}
                  placeholder="¿En qué podemos ayudarte?" rows={4}
                  className="nightlife-input text-sm !py-2 w-full resize-none" />
              </div>
            </div>

            <div className="px-5 pb-5">
              <button onClick={send} disabled={sending}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Send size={14} />
                {sending ? 'Enviando...' : 'Enviar mensaje'}
              </button>
              <p className="text-center text-xs mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Te responderemos en menos de 24h.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
