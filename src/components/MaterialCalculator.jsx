import { useMemo, useState } from 'react';

const TYPES = {
  floor: { label: 'Piso / placa', unit: 'm²', needsThickness: true },
  concrete: { label: 'Concreto', unit: 'm³', needsThickness: true },
  wall: { label: 'Muro', unit: 'm²', needsThickness: false },
  paint: { label: 'Pintura', unit: 'm²', needsThickness: false },
};

const MIXES = {
  standard: { label: 'Concreto estándar (referencial)', bags: 8, sand: 0.55, gravel: 0.85, water: 180 },
  structural: { label: 'Concreto estructural (referencial)', bags: 9, sand: 0.50, gravel: 0.80, water: 175 },
  lean: { label: 'Concreto pobre (referencial)', bags: 6, sand: 0.60, gravel: 0.90, water: 170 },
};

export default function MaterialCalculator({ onClose, onAddToBudget }) {
  const [type, setType] = useState('floor');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [thickness, setThickness] = useState('0.10');
  const [height, setHeight] = useState('2.50');
  const [waste, setWaste] = useState('5');
  const [mix, setMix] = useState('standard');

  const result = useMemo(() => {
    const l = Number(length) || 0;
    const w = Number(width) || 0;
    const t = Number(thickness) || 0;
    const h = Number(height) || 0;
    if (!l || !w) return { area: 0, volume: 0 };
    const area = l * w;
    const volume = type === 'concrete' || type === 'floor' ? area * t : type === 'wall' ? area * h : 0;
    const factor = 1 + Math.max(0, Number(waste) || 0) / 100;
    return { area, volume: volume * factor };
  }, [type, length, width, thickness, height, waste]);

  const concrete = useMemo(() => {
    if (!result.volume || !['floor', 'concrete'].includes(type)) return null;
    const recipe = MIXES[mix];
    return {
      bags: result.volume * recipe.bags,
      sand: result.volume * recipe.sand,
      gravel: result.volume * recipe.gravel,
      water: result.volume * recipe.water,
    };
  }, [result.volume, type, mix]);

  const item = TYPES[type];

  function add() {
    if (!result.volume && !result.area) return;
    const quantity = type === 'paint' || type === 'wall' ? result.area : result.volume;
    onAddToBudget?.({
      description: `${item.label} (${type === 'floor' ? 'concreto' : 'estimado'})`,
      category: 'Materiales',
      quantity: Number(quantity.toFixed(2)),
      unit: item.unit,
    });
  }

  const quantity = type === 'paint' || type === 'wall' ? result.area : result.volume;

  return <div className="modal-backdrop"><section className="project-form material-calculator" aria-label="Calculadora de materiales">
    <div className="form-heading"><div><span className="eyebrow">HERRAMIENTA DE OBRA</span><h2>🧮 ¿Qué vas a construir?</h2></div><button type="button" onClick={onClose} aria-label="Cerrar">✕</button></div>
    <p style={{ marginBottom: 18 }}>Ingresa las medidas y MasterObrix estima cantidades para ayudarte a preparar la obra.</p>

    <label>Tipo de trabajo<select value={type} onChange={e => setType(e.target.value)}>{Object.entries(TYPES).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>

    <div className="form-row"><label>Largo (m)<input type="number" min="0" step="0.01" value={length} onChange={e => setLength(e.target.value)} placeholder="Ej. 5" /></label><label>Ancho (m)<input type="number" min="0" step="0.01" value={width} onChange={e => setWidth(e.target.value)} placeholder="Ej. 4" /></label></div>

    {(type === 'floor' || type === 'concrete') && <label>Espesor (m)<input type="number" min="0.01" step="0.01" value={thickness} onChange={e => setThickness(e.target.value)} placeholder="Ej. 0.10" /></label>}
    {type === 'wall' && <label>Altura del muro (m)<input type="number" min="0.01" step="0.01" value={height} onChange={e => setHeight(e.target.value)} placeholder="Ej. 2.50" /></label>}
    <label>Desperdicio / reserva (%)<input type="number" min="0" max="100" step="0.5" value={waste} onChange={e => setWaste(e.target.value)} /></label>

    {(type === 'floor' || type === 'concrete') && <label>Dosificación orientativa<select value={mix} onChange={e => setMix(e.target.value)}>{Object.entries(MIXES).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>}

    <div className="budget-summary material-result">
      <div><span>Área calculada</span><strong>{result.area.toLocaleString(undefined,{maximumFractionDigits:2})} m²</strong></div>
      <div><span>Cantidad con reserva</span><strong>{quantity.toLocaleString(undefined,{maximumFractionDigits:2})} {item.unit}</strong></div>
      {concrete && <>
        <div><span>🧱 Cemento</span><strong>{concrete.bags.toLocaleString(undefined,{maximumFractionDigits:1})} bultos</strong></div>
        <div><span>🏖️ Arena</span><strong>{concrete.sand.toLocaleString(undefined,{maximumFractionDigits:2})} m³</strong></div>
        <div><span>🪨 Grava</span><strong>{concrete.gravel.toLocaleString(undefined,{maximumFractionDigits:2})} m³</strong></div>
        <div><span>💧 Agua</span><strong>{concrete.water.toLocaleString(undefined,{maximumFractionDigits:0})} L</strong></div>
      </>}
      <small>⚠️ Estimación referencial. Las cantidades reales dependen de la resistencia especificada, dosificación aprobada, materiales disponibles, humedad, compactación y condiciones de la obra. Verifica con el responsable técnico antes de comprar o ejecutar.</small>
    </div>

    <div className="form-row"><button className="primary form-submit" type="button" disabled={!quantity} onClick={add}>➕ Añadir al presupuesto</button><button className="form-submit" type="button" onClick={onClose}>Listo</button></div>
  </section></div>;
}
