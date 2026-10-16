import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { marcarAvisosMensajesLeidos } from '@/hooks/useDashboardBadges';
import { sanitizeInput } from '@/lib/contentFilter';
import { conversationPair } from '@/lib/conversationPair';
import { toast } from 'sonner';
import ConversationList from './messages/ConversationList';
import ChatWindow, { EmptyChatPlaceholder } from './messages/ChatWindow';
import { leerAcuerdo, leerCondiciones, fechaIso, mensajeAceptado, mensajeAcepto, estadoAcepto, vistaPrevia } from '@/lib/acuerdoChat';
import type { ReservaAcuerdo } from './messages/AcuerdoAcepto';
import { useNavigate } from 'react-router-dom';
import { celebrar } from '@/components/FuegosArtificiales';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { isNative } from '@/lib/capacitor';
import { useAltoLibreEnPanel } from '@/hooks/useAltoLibreEnPanel';
import { RefreshCw } from 'lucide-react';
import { askForPush } from '@/lib/pushAsk';

// Los resultados de búsqueda mostraban el rol tal cual sale de BD
// ('photo-booth', 'grupo-musical'). Etiquetas legibles para el usuario.
const ROLE_LABEL: Record<string, string> = {
  dj: 'DJ / Artista', 'grupo-musical': 'Grupo musical', media: 'Media', fotografo: 'Fotógrafo',
  makeup: 'Maquillaje', maquillaje: 'Maquillaje', peluqueria: 'Peluquería', staff: 'Staff / Camarero',
  azafata: 'Azafata', promotor: 'Promotor', promotores: 'Promotor', catering: 'Catering', 'food-truck': 'Food truck', 'disco-movil': 'Disco móvil',
  mago: 'Mago', humorista: 'Humorista', animador: 'Animador', bailarin: 'Bailarín',
  speaker: 'Speaker', vestuario: 'Vestuario', 'photo-booth': 'Photo Booth',
  tecnico: 'Técnico de sonido', alquiler: 'Alquiler de equipos', local_eventos: 'Local para eventos',
  'diseno-grafico': 'Diseño gráfico', 'wedding-planner': 'Wedding Planner',
  ambassador: 'Embajador', empresario: 'Empresa / Sala', rookie: 'Artista emergente',
};

interface Conversation {
  id: string;
  other_user_id: string;
  other_name: string;
  other_photo?: string | null;
  last_message: string;
  last_message_at: string;
  unread: number;
}

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

