import { useState, useEffect } from 'react';
import { Calendar, MapPin, Euro, Users, Plus, X, Send, ChevronDown, ChevronUp, Check, Pencil, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ROLE_TAGS, ROL_UI_A_SLUG, jobWord, canonicalRole } from '@/lib/constants';
import ContractModal, { type ContractPrefill } from '@/components/dashboard/ContractModal';
import type { Profile } from '@/data/profiles';

interface EventRequest {
  id: string;
  client_name: string;
  client_user_id: string | null;
  event_type: string;
  city: string;
  event_date: string | null;
  event_dates: string[] | null;
  budget_min: number | null;
  budget_max: number | null;
  roles_needed: string[];
  description: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  expires_at: string;
  status: string;
}

const EVENT_TYPES = ['Boda', 'Comunión', 'Evento corporativo', 'Fiesta privada', 'Festival', 'Cumpleaños', 'Inauguración', 'Concierto', 'Otro'];

// Familias para agrupar los géneros de DJ: quien contrata no distingue Tech
// House de Minimal, pide "electrónica" o "de todo". El resto de roles no
// necesita agrupar (sus tags de ROLE_TAGS ya son pocos y concretos, tipo
// "Magia de bodas" o "Payaso clásico"), así que se ofrecen sueltos.
const FAMILIAS_DJ: { label: string; incluye: string[] }[] = [
  { label: 'House / Electrónica', incluye: ['Tech House','Deep House','House','Afro House','Organic House','Funky House','Tribal House','Progressive House','Latin House','Electro','Nu-Disco'] },
  { label: 'Techno', incluye: ['Techno','Melodic Techno','Minimal','Hard Techno','Industrial','Dub Techno'] },
  { label: 'Comercial / Hits', incluye: ['Comercial','Top 40','Hits actuales','EDM'] },
  { label: 'Reggaetón / Latino', incluye: ['Reggaetón','Dembow','Moombahton','Dancehall','Latin House'] },
  { label: 'Hip Hop / R&B', incluye: ['Hip Hop','Trap','R&B','Afrobeats','Amapiano'] },
  { label: 'Remember / Pachanga', incluye: ['Remember','Pachanga','Disco','Funk'] },
  { label: 'Ambiente / Chill', incluye: ['Ambient','Downtempo','Chillout'] },
];

// Etiqueta del formulario → slug real de profiles.role: ROL_UI_A_SLUG vive en
// constants.ts para poder leer ROLE_TAGS y saber qué especialidades tiene ese
// rol (lo mismo que ya declara cada profesional en su perfil).
const ROLES_LIST = ['DJ / Artista', 'Fotógrafo', 'Camarero / Staff', 'Maquilladora', 'Grupo musical', 'Animador', 'Promotor / RRPP', 'Photo Booth', 'Catering'];

// Opciones de estilo para un rol pedido: familias para DJ, tags sueltos (los
// mismos que declara el profesional en su perfil) para el resto.
const opcionesEstilo = (rolesUI: string[]): { label: string; incluye: string[] }[] => {
  if (rolesUI.includes('DJ / Artista')) return FAMILIAS_DJ;
  const slug = rolesUI.map(r => ROL_UI_A_SLUG[r]).find(s => s && ROLE_TAGS[s]);
  if (!slug) return [];
  return ROLE_TAGS[slug].tags.map(t => ({ label: t, incluye: [t] }));
};

const daysLeft = (expires: string) => {
  const diff = new Date(expires).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
};

