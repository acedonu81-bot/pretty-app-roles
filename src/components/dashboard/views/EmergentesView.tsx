import DirectoryView from './DirectoryView';
import type { Profile } from '@/data/profiles';

interface Props { onNavigate?: (view: string) => void; onMessage?: (userId: string, name: string) => void; searchQuery?: string; onViewProfile?: (p: Profile) => void; }

// Directorio separado para DJs que se están iniciando (16 sep 2026). No es
// un oficio nuevo ni usa `roles[]` — filtra por experience_level='emergente',
// un atributo ortogonal al rol (ver migración 20260916120000_emergentes.sql).
// Sin Flash Booking directo a propósito: solo contacto por mensaje, para no
// arrastrar la métrica de "responde en X" de los profesionales verificados.
const EmergentesView = ({ onNavigate, onMessage, searchQuery, onViewProfile }: Props) => (
  <DirectoryView
    role="dj"
    title="Cantera XPEAK"
    subtitle="DJs que empiezan y tienen proyección. XPEAK escucha sus sesiones y los sube al directorio de DJs cuando su nivel lo demuestra. Contacta por mensaje."
    onNavigate={onNavigate}
    onMessage={onMessage}
    searchQuery={searchQuery}
    onViewProfile={onViewProfile}
    experienceLevel="only"
  />
);

export default EmergentesView;
