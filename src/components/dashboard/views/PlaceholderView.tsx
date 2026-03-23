interface PlaceholderViewProps {
  title: string;
  subtitle: string;
}

const PlaceholderView = ({ title, subtitle }: PlaceholderViewProps) => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold mb-1">
          {title.split(' ').slice(0, -1).join(' ')}{' '}
          <span className="text-gradient">{title.split(' ').slice(-1)}</span>
        </h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div className="glass-panel p-12 rounded-2xl text-center">
        <p className="text-6xl mb-4">🚧</p>
        <p className="text-lg font-semibold mb-2">Vista en Construcción</p>
        <p className="text-sm text-muted-foreground">Esta sección estará disponible próximamente.</p>
      </div>
    </div>
  );
};

export default PlaceholderView;
