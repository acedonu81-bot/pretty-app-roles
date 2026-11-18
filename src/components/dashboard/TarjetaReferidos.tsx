// "Invita y paga menos": enlace de invitación y estado del descuento por amigos.
// Sustituye a la antigua "Invita y gana prioridad" cuando los cobros están encendidos.
import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { descuentoReferidos, enlaceInvitacion, leerMisReferidos } from '@/lib/referidos';

const PASOS = [
  { pct: 0, texto: 'Sin amigos' },
  { pct: 10, texto: '1 amigo' },
  { pct: 20, texto: '2 amigos' },
];

const TarjetaReferidos = ({ suscrito }: { suscrito: boolean }) => {
  const profile = useProfile();
  const codigo = (profile as any).referral_code as string | null;
  const [datos, setDatos] = useState({ invitados: 0, pagando: 0 });
  const [copiado, setCopiado] = useState(false);

  useEffect(() => { leerMisReferidos().then(setDatos).catch(() => {}); }, []);

  const pct = descuentoReferidos(datos.pagando);
  const copiar = async () => {
    if (!codigo) return;
    try { await navigator.clipboard.writeText(enlaceInvitacion(codigo)); } catch { return; }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="rounded-2xl p-6 md:p-7 flex flex-col gap-4"
      style={{ background: '#fff', border: '1px solid rgba(212,175,55,.5)', boxShadow: '0 2px 4px rgba(60,45,0,.07), 0 22px 44px -20px rgba(120,90,0,.4)' }}>
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: '#8A6D0F' }}>Invita y paga menos</p>
        <p className="font-black text-lg mt-1">Trae a otros profesionales y baja tu cuota</p>
        <p className="text-sm mt-1" style={{ color: '#6b6454' }}>
          Cada amigo que se suscriba con tu enlace y pague te baja la cuota un 10 %, hasta un 20 % con dos.
          Se aplica desde tu siguiente cobro y dura mientras sigan suscritos.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2" role="list" aria-label="Descuento por amigos">
        {PASOS.map(p => {
          const actual = p.pct === pct;
          return (
            <div key={p.pct} role="listitem" aria-current={actual ? 'true' : undefined}
              className="rounded-xl py-3 text-center"
              style={actual
                ? { background: 'linear-gradient(180deg,#E6C75A 0%,#CFA52B 100%)', color: '#1d1a12', boxShadow: '0 8px 16px -8px rgba(120,90,0,.6)' }
                : { background: '#FBF3DD', color: '#6b5a1e' }}>
              <p className="font-black text-xl">{p.pct} %</p>
              <p className="text-xs font-bold">{p.texto}</p>
            </div>
          );
        })}
      </div>

      <p className="text-sm font-bold" style={{ color: '#5a4716' }}>
        {datos.invitados === 0
          ? 'Aún no has invitado a nadie.'
          : `${datos.invitados} ${datos.invitados === 1 ? 'invitado' : 'invitados'} · ${datos.pagando} pagando`}
        {pct > 0 && (suscrito ? ` · Tu descuento: ${pct} %` : ` · Tienes guardado un ${pct} %: se aplica cuando te suscribas`)}
      </p>

      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0 px-3 py-2.5 rounded-lg text-xs font-mono truncate"
          style={{ background: '#FFFDF7', border: '1px solid rgba(122,98,22,.2)', color: '#3d3d4e' }}>
          {codigo ? enlaceInvitacion(codigo).replace('https://', '') : '···'}
        </div>
        <button type="button" onClick={copiar} disabled={!codigo}
          className="px-4 py-2.5 rounded-lg flex items-center gap-1.5 text-sm font-bold flex-shrink-0 disabled:opacity-40"
          style={copiado
            ? { background: 'rgba(5,150,105,.12)', border: '1px solid rgba(5,150,105,.3)', color: '#059669' }
            : { background: 'linear-gradient(180deg,#E6C75A 0%,#CFA52B 100%)', color: '#1d1a12' }}>
          {copiado ? <Check size={14} /> : <Copy size={14} />}
          {copiado ? 'Copiado' : 'Copiar enlace'}
        </button>
      </div>
      <p className="text-xs" style={{ color: '#6b6454' }}>
        Solo cuentan los amigos directos y no quien pague con tu misma tarjeta. <a href="/condiciones-suscripcion" className="underline">Condiciones</a>.
      </p>
    </div>
  );
};

export default TarjetaReferidos;
