import { useSoundcloudWidget } from '@/hooks/useSoundcloudWidget';
import { useMixcloudWidget } from '@/hooks/useMixcloudWidget';
import { useHearthisWidget } from '@/hooks/useHearthisWidget';
import { useContadorEscucha } from '@/hooks/useContadorEscucha';

// Cuenta las escuchas de 5 minutos de un set de DJ anclado a la barra de abajo
// (10 nov 2026). Va en su propio chunk (lazy en ReproductorConcurso): la barra
// está en todas las páginas y con estos hooks dentro el chunk principal pasaba
// del límite de check-bundle-size. No pinta nada.
const ContadorBarra = ({ djUserId, setUrl, src, iframe, sonandoAudio, posAudio }: {
  djUserId: string;
  setUrl: string;
  /** src del iframe ('' si es un archivo con <audio>). */
  src: string;
  iframe: HTMLIFrameElement | null;
  sonandoAudio: boolean;
  posAudio: number;
}) => {
  const esSc = /w\.soundcloud\.com/.test(src);
  const esMx = /mixcloud\.com/.test(src);
  const esHt = /hearthis\.at/.test(src);
  const sc = useSoundcloudWidget(esSc ? iframe : null);
  const mx = useMixcloudWidget(esMx ? iframe : null);
  const ht = useHearthisWidget(esHt ? iframe : null);
  const externo = esSc ? sc : esMx ? mx : esHt ? ht : null;
  useContadorEscucha(djUserId, setUrl, src ? !!externo?.sonando : sonandoAudio, src ? (externo?.posicion ?? 0) : posAudio);
  return null;
};

export default ContadorBarra;
