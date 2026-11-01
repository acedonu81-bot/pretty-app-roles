// Forma de onda de los archivos subidos a XPEAK (perfil de DJ, fase 2,
// 1 nov 2026). Se calcula una sola vez al subir el archivo y se guarda en
// set_ondas: pintar la onda en cada visita no exige descargar el audio.

export const NUM_PICOS = 300;

/**
 * Reduce las muestras a `n` valores de 8 a 100: energía media (RMS) de cada
 * tramo, estirada entre el tramo más flojo y el más fuerte del set. Con el
 * pico máximo, un set masterizado salía casi entero a 100 (un bloque plano);
 * así se ven los breaks y las subidas, como en SoundCloud.
 */
export const picosDesdeMuestras = (canales: Float32Array[], n = NUM_PICOS): number[] => {
  const largo = canales[0]?.length ?? 0;
  if (!largo) return [];
  const tramo = Math.max(1, Math.floor(largo / n));
  const rms: number[] = [];
  for (let i = 0; i < n; i++) {
    const ini = i * tramo;
    if (ini >= largo) break;
    const fin = Math.min(largo, ini + tramo);
    let suma = 0;
    for (const c of canales) {
      for (let j = ini; j < fin; j++) suma += c[j] * c[j];
    }
    rms.push(Math.sqrt(suma / ((fin - ini) * canales.length)));
  }
  const min = Math.min(...rms);
  const max = Math.max(...rms);
  if (max - min < 1e-9) return rms.map(() => (max > 0 ? 60 : 8));
  // Suelo de 8 para que los silencios se vean como una línea y no como un hueco.
  return rms.map(v => Math.round(8 + 92 * ((v - min) / (max - min))));
};

/**
 * Decodifica el archivo a baja resolución (3 kHz basta para la silueta y
 * consume ~15 veces menos memoria que a 44,1 kHz) y saca los picos. Devuelve
 * null si el navegador no puede: la onda es un extra, nunca bloquea la subida.
 */
export const calcularOnda = async (archivo: File): Promise<{ duracion: number; picos: number[] } | null> => {
  try {
    const Ctx = window.OfflineAudioContext
      ?? (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext }).webkitOfflineAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx(1, 1, 3000);
    const audio = await ctx.decodeAudioData(await archivo.arrayBuffer());
    const canales = Array.from({ length: audio.numberOfChannels }, (_, i) => audio.getChannelData(i));
    const picos = picosDesdeMuestras(canales);
    const duracion = Math.round(audio.duration);
    if (picos.length < 20 || duracion < 1) return null;
    return { duracion, picos };
  } catch {
    return null;
  }
};
