import { useMemo, useState } from 'react';

const MATERIALS = {
  concrete: { label: 'Piso / concreto', unit: 'm³' },
  floor: { label: 'Piso / revestimiento', unit: 'm²' },
  wall: { label: 'Muro', unit: 'm²' },
  paint: { label: 'Pintura', unit: 'm²' },
  block: { label: 'Bloque / ladrillo', unit: 'unidades' },
};

const MIXES = {
  general: { label: 'Referencia general', cement: 7, sand: 0.5, gravel: 0.8, water: 180 },
  structural: { label: 'Referencia estructural', cement: 8, sand: 0.5, gravel: 0.8, water: 180 },
  lean: { label: 'Referencia baja resistencia', cement: 6, sand: 0.55, gravel: 0.85, water: 170 },
};

const BLOCK_SIZES = {
  standard: { label: 'Bloque estándar (40 × 20 cm)', area: 0.08 },
  brick: { label: 'Ladrillo estándar (24 × 12 cm)', area: 0.0288 },
  custom: { label: 'Medida personalizada', area: 0 },
};

export default function MaterialCalculator({ onClose, onAddToBudget }) {
  const [material, setMaterial] = useState('floor');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [waste, setWaste] = useState('10');
  const [mix, setMix] = useState('general');
  const [blockSize, setBlockSize] = useState('standard');
  const [blockLength, setBlockLength] = useState('');
  const [blockHeight, setBlockHeight] = useState('');
  const [paintCoverage, setPaintCoverage] = useState('10');
  const [paintCoats, setPaintCoats] = useState('2');
  const [unitPrice, setUnitPrice] = useState('');
  const [priceMode, setPriceMode] = useState('unit');

  const baseResult = useMemo(() => {
    const l = Number(length) || 0;
    const w = Number(width) || 0;
    const h = Number(height) || 0;
    if (material === 'wall') return l && h ? l * h : 0;
    if (material === 'concrete') return l && w ? l * w * (h || 0.1) : 0;
    if (material === 'paint') return l && w ? l * w : 0;
    return l && w ? l * w : 0;
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

  const blockBreakdown = useMemo(() => {
    if (material !== 'block' || !baseResult) return null;
    const customArea = ((Number(blockLength) || 0) / 100) * ((Number(blockHeight) || 0) / 100);
    const area = blockSize === 'custom' ? customArea : BLOCK_SIZES[blockSize].area;
    if (!area) return null;
    return { pieces: Math.ceil((baseResult / area) * reserve), area };
  }, [material, baseResult, blockSize, blockLength, blockHeight, reserve]);

  const paintBreakdown = useMemo(() => {
    if (material !== 'paint' || !baseResult) return null;
    const coverage = Number(paintCoverage) || 0;
    const coats = Number(paintCoats) || 1;
    if (!coverage) return null;
    return { liters: (baseResult * coats * reserve) / coverage, coats, coverage };
  }, [material, baseResult, paintCoverage, paintCoats, reserve]);

  const displayQuantity = material === 'block'
    ? blockBreakdown?.pieces || 0
    : material === 'paint'
      ? paintBreakdown?.liters || 0
      : finalResult;

  const displayUnit = material === 'block' ? 'unidades' : material === 'paint' ? 'L' : item.unit;

  const estimatedTotal = useMemo(() => {
    const price = Number(unitPrice) || 0;
    if (!price || !displayQuantity) return 0;
    return priceMode === 'total' ? price : displayQuantity * price;
  }, [unitPrice, displayQuantity, priceMode]);

  function add() {
    if (!displayQuantity) return;
    const total = Number(estimatedTotal.toFixed(2));
    const effectiveUnitPrice = priceMode === 'unit'
      ? Number(unitPrice) || 0
      : displayQuantity ? Number((total / displayQuantity).toFixed(4)) : 0;

    onAddToBudget?.({
      description: item.label,
      category: 'Materiales',
      quantity: Number(displayQuantity.toFixed(2)),
      unit: displayUnit,
      unitPrice: effectiveUnitPrice,
      total,
      calculation: {
        base: Number(baseResult.toFixed(2)),
        waste: Number(waste) || 0,
        concrete: concreteBreakdown,
        blocks: blockBreakdown,
        paint: paintBreakdown,
      },
    });
  }

  return (
    <div className="modal-backdrop">
      <section className="project-form" aria-label="Calculadora de materiales">
        <div className="form-heading"><div><span className="eyebrow">HERRAMIENTA</span><h2>🧮 Calcular materiales</h2></div><button type="button" onClick={onClose} aria-label="Cerrar">✕</button></div>
        <p style={{ marginBottom: 18 }}>Calcula cantidades, aplica una reserva de desperdicio, estima el costo y llévalo directamente al presupuesto.</p>
        <label>Material<select value={material} onChange={e => setMaterial(e.target.value)}>{Object.entries(MATERIALS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>
        <div className="form-row"><label>Largo (m)<input type="number" min="0" step="0.01" value={length} onChange={e => setLength(e.target.value)} placeholder="0" /></label><label>Ancho (m)<input type="number" min="0" step="0.01" value={width} onChange={e => setWidth(e.target.value)} placeholder="0" /></label></div>
        {(material === 'wall' || material === 'concrete') && <label>{material === 'wall' ? 'Alto (m)' : 'Espesor (m)'}<input type="number" min="0" step="0.01" value={height} onChange={e => setHeight(e.target.value)} placeholder={material === 'wall' ? '2.5' : '0.10'} /></label>}
        {material === 'concrete' && <label>Mezcla de referencia<select value={mix} onChange={e => setMix(e.target.value)}>{Object.entries(MIXES).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>}
        {material === 'block' && <><label>Tipo de pieza<select value={blockSize} onChange={e => setBlockSize(e.target.value)}>{Object.entries(BLOCK_SIZES).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>{blockSize === 'custom' && <div className="form-row"><label>Frente de pieza (cm)<input type="number" min="0" step="0.1" value={blockLength} onChange={e => setBlockLength(e.target.value)} placeholder="40" /></label><label>Alto de pieza (cm)<input type="number" min="0" step="0.1" value={blockHeight} onChange={e => setBlockHeight(e.target.value)} placeholder="20" /></label></div>}</>}
        {material === 'paint' && <div className="form-row"><label>Rendimiento (m²/L)<input type="number" min="0" step="0.1" value={paintCoverage} onChange={e => setPaintCoverage(e.target.value)} placeholder="10" /></label><label>Capas<input type="number" min="1" max="10" step="1" value={paintCoats} onChange={e => setPaintCoats(e.target.value)} /></label></div>}
        <label>Desperdicio / reserva (%)<input type="number" min="0" max="100" step="0.5" value={waste} onChange={e => setWaste(e.target.value)} /></label>
        <div className="budget-summary"><div><span>Cantidad base</span><strong>{baseResult.toLocaleString(undefined, { maximumFractionDigits: 2 })} {item.unit}</strong></div><div><span>Resultado con reserva</span><strong>{displayQuantity.toLocaleString(undefined, { maximumFractionDigits: 2 })} {displayUnit}</strong></div></div>
        {concreteBreakdown && <div className="budget-summary"><strong>🧱 Materiales estimados</strong><div><span>🪨 Cemento</span><strong>{concreteBreakdown.cement} sacos aprox. de 50 kg</strong></div><div><span>🏖️ Arena</span><strong>{concreteBreakdown.sand.toFixed(2)} m³</strong></div><div><span>🪨 Grava</span><strong>{concreteBreakdown.gravel.toFixed(2)} m³</strong></div><div><span>💧 Agua</span><strong>{Math.round(concreteBreakdown.water)} litros</strong></div><small>⚠️ Dosificación de referencia. La resistencia, granulometría, humedad, tipo de cemento y diseño de mezcla deben verificarse según las especificaciones del proyecto y por el profesional responsable.</small></div>}
        {blockBreakdown && <div className="budget-summary"><strong>🧱 Bloques / ladrillos estimados</strong><div><span>Piezas necesarias</span><strong>{blockBreakdown.pieces.toLocaleString('es-CO')} unidades</strong></div><small>Estimación por área visible. Juntas, cortes, vanos y modulación deben verificarse antes de comprar.</small></div>}
        {paintBreakdown && <div className="budget-summary"><strong>🎨 Pintura estimada</strong><div><span>Litros necesarios</span><strong>{paintBreakdown.liters.toFixed(1)} L</strong></div><small>El rendimiento real depende de la superficie, producto, absorción y método de aplicación.</small></div>}
        <div className="budget-summary"><strong>💰 Estimar costo</strong><label>Precio<select value={priceMode} onChange={e => setPriceMode(e.target.value)}><option value="unit">Por {displayUnit}</option><option value="total">Costo total</option></select><input type="number" min="0" step="1" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} placeholder="Ej. 45000" /></label>{estimatedTotal > 0 && <div><span>Costo estimado</span><strong>${estimatedTotal.toLocaleString('es-CO')}</strong></div>}<small>El precio es editable y sirve como estimación; después podremos conectarlo con precios reales de proveedores.</small></div>
        <div className="budget-summary"><small>⚠️ Las cantidades son estimaciones de referencia y no sustituyen planos, memorias de cálculo, especificaciones técnicas ni la verificación del profesional responsable.</small></div>
        <div className="form-row"><button className="primary form-submit" type="button" disabled={!displayQuantity} onClick={add}>Añadir al presupuesto</button><button className="form-submit" type="button" onClick={onClose}>Listo</button></div>
      </section>
    </div>
  );
}