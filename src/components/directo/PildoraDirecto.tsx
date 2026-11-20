export default function PildoraDirecto({ texto = 'En directo', className = '' }: { texto?: string; className?: string }) {
  return (
    <span className={`directo-pill text-[0.75rem] px-2.5 py-1 ${className}`}>
      <span className="directo-dot" aria-hidden="true" />
      {texto}
    </span>
  );
}
