const BlogAuthor = () => (
  <div className="flex items-center gap-3 mt-10 mb-2 pt-6"
    style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm"
      style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
      D
    </div>
    <div>
      <p className="text-sm font-bold">Daniel, fundador de XPEAK</p>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Especialista en el sector de eventos y entretenimiento en España. Creador de{' '}
        <a href="https://xpeak.es" style={{ color: '#D4AF37' }}>xpeak.es</a>
        , la plataforma de referencia para profesionales del sector.
      </p>
    </div>
  </div>
);

export default BlogAuthor;
