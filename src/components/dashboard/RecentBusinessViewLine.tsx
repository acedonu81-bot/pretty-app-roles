import { useRecentBusinessView } from '@/hooks/useRecentBusinessView';

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

const RecentBusinessViewLine = () => {
  const { view } = useRecentBusinessView();

  if (!view) return null;

  const text = view.zone
    ? `Una sala de ${view.zone} ha visto tu perfil · ${timeAgo(view.createdAt)}`
    : `Una sala ha visto tu perfil · ${timeAgo(view.createdAt)}`;
  // view.zone solo puede ser null aquí si la query de arriba cambia — el hook
  // ya filtra viewer_zone IS NOT NULL, así que este texto siempre es preciso.

  return (
    <p className="mx-4 md:mx-6 mt-2 text-xs font-semibold" style={{ color: '#333' }}>
      {text}
    </p>
  );
};

export default RecentBusinessViewLine;
