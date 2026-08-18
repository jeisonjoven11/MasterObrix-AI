import { useMemo, useState } from 'react';

const MATERIALS = {
  concrete: { label: 'Concreto', unit: 'm³' },
  floor: { label: 'Piso', unit: 'm²' },
  wall: { label: 'Muro', unit: 'm²' },
  paint: { label: 'Pintura', unit: 'm²' },
};

export default function MaterialCalculator({ onClose, onAddToBudget }) {
  const [material, setMaterial] = useState('floor');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [waste, setWaste] = useState('10');
  const baseResult = useMemo(() => {
    const l = Number(length) || 0, w = Number(width) || 0, h = Number(height) || 0;
    if (!l || !w) return 0;
    if (material === 'concrete') return l * w * (h || 0.1);
    if (material === 'wall') return l * h;
    return l * w;
  }, [material, length, width, height]);
  const finalResult = baseResult * (1 + Math.max(0, Number(waste) || 0) / 100);
  const item = MATERIALS[material];
  function add() {
    if (!finalResult) return;
    onAddToBudget?.({ description: item.label, category: 'Materiales', quantity: Number(finalResult.toFixed(2)), unit: item.unit });
  }
  return <div className="modal-backdrop"><section className="project-form" aria-label="Calculadora de materiales">
    <div className="form-heading"><div><span className="eyebrow">HERRAMIENTA</span><h2>🧮 Calcular materiales</h2></div><button type="button" onClick={onClose} aria-label="Cerrar">✕</button></div>
    <p style={{ marginBottom: 18 }}>Calcula una cantidad estimada y llévala directamente a tu presupuesto.</p>
    <label>Material<select value={material} onChange={e => setMaterial(e.target.value)}>{Object.entries(MATERIALS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>
    <div className="form-row"><label>Largo (m)<input type="number" min="0" step="0.01" value={length} onChange={e => setLength(e.target.value)} placeholder="0" /></label><label>Ancho (m)<input type="number" min="0" step="0.01" value={width} onChange={e => setWidth(e.target.value)} placeholder="0" /></label></div>
    {(material === 'wall' || material === 'concrete') && <label>Alto / espesor (m)<input type="number" min="0" step="0.01" value={height} onChange={e => setHeight(e.target.value)} placeholder={material === 'wall' ? '2.5' : '0.1'} /></label>}
    <label>Desperdicio / reserva (%)<input type="number" min="0" max="100" step="0.5" value={waste} onChange={e => setWaste(e.target.value)} /></label>
    <div className="budget-summary"><div><span>Cantidad base</span><strong>{baseResult.toLocaleString(undefined,{maximumFractionDigits:2})} {item.unit}</strong></div><div><span>Con {Number(waste) || 0}% de reserva</span><strong>{finalResult.toLocaleString(undefined,{maximumFractionDigits:2})} {item.unit}</strong></div><small>⚠️ Es una estimación geométrica. La reserva no sustituye especificaciones técnicas, desperdicios reales, espesores o dosificaciones definidos por un profesional.</small></div>
    <div className="form-row"><button className="primary form-submit" type="button" disabled={!finalResult} onClick={add}>Añadir al presupuesto</button><button className="form-submit" type="button" onClick={onClose}>Listo</button></div>
  </section></div>;
}
