import { useMemo, useState } from 'react';

const MATERIALS = {
  concrete: { label: 'Concreto', unit: 'm³', factor: 1 },
  floor: { label: 'Piso', unit: 'm²', factor: 1 },
  wall: { label: 'Muro', unit: 'm²', factor: 1 },
  paint: { label: 'Pintura', unit: 'm²', factor: 1 },
};

export default function MaterialCalculator({ onClose }) {
  const [material, setMaterial] = useState('floor');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  const result = useMemo(() => {
    const l = Number(length) || 0;
    const w = Number(width) || 0;
    const h = Number(height) || 0;
    if (!l || !w) return 0;
    if (material === 'concrete') return l * w * (h || 0.1);
    if (material === 'wall') return l * h;
    return l * w;
  }, [material, length, width, height]);

  const item = MATERIALS[material];

  return (
    <div className="modal-backdrop">
      <section className="project-form" aria-label="Calculadora de materiales">
        <div className="form-heading">
          <div><span className="eyebrow">HERRAMIENTA</span><h2>🧮 Calcular materiales</h2></div>
          <button type="button" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <p style={{marginBottom:18}}>Calcula una cantidad estimada a partir de las medidas de la obra.</p>
        <label>Material
          <select value={material} onChange={e => setMaterial(e.target.value)}>
            {Object.entries(MATERIALS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
          </select>
        </label>
        <div className="form-row">
          <label>Largo (m)<input type="number" min="0" step="0.01" value={length} onChange={e => setLength(e.target.value)} placeholder="0" /></label>
          <label>Ancho (m)<input type="number" min="0" step="0.01" value={width} onChange={e => setWidth(e.target.value)} placeholder="0" /></label>
        </div>
        {(material === 'wall' || material === 'concrete') && <label>Alto / espesor (m)<input type="number" min="0" step="0.01" value={height} onChange={e => setHeight(e.target.value)} placeholder={material === 'wall' ? '2.5' : '0.1'} /></label>}
        <div className="budget-summary">
          <span>Resultado estimado</span>
          <strong style={{display:'block',fontSize:28,marginTop:6}}>{result.toLocaleString(undefined,{maximumFractionDigits:2})} {item.unit}</strong>
          <small>⚠️ Es una estimación geométrica. No sustituye especificaciones técnicas ni desperdicio, espesores o dosificaciones definidos por un profesional.</small>
        </div>
        <button className="primary form-submit" type="button" onClick={onClose}>Listo</button>
      </section>
    </div>
  );
}
