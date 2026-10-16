import { useEffect, useRef, useState } from 'react';

// Fuegos artificiales a pantalla completa al cerrar un acuerdo (16 oct 2026,
// petición del usuario: "que salten chispas como si fuera un cumpleaños,
// fuegos artificiales de colores, enhorabuena"). Se lanza con celebrar() desde
// cualquier sitio; este componente va montado una vez en el Dashboard. Sin
// librerías: un canvas con partículas, unos 4,5 s, y se cierra al tocar.
// Con "reducir movimiento" solo sale el mensaje.
const EVENTO = 'xpeak:celebrar';
const DURACION_MS = 4500;
const COLORES = ['#D4AF37', '#FFD86B', '#FF4D6D', '#FF8A3D', '#2EC4B6', '#3A86FF', '#8338EC', '#06D6A0', '#FFFFFF'];

let ultimo = { clave: '', t: 0 };

/** Lanza la celebración. La misma clave en menos de 10 s no se repite
 *  (varios oyentes en vivo pueden enterarse del mismo acuerdo). */
export function celebrar(titulo: string, texto?: string, clave = titulo + (texto ?? '')) {
  const ahora = Date.now();
  if (ultimo.clave === clave && ahora - ultimo.t < 10_000) return;
  ultimo = { clave, t: ahora };
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: { titulo, texto } }));
}

interface Chispa { x: number; y: number; vx: number; vy: number; vida: number; max: number; color: string; r: number }
interface Cohete { x: number; y: number; vy: number; destinoY: number; color: string }

const FuegosArtificiales = () => {
  const [msg, setMsg] = useState<{ titulo: string; texto?: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onCelebrar = (e: Event) => setMsg((e as CustomEvent).detail);
    window.addEventListener(EVENTO, onCelebrar);
    return () => window.removeEventListener(EVENTO, onCelebrar);
  }, []);

  useEffect(() => {
    if (!msg) return;
    const cerrar = window.setTimeout(() => setMsg(null), DURACION_MS + 1500);
    const reducir = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (reducir || !canvas || !ctx) return () => window.clearTimeout(cerrar);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ajustar = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ajustar();
    window.addEventListener('resize', ajustar);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    const azar = (a: number, b: number) => a + Math.random() * (b - a);
    const color = () => COLORES[Math.floor(Math.random() * COLORES.length)];
    const chispas: Chispa[] = [];
    const cohetes: Cohete[] = [];

    const explotar = (x: number, y: number, c: string) => {
      const n = W() < 640 ? 70 : 110;
      const segundo = Math.random() < 0.5 ? color() : c;
      for (let i = 0; i < n; i++) {
        const ang = (Math.PI * 2 * i) / n + azar(-0.05, 0.05);
        const vel = azar(1.5, 6.5);
        chispas.push({
          x, y, vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel,
          vida: 0, max: azar(55, 95), color: i % 3 === 0 ? segundo : c, r: azar(1.4, 2.8),
        });
      }
    };
    const lanzar = () => cohetes.push({
      x: azar(W() * 0.12, W() * 0.88), y: H() + 10, vy: azar(-11, -14),
      destinoY: azar(H() * 0.12, H() * 0.5), color: color(),
    });

    const inicio = performance.now();
    let siguiente = 0;
    let raf = 0;
    const paso = (t: number) => {
      const pasado = t - inicio;
      if (pasado < DURACION_MS && t >= siguiente) {
        lanzar();
        if (Math.random() < 0.6) lanzar();
        siguiente = t + azar(180, 420);
      }
      // Estela: se borra con transparencia para que las chispas dejen rastro.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(0, 0, W(), H());
      ctx.globalCompositeOperation = 'lighter';

      for (let i = cohetes.length - 1; i >= 0; i--) {
        const k = cohetes[i];
        k.y += k.vy; k.vy += 0.12;
        ctx.fillStyle = k.color;
        ctx.beginPath(); ctx.arc(k.x, k.y, 2.4, 0, Math.PI * 2); ctx.fill();
        if (k.y <= k.destinoY || k.vy >= 0) { explotar(k.x, k.y, k.color); cohetes.splice(i, 1); }
      }
      for (let i = chispas.length - 1; i >= 0; i--) {
        const p = chispas[i];
        p.vida++; p.x += p.vx; p.y += p.vy; p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.06;
        const alfa = 1 - p.vida / p.max;
        if (alfa <= 0) { chispas.splice(i, 1); continue; }
        ctx.globalAlpha = alfa;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (pasado < DURACION_MS + 1500 || chispas.length) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);

    return () => {
      window.clearTimeout(cerrar);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', ajustar);
    };
  }, [msg]);

  if (!msg) return null;
  return (
    <div role="status" aria-live="polite" onClick={() => setMsg(null)}
      className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer"
      style={{ background: 'rgba(10,9,8,0.55)' }}>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="relative mx-4 px-8 py-6 rounded-3xl text-center max-w-md"
        style={{ background: 'rgba(255,253,247,0.96)', border: '1px solid rgba(212,175,55,0.5)', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
        <p className="text-3xl sm:text-4xl font-black font-display" style={{ color: '#8B6A00' }}>{msg.titulo}</p>
        {msg.texto && <p className="text-sm mt-2 font-semibold" style={{ color: '#333' }}>{msg.texto}</p>}
        <p className="text-[0.75rem] mt-3" style={{ color: 'rgba(0,0,0,0.45)' }}>Toca para cerrar</p>
      </div>
    </div>
  );
};

export default FuegosArtificiales;
