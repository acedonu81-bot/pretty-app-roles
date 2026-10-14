/**
 * Pestañas de "Mi perfil": datos y contenido público en un solo sitio.
 *
 * Antes eran dos entradas del menú (Mi Perfil y Mi Ficha) más una tercera en
 * Ajustes, y quien venía a "arreglar su perfil" tenía que adivinar cuál. Los
 * ids de vista 'profile' y 'ficha' se conservan (enlaces de emails, consejos y
 * tour), solo cambia que se llega a los dos desde aquí.
 */
interface Props {
  active: 'profile' | 'ficha';
  onNavigate: (view: string) => void;
}

const TABS: { id: 'profile' | 'ficha'; label: string }[] = [
  { id: 'profile', label: 'Mis datos' },
  { id: 'ficha', label: 'Fotos, vídeo y música' },
];

const PerfilTabs = ({ active, onNavigate }: Props) => (
  <div role="tablist" aria-label="Mi perfil" className="flex gap-1 p-1 mb-5 rounded-xl w-full sm:w-auto sm:inline-flex"
    style={{ background: 'rgba(10,9,8,0.05)' }}>
    {TABS.map(t => {
      const on = t.id === active;
      return (
        <button key={t.id} role="tab" aria-selected={on} type="button"
          onClick={() => { if (!on) onNavigate(t.id); }}
          className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-bold transition-all"
          style={on
            ? { background: '#fff', color: '#111', boxShadow: '0 1px 4px rgba(10,9,8,0.12)' }
            : { background: 'transparent', color: 'rgba(10,9,8,0.55)' }}>
          {t.label}
        </button>
      );
    })}
  </div>
);

export default PerfilTabs;
