import { useState } from 'react';

const suggestions = [
  'Calcula un piso de concreto de 6 x 5 m y 10 cm de espesor',
  '¿Qué materiales debo considerar para una remodelación de baño?',
  '¿Cómo puedo controlar un sobrecosto en una obra?',
  '¿Qué debo revisar antes de enviar una cotización?'
];

function money(value) {
  return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(value);
}

function extractNumber(text, pattern) {
  const match = text.match(pattern);
  return match ? Number(match[1].replace(',', '.')) : null;
}

function floorCalculation(question) {
  const q = question.toLowerCase().replace(/,/g, '.');
  const dimensions = q.match(/(\d+(?:\.\d+)?)\s*(?:m|metros?)?\s*[x×*]\s*(\d+(?:\.\d+)?)\s*(?:m|metros?)?/);
  const thicknessCm = extractNumber(q, /(\d+(?:\.\d+)?)\s*(?:cm|centimetros?)/);
  if (!dimensions || thicknessCm === null || !/(piso|placa|concreto|hormig[oó]n)/.test(q)) return null;

  const length = Number(dimensions[1]);
  const width = Number(dimensions[2]);
  const wasteMatch = q.match(/(\d+(?:\.\d+)?)\s*%\s*(?:de\s*)?(?:desperdicio|merma)/);
  const waste = wasteMatch ? Number(wasteMatch[1]) : 5;
  const area = length * width;
  const baseVolume = area * (thicknessCm / 100);
  const volume = baseVolume * (1 + waste / 100);

  // Reference mix only. These coefficients are deliberately presented as estimates,
  // not structural specifications. Final mix must be verified by the responsible professional.
  const cementBags = volume * 7.5;
  const sandM3 = volume * 0.52;
  const gravelM3 = volume * 0.78;
  const waterLiters = volume * 175;

  return `📐 **Resultado estimado**\n\nÁrea: **${money(area)} m²**\nConcreto base: **${money(baseVolume)} m³**\nCon desperdicio (${waste}%): **${money(volume)} m³**\n\n🧱 **Materiales de referencia**\n• Cemento: **${money(cementBags)} sacos**\n• Arena: **${money(sandM3)} m³**\n• Grava: **${money(gravelM3)} m³**\n• Agua: **${money(waterLiters)} L**\n\n💡 Puedes llevar este cálculo al presupuesto cuando esté conectado a la obra.\n\n⚠️ **Referencia técnica:** estos factores son orientativos. La dosificación, resistencia, humedad de agregados y normativa deben ser verificadas por el profesional responsable antes de ejecutar la obra.`;
}

function answerFor(question) {
  const calculated = floorCalculation(question);
  if (calculated) return calculated;

  const q = question.toLowerCase();
  if (q.includes('baño') || q.includes('remodel')) return 'Para una remodelación conviene revisar demolición, retiro de residuos, instalaciones hidráulicas y eléctricas, impermeabilización, revestimientos, aparatos, mano de obra, transporte y contingencia. Convierte cada partida en un ítem del presupuesto antes de cotizar.';
  if (q.includes('sobrecosto') || q.includes('gasto')) return 'Primero identifica la partida que provoca el desvío, compara gasto real contra presupuesto y registra la causa. Si el consumo supera el 80% del presupuesto, revisa cantidades, precios y trabajos adicionales antes de comprometer más dinero.';
  if (q.includes('cotización') || q.includes('cliente')) return 'Antes de enviar una cotización revisa alcance, cantidades, unidades, precios, mano de obra, utilidad, vigencia, condiciones de pago y exclusiones. El cliente debe poder entender exactamente qué está comprando.';
  if (q.includes('material') || q.includes('cemento') || q.includes('arena')) return 'Puedo ayudarte a preparar un cálculo de materiales. Para un piso o placa de concreto dime, por ejemplo: “piso 6 x 5 m, espesor 10 cm, desperdicio 5%”.';
  return 'Puedo ayudarte con materiales, presupuestos, gastos y control de obra. Prueba una pregunta como: “Calcula un piso de concreto de 6 x 5 m y 10 cm de espesor”.';
}

export default function AssistantPanel({ onClose }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);

  function ask(text = question) {
    const clean = text.trim();
    if (!clean) return;
    setMessages((items) => [...items, { role: 'user', text: clean }, { role: 'assistant', text: answerFor(clean) }]);
    setQuestion('');
  }

  return <div className="modal-backdrop"><section className="assistant-panel">
    <div className="form-heading"><div><span className="eyebrow">MASTEROBRIX AI</span><h2>Asistente de construcción</h2><p>Calcula, orienta y ayuda a controlar tu obra.</p></div><button type="button" onClick={onClose}>✕</button></div>
    <div className="assistant-disclaimer">🧠 Primera capa de IA local: interpreta consultas comunes y cálculos de referencia sin enviar datos de tu obra a un servicio externo. Verifica cantidades, precios y normativa con el profesional responsable.</div>
    <div className="assistant-suggestions">{suggestions.map((item) => <button type="button" key={item} onClick={() => ask(item)}>{item}</button>)}</div>
    <div className="assistant-messages">{messages.length === 0 ? <div className="assistant-empty">🏗️<strong>¿En qué obra estás trabajando?</strong><span>Puedo ayudarte a calcular materiales, revisar presupuestos y controlar gastos.</span></div> : messages.map((message, index) => <div className={`assistant-message ${message.role}`} key={`${message.role}-${index}`} style={{ whiteSpace: 'pre-line' }}>{message.text}</div>)}</div>
    <form className="assistant-input" onSubmit={(e) => { e.preventDefault(); ask(); }}><input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ej: piso 6 x 5 m, espesor 10 cm..."/><button className="primary" type="submit">Preguntar</button></form>
  </section></div>;
}