const MessagesView = ({ initialUserId, initialName }: { initialUserId?: string; initialName?: string }) => {
  const { user } = useAuth();
  const { display_name: myDisplayName, role: miRol } = useProfile();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeOtherName, setActiveOtherName] = useState('');
  const [activeOtherUserId, setActiveOtherUserId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  // Solo controla la navegación en MÓVIL (lista <-> chat). En desktop ambos se ven siempre.
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [showNewConv, setShowNewConv] = useState(false);
  const [searchUsers, setSearchUsers] = useState('');
  const [userResults, setUserResults] = useState<{ user_id: string; display_name: string; role: string }[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);
  const realtimeRef = useRef<RealtimeChannel | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('conversations')
      .select('id, participant_a, participant_b, last_message_at, deleted_by_a, deleted_by_b')
      .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
      .order('last_message_at', { ascending: false });

    if (error) { toast.error('Error al cargar conversaciones'); return; }
    const visible = (data ?? []).filter(c =>
      (c.participant_a === user.id && !c.deleted_by_a) || (c.participant_b === user.id && !c.deleted_by_b)
    );
    if (visible.length === 0) { setConversations([]); setLoading(false); return; }

    const convIds = visible.map(c => c.id);
    const otherIds = visible.map(c => c.participant_a === user.id ? c.participant_b : c.participant_a);

    // 4 queries totales (independiente del nº de conversaciones):
    // perfiles + mensajes + bloqueos, en paralelo.
    const [{ data: profilesData }, { data: msgsData }, { data: blockedData }] = await Promise.all([
      supabase.from('profiles').select('user_id, display_name, photo_url').in('user_id', otherIds),
      supabase.from('messages').select('conversation_id, content, photo_url, video_url, read, sender_id, created_at, deleted_at')
        .in('conversation_id', convIds).order('created_at', { ascending: false }),
      supabase.from('blocked_users').select('blocked_id').eq('blocker_id', user.id),
    ]);

    const blockedIds = new Set((blockedData ?? []).map(b => b.blocked_id));
    setBlockedUserIds(blockedIds);
    const finalConvs = visible.filter(c => {
      const otherId = c.participant_a === user.id ? c.participant_b : c.participant_a;
      return !blockedIds.has(otherId);
    });

    const profileMap = new Map((profilesData ?? []).map(p => [p.user_id, { name: p.display_name, photo: p.photo_url }]));

    // Agregar en memoria: último mensaje y nº de no leídos por conversación.
    const lastMsgMap = new Map<string, { content: string }>();
    const unreadMap = new Map<string, number>();
    for (const m of msgsData ?? []) {
      if (m.deleted_at) continue;
      // Mensajes ya ordenados desc → el primero por conv es el último cronológico.
      if (!lastMsgMap.has(m.conversation_id)) lastMsgMap.set(m.conversation_id, { content: vistaPrevia(m.content) || (m.video_url ? 'Vídeo' : m.photo_url ? 'Foto' : '') });
      if (!m.read && m.sender_id !== user.id) {
        unreadMap.set(m.conversation_id, (unreadMap.get(m.conversation_id) || 0) + 1);
      }
    }

    const convs: Conversation[] = finalConvs.map((c) => {
      const otherId = c.participant_a === user.id ? c.participant_b : c.participant_a;
      return {
        id: c.id,
        other_user_id: otherId,
        other_name: profileMap.get(otherId)?.name || 'Usuario',
        other_photo: profileMap.get(otherId)?.photo,
        last_message: lastMsgMap.get(c.id)?.content || '',
        last_message_at: c.last_message_at,
        unread: unreadMap.get(c.id) || 0,
      };
    });

    setConversations(convs);
    setLoading(false);
  }, [user]);

  const loadMessages = useCallback(async (convId: string) => {
    const { data, error } = await supabase
      .from('messages').select('id, sender_id, content, photo_url, video_url, read, created_at, deleted_at')
      .eq('conversation_id', convId).order('created_at', { ascending: true });
    if (error) { toast.error('Error al cargar mensajes'); return; }
    setMessages((data ?? []) as Message[]);

    if (user) {
      await supabase.from('messages').update({ read: true })
        .eq('conversation_id', convId).neq('sender_id', user.id);
      void marcarAvisosMensajesLeidos(user.id, convId);
    }
  }, [user]);

  const openConversationWith = useCallback(async (targetUserId: string, targetName: string) => {
    if (!user) return;
    if (blockedUserIds.has(targetUserId)) {
      toast.error('Has bloqueado a este usuario. Desbloquéalo para escribirle.');
      return;
    }
    const pair = conversationPair(user.id, targetUserId);
    if (!pair) {
      toast.info('Esta es tu propia ficha. Los mensajes son para hablar con otros usuarios.');
      return;
    }
    const { a, b } = pair;

    const { data: existingData, error: fetchError } = await supabase
      .from('conversations').select('id').eq('participant_a', a).eq('participant_b', b).maybeSingle();
    if (fetchError) {
      toast.error('No se pudo abrir la conversación. Inténtalo de nuevo.');
      console.error('[MessagesView] fetch conversation error:', fetchError);
      return;
    }
    let existing = existingData;

    if (!existing) {
      const { data: created, error: insertError } = await supabase
        .from('conversations').insert({ participant_a: a, participant_b: b }).select('id').single();
      if (insertError) {
        if (insertError.code === '23505') {
          const { data: retryData, error: retryError } = await supabase
            .from('conversations').select('id').eq('participant_a', a).eq('participant_b', b).maybeSingle();
          if (retryError || !retryData) {
            toast.error('No se pudo iniciar la conversación. Inténtalo de nuevo.');
            console.error('[MessagesView] retry fetch conversation error:', retryError);
            return;
          }
          existing = retryData;
        } else {
          toast.error('No se pudo iniciar la conversación. Inténtalo de nuevo.');
          console.error('[MessagesView] create conversation error:', insertError);
          return;
        }
      } else {
        existing = created;
      }
    }

    if (existing) {
      // Si el usuario había "eliminado" este chat de su bandeja, reaparece al reabrirlo.
      const deletedField = user.id === a ? 'deleted_by_a' : 'deleted_by_b';
      await supabase.from('conversations').update({ [deletedField]: false }).eq('id', existing.id);

      setActiveConvId(existing.id);
      setActiveOtherName(targetName);
      setActiveOtherUserId(targetUserId);
      setMobileShowChat(true);
      await loadMessages(existing.id);
      await loadConversations();
    }
  }, [user, loadMessages, loadConversations, blockedUserIds]);

  // Pull-to-refresh (solo app nativa, Task 6): reutiliza loadConversations,
  // la misma función que el mount inicial y el polling realtime.
  const { isRefreshing, triggerRefresh } = usePullToRefresh(loadConversations);
  const pullStartY = useRef<number | null>(null);
  const PULL_THRESHOLD_PX = 70;
  const handleListTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isNative) return;
    if (e.currentTarget.scrollTop <= 0) pullStartY.current = e.touches[0].clientY;
  };
  const handleListTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isNative || pullStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - pullStartY.current;
    pullStartY.current = null;
    if (delta > PULL_THRESHOLD_PX && !isRefreshing) triggerRefresh();
  };

  useEffect(() => { loadConversations(); }, [loadConversations]);
  useEffect(() => {
    if (initialUserId && initialName) openConversationWith(initialUserId, initialName);
  }, [initialUserId, initialName, openConversationWith]);
  // Realtime subscription — replaces 5s polling
  useEffect(() => {
    if (!activeConvId || !user) return;
    if (realtimeRef.current) supabase.removeChannel(realtimeRef.current);

    realtimeRef.current = supabase
      .channel(`messages-conv-${activeConvId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${activeConvId}`,
      }, (payload) => {
        const msg = payload.new as Message;
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          // Mío y aún provisional: lo sustituye en vez de duplicarlo.
          const tmp = msg.sender_id === user.id && prev.find(m => m.id.startsWith('tmp-') && m.content === msg.content);
          if (tmp) return prev.map(m => m === tmp ? msg : m);
          return [...prev, msg];
        });
        // El otro aceptó el contrato que le propusiste: fuegos para ti también.
        const acuerdo = leerAcuerdo(msg.content);
        if (acuerdo?.estado === 'aceptado' && acuerdo.ref !== 'ACUERDO') celebrar('¡Enhorabuena!', 'Acuerdo cerrado. Ya está por escrito en este chat.', acuerdo.ref);
        // Auto-mark incoming messages as read
        if (msg.sender_id !== user.id) {
          supabase.from('messages').update({ read: true }).eq('id', msg.id)
            .then(() => { void marcarAvisosMensajesLeidos(user.id, activeConvId); });
          loadConversations();
        }
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') toast.error('Chat desconectado. Recarga la página.');
      });

    return () => {
      if (realtimeRef.current) supabase.removeChannel(realtimeRef.current);
    };
  }, [activeConvId, user, loadConversations]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Botón Acepto solo entre organizador y profesional (entre dos profesionales
  // o dos organizadores no hay acuerdo que cerrar).
  const [otroRol, setOtroRol] = useState<string | null>(null);
  useEffect(() => {
    setOtroRol(null);
    if (!activeOtherUserId) return;
    let vivo = true;
    supabase.from('profiles').select('role').eq('user_id', activeOtherUserId)
      .order('is_primary', { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => { if (vivo) setOtroRol(data?.role ?? null); });
    return () => { vivo = false; };
  }, [activeOtherUserId]);
  const hayAcuerdoPosible = !!miRol && !!otroRol && (miRol === 'empresario') !== (otroRol === 'empresario');
  const registradosRef = useRef<Set<string>>(new Set());
  const aceptandoRef = useRef(false);
  const profesionalAcuerdo = !hayAcuerdoPosible || !user ? null
    : miRol === 'empresario'
      ? { userId: activeOtherUserId, name: activeOtherName, role: otroRol ?? 'dj' }
      : { userId: user.id, name: myDisplayName?.trim() || 'Profesional', role: miRol ?? 'dj' };

  // Fuegos para los dos cuando el segundo "Acepto" cierra el acuerdo (llegue
  // por el envío propio o en vivo). Solo si es el último mensaje y reciente:
  // al abrir un chat con acuerdos antiguos no se repiten.
  useEffect(() => {
    const ultimo = messages[messages.length - 1];
    // El provisional ("tmp-") no: si no, al cambiarse por el guardado salían dos veces.
    if (!ultimo || ultimo.id.startsWith('tmp-') || Date.now() - new Date(ultimo.created_at).getTime() > 120_000) return;
    if (estadoAcepto(messages).cierres.has(ultimo.id)) {
      celebrar('¡Enhorabuena!', `Acuerdo cerrado con ${activeOtherName || 'tu contacto'}. Queda por escrito en este chat.`, ultimo.id);
      // Se registra como reserva confirmada (historial del organizador,
      // calendario del profesional, métricas y reseña tras el evento). Lo
      // piden los dos lados; la RPC es idempotente y valida las condiciones.
      if (!registradosRef.current.has(ultimo.id)) {
        registradosRef.current.add(ultimo.id);
        void (supabase.rpc as unknown as (f: string, a: Record<string, unknown>) => Promise<{ error: { message: string } | null }>)(
          'cerrar_acuerdo_chat', { p_message_id: ultimo.id },
        ).then(({ error }) => {
          if (error) { console.warn('[MessagesView] cerrar_acuerdo_chat:', error.message); return; }
          void cargarReservasRef.current();
          void enviarConfirmacion(ultimo.content);
        });
      }
    }
  }, [messages, activeOtherName]);

  // Estado de la reserva de cada acuerdo cerrado (para la tarjeta verde: fecha,
  // cancelar, valorar). La puede crear el otro cliente un instante después.
  const cierresKey = [...estadoAcepto(messages).cierres].filter(i => !i.startsWith('tmp-')).join(',');
  const [reservasAcuerdo, setReservasAcuerdo] = useState<Record<string, ReservaAcuerdo>>({});
  const cargarReservas = useCallback(async () => {
    const ids = cierresKey ? cierresKey.split(',') : [];
    if (!ids.length) { setReservasAcuerdo({}); return 0; }
    const { data } = await supabase.from('flash_bookings' as any)
      .select('id, status, event_date, chat_message_id').in('chat_message_id', ids);
    const mapa: Record<string, ReservaAcuerdo> = {};
    for (const r of (data ?? []) as unknown as { id: string; status: string; event_date: string | null; chat_message_id: string }[]) {
      mapa[r.chat_message_id] = { id: r.id, status: r.status, fecha: /^\d{4}-\d{2}-\d{2}$/.test(r.event_date ?? '') ? r.event_date : null };
    }
    setReservasAcuerdo(mapa);
    return ids.length - Object.keys(mapa).length;
  }, [cierresKey]);
  const cargarReservasRef = useRef(cargarReservas);
  cargarReservasRef.current = cargarReservas;
  useEffect(() => {
    let vivo = true; let intentos = 0;
    const cargar = async () => {
      const faltan = await cargarReservas();
      if (vivo && faltan > 0 && intentos++ < 3) window.setTimeout(cargar, 2500);
    };
    void cargar();
    return () => { vivo = false; };
  }, [cargarReservas]);

  // Email de confirmación a cada parte (el servidor lo manda siempre al correo de
  // quien llama), solo si tiene activado el aviso de nuevos bolos.
  const enviarConfirmacion = async (contenido: string) => {
    if (!user?.email) return;
    const c = leerCondiciones(leerAcuerdo(contenido)?.resumen ?? '');
    if (!c) return;
    const { data: pref } = await supabase.from('alert_preferences' as any).select('nuevos_bolos').eq('user_id', user.id).maybeSingle();
    if (!(pref as { nuevos_bolos?: boolean } | null)?.nuevos_bolos) return;
    supabase.functions.invoke('send-email', {
      body: { type: 'bolo_new_confirmation', data: { email: user.email, title: `Acuerdo con ${activeOtherName || 'tu contacto'}`, date: fechaIso(c.fecha), location: c.ciudad } },
    }).catch((err: unknown) => console.warn('[MessagesView] confirmación por email:', err));
  };

  const navigate = useNavigate();
  const cancelarAcuerdo = async (reservaId: string, motivo = '') => {
    const { error } = await (supabase.rpc as unknown as (f: string, a: Record<string, unknown>) => Promise<{ error: { message: string } | null }>)(
      'cancelar_acuerdo_chat', { p_booking_id: reservaId },
    );
    if (error) { toast.error('No se pudo cancelar el acuerdo. Inténtalo de nuevo.'); return; }
    toast.success(`Acuerdo cancelado. Se ha avisado a ${activeOtherName || 'la otra parte'}.`);
    const reserva = Object.values(reservasAcuerdo).find(r => r.id === reservaId);
    // El motivo (opcional) va como mensaje normal tras el aviso de cancelación.
    if (motivo) void sendMessage(`Motivo de la cancelación: ${motivo}`);
    // Email a la otra parte con el motivo (la función comprueba que el acuerdo
    // esté cancelado y que quien lo pide sea una de las dos partes).
    if (activeOtherUserId) {
      supabase.functions.invoke('send-email', {
        body: { type: 'acuerdo_cancelado', data: {
          user_id: activeOtherUserId, booking_id: reservaId,
          sender_name: myDisplayName?.trim() || 'Tu contacto',
          event_date: reserva?.fecha ? reserva.fecha.split('-').reverse().join('/') : undefined,
          motivo: motivo || undefined,
        } },
      }).catch((err: unknown) => console.warn('[MessagesView] email de cancelación:', err));
    }
    void cargarReservas();
    if (activeConvId) void loadMessages(activeConvId);
  };
  const valorarAcuerdo = () => navigate(miRol === 'empresario' ? '/dashboard?view=empresario&tab=historial' : '/dashboard?view=flashbooking&tab=solicitudes');
  useEffect(() => () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current); }, []);

  const sendMessage = async (overrideContent?: string, adjunto?: { tipo: 'foto' | 'video'; ruta: string }): Promise<boolean> => {
    const text = typeof overrideContent === 'string' ? overrideContent : input.trim();
    if (!text && !adjunto) return false;
    if (!activeConvId || !user || sending) return false;

    if (text) {
      const { clean, reason } = sanitizeInput(text, 'default');
      if (!clean) { toast.error(reason); return false; }
    }

    // Envío optimista (16 oct 2026): antes se esperaban seis viajes al
    // servidor en fila (guardar, fecha de la conversación, recargar mensajes,
    // marcar leídos, recargar la lista) antes de ver el mensaje y vaciar la
    // caja; en el móvil se notaba lento. Ahora sale al momento, atenuado
    // ("tmp-"), y se cambia por el guardado en cuanto vuelve; lo demás va en
    // segundo plano.
    setSending(true);
    const payload: Record<string, unknown> = {
      conversation_id: activeConvId, sender_id: user.id, content: text || '',
    };
    if (adjunto?.tipo === 'foto') payload.photo_url = adjunto.ruta;
    if (adjunto?.tipo === 'video') payload.video_url = adjunto.ruta;

    const convId = activeConvId;
    const tmpId = `tmp-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: tmpId, sender_id: user.id, content: text || '', read: false, created_at: new Date().toISOString(),
      photo_url: (payload.photo_url as string) ?? null, video_url: (payload.video_url as string) ?? null,
    }]);
    if (typeof overrideContent !== 'string') setInput('');

    const { data: guardado, error } = await supabase.from('messages').insert(payload as any)
      .select('id, sender_id, content, photo_url, video_url, read, created_at, deleted_at').single();
    if (error || !guardado) {
      setMessages(prev => prev.filter(m => m.id !== tmpId));
      if (typeof overrideContent !== 'string') setInput(prev => prev || text);
      toast.error('Error al enviar el mensaje'); setSending(false); return false;
    }
    // El aviso en vivo (realtime) puede haber traído ya el guardado.
    setMessages(prev => prev.some(m => m.id === guardado.id)
      ? prev.filter(m => m.id !== tmpId)
      : prev.map(m => m.id === tmpId ? guardado as Message : m));
    setSending(false);
    void supabase.from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', convId)
      .then(() => loadConversations());
    askForPush('mensaje');
    // Notify recipient by 2 channels: in-app notification + email (fire and forget)
    if (activeOtherUserId) {
      const senderName = myDisplayName?.trim() || user.user_metadata?.display_name || 'Un usuario';
      // La notificación in-app se crea en la base de datos al insertar el
      // mensaje; el cliente solo envía el email complementario.
      // Un solo email por ráfaga (16 oct 2026): si ya hay un mensaje mío sin leer
      // en esta conversación, la otra persona ya fue avisada y este no manda
      // otro. El del servidor solo frena 2 minutos entre avisos.
      // En segundo plano: el envío no espera a esta comprobación.
      const destinatario = activeOtherUserId;
      void (async () => {
        const { count: sinLeerMios } = await supabase.from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('conversation_id', convId).eq('sender_id', user.id)
          .eq('read', false).is('deleted_at', null);
        if ((sinLeerMios ?? 0) > 1) return; // el recién enviado cuenta como 1
        supabase.functions.invoke('send-email', {
          body: {
            type: 'new_message',
            data: { user_id: destinatario, sender_name: senderName },
          },
        });
      })();
    }
    return true;
  };

  // Fotos y vídeos (16 oct 2026). Bucket privado: se guarda la ruta y el chat
  // pide una URL firmada al mostrarlo (ver messages/AdjuntoChat.tsx). Vídeo
  // hasta 25 MB y 60 s; foto hasta 5 MB.
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !user) return;
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const esVideo = file.type.startsWith('video/');
    const fotoOk = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) && file.type.startsWith('image/');
    const videoOk = ['mp4', 'mov', 'webm'].includes(ext) && esVideo;
    if (!fotoOk && !videoOk) { toast.error('Solo fotos (JPG, PNG, WebP, GIF) o vídeos (MP4, MOV, WebM)'); return; }
    if (!esVideo && file.size > 5 * 1024 * 1024) { toast.error('Máximo 5 MB por foto'); return; }
    if (esVideo && file.size > 25 * 1024 * 1024) { toast.error('Máximo 25 MB por vídeo'); return; }
    if (esVideo) {
      const dur = await new Promise<number>(res => {
        const v = document.createElement('video');
        v.preload = 'metadata';
        v.onloadedmetadata = () => { URL.revokeObjectURL(v.src); res(v.duration); };
        v.onerror = () => res(0);
        v.src = URL.createObjectURL(file);
      });
      if (dur > 61) { toast.error('Máximo 60 segundos por vídeo'); return; }
    }
    try {
      if (!sessionStorage.getItem('xpeak_aviso_adjuntos')) {
        sessionStorage.setItem('xpeak_aviso_adjuntos', '1');
        toast.info('No envíes teléfonos ni redes en fotos o vídeos: se retiran y la cuenta puede bloquearse.');
      }
    } catch { /* sin almacenamiento */ }

    setUploadingPhoto(true);
    const ruta = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('message-attachments')
      .upload(ruta, file, { upsert: false, contentType: file.type });
    if (uploadError) { toast.error(esVideo ? 'Error al subir el vídeo' : 'Error al subir la foto'); setUploadingPhoto(false); return; }
    // La BD exige texto en todo mensaje (messages_content_length: 1-2000
    // caracteres): sin él la foto se subía y el mensaje se rechazaba. En el chat
    // se ve la foto o el vídeo, y "Foto"/"Vídeo" es lo que sale en avisos y lista.
    const ok = await sendMessage(esVideo ? 'Vídeo' : 'Foto', { tipo: esVideo ? 'video' : 'foto', ruta });
    // Si el mensaje no se guardó, el archivo no lo vería nadie: se borra.
    if (!ok) await supabase.storage.from('message-attachments').remove([ruta]);
    setUploadingPhoto(false);
  };

  const handleSelectConversation = async (conv: Conversation) => {
    setActiveConvId(conv.id);
    setActiveOtherName(conv.other_name);
    setActiveOtherUserId(conv.other_user_id);
    setMobileShowChat(true);
    // Fuera los de la conversación anterior mientras llegan estos.
    if (conv.id !== activeConvId) setMessages([]);
    await loadMessages(conv.id);
    loadConversations();
  };

  // Cierra el chat: en móvil vuelve a la lista; en desktop deselecciona la conversación.
  const handleCloseChat = () => {
    setMobileShowChat(false);
    setActiveConvId(null);
  };

  const searchUsersHandler = (q: string) => {
    setSearchUsers(q);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (q.trim().length < 2) { setUserResults([]); setSearchingUsers(false); return; }
    setSearchingUsers(true);
    // Debounce 300ms: una sola query cuando el usuario deja de teclear.
    searchDebounceRef.current = setTimeout(async () => {
      const { data } = await supabase.from('profiles')
        .select('user_id, display_name, role')
        .ilike('display_name', `%${q}%`)
        .neq('user_id', user?.id ?? '')
        .limit(10);
      setUserResults((data ?? []) as { user_id: string; display_name: string; role: string }[]);
      setSearchingUsers(false);
    }, 300);
  };

  const startNewConversation = async (targetUserId: string, targetName: string) => {
    setShowNewConv(false);
    setSearchUsers('');
    setUserResults([]);
    await openConversationWith(targetUserId, targetName);
  };

  const deleteMessage = async (messageId: string) => {
    const { error } = await supabase.from('messages')
      .update({ deleted_at: new Date().toISOString() }).eq('id', messageId);
    if (error) { toast.error('No se pudo eliminar el mensaje'); return; }
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, deleted_at: new Date().toISOString() } : m));
    if (activeConvId) loadConversations();
  };

  const deleteConversation = async (conv: Conversation) => {
    if (!user) return;
    const a = user.id < conv.other_user_id ? user.id : conv.other_user_id;
    const field = user.id === a ? 'deleted_by_a' : 'deleted_by_b';
    const { error } = await supabase.from('conversations').update({ [field]: true }).eq('id', conv.id);
    if (error) { toast.error('No se pudo eliminar la conversación'); return; }
    setConversations(prev => prev.filter(c => c.id !== conv.id));
    if (activeConvId === conv.id) handleCloseChat();
  };

  const blockUser = async (targetUserId: string) => {
    if (!user) return;
    const { error } = await supabase.from('blocked_users')
      .insert({ blocker_id: user.id, blocked_id: targetUserId });
    if (error) { toast.error('No se pudo bloquear al usuario'); return; }
    toast.success('Usuario bloqueado');
    setBlockedUserIds(prev => new Set(prev).add(targetUserId));
    setConversations(prev => prev.filter(c => c.other_user_id !== targetUserId));
    if (activeOtherUserId === targetUserId) handleCloseChat();
  };

  // Reporta la conversación activa para revisión del admin. content_id usa
  // el id de la conversación (no de un mensaje suelto): más simple y ya
  // cubre el caso de uso real — el admin revisa el hilo completo, no un
  // mensaje aislado. unique(reporter_id, content_type, content_id) evita
  // duplicar el mismo reporte si el usuario pulsa dos veces.
  const reportUser = async (reason: string) => {
    if (!user || !activeConvId || !activeOtherUserId) return;
    const { error } = await supabase.from('content_reports').insert({
      reporter_id: user.id,
      content_type: 'message',
      content_id: activeConvId,
      reported_user_id: activeOtherUserId,
      reason,
    });
    if (error) {
      if (error.code === '23505') { toast.error('Ya reportaste esta conversación.'); return; }
      toast.error('No se pudo enviar el reporte');
      return;
    }
    toast.success('Reporte enviado. Un administrador lo revisará.');
  };

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);
  const chatAbiertoMovil = mobileShowChat && !!activeConvId;

  // Marca para index.css: en móvil, con una conversación abierta, se esconde
  // la barra inferior y su hueco. Layout effect, y antes de la medida de
  // abajo, para que esta ya vea el hueco nuevo.
  useLayoutEffect(() => {
    const raiz = document.documentElement;
    raiz.toggleAttribute('data-chat-abierto', chatAbiertoMovil);
    return () => raiz.removeAttribute('data-chat-abierto');
  }, [chatAbiertoMovil]);

  const [raizRef, alto] = useAltoLibreEnPanel<HTMLDivElement>(chatAbiertoMovil);

  return (
    <div ref={raizRef} className="animate-[fadeIn_0.4s_ease] flex flex-col"
      style={{
        // Respaldo hasta la primera medida.
        height: alto ?? 'calc(100dvh - 120px - var(--mobile-nav-space, 0px) - var(--install-bar-h, 0px))',
        minHeight: 380,
      }}>
      {/* En móvil, dentro de una conversación, sobra: el chat ya lleva su
          cabecera con el nombre y la flecha de volver. */}
      <div className={`mb-4 items-center justify-between ${chatAbiertoMovil ? 'hidden sm:flex' : 'flex'}`}>
        <div>
          <h2 className="text-2xl font-bold mb-0.5 flex items-center gap-2">
            <span className="text-gradient">Mensajes</span>
            {totalUnread > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(212,175,55,0.2)', color: '#8A6D0F' }}>
                {totalUnread}
              </span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground">Comunicaciones directas y privadas.</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-2xl sm:rounded-2xl relative"
        style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#ffffff' }}>
        <div className="flex flex-col sm:grid h-full" style={{ gridTemplateColumns: 'minmax(0,280px) 1fr' }}>

          {/* Lista de conversaciones — siempre visible en desktop; en móvil oculta al abrir un chat */}
          <div className={`${mobileShowChat ? 'hidden' : 'flex'} sm:flex flex-col h-full overflow-hidden`}
            onTouchStart={handleListTouchStart} onTouchEnd={handleListTouchEnd}>
            {isNative && isRefreshing && (
              <div className="clay-card flex items-center justify-center gap-2 py-2 m-2 text-xs font-bold flex-shrink-0"
                style={{ color: '#8A6D0F' }}>
                <RefreshCw size={14} className="animate-spin" /> Actualizando…
              </div>
            )}
            <ConversationList
              conversations={conversations}
              loading={loading}
              activeConvId={activeConvId}
              onSelectConversation={handleSelectConversation}
              onNewConversation={() => setShowNewConv(true)}
              onDeleteConversation={deleteConversation}
              onBlockUser={conv => blockUser(conv.other_user_id)}
            />
          </div>

          {/* Panel derecho — placeholder si no hay chat (solo desktop), o el chat */}
          {!activeConvId ? (
            <div className="hidden sm:flex flex-col h-full overflow-hidden">
              <EmptyChatPlaceholder />
            </div>
          ) : (
            <div className={`${mobileShowChat ? 'flex' : 'hidden'} sm:flex flex-col h-full overflow-hidden`}>
              <ChatWindow
                messages={messages}
                userId={user?.id ?? ''}
                activeOtherName={activeOtherName}
                input={input}
                setInput={setInput}
                sending={sending}
                uploadingPhoto={uploadingPhoto}
                bottomRef={bottomRef}
                fileInputRef={fileInputRef}
                onSend={sendMessage}
                onPhotoUpload={handlePhotoUpload}
                onBack={handleCloseChat}
                onDeleteMessage={deleteMessage}
                onDeleteConversation={() => {
                  const conv = conversations.find(c => c.id === activeConvId);
                  if (conv) deleteConversation(conv);
                }}
                onBlockUser={() => { if (activeOtherUserId) blockUser(activeOtherUserId); }}
                onReportUser={reportUser}
                onAcepto={hayAcuerdoPosible ? async cod => {
                  // Candado: con toques rápidos salían varios "Acepto" seguidos.
                  if (aceptandoRef.current || !user) return;
                  const abierto = estadoAcepto(messages);
                  if (abierto.pendientes.has(user.id) && abierto.condiciones === cod) return;
                  aceptandoRef.current = true;
                  try {
                    const cierra = abierto.pendientes.has(activeOtherUserId) && abierto.condiciones === cod;
                    if (await sendMessage(mensajeAcepto(cod)) && !cierra) {
                      toast.success(`Has aceptado. Falta que ${activeOtherName || 'la otra parte'} acepte.`);
                    }
                  } finally { aceptandoRef.current = false; }
                } : undefined}
                profesionalAcuerdo={profesionalAcuerdo}
                reservasAcuerdo={reservasAcuerdo}
                onCancelarAcuerdo={cancelarAcuerdo}
                onValorarAcuerdo={valorarAcuerdo}
                onAceptarAcuerdo={async ref => {
                  if (await sendMessage(mensajeAceptado(ref))) {
                    celebrar('¡Enhorabuena!', `Acuerdo cerrado con ${activeOtherName || 'tu contacto'}. Ya está por escrito en este chat.`, ref);
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nueva conversación modal */}
      {showNewConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) { setShowNewConv(false); setSearchUsers(''); setUserResults([]); } }}>
          <div className="rounded-2xl p-5 w-full max-w-sm"
            style={{ background: '#0a0a0e', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
            {/* Panel oscuro (#0a0a0e): los textos heredaban el color oscuro de
                la UI clara y quedaban casi negros sobre negro, ilegibles. */}
            <p className="text-sm font-bold mb-3" style={{ color: 'rgba(255,255,255,0.92)' }}>Nueva conversación</p>
            <input
              autoFocus
              value={searchUsers}
              onChange={e => searchUsersHandler(e.target.value)}
              placeholder="Buscar por nombre..."
              className="nightlife-input w-full text-base sm:text-sm mb-3"
            />
            {searchingUsers && <p className="text-xs text-muted-foreground text-center py-2">Buscando...</p>}
            {!searchingUsers && userResults.length === 0 && searchUsers.length >= 2 && (
              <p className="text-xs text-muted-foreground text-center py-2">Nadie con ese nombre por aquí</p>
            )}
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
              {userResults.map(u => (
                <button key={u.user_id} onClick={() => startNewConversation(u.user_id, u.display_name || 'Usuario')}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all hover:scale-[1.01]"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                    {(u.display_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: 'rgba(255,255,255,0.92)' }}>{u.display_name || 'Usuario'}</p>
                    {/* El rol se pintaba en crudo ('photo-booth', 'event_manager') */}
                    <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>{ROLE_LABEL[u.role] ?? u.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesView;
