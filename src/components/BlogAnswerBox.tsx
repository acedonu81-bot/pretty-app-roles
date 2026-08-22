interface BlogAnswerBoxProps {
  question: string;
  answer: string;
}

export default function BlogAnswerBox({ question, answer }: BlogAnswerBoxProps) {
  return (
    <div className="my-6 rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.05)' }}>
      <div className="px-4 py-2 text-[0.6rem] font-black uppercase tracking-widest"
        style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        Respuesta rápida
      </div>
      <div className="px-4 py-4">
        <p className="text-xs font-bold mb-2 xpeak-speakable-question" style={{ color: '#444' }}>{question}</p>
        <p className="text-sm leading-relaxed font-medium xpeak-speakable-answer" style={{ color: '#111' }}>{answer}</p>
      </div>
    </div>
  );
}
