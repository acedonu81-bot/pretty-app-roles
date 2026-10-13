import EventRequestsSection from './EventRequestsSection';

interface DemandaTabProps {
  /** Oferta que debe quedar abierta y a la vista (aviso, email o campana). */
  foco?: { requestId: string; n: number } | null;
  onMessage?: (userId: string, name: string) => void;
}

// Aquí vivían además las "ofertas urgentes" (Flash Jobs): un segundo sistema de
// ofertas con otra pantalla y nombres parecidos, sin una sola oferta real, que
// mandaba al organizador un email "te ha enviado un mensaje" sin haber mensaje.
// Se quitó el 13 oct 2026: queda un único camino, la oferta del organizador.
const DemandaTab = ({ foco, onMessage }: DemandaTabProps = {}) => (
  <EventRequestsSection foco={foco} onMessage={onMessage} />
);

export default DemandaTab;
