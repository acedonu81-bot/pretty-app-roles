// Las 3 preguntas extra de una reseña (llegó puntual / cumplió lo acordado /
// volvería a contratarlo) solo tienen sentido cuando el ORGANIZADOR valora a
// un PROFESIONAL — es quien llega a un sitio y cumple un servicio acordado,
// no al revés. Compartido entre el formulario inicial de la ficha pública
// (PublicProfile.tsx) y el modal de valorar de HistorialTab.tsx, que antes
// tenían cada uno su propia copia del mismo toggle.
export function canSubmitReview(
  rating: number,
  comment: string,
  llegoPuntual: boolean | null,
  cumplioAcordado: boolean | null,
  volveriaContratar: boolean | null,
): boolean {
  if (rating < 1) return false;
  if (comment.trim().length < 5) return false;
  if (llegoPuntual === null || cumplioAcordado === null || volveriaContratar === null) return false;
  return true;
}

export function isReviewIncomplete(review: {
  llego_puntual: boolean | null;
  cumplio_acordado: boolean | null;
  volveria_contratar: boolean | null;
}): boolean {
  return review.llego_puntual === null || review.cumplio_acordado === null || review.volveria_contratar === null;
}

export function YesNoToggle({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="mb-3">
      <p className="text-xs font-bold mb-1.5" style={{ color: '#333' }}>{label}</p>
      <div className="flex gap-2">
        <button type="button" onClick={() => onChange(true)}
          className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
          style={{
            background: value === true ? 'linear-gradient(90deg,#D4AF37,#B8941E)' : 'rgba(0,0,0,0.04)',
            color: value === true ? '#000' : '#666',
            border: value === true ? 'none' : '1px solid rgba(0,0,0,0.08)',
          }}>
          Sí
        </button>
        <button type="button" onClick={() => onChange(false)}
          className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
          style={{
            background: value === false ? 'linear-gradient(90deg,#D4AF37,#B8941E)' : 'rgba(0,0,0,0.04)',
            color: value === false ? '#000' : '#666',
            border: value === false ? 'none' : '1px solid rgba(0,0,0,0.08)',
          }}>
          No
        </button>
      </div>
    </div>
  );
}
