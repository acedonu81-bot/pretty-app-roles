import { lazy, Suspense, useRef, useState } from 'react';
import { leerAcuerdo, estadoAcepto, REF_ACUERDO } from '@/lib/acuerdoChat';
import AdjuntoChat from './AdjuntoChat';
import AvatarChat from './AvatarChat';
import { FormCondiciones, TarjetaAcepto, type ReservaAcuerdo } from './AcuerdoAcepto';
import { fechaIso, type Condiciones } from '@/lib/acuerdoChat';
import type { Profile } from '@/data/profiles';

const ContractModal = lazy(() => import('@/components/dashboard/ContractModal'));
import { Send, Shield, MessageSquare, CheckCheck, Check, Clock, Image, X, ArrowLeft, Trash2, MoreVertical, Flag } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  photo_url?: string | null;
  video_url?: string | null;
  read: boolean;
  created_at: string;
  deleted_at?: string | null;
}

// Dentro del chat la fecha ya la ponen los separadores: aquí solo la hora.
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });

interface Props {
  messages: Message[];
  userId: string;
  activeOtherName: string;
  input: string;
  setInput: (v: string) => void;
  sending: boolean;
  uploadingPhoto: boolean;
  bottomRef: React.RefObject<HTMLDivElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onSend: () => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onDeleteMessage?: (messageId: string) => void;
  onDeleteConversation?: () => void;
  onBlockUser?: () => void;
  onReportUser?: (reason: string) => void;
  /** Botón "Acepto" junto al cuadro de escribir (solo organizador ↔ profesional). */
  onAcepto?: (condicionesCodificadas: string) => void;
  /** Profesional del acuerdo, para el contrato opcional en PDF. */
  profesionalAcuerdo?: { userId: string; name: string; role: string } | null;
  /** Reserva creada por cada mensaje que cerró un acuerdo (id del mensaje → reserva). */
  reservasAcuerdo?: Record<string, ReservaAcuerdo>;
  onCancelarAcuerdo?: (reservaId: string, motivo: string) => void;
  onValorarAcuerdo?: () => void;
  /** El profesional acepta el contrato propuesto en el chat. */
  onAceptarAcuerdo?: (ref: string) => void;
}

const REPORT_REASONS = [
  'Contenido ofensivo o abusivo',
  'Acoso o intimidación',
  'Spam o estafa',
  'Suplantación de identidad',
  'Otro motivo',
];

