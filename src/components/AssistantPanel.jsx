import { useMemo, useState } from 'react';

const suggestions = [
  '¿Qué partidas debo considerar para una remodelación de baño?',
  '¿Cómo puedo controlar un sobrecosto en una obra?',
  '¿Qué debo revisar antes de enviar una cotización?'
];

function answerFor(question) {
  const q = question.toLowerCase();
  if (q.includes('baño') || q.includes('remodel')) return 'Para una remodelación conviene revisar demolición, retiro de residuos, instalaciones hidráulicas y eléctricas, impermeabilización, revestimientos, aparatos, mano de obra, transporte y una contingencia. Convierte cada partida en un ítem del presupuesto antes de cotizar.';
  if (q.includes('sobrecosto') || q.includes('gasto')) return 'Primero identifica qué partida está provocando el desvío, compara gasto real contra presupuesto y registra la causa. Si el consumo supera el 80%, revisa cantidades, precios y trabajos adicionales antes de comprometer más dinero.';
  if (q.includes('cotización') || q.includes('cliente')) return 'Antes de enviar una cotización revisa alcance, cantidades, unidades, precios, mano de obra, materiales, utilidad, vigencia, condiciones de pago y exclusiones. El cliente debe poder entender exactamente qué está comprando.';
  return 'Puedo ayudarte a revisar presupuestos, partidas, gastos y riesgos de una obra. Prueba una de las preguntas sugeridas para comenzar.';
}

export default function AssistantPanel({ onClose }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const reply = useMemo(() => question.trim() ? answerFor(question) : '', [question]);
  function ask(text = question) {
    const clean = text.trim();
    if (!clean) return;
    setMessages((items) => [...items, { role: 'user', text: clean }, { role: 'assistant', text: answerFor(clean) }]);
    setQuestion('');
  }
  return <div className="modal-backdrop"><section className="assistant-panel">
    <div className="form-heading"><div><span className="eyebrow">MASTEROBRIX AI</span><h2>Asistente de construcción</h2><p>Consejos prácticos para presupuestos y control de obra.</p></div><button type="button" onClick={onClose}>✕</button></div>
    <div className="assistant-disclaimer">💡 Esta primera versión es una base de asesoría. Verifica cantidades, precios y normativa con un profesional antes de tomar decisiones de obra.</div>
    <div className="assistant-suggestions">{suggestions.map((item) => <button type="button" key={item} onClick={() => ask(item)}>{item}</button>)}</div>
    <div className="assistant-messages">{messages.length === 0 ? <div className="assistant-empty">🏗️<strong>¿En qué obra estás trabajando?</strong><span>Pregúntame por partidas, presupuestos, gastos o cotizaciones.</span></div> : messages.map((message, index) => <div className={`assistant-message ${message.role}`} key={`${message.role}-${index}`}>{message.text}</div>)}</div>
    <form className="assistant-input" onSubmit={(e) => { e.preventDefault(); ask(); }}><input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Escribe tu consulta..."/><button className="primary" type="submit">Enviar</button></form>
  </section></div>;
}
