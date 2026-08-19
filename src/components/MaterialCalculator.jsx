import { useMemo, useState } from 'react';

const MATERIALS = {
  concrete: { label: 'Piso / concreto', unit: 'm³' },
  floor: { label: 'Piso', unit: 'm²' },
  wall: { label: 'Muro', unit: 'm²' },
  paint: { label: 'Pintura', unit: 'm²' },
};

const MIXES = {
  general: { label: 'Referencia general', cement: 7, sand: 0.5, gravel: 0.8, water: 180 },
  structural: { label: 'Referencia estructural', cement: 8, sand: 0.5, gravel: 0.8, water: 180 },
  lean: { label: 'Referencia baja resistencia', cement: 6, sand: 0.55, gravel: 0.85, water: 170 },
};

export default function MaterialCalculator({ onClose, onAddToBudget }) {
  const [material, setMaterial] = useState('floor');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [waste, setWaste] = useState('10');
  const [mix, setMix] = useState('general');
  const baseResult = useMemo(() => {
    const l = Number(length) || 0, w = Number(width) || 0, h = Number(height) || 0;
    if (!l || !w) return 0;
    if (material === 'concrete') return l * w * (h || 0.1);
    if (material === 'wall') return l * h;
    return l * w;
  }, [material, length, width, height]);
  const reserve = 1 + Math.max(0, Number(waste) || 0) / 100;
  const finalResult = baseResult * reserve;
  const item = MATERIALS[material];
  const mixData = MIXES[mix];
  const concreteBreakdown = useMemo(() => {
    if (material !== 'concrete' || !finalResult) return null;
    return {
      cement: Math.ceil(finalResult * mixData.cement),
      sand: finalResult * mixData.sand,
      gravel: finalResult * mixData.gravel,
      water: finalResult * mixData.water,
    };
  }, [material, finalResult, mixData]);
  function add() {
    if (!finalResult) return;
    onAddToBudget?.({
      description: item.label,
      category: 'Materiales',
      quantity: Number(finalResult.toFixed(2)),
      unit: item.unit,
      calculation: concreteBreakdown ? { mix: mixData.label, ...concreteBreakdown } : null,
    });
  }
  return <div className="modal-backdrop"><section className="project-form" aria-label="Calculadora de materiales">
    <div className="form-heading"><div><span className="eyebrow">HERRAMIENTA</span><h2>🧮 Calcular materiales</h2></div><button type="button" onClick={onClose} aria-label="Cerrar">✕</button></div>
    <p style={{ marginBottom: 18 }}>Calcula cantidades estimadas y llévalas directamente a tu presupuesto.</p>
    <label>Material<select value={material} onChange={e => setMaterial(e.target.value)}>{Object.entries(MATERIALS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>
    <div className="form-row"><label>Largo (m)<input type="number" min="0" step="0.01" value={length} onChange={e => setLength(e.target.value)} placeholder="0" /></label><label>Ancho (m)<input type="number" min="0" step="0.01" value={width} onChange={e => setWidth(e.target.value)} placeholder="0" /></label></div>
    {(material === 'wall' || material === 'concrete') && <label>{material === 'wall' ? 'Alto (m)' : 'Espesor (m)'}<input type="number" min="0" step="0.01" value={height} onChange={e => setHeight(e.target.value)} placeholder={material === 'wall' ? '2.5' : '0.10'} /></label>}
    {material === 'concrete' && <label>Mezcla de referencia<select value={mix} onChange={e => setMix(e.target.value)}>{Object.entries(MIXES).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>}
    <label>Desperdicio / reserva (%)<input type="number" min="0" max="100" step="0.5" value={waste} onChange={e => setWaste(e.target.value)} /></label>
    <div className="budget-summary"><div><span>Cantidad base</span><strong>{baseResult.toLocaleString(undefined,{maximumFractionDigits:2})} {item.unit}</strong></div><div><span>Con {Number(waste) || 0}% de reserva</span><strong>{finalResult.toLocaleString(undefined,{maximumFractionDigits:2})} {item.unit}</strong></div></div>
    {concreteBreakdown && <div className="budget-summary"><strong>🧱 Materiales estimados</strong><div><span>🪨 Cemento</span><strong>{concreteBreakdown.cement} sacos aprox. de 50 kg</strong></div><div><span>🏖️ Arena</span><strong>{concreteBreakdown.sand.toFixed(2)} m³</strong></div><div><span>🪨 Grava</span><strong>{concreteBreakdown.gravel.toFixed(2)} m³</strong></div><div><span>💧 Agua</span><strong>{Math.round(concreteBreakdown.water)} litros</strong></div><small>⚠️ Dosificación de referencia. La resistencia, granulometría, humedad, tipo de cemento y diseño de mezcla deben verificarse según las especificaciones del proyecto y por el profesional responsable.</small></div>}
    <div className="budget-summary"><small>⚠️ Las cantidades son estimaciones de referencia y no sustituyen planos, memorias de cálculo, especificaciones técnicas ni la verificación del profesional responsable.</small></div>
    <div className="form-row"><button className="primary form-submit" type="button" disabled={!finalResult} onClick={add}>Añadir al presupuesto</button><button className="form-submit" type="button" onClick={onClose}>Listo</button></div>
  </section></div>;
}
