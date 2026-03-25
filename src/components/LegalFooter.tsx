const LegalFooter = () => (
  <footer
    className="w-full px-6 py-5 text-center text-[0.65rem] leading-relaxed text-muted-foreground"
    style={{ borderTop: '1px solid var(--nightlife-border)', background: 'rgba(0,0,0,0.3)' }}
  >
    <p className="mb-2 font-bold uppercase tracking-widest text-[0.6rem]" style={{ color: 'var(--nightlife-yellow)' }}>
      Aviso Legal Importante
    </p>
    <p className="max-w-4xl mx-auto">
      Esta plataforma es un servicio de intermediación técnica (directorio). El titular de la app no es responsable de la veracidad de los perfiles, ni de su situación fiscal o laboral (autónomos, seguros, etc.). Cada usuario declara actuar bajo su propia responsabilidad legal. No gestionamos pagos ni contratos.
    </p>
    <p className="mt-2 max-w-4xl mx-auto opacity-70">
      NIGHTLIFE Madrid es un tablón de anuncios. No intervenimos en la contratación ni verificamos la situación legal de los usuarios. La relación es exclusiva entre las partes.
    </p>
  </footer>
);

export default LegalFooter;