const ChatWindow = ({
  messages, userId, activeOtherName,
  input, setInput,
  sending, uploadingPhoto, bottomRef, fileInputRef,
  onSend, onPhotoUpload, onBack,
  onDeleteMessage, onDeleteConversation, onBlockUser, onReportUser, onAcepto, onAceptarAcuerdo, profesionalAcuerdo, reservasAcuerdo, onCancelarAcuerdo, onValorarAcuerdo,
}: Props) => {
  const { pendientes: aceptanAhora, condiciones: condicionesAbiertas, cierres: acuerdosCerrados } = estadoAcepto(messages);
  const yaAcepte = aceptanAhora.has(userId);
  // Pendiente del otro: ACEPTO acepta sus condiciones sin formulario.
  const otroEsperando = aceptanAhora.size > 0 && !yaAcepte && !!condicionesAbiertas;
  // Id del último "Acepto" del acuerdo abierto (para marcar cuál sigue vigente).
  const ultimoPendienteId = aceptanAhora.size > 0
    ? [...messages].reverse().find(m => !m.deleted_at && leerAcuerdo(m.content)?.ref === REF_ACUERDO)?.id : undefined;
  // Tras cerrar un acuerdo el botón queda en "Cerrado" (no se reabre con un
  // toque); para otro acuerdo, "Nuevo acuerdo" en la tarjeta verde.
  const ultimoAcuerdo = [...messages].reverse().find(m => !m.deleted_at && leerAcuerdo(m.content)?.ref === REF_ACUERDO);
  // Si la reserva se canceló, se puede acordar otra vez.
  const recienCerrado = !!ultimoAcuerdo && acuerdosCerrados.has(ultimoAcuerdo.id) && reservasAcuerdo?.[ultimoAcuerdo.id]?.status !== 'cancelled';
  const [formAcepto, setFormAcepto] = useState<{ inicial: Condiciones | null } | null>(null);
  const [contrato, setContrato] = useState<Condiciones | null | false>(false);
  const pulsarAcepto = () => {
    if (!onAcepto) return;
    if (otroEsperando) onAcepto(condicionesAbiertas);
    else setFormAcepto({ inicial: null });
  };
  const acuerdosAceptados = new Set(messages.map(m => leerAcuerdo(m.content)).filter(a => a?.estado === 'aceptado').map(a => a!.ref));
  const inputRef = useRef<HTMLInputElement>(null);
  const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null);
  const [confirmDeleteMsgId, setConfirmDeleteMsgId] = useState<string | null>(null);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'delete-chat' | 'block' | null>(null);
  const [reportReason, setReportReason] = useState<string | null>(null);



  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat header */}
      <div className="px-4 sm:px-5 py-3.5 flex items-center gap-3.5 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(139,106,0,0.14)', background: '#FFFDF9' }}>
        <button onClick={onBack}
          aria-label="Volver a conversaciones"
          title="Volver a conversaciones"
          className="p-1.5 -ml-1 rounded-full transition-colors hover:bg-[rgba(139,106,0,0.08)]"
          style={{ color: '#5B5238' }}>
          <ArrowLeft size={18} />
        </button>
        <AvatarChat name={activeOtherName} size={42} />
        <div className="flex-1 min-w-0">
          <p className="font-display text-[1rem] font-bold truncate" style={{ color: '#2A2412' }}>{activeOtherName}</p>
          <p className="text-[0.72rem] flex items-center gap-1.5" style={{ color: '#8B6A00' }}>
            <Shield size={11} /> Conversación privada en XPEAK
          </p>
        </div>

        {(onDeleteConversation || onBlockUser || onReportUser) && (
          <div className="relative flex-shrink-0">
            <button onClick={() => setShowHeaderMenu(v => !v)}
              aria-label="Más opciones"
              title="Más opciones"
              className="p-2 rounded-full transition-colors hover:bg-[rgba(139,106,0,0.08)]"
              style={{ color: '#5B5238' }}>
              <MoreVertical size={18} />
            </button>
            {showHeaderMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowHeaderMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-30 rounded-xl overflow-hidden min-w-[180px]"
                  style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                  {onDeleteConversation && (
                    <button onClick={() => { setShowHeaderMenu(false); setConfirmAction('delete-chat'); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors hover:bg-black/5"
                      style={{ color: '#333' }}>
                      <Trash2 size={14} /> Eliminar chat
                    </button>
                  )}
                  {onReportUser && (
                    <button onClick={() => { setShowHeaderMenu(false); setReportReason(REPORT_REASONS[0]); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors hover:bg-black/5"
                      style={{ color: '#333' }}>
                      <Flag size={14} /> Reportar a {activeOtherName}
                    </button>
                  )}
                  {onBlockUser && (
                    <button onClick={() => { setShowHeaderMenu(false); setConfirmAction('block'); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors hover:bg-black/5"
                      style={{ color: '#dc2626' }}>
                      <Shield size={14} /> Bloquear a {activeOtherName}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {reportReason !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setReportReason(null)}>
          <div className="rounded-2xl p-5 max-w-sm w-full" style={{ background: '#ffffff' }} onClick={e => e.stopPropagation()}>
            <p className="text-sm font-bold mb-1">Reportar a {activeOtherName}</p>
            <p className="text-xs text-muted-foreground mb-3">
              Un administrador de XPEAK revisará esta conversación. No podrá deshacerse.
            </p>
            <div className="flex flex-col gap-1.5 mb-4">
              {REPORT_REASONS.map(r => (
                <button key={r} onClick={() => setReportReason(r)}
                  className="text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    background: reportReason === r ? 'rgba(212,175,55,0.12)' : 'rgba(0,0,0,0.03)',
                    border: `1px solid ${reportReason === r ? '#D4AF37' : 'transparent'}`,
                    color: '#222',
                  }}>
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setReportReason(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-bold" style={{ background: 'rgba(0,0,0,0.05)', color: '#333' }}>
                Cancelar
              </button>
              <button onClick={() => { onReportUser?.(reportReason); setReportReason(null); }}
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-white" style={{ background: '#dc2626' }}>
                Reportar
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setConfirmAction(null)}>
          <div className="rounded-2xl p-5 max-w-sm w-full" style={{ background: '#ffffff' }} onClick={e => e.stopPropagation()}>
            <p className="text-sm font-bold mb-1">
              {confirmAction === 'delete-chat' ? 'Eliminar conversación' : `Bloquear a ${activeOtherName}`}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              {confirmAction === 'delete-chat'
                ? 'Se eliminará de tu bandeja. La otra persona seguirá viendo el historial.'
                : 'No podrá enviarte mensajes ni tú a ella. Podrás desbloquearla más adelante.'}
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmAction(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-bold" style={{ background: 'rgba(0,0,0,0.05)', color: '#333' }}>
                Cancelar
              </button>
              <button onClick={() => {
                if (confirmAction === 'delete-chat') onDeleteConversation?.();
                else onBlockUser?.();
                setConfirmAction(null);
              }}
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-white" style={{ background: '#dc2626' }}>
                {confirmAction === 'delete-chat' ? 'Eliminar' : 'Bloquear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 flex flex-col gap-2.5"
        style={{ background: '#FBF8EE' }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <AvatarChat name={activeOtherName} size={64} />
            <p className="font-display text-base font-bold" style={{ color: '#2A2412' }}>Inicia la conversación con {activeOtherName}</p>
            <p className="text-xs max-w-[240px]" style={{ color: '#5B5238' }}>Los mensajes son privados y solo visibles entre vosotros.</p>
          </div>
        )}
        {messages.map((msg, idx) => {
          const isMe = msg.sender_id === userId;
          const prevMsg = messages[idx - 1];
          const showDateSep = !prevMsg || new Date(msg.created_at).toDateString() !== new Date(prevMsg.created_at).toDateString();
          const acuerdo = msg.deleted_at ? null : leerAcuerdo(msg.content);
          const fotoAntigua = msg.content.startsWith('http') && /\.(jpg|jpeg|png|webp|gif)/i.test(msg.content) ? msg.content : null;
          const adjunto = msg.video_url ? { ruta: msg.video_url, tipo: 'video' as const }
            : (msg.photo_url || fotoAntigua) ? { ruta: (msg.photo_url || fotoAntigua)!, tipo: 'foto' as const } : null;

          return (
            <div key={msg.id}>
              {showDateSep && (
                <div className="flex items-center gap-4 my-3">
                  <div className="flex-1 h-px" style={{ background: 'rgba(139,106,0,0.16)' }} />
                  <span className="text-[0.68rem] font-semibold uppercase" style={{ color: '#8B6A00', letterSpacing: '0.16em' }}>
                    {new Date(msg.created_at).toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(139,106,0,0.16)' }} />
                </div>
              )}
              <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} group`}
                onMouseEnter={() => setHoveredMsgId(msg.id)}
                onMouseLeave={() => setHoveredMsgId(null)}>
                {!isMe && (
                  <div className="mb-5"><AvatarChat name={activeOtherName} size={28} /></div>
                )}
                {isMe && onDeleteMessage && !msg.deleted_at && !msg.id.startsWith('tmp-') && (
                  <button onClick={() => setConfirmDeleteMsgId(msg.id)}
                    aria-label="Eliminar mensaje"
                    title="Eliminar mensaje"
                    className="mb-1 p-1 rounded-lg transition-opacity hover:bg-black/5"
                    style={{ opacity: hoveredMsgId === msg.id ? 1 : 0, color: '#333' }}>
                    <Trash2 size={13} />
                  </button>
                )}
                <div className={`max-w-[78%] sm:max-w-[68%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  {msg.deleted_at ? (
                    <div className="px-4 py-2.5 rounded-2xl text-sm italic"
                      style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', color: '#666' }}>
                      Mensaje eliminado
                    </div>
                  ) : acuerdo?.estado === 'cancelado' ? (
                    <div className="px-4 py-2.5 rounded-2xl text-sm" style={{ background: '#F3F4F6', border: '1px solid rgba(0,0,0,0.12)', color: '#4B5563' }}>
                      <p className="font-bold">{isMe ? 'Has cancelado el acuerdo' : `${activeOtherName || 'La otra parte'} ha cancelado el acuerdo`}</p>
                    </div>
                  ) : acuerdo?.estado === 'aceptado' && acuerdo.ref === REF_ACUERDO ? (
                    <TarjetaAcepto resumen={acuerdo.resumen} isMe={isMe} otroNombre={activeOtherName}
                      cerrado={acuerdosCerrados.has(msg.id)}
                      pendienteActual={msg.id === ultimoPendienteId}
                      onProponerOtras={onAcepto ? c => setFormAcepto({ inicial: c }) : undefined}
                      reserva={reservasAcuerdo?.[msg.id] ?? null}
                      onCancelar={onCancelarAcuerdo} onValorar={onValorarAcuerdo}
                      onContrato={profesionalAcuerdo ? c => setContrato(c) : undefined}
                      onNuevoAcuerdo={onAcepto && msg.id === ultimoAcuerdo?.id ? () => setFormAcepto({ inicial: null }) : undefined} />
                  ) : acuerdo ? (
                    <div className="px-4 py-3 rounded-2xl text-sm max-w-[280px]"
                      style={{ background: '#FBF3DD', border: '1px solid rgba(212,175,55,0.5)', color: '#3d300a' }}>
                      <p className="text-[0.75rem] font-black uppercase tracking-wider" style={{ color: '#8B6A00' }}>
                        {acuerdo.estado === 'propuesto' ? 'Propuesta de contrato' : 'Contrato aceptado'}
                      </p>
                      <p className="font-bold mt-0.5">{acuerdo.ref}</p>
                      {acuerdo.resumen && <p className="text-xs mt-0.5">{acuerdo.resumen}</p>}
                      {acuerdo.estado === 'propuesto' && (acuerdosAceptados.has(acuerdo.ref) ? (
                        <p className="text-xs font-bold mt-2" style={{ color: '#059669' }}>Aceptado por los dos</p>
                      ) : isMe ? (
                        <p className="text-xs mt-2" style={{ color: 'rgba(0,0,0,0.55)' }}>Esperando a que {activeOtherName || 'la otra parte'} lo acepte</p>
                      ) : onAceptarAcuerdo ? (
                        <button type="button" onClick={() => onAceptarAcuerdo(acuerdo.ref)} disabled={sending}
                          className="mt-2 w-full px-4 py-2 rounded-full text-xs font-black disabled:opacity-50"
                          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                          Aceptar contrato
                        </button>
                      ) : null)}
                    </div>
                  ) : adjunto ? (
                    <div className="rounded-2xl overflow-hidden"
                      style={{
                        border: `1px solid ${isMe ? 'rgba(139,106,0,0.3)' : 'rgba(139,106,0,0.16)'}`,
                        borderBottomRightRadius: isMe ? 4 : undefined,
                        borderBottomLeftRadius: !isMe ? 4 : undefined,
                      }}>
                      <AdjuntoChat ruta={adjunto.ruta} tipo={adjunto.tipo} />
                    </div>
                  ) : (
                    <div className="px-4 py-2.5 text-[0.92rem]"
                      style={{
                        background: isMe ? '#F1E2B5' : '#FFFFFF',
                        border: `1px solid ${isMe ? 'rgba(139,106,0,0.3)' : 'rgba(139,106,0,0.16)'}`,
                        borderRadius: 18,
                        borderBottomRightRadius: isMe ? 5 : 18,
                        borderBottomLeftRadius: !isMe ? 5 : 18,
                        boxShadow: '0 1px 2px rgba(42,36,18,0.06)',
                        color: '#2A2412',
                        fontWeight: 400,
                        lineHeight: '1.55',
                        overflowWrap: 'anywhere',
                      }}>
                      {msg.content}
                    </div>
                  )}
                  <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-[0.7rem]" style={{ color: '#7A7360' }}>
                      {formatTime(msg.created_at)}
                    </span>
                    {/* tmp-: enviándose (envío optimista de MessagesView). */}
                    {isMe && (msg.id.startsWith('tmp-')
                      ? <Clock size={10} style={{ color: '#888' }} aria-label="Enviando" />
                      : msg.read
                      ? <CheckCheck size={10} style={{ color: '#8A6D0F' }} />
                      : <Check size={10} style={{ color: '#333' }} />)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {confirmDeleteMsgId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setConfirmDeleteMsgId(null)}>
          <div className="rounded-2xl p-5 max-w-sm w-full" style={{ background: '#ffffff' }} onClick={e => e.stopPropagation()}>
            <p className="text-sm font-bold mb-1">Eliminar mensaje</p>
            <p className="text-xs text-muted-foreground mb-4">Se eliminará para ambos. Esta acción no se puede deshacer.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDeleteMsgId(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-bold" style={{ background: 'rgba(0,0,0,0.05)', color: '#333' }}>
                Cancelar
              </button>
              <button onClick={() => { onDeleteMessage?.(confirmDeleteMsgId); setConfirmDeleteMsgId(null); }}
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-white" style={{ background: '#dc2626' }}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input area. Fina (py-2, botones de 40px) y con los iconos sueltos,
          sin cajita gris: con py-3 y tres cajas de 44px se veía una franja
          blanca enorme encima de la barra inferior (16 oct 2026). Sin botón
          de emoticonos: el teclado del móvil ya los trae. */}
      <div className="px-2 sm:px-4 py-2 flex-shrink-0 relative"
        style={{ borderTop: '1px solid rgba(139,106,0,0.14)', background: '#FFFDF9' }}>
        {formAcepto && onAcepto && (
          <FormCondiciones inicial={formAcepto.inicial} otroNombre={activeOtherName} enviando={sending}
            onCancelar={() => setFormAcepto(null)}
            onEnviar={cod => { setFormAcepto(null); onAcepto(cod); }} />
        )}
        {contrato !== false && profesionalAcuerdo && (
          <Suspense fallback={null}>
            <ContractModal
              professional={{ id: 0, userId: profesionalAcuerdo.userId, name: profesionalAcuerdo.name, role: profesionalAcuerdo.role } as unknown as Profile}
              prefill={{
                nombreEvento: contrato?.evento ?? '',
                fechaEvento: contrato?.fecha ? fechaIso(contrato.fecha) : '',
                direccionLocal: contrato?.ciudad ?? '',
                precioNeto: contrato?.precio ?? '',
              }}
              acuerdoCerrado
              onClose={() => setContrato(false)} onSaved={() => setContrato(false)} />
          </Suspense>
        )}
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingPhoto}
            aria-label="Enviar foto o vídeo" title="Enviar foto o vídeo"
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-40"
            style={{ background: 'transparent', color: '#8B6A00' }}>
            {uploadingPhoto
              ? <div className="w-4 h-4 rounded-full border border-t-transparent animate-spin" style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} />
              : <Image size={22} />}
          </button>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm" className="hidden" onChange={onPhotoUpload} />

          {onAcepto && (
            <button type="button" onClick={pulsarAcepto} disabled={sending || yaAcepte || recienCerrado}
              title={yaAcepte ? `Has aceptado. Falta ${activeOtherName || 'la otra parte'}` : 'Aceptar el acuerdo'}
              className="flex-shrink-0 h-10 rounded-full px-3 text-xs font-black transition-all active:scale-95"
              style={yaAcepte || recienCerrado
                ? { background: '#ECFDF5', border: '1px solid rgba(5,150,105,0.4)', color: '#059669' }
                : { background: '#059669', color: '#fff' }}>
              {recienCerrado ? 'Cerrado' : yaAcepte ? 'Aceptado' : 'ACEPTO'}
            </button>
          )}

          <div className="flex-1 relative">
            <input ref={inputRef} type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
              }}
              placeholder="Escribe un mensaje"
              maxLength={1000}
              className="w-full px-4 py-2 rounded-full text-base sm:text-sm outline-none transition-all"
              style={{ background: '#FFFFFF', border: '1px solid rgba(139,106,0,0.25)', color: '#2A2412' }}
              onFocus={e => (e.target.style.borderColor = '#B8941E')}
              onBlur={e => (e.target.style.borderColor = 'rgba(139,106,0,0.25)')}
            />
          </div>

          <button type="button" onClick={() => onSend()} disabled={sending || !input.trim()}
            aria-label="Enviar"
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-40"
            style={{ background: input.trim() ? 'linear-gradient(135deg,#D4AF37,#B8941E)' : 'rgba(139,106,0,0.08)', color: input.trim() ? '#2A2412' : '#8B6A00' }}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const EmptyChatPlaceholder = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-5" style={{ background: '#FBF8EE' }}>
    <div className="w-20 h-20 rounded-full flex items-center justify-center"
      style={{ background: '#FBF3DD', boxShadow: '0 0 0 1px rgba(139,106,0,0.3)' }}>
      <MessageSquare size={30} style={{ color: '#8B6A00' }} />
    </div>
    <div>
      <p className="font-display text-lg font-bold mb-1" style={{ color: '#2A2412' }}>Selecciona una conversación</p>
      <p className="text-xs" style={{ color: '#5B5238' }}>O inicia contacto desde el perfil de un profesional.</p>
    </div>
  </div>
);

export default ChatWindow;