// La fecha se pintaba en crudo ("2026-09-14"); el resto de la app usa formato es-ES.
const fmtDate = (iso: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

const EventRequestsSection = () => {
  const profile = useProfile();
  const { user } = useAuth();
  const isEmpresario = profile.role === 'empresario';

  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const [responses, setResponses] = useState<Record<string, { id: string; professionalUserId: string; name: string; photo: string | null; message: string | null; slot_id: string | null; chosen_at: string | null; hired_at: string | null }[]>>({});
  const [contractFor, setContractFor] = useState<{ req: EventRequest; professionalUserId: string; name: string } | null>(null);
  const [contractProfile, setContractProfile] = useState<Profile | null>(null);
  const [loadingContract, setLoadingContract] = useState(false);
  const [slots, setSlots] = useState<Record<string, { id: string; role: string }[]>>({});
  const [hiring, setHiring] = useState<string | null>(null);
  const [applied, setApplied] = useState<Record<string, { responseId: string; chosenAt: string | null }>>({});
  const [applyText, setApplyText] = useState<Record<string, string>>({});
  const [applying, setApplying] = useState<string | null>(null);

  const [form, setForm] = useState({
    client_name: '',
    event_type: '',
    city: '',
    event_dates: [] as string[],
    estilos: [] as string[],
    budget_min: '',
    budget_max: '',
    roleCounts: {} as Record<string, number>,
    description: '',
    contact_email: '',
    contact_phone: '',
  });

  useEffect(() => {
    // El empresario necesita seguir viendo SU oferta ya cerrada (contratación
    // hecha) para poder generar el contrato después — antes desaparecía del
    // listado en cuanto pasaba a 'closed' y no había forma de volver a abrirla.
    // expires_at es la caducidad de la oferta ABIERTA: una vez cerrada puede
    // ya haber pasado, así que esa rama filtra por created_at en su lugar.
    //
    // El profesional CONTRATADO tiene el mismo problema: en cuanto la oferta
    // se cierra (justo al ser elegido) desaparecía de su lista y el email
    // "¡El bolo es tuyo!" llevaba a una vista vacía (11 sep 2026, caso Gonzalo
    // DJ / Burger Gourmet Fest). Se resuelve con una subquery a sus propias
    // event_request_responses con hired_at relleno — igual que el empresario,
    // solo ve sus propias contrataciones cerradas, no las de otros.
    const catorceDiasAtras = new Date(Date.now() - 14 * 86400000).toISOString();
    supabase
      .from('event_requests' as any)
      .select(isEmpresario || !user?.id ? '*' : '*, event_request_responses(hired_at, professional_user_id)')
      .or(
        isEmpresario && user?.id
          ? `and(status.eq.open,expires_at.gt.${new Date().toISOString()}),and(status.eq.closed,client_user_id.eq.${user.id},created_at.gt.${catorceDiasAtras})`
          : `and(status.eq.open,expires_at.gt.${new Date().toISOString()}),and(status.eq.closed,created_at.gt.${catorceDiasAtras})`
      )
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        // Sin manejar `error` ni rechazo, un fallo (RLS, tabla ausente) dejaba
        // los skeletons pulsando indefinidamente o fingía "sin solicitudes".
        if (error) console.error('[EventRequestsSection] load failed:', error.message);
        let rows = (data ?? []) as (EventRequest & { event_request_responses?: { hired_at: string | null; professional_user_id: string }[] })[];
        // Para el profesional, una oferta 'closed' solo debe quedarse si él
        // mismo fue el contratado (hired_at relleno en su respuesta) — nunca
        // las cerradas de otros profesionales.
        if (!isEmpresario && user?.id) {
          rows = rows.filter(r =>
            r.status === 'open' ||
            (r.event_request_responses ?? []).some(resp => resp.professional_user_id === user.id && resp.hired_at)
          );
        }
        setRequests(rows as EventRequest[]);
        setLoading(false);
      }, (err: unknown) => {
        console.error('[EventRequestsSection] load rejected:', err);
        setLoading(false);
      });
  }, [isEmpresario, user?.id]);

  // Quién se ha apuntado a MIS ofertas, ya ordenado por completitud de perfil:
  // cuando varios responden al mismo bolo, el organizador decide en segundos y
  // un perfil sin foto no compite. La RPC hace el orden en BD y comprueba que
  // la oferta es de quien pregunta.
  useEffect(() => {
    if (!user?.id || !isEmpresario || requests.length === 0) return;
    let cancelado = false;
    (async () => {
      const agrupado: Record<string, { id: string; professionalUserId: string; name: string; photo: string | null; message: string | null; slot_id: string | null; chosen_at: string | null; hired_at: string | null }[]> = {};
      for (const req of requests) {
        const { data } = await (supabase.rpc as any)('interesados_en_oferta', { p_request_id: req.id });
        const filas = (data ?? []) as { id: string; professional_user_id: string; nombre: string; foto: string | null; mensaje: string | null; slot_id: string | null; chosen_at: string | null; hired_at: string | null }[];
        if (filas.length > 0) {
          agrupado[req.id] = filas.map(f => ({
            id: f.id, professionalUserId: f.professional_user_id, name: f.nombre, photo: f.foto,
            message: f.mensaje, slot_id: f.slot_id, chosen_at: f.chosen_at, hired_at: f.hired_at,
          }));
        }
      }
      if (!cancelado) setResponses(agrupado);
    })();
    return () => { cancelado = true; };
  }, [user?.id, isEmpresario, requests]);

  // Plazas de cada oferta (1 DJ + 2 camareros = 3 filas: dj, camarero, camarero).
  useEffect(() => {
    if (requests.length === 0) return;
    let cancelado = false;
    (async () => {
      const { data } = await supabase
        .from('event_request_slots' as any)
        .select('id, role, request_id')
        .in('request_id', requests.map(r => r.id));
      if (cancelado || !data) return;
      const agrupado: Record<string, { id: string; role: string }[]> = {};
      for (const s of data as { id: string; role: string; request_id: string }[]) {
        (agrupado[s.request_id] ??= []).push({ id: s.id, role: s.role });
      }
      setSlots(agrupado);
    })();
    return () => { cancelado = true; };
  }, [requests]);

  // Candidaturas ya enviadas: sin esto el botón "Me interesa" reaparecía al
  // recargar y el profesional creía que no se había apuntado.
  useEffect(() => {
    if (!user?.id || isEmpresario) return;
    supabase
      .from('event_request_responses' as any)
      .select('id, request_id, chosen_at, hired_at')
      .eq('professional_user_id', user.id)
      .is('hired_at', null)
      .then(({ data }) => {
        if (!data) return;
        setApplied(Object.fromEntries(
          (data as { id: string; request_id: string; chosen_at: string | null }[])
            .map(r => [r.request_id, { responseId: r.id, chosenAt: r.chosen_at }])
        ));
      }, () => {});
  }, [user?.id, isEmpresario]);

  // Elegir un candidato: NO cierra la oferta todavía. Avisa al elegido y
  // espera su confirmación (aceptar/rechazar) — hasta entonces la oferta
  // sigue abierta y los demás inscritos no ven ningún cambio.
  const chooseProfessional = async (req: EventRequest, responseId: string, nombre: string) => {
    setHiring(responseId);
    const { error } = await supabase
      .from('event_request_responses' as any)
      .update({ chosen_at: new Date().toISOString() })
      .eq('id', responseId);
    setHiring(null);

    if (error) { toast.error('No se pudo avisar al profesional.'); return; }

    setResponses(prev => ({
      ...prev,
      [req.id]: (prev[req.id] ?? []).map(r =>
        r.id === responseId ? { ...r, chosen_at: new Date().toISOString() } : r
      ),
    }));
    toast.success(`Avisado ${nombre} — en cuanto confirme, se cierra la oferta.`);
  };

  // El profesional preseleccionado acepta: esto SÍ dispara notify_contratacion
  // (avisa a los descartados, cierra la oferta).
  const acceptChoice = async (responseId: string, reqId: string) => {
    setHiring(responseId);
    const { error } = await supabase
      .from('event_request_responses' as any)
      .update({ hired_at: new Date().toISOString() })
      .eq('id', responseId);
    setHiring(null);
    if (error) { toast.error('No se pudo confirmar.'); return; }
    setRequests(prev => prev.filter(r => r.id !== reqId));
    toast.success('¡Bolo confirmado!');
  };

  // El profesional rechaza: chosen_at vuelve a NULL, la oferta sigue abierta
  // para que el organizador elija a otro.
  const rejectChoice = async (responseId: string) => {
    setHiring(responseId);
    const { error } = await supabase
      .from('event_request_responses' as any)
      .update({ chosen_at: null })
      .eq('id', responseId);
    setHiring(null);
    if (error) { toast.error('No se pudo rechazar.'); return; }
    toast('Has rechazado la oferta.');
  };

  // El profesional ya está contratado (hired_at) pero ContractModal exige un
  // Profile completo, no solo el id — se carga bajo demanda al pulsar el botón.
  const openContract = async (req: EventRequest, professionalUserId: string, name: string) => {
    setLoadingContract(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', professionalUserId)
      .single();
    setLoadingContract(false);
    if (error || !data) { toast.error('No se pudo cargar el perfil del profesional.'); return; }
    const p = data as Record<string, any>;
    setContractProfile({
      id: 0,
      userId: p.user_id,
      name: p.display_name || name,
      role: (p.role as Profile['role']) || 'dj',
      specialty: p.specialty ?? '',
      rating: 0, reviews: 0,
      location: p.zone ?? '', zone: p.zone ?? '', experience: '',
      price: p.hourly_rate ?? 0, priceUnit: '/hora',
      avatar: '', gradient: '', badges: [], description: p.bio ?? '',
      phone: p.phone ?? '', instagram: p.instagram ?? '',
      topWeekend: false, photo: p.photo_url ?? '',
      subscriptionTier: (p.subscription_tier as Profile['subscriptionTier']) ?? 'free',
      isFlashActive: p.is_flash_active ?? false,
      profileViews: 0, contactClicks: 0,
    });
    setContractFor({ req, professionalUserId, name });
  };

  // El organizador cierra su propia oferta a mano — si nadie se apunta, o ya
  // no la necesita, no hay que esperar a que expire sola.
  const cancelRequest = async (req: EventRequest) => {
    if (!window.confirm('¿Cancelar esta oferta? Ya no aparecerá para los profesionales.')) return;
    setCancelling(req.id);
    const { error } = await supabase
      .from('event_requests' as any)
      .update({ status: 'closed' })
      .eq('id', req.id);
    setCancelling(null);
    if (error) { toast.error('No se pudo cancelar.'); return; }
    setRequests(prev => prev.filter(r => r.id !== req.id));
    toast.success('Oferta cancelada.');
  };

  // Quitar UNA plaza sin cubrir (ej. tiene DJ pero ya no encuentra camareros
  // y no quiere seguir esperando esa plaza) — no toca las demás plazas ni
  // cierra la oferta entera.
  const removeSlot = async (slotId: string, roleLabel: string) => {
    if (!window.confirm(`¿Seguro que ya no necesitas ${roleLabel}? Se quitará esa plaza de la oferta.`)) return;
    setCancelling(slotId);
    const { error } = await supabase
      .from('event_request_slots' as any)
      .delete()
      .eq('id', slotId);
    setCancelling(null);
    if (error) { toast.error('No se pudo quitar esa plaza.'); return; }
    setSlots(prev => {
      const next = { ...prev };
      for (const reqId of Object.keys(next)) {
        next[reqId] = next[reqId].filter(s => s.id !== slotId);
      }
      return next;
    });
    toast.success('Plaza eliminada.');
  };

  const applyToRequest = async (req: EventRequest) => {
    if (!user?.id) { toast.error('Inicia sesión para apuntarte.'); return; }
    // Con varios roles en una misma oferta (1 DJ + 2 camareros), el
    // profesional se apunta automáticamente a UNA plaza libre de su propio
    // rol — nunca elige él, solo se filtra por lo que ya declara su perfil.
    const miPlaza = (slots[req.id] ?? []).find(s => ROL_UI_A_SLUG[s.role] === canonicalRole(profile.role));
    if (!miPlaza) { toast.error('No hay ninguna plaza de tu rol en esta oferta.'); return; }
    setApplying(req.id);
    const { data, error } = await supabase.from('event_request_responses' as any).insert({
      request_id: req.id,
      slot_id: miPlaza.id,
      professional_user_id: user.id,
      message: (applyText[req.id] ?? '').trim() || null,
    }).select().single();
    setApplying(null);

    if (error) {
      // 23505 = ya existe: se había apuntado antes, no es un fallo que contar.
      if ((error as { code?: string }).code === '23505') {
        setApplied(a => ({ ...a, [req.id]: { responseId: '', chosenAt: null } }));
        toast.info('Ya te habías apuntado a esta oferta.');
        return;
      }
      toast.error('No se pudo enviar. Inténtalo de nuevo.');
      return;
    }

    setApplied(a => ({ ...a, [req.id]: { responseId: (data as { id: string }).id, chosenAt: null } }));
    toast.success('¡Enviado! El organizador ya lo ve en su panel.');

    // Email de refuerzo al organizador. La campana ya la escribe el trigger;
    // si el correo falla, el aviso principal sigue estando.
    if (req.client_user_id) {
      supabase.functions.invoke('send-email', {
        body: {
          type: 'new_message',
          data: {
            user_id: req.client_user_id,
            sender_name: profile.display_name || 'Un profesional',
          },
        },
      }).catch(() => {});
    }
  };

  // El organizador se equivoca en la ciudad o el pago y hasta ahora tenía que
  // borrar la oferta entera y publicar otra — perdiendo las respuestas que ya
  // tuviera. Reutiliza el mismo modal de publicar, precargado.
  const startEdit = (req: EventRequest) => {
    setForm({
      client_name: req.client_name,
      event_type: req.event_type,
      city: req.city,
      event_dates: req.event_dates ?? (req.event_date ? [req.event_date] : []),
      estilos: [],
      budget_min: req.budget_min?.toString() ?? '',
      budget_max: req.budget_max?.toString() ?? '',
      // Las plazas ya no se editan aquí (pueden tener respuestas): se añaden
      // o quitan una a una desde la propia tarjeta de la oferta.
      roleCounts: {},
      description: req.description ?? '',
      contact_email: req.contact_email ?? '',
      contact_phone: req.contact_phone ?? '',
    });
    setEditingId(req.id);
    setShowForm(true);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const falta = camposIncompletos(form, rolesNeededFlat(form.roleCounts));
    if (falta) { toast.error(`Falta: ${falta}`); return; }
    setSavingEdit(true);
    const { data, error } = await supabase
      .from('event_requests' as any)
      .update({
        client_name: form.client_name.trim(),
        event_type: form.event_type,
        city: form.city.trim(),
        event_date: form.event_dates[0] || null,
        event_dates: form.event_dates.length > 0 ? form.event_dates : null,
        budget_min: form.budget_min ? parseInt(form.budget_min) : null,
        budget_max: form.budget_max ? parseInt(form.budget_max) : null,
        description: form.description.trim() || null,
        contact_email: form.contact_email.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
      })
      .eq('id', editingId)
      .select()
      .single();
    setSavingEdit(false);
    if (error) { toast.error('No se pudo guardar el cambio.'); return; }
    setRequests(prev => prev.map(r => r.id === editingId ? (data as EventRequest) : r));
    setShowForm(false);
    setEditingId(null);
    setForm({ client_name: '', event_type: '', city: '', event_dates: [], estilos: [], budget_min: '', budget_max: '', roleCounts: {}, description: '', contact_email: '', contact_phone: '' });
    toast.success('Oferta actualizada.');
  };

  // Añadir una plaza más de un rol que la oferta YA tenía, sin tocar el
  // formulario de edición — la X de la tarjeta quita, este botón suma.
  const addSlot = async (req: EventRequest, role: string) => {
    const { data, error } = await supabase
      .from('event_request_slots' as any)
      .insert({ request_id: req.id, role })
      .select()
      .single();
    if (error || !data) { toast.error('No se pudo añadir la plaza.'); return; }
    setSlots(prev => ({ ...prev, [req.id]: [...(prev[req.id] ?? []), data as { id: string; role: string }] }));
  };

  // Cantidad por rol, tipo carrito: +/- sube o baja, nunca baja de 0. El array
  // plano que espera roles_needed (compatibilidad con lo que ya lee el resto
  // del código) se deriva repitiendo cada rol tantas veces como su cantidad.
  const setRoleCount = (r: string, delta: number) => {
    setForm(f => {
      const current = f.roleCounts[r] ?? 0;
      const next = Math.max(0, current + delta);
      const roleCounts = { ...f.roleCounts };
      if (next === 0) delete roleCounts[r]; else roleCounts[r] = next;
      return { ...f, roleCounts };
    });
  };

  const rolesNeededFlat = (counts: Record<string, number>): string[] =>
    Object.entries(counts).flatMap(([role, n]) => Array(n).fill(role));

  // Todos los campos son obligatorios para publicar — una oferta a medias
  // (sin fecha, sin presupuesto, sin descripción) no le sirve al profesional
  // que la ve para decidir si le interesa. El contacto con el elegido se
  // hace por el chat interno de XPEAK, no por email/teléfono del formulario
  // — por eso no se piden aquí.
  const camposIncompletos = (f: typeof form, roles_needed: string[]): string | null => {
    if (!f.client_name.trim()) return 'tu nombre o empresa';
    if (!f.event_type) return 'el tipo de evento';
    if (!f.city.trim()) return 'la ciudad';
    if (f.event_dates.length === 0) return 'al menos una fecha';
    if (!f.budget_min || !f.budget_max) return 'el presupuesto (mínimo y máximo)';
    if (roles_needed.length === 0) return 'qué profesionales necesitas';
    if (!f.description.trim()) return 'la descripción del evento';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const roles_needed = rolesNeededFlat(form.roleCounts);
    const falta = camposIncompletos(form, roles_needed);
    if (falta) { toast.error(`Falta: ${falta}`); return; }
    // Publicar avisa de verdad a profesionales reales (push + email) en
    // segundos. El 10 sep 2026 una oferta de prueba con nombre "Verify Test
    // Co" se publicó, avisó a 19 profesionales y contrató a uno real
    // (Gonzalo DJ) antes de borrarla — nadie se dio cuenta de que no era una
    // oferta real hasta que el profesional preguntó por qué no veía los
    // detalles. No se bloquea (puede ser un nombre real de empresa), solo se
    // pide confirmar.
    if (/\b(test|prueba|verify|demo)\b/i.test(form.client_name)) {
      const seguro = window.confirm(
        `"${form.client_name}" parece un nombre de prueba. Al publicar se avisa YA a profesionales reales por email y push — ¿seguro que quieres continuar?`
      );
      if (!seguro) return;
    }
    setSubmitting(true);
    const { data, error } = await (supabase
      .from('event_requests' as any)
      .insert({
        client_name: form.client_name.trim(),
        client_user_id: user?.id ?? null,
        event_type: form.event_type,
        city: form.city.trim(),
        // event_date conserva la primera fecha por compatibilidad (la lee el
        // trigger de aviso y el cron de valoración); event_dates lleva todas.
        event_date: form.event_dates[0] || null,
        event_dates: form.event_dates.length > 0 ? form.event_dates : null,
        estilos: form.estilos.length > 0 ? form.estilos : null,
        budget_min: form.budget_min ? parseInt(form.budget_min) : null,
        budget_max: form.budget_max ? parseInt(form.budget_max) : null,
        roles_needed,
        description: form.description.trim() || null,
        contact_email: form.contact_email.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
      })
      .select()
      .single() as any);
    if (error) { setSubmitting(false); toast.error('Error al publicar. Inténtalo de nuevo.'); return; }

    // Una plaza por unidad: "2 camareros" son 2 filas, cada una con su propio
    // estado independiente (ver event_request_slots).
    const nuevaOferta = data as EventRequest;
    const { error: slotsError } = await supabase
      .from('event_request_slots' as any)
      .insert(roles_needed.map(role => ({ request_id: nuevaOferta.id, role })));
    setSubmitting(false);
    if (slotsError) { toast.error('La oferta se creó pero hubo un problema con las plazas.'); }

    toast.success('¡Solicitud publicada! Los profesionales podrán contactarte.');
    setRequests(prev => [nuevaOferta, ...prev]);
    setShowForm(false);
    setForm({ client_name: '', event_type: '', city: '', event_dates: [], estilos: [], budget_min: '', budget_max: '', roleCounts: {}, description: '', contact_email: '', contact_phone: '' });
  };

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="min-w-0">
          <h3 className="text-sm font-black" style={{ color: '#222', fontFamily: 'Syne, sans-serif' }}>
            Solicitudes de Evento
          </h3>
          <p className="text-xs" style={{ color: '#333' }}>
            {isEmpresario ? 'Publica lo que necesitas — los profesionales te contactan' : 'Clientes buscando profesionales ahora'}
          </p>
        </div>
        {/* Publicar una solicitud de evento es cosa del empresario: al
            profesional (que viene a RESPONDERLAS) se le ofrecía el mismo CTA. */}
        {isEmpresario && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
            <Plus size={12} /> Publicar evento
          </button>
        )}
      </div>

      {/* List */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1,2].map(i => <div key={i} className="glass-panel animate-pulse rounded-2xl h-28" />)}
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="py-8 text-center rounded-2xl" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <Calendar size={24} className="mx-auto mb-2" style={{ color: 'rgba(212,175,55,0.3)' }} />
          <p className="text-xs font-bold mb-1" style={{ color: '#333' }}>Sin solicitudes abiertas</p>
          <p className="text-xs" style={{ color: 'rgba(22,20,18,0.25)' }}>
            {isEmpresario ? 'Publica tu evento y los pros disponibles te contactarán.' : 'Cuando un cliente publique un evento aparecerá aquí.'}
          </p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {requests.map(req => {
            const open = expanded === req.id;
            const days = daysLeft(req.expires_at);
            return (
              <div key={req.id} className="rounded-2xl overflow-hidden transition-all"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div className="p-4">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black"
                          style={{ background: 'rgba(212,175,55,0.12)', color: '#B8941E' }}>
                          {req.event_type}
                        </span>
                        <span className="text-[10px]" style={{ color: days <= 2 ? '#ef4444' : '#333' }}>
                          {days}d restantes
                        </span>
                      </div>
                      <p className="text-sm font-black truncate" style={{ color: '#111' }}>
                        {req.client_name}
                      </p>
                    </div>
                    {/* Solo el dueño de la oferta la edita. Antes había que
                        borrarla y publicar otra, perdiendo las respuestas ya
                        recibidas. */}
                    {req.client_user_id === user?.id && (
                      <div className="flex-shrink-0 flex items-center gap-1.5">
                        <button type="button" onClick={() => startEdit(req)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all hover:scale-105"
                          style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#555' }}>
                          <Pencil size={10} /> Editar
                        </button>
                        <button type="button" onClick={() => cancelRequest(req)}
                          disabled={cancelling === req.id}
                          title="Cancelar toda la oferta"
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all hover:scale-105 disabled:opacity-60"
                          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626' }}>
                          <X size={10} /> {cancelling === req.id ? '…' : 'Cancelar'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#333' }}>
                      <MapPin size={10} /> {req.city}
                    </span>
                    {req.event_dates && req.event_dates.length > 1 ? (
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#333' }}>
                        <Calendar size={10} /> {req.event_dates.map(fmtDate).join(' y ')}
                      </span>
                    ) : req.event_date && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#333' }}>
                        <Calendar size={10} /> {fmtDate(req.event_date)}
                      </span>
                    )}
                    {(req.budget_min || req.budget_max) && (
                      <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#8A6D0F' }}>
                        <Euro size={10} />
                        {req.budget_min && req.budget_max
                          ? `${req.budget_min}–${req.budget_max}€`
                          : req.budget_max ? `hasta ${req.budget_max}€` : `desde ${req.budget_min}€`}
                      </span>
                    )}
                  </div>

                  {/* Roles agrupados por cantidad + cuántos ya están cubiertos —
                      "2 Sala & Barra · 1/2 cubiertos" en vez de repetir el chip. */}
                  {(slots[req.id]?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {Object.entries(
                        (slots[req.id] ?? []).reduce((acc, s) => {
                          (acc[s.role] ??= []).push(s.id);
                          return acc;
                        }, {} as Record<string, string[]>)
                      ).map(([role, slotIds]) => {
                        const cubiertos = (responses[req.id] ?? []).filter(
                          r2 => r2.hired_at && slotIds.includes(r2.slot_id ?? '')
                        ).length;
                        return (
                          <span key={role} className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{
                              background: cubiertos === slotIds.length ? 'rgba(34,197,94,0.1)' : 'rgba(0,0,0,0.04)',
                              color: cubiertos === slotIds.length ? '#16a34a' : '#333',
                              border: `1px solid ${cubiertos === slotIds.length ? 'rgba(34,197,94,0.3)' : 'rgba(0,0,0,0.07)'}`,
                            }}>
                            {slotIds.length > 1 ? `${slotIds.length} ${role}` : role}
                            {cubiertos > 0 && ` · ${cubiertos}/${slotIds.length} cubiertos`}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Expand */}
                  <button onClick={() => setExpanded(open ? null : req.id)}
                    className="w-full flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs transition-all hover:bg-black/5"
                    style={{ color: '#333', border: '1px solid rgba(0,0,0,0.06)' }}>
                    {open ? <><ChevronUp size={12} /> Cerrar</> : <><ChevronDown size={12} /> Ver detalle y contactar</>}
                  </button>

                  {open && (
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      {req.description && (
                        <p className="text-xs leading-relaxed mb-3" style={{ color: '#222' }}>
                          {req.description}
                        </p>
                      )}
                      {/* El contacto se hace DENTRO de XPEAK. Antes se pintaban
                          mailto: y tel: con los datos del organizador: la
                          conversación se iba fuera y no quedaba registro de
                          quién se había apuntado ni de si el bolo se cerró. */}
                      {isEmpresario ? (
                        (slots[req.id]?.length ?? 0) > 0 ? (
                          <div className="flex flex-col gap-4">
                            {slots[req.id].map(slot => {
                              const candidatos = (responses[req.id] ?? []).filter(r2 => r2.slot_id === slot.id);
                              const cubierta = candidatos.some(c => c.hired_at);
                              return (
                                <div key={slot.id}>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#8A6D0F' }}>
                                      {slot.role} — {candidatos.length} interesado{candidatos.length === 1 ? '' : 's'}
                                    </p>
                                    {candidatos.length === 0 && (
                                      <button type="button"
                                        onClick={() => removeSlot(slot.id, slot.role)}
                                        disabled={cancelling === slot.id}
                                        title={`Ya no necesito ${slot.role}`}
                                        className="p-1 rounded-lg hover:bg-black/5 disabled:opacity-50">
                                        <X size={12} style={{ color: '#999' }} />
                                      </button>
                                    )}
                                  </div>
                                  {candidatos.length === 0 ? (
                                    <p className="text-xs text-center py-2 rounded-xl" style={{ color: '#888', background: 'rgba(0,0,0,0.02)' }}>
                                      Aún no se ha apuntado nadie.
                                    </p>
                                  ) : (
                                    <div className="flex flex-col gap-2">
                                      {candidatos.map(resp => (
                                        <div key={resp.id} className="px-3 py-2 rounded-xl"
                                          style={{
                                            background: resp.hired_at ? 'rgba(34,197,94,0.08)' : resp.chosen_at ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.06)',
                                            border: `1px solid ${resp.hired_at ? 'rgba(34,197,94,0.3)' : resp.chosen_at ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.18)'}`,
                                          }}>
                                          <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                              {resp.photo ? (
                                                <img src={resp.photo} alt={resp.name}
                                                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                                                  style={{ border: '1px solid rgba(0,0,0,0.08)' }} />
                                              ) : (
                                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                                                  style={{ background: 'rgba(0,0,0,0.06)', color: '#666' }}>
                                                  {resp.name.charAt(0).toUpperCase()}
                                                </div>
                                              )}
                                              <p className="text-xs font-bold truncate" style={{ color: '#111' }}>{resp.name}</p>
                                            </div>
                                            {resp.hired_at ? (
                                              <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="flex items-center gap-1 text-[10px] font-black"
                                                  style={{ color: '#16a34a' }}>
                                                  <Check size={11} /> CONTRATADO
                                                </span>
                                                <button type="button"
                                                  onClick={() => openContract(req, resp.professionalUserId, resp.name)}
                                                  disabled={loadingContract}
                                                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black transition-all hover:scale-105 disabled:opacity-60"
                                                  style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', color: '#8A6D0F' }}>
                                                  <FileText size={10} /> {loadingContract ? '…' : 'Contrato'}
                                                </button>
                                              </div>
                                            ) : resp.chosen_at ? (
                                              <span className="text-[10px] font-black flex-shrink-0" style={{ color: '#8A6D0F' }}>
                                                ESPERANDO SU CONFIRMACIÓN
                                              </span>
                                            ) : cubierta ? null : (
                                              <button type="button"
                                                onClick={() => chooseProfessional(req, resp.id, resp.name)}
                                                disabled={hiring === resp.id}
                                                className="px-2.5 py-1 rounded-lg text-[10px] font-black transition-all hover:scale-105 disabled:opacity-60 flex-shrink-0"
                                                style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                                                {hiring === resp.id ? '…' : 'Elegir'}
                                              </button>
                                            )}
                                          </div>
                                          {resp.message && (
                                            <p className="text-xs mt-0.5" style={{ color: '#333' }}>{resp.message}</p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-center py-2" style={{ color: '#333' }}>
                            Aún no se ha apuntado nadie. Te avisaremos en tus notificaciones.
                          </p>
                        )
                      ) : applied[req.id]?.chosenAt ? (
                        <div className="flex flex-col gap-2">
                          <div className="px-3 py-2 rounded-xl text-xs font-bold text-center"
                            style={{ background: 'rgba(212,175,55,0.12)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.35)' }}>
                            ¡Te han elegido para este {jobWord(profile.role)}! Confirma antes de que el organizador elija a otro.
                          </div>
                          <div className="flex gap-2">
                            <button type="button"
                              onClick={() => acceptChoice(applied[req.id].responseId, req.id)}
                              disabled={hiring === applied[req.id].responseId}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 disabled:opacity-60"
                              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                              <Check size={12} /> {hiring === applied[req.id].responseId ? '…' : 'Aceptar'}
                            </button>
                            <button type="button"
                              onClick={() => rejectChoice(applied[req.id].responseId)}
                              disabled={hiring === applied[req.id].responseId}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-black/5 disabled:opacity-60"
                              style={{ background: 'transparent', color: '#666', border: '1px solid rgba(0,0,0,0.15)' }}>
                              <X size={12} /> Rechazar
                            </button>
                          </div>
                        </div>
                      ) : applied[req.id] ? (
                        <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
                          style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.25)' }}>
                          <Check size={12} /> Te has apuntado — el organizador ya lo sabe
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={applyText[req.id] ?? ''}
                            onChange={e => setApplyText(t => ({ ...t, [req.id]: e.target.value }))}
                            placeholder="Preséntate en una línea (opcional): disponibilidad, equipo, experiencia…"
                            rows={2} maxLength={300}
                            className="w-full px-3 py-2 rounded-xl text-xs focus:outline-none resize-none"
                            style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
                          <button
                            type="button"
                            onClick={() => applyToRequest(req)}
                            disabled={applying === req.id}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                            <Send size={11} /> {applying === req.id ? 'Enviando…' : 'Me interesa este bolo'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setEditingId(null); } }}>
          <div className="w-full max-w-lg rounded-3xl overflow-hidden"
            style={{ background: '#fff', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="sticky top-0 flex items-center justify-between px-6 py-4"
              style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', zIndex: 1 }}>
              <div>
                <h4 className="font-black text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {editingId ? 'Editar solicitud de evento' : 'Publicar solicitud de evento'}
                </h4>
                <p className="text-xs" style={{ color: '#333' }}>
                  {editingId ? 'Los profesionales ya apuntados verán los cambios' : 'Visible 7 días para todos los profesionales'}
                </p>
              </div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1.5 rounded-lg hover:bg-black/5">
                <X size={16} style={{ color: '#333' }} />
              </button>
            </div>

            <form onSubmit={e => { e.preventDefault(); editingId ? saveEdit() : handleSubmit(e); }} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-black mb-1.5 block" style={{ color: '#333' }}>TU NOMBRE O EMPRESA *</label>
                  <input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))}
                    placeholder="María García / Eventos Sol" required
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>

                <div>
                  <label className="text-xs font-black mb-1.5 block" style={{ color: '#333' }}>TIPO DE EVENTO *</label>
                  <select value={form.event_type} onChange={e => setForm(f => ({ ...f, event_type: e.target.value }))} required
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none appearance-none"
                    style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }}>
                    <option value="">Seleccionar...</option>
                    {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black mb-1.5 block" style={{ color: '#333' }}>CIUDAD *</label>
                  <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="Madrid, Sevilla..." required
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>

                <div>
                  <label className="text-xs font-black mb-1.5 block" style={{ color: '#333' }}>
                    FECHAS DEL EVENTO
                  </label>
                  {/* Varias fechas: el Burger Gourmet Fest era viernes Y sábado
                      y solo cabía una, así que el segundo día acabó explicado
                      en la descripción, donde ningún recordatorio lo lee. */}
                  {form.event_dates.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {form.event_dates.map(d => (
                        <span key={d} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
                          style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', color: '#8A6D0F' }}>
                          {new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                          <button type="button" aria-label={`Quitar ${d}`}
                            onClick={() => setForm(f => ({ ...f, event_dates: f.event_dates.filter(x => x !== d) }))}
                            className="opacity-60 hover:opacity-100">
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input type="date" value=""
                    onChange={e => {
                      const v = e.target.value;
                      if (!v) return;
                      setForm(f => f.event_dates.includes(v)
                        ? f
                        : { ...f, event_dates: [...f.event_dates, v].sort() });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
                  <p className="text-[10px] mt-1" style={{ color: '#888' }}>
                    Añade un día cada vez si el evento dura varias jornadas.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-black mb-1.5 block" style={{ color: '#333' }}>PRESUPUESTO (€)</label>
                  <div className="flex gap-2">
                    <input type="number" value={form.budget_min} onChange={e => setForm(f => ({ ...f, budget_min: e.target.value }))}
                      placeholder="Mín" className="w-1/2 px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                      style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
                    <input type="number" value={form.budget_max} onChange={e => setForm(f => ({ ...f, budget_max: e.target.value }))}
                      placeholder="Máx" className="w-1/2 px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                      style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black mb-1 block" style={{ color: '#333' }}>¿QUÉ PROFESIONALES NECESITAS?</label>
                <p className="text-[10px] mb-2" style={{ color: '#888' }}>
                  Ej. 1 DJ y 2 camareros — cada uno se elige y confirma por separado.
                </p>
                <div className="flex flex-col gap-1.5">
                  {ROLES_LIST.map(r => {
                    const count = form.roleCounts[r] ?? 0;
                    return (
                      <div key={r} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl"
                        style={{
                          background: count > 0 ? 'rgba(212,175,55,0.1)' : 'rgba(0,0,0,0.03)',
                          border: `1px solid ${count > 0 ? 'rgba(212,175,55,0.4)' : 'rgba(0,0,0,0.07)'}`,
                        }}>
                        <span className="text-xs font-semibold" style={{ color: count > 0 ? '#B8941E' : '#333' }}>{r}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button type="button" onClick={() => setRoleCount(r, -1)}
                            disabled={count === 0}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-black disabled:opacity-30"
                            style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.15)', color: '#333' }}>
                            −
                          </button>
                          <span className="w-4 text-center text-sm font-black" style={{ color: '#111' }}>{count}</span>
                          <button type="button" onClick={() => setRoleCount(r, 1)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-black"
                            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Especialidad pedida: no solo para DJ. Antes una oferta de DJ
                  avisaba a los 47 géneros por igual — al de techno le llegaba
                  una boda de pachanga — y lo mismo pasaba en el resto de
                  roles (a un mago de bodas le llegaba una oferta de magia
                  infantil). Se usan las mismas tags que cada rol declara en
                  su perfil (ROLE_TAGS), así no hay que mantener dos listas. */}
              {(() => {
                const rolesSeleccionados = Object.keys(form.roleCounts);
                const opciones = opcionesEstilo(rolesSeleccionados);
                if (opciones.length === 0) return null;
                const esDJ = rolesSeleccionados.includes('DJ / Artista');
                return (
                  <div>
                    <label className="text-xs font-black mb-2 block" style={{ color: '#333' }}>
                      {esDJ ? '¿QUÉ ESTILO DE MÚSICA QUIERES?' : '¿ALGUNA ESPECIALIDAD CONCRETA?'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button type="button"
                        onClick={() => setForm(f => ({ ...f, estilos: [] }))}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: form.estilos.length === 0 ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.04)',
                          border: `1px solid ${form.estilos.length === 0 ? 'rgba(212,175,55,0.5)' : 'rgba(0,0,0,0.08)'}`,
                          color: form.estilos.length === 0 ? '#B8941E' : '#222',
                        }}>
                        De todo un poco
                      </button>
                      {opciones.map(e => {
                        const sel = e.incluye.every(g => form.estilos.includes(g)) && form.estilos.length > 0;
                        return (
                          <button key={e.label} type="button"
                            onClick={() => setForm(f => ({ ...f, estilos: e.incluye }))}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={{
                              background: sel ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.04)',
                              border: `1px solid ${sel ? 'rgba(212,175,55,0.5)' : 'rgba(0,0,0,0.08)'}`,
                              color: sel ? '#B8941E' : '#222',
                            }}>
                            {e.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div>
                <label className="text-xs font-black mb-1.5 block" style={{ color: '#333' }}>DESCRIPCIÓN</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Cuéntanos más sobre el evento: nº de personas, estilo, necesidades especiales..."
                  rows={3} className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
                  style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)' }} />
              </div>

              {!editingId && (
                <p className="text-[10px]" style={{ color: '#333' }}>
                  Al publicar aceptas que los profesionales de XPEAK puedan ver y responder a tu solicitud. Visible 7 días. El contacto con el profesional elegido se hace dentro de XPEAK (chat), no hace falta dar tu email ni tu teléfono.
                </p>
              )}

              <button type="submit"
                disabled={submitting || savingEdit || (!editingId && Object.keys(form.roleCounts).length === 0)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm transition-all disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', opacity: (submitting || savingEdit) ? 0.7 : 1 }}>
                <Send size={14} /> {editingId
                  ? (savingEdit ? 'Guardando...' : 'Guardar cambios')
                  : (submitting ? 'Publicando...' : 'Publicar solicitud')}
              </button>
            </form>
          </div>
        </div>
      )}

      {contractFor && contractProfile && (
        <ContractModal
          professional={contractProfile}
          prefill={{
            contratanteNombre: contractFor.req.client_name,
            nombreEvento: contractFor.req.event_type,
            fechaEvento: contractFor.req.event_dates?.[0] ?? contractFor.req.event_date ?? '',
            nombreLocal: contractFor.req.city,
            precioNeto: contractFor.req.budget_max != null
              ? String(contractFor.req.budget_max)
              : contractFor.req.budget_min != null ? String(contractFor.req.budget_min) : '',
          } satisfies ContractPrefill}
          onClose={() => { setContractFor(null); setContractProfile(null); }}
        />
      )}
    </div>
  );
};

export default EventRequestsSection;
