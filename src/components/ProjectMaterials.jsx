import { useMemo, useState } from 'react';

const UNITS = ['sacos', 'm³', 'unidades', 'litros', 'kg', 'metros'];

export default function ProjectMaterials({ projects, materials, onSave, onClose }) {
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('sacos');
  const [needed, setNeeded] = useState('');
  const [purchased, setPurchased] = useState('');
  const [price, setPrice] = useState('');

  const rows = materials.filter(m => m.projectId === projectId);
  const totalSpent = useMemo(() => rows.reduce((sum, m) => sum + Number(m.purchased || 0) * Number(m.price || 0), 0), [rows]);

  function addMaterial(e) {
    e.preventDefault();
    if (!projectId || !name.trim() || Number(needed) <= 0) return;
    onSave({ id: crypto.randomUUID(), projectId, name: name.trim(), unit, needed: Number(needed), purchased: Number(purchased) || 0, price: Number(price) || 0 });
    setName(''); setNeeded(''); setPurchased(''); setPrice('');
  }

  function updatePurchased(material, value) {
    onSave({ ...material, purchased: Math.max(0, Number(value) || 0), replaceId: material.id });
  }

  return <div className="modal-backdrop"><section className="project-form material-tracker" aria-label="Materiales de la obra">
    <div className="form-heading"><div><span className="eyebrow">CONTROL DE OBRA</span><h2>🧱 Materiales de mi obra</h2></div><button type="button" onClick={onClose}>✕</button></div>
    <label>Obra<select value={projectId} onChange={e => setProjectId(e.target.value)}>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>

    <form onSubmit={addMaterial}>
      <div className="form-row"><label>Material<input value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Cemento" required /></label><label>Unidad<select value={unit} onChange={e => setUnit(e.target.value)}>{UNITS.map(u => <option key={u}>{u}</option>)}</select></label></div>
      <div className="form-row"><label>Necesario<input type="number" min="0" step="0.01" value={needed} onChange={e => setNeeded(e.target.value)} placeholder="0" required /></label><label>Comprado<input type="number" min="0" step="0.01" value={purchased} onChange={e => setPurchased(e.target.value)} placeholder="0" /></label></div>
      <label>Precio por unidad<input type="number" min="0" step="100" value={price} onChange={e => setPrice(e.target.value)} placeholder="$0" /></label>
      <button className="primary form-submit" type="submit">➕ Agregar material</button>
    </form>

    {rows.length === 0 ? <div className="empty-state"><span>📦</span><strong>Aún no tienes materiales registrados</strong><p>Agrega lo que necesitas o trae materiales desde la calculadora.</p></div> : <div className="material-list">{rows.map(m => { const missing = Math.max(0, Number(m.needed) - Number(m.purchased)); return <article className="material-row" key={m.id}><div><strong>{m.name}</strong><small>{m.purchased} / {m.needed} {m.unit}</small></div><div><label>Comprado<input aria-label={`Comprado ${m.name}`} type="number" min="0" step="0.01" value={m.purchased} onChange={e => updatePurchased(m, e.target.value)} /></label><strong className={missing ? 'material-missing' : 'material-ok'}>{missing ? `Faltan ${missing} ${m.unit}` : '✓ Completo'}</strong></div></article>; })}</div>}

    <div className="budget-summary"><div><span>💸 Compra registrada</span><strong>${totalSpent.toLocaleString()}</strong></div><small>Registra cantidades compradas para saber rápidamente qué falta en la obra.</small></div>
    <button className="form-submit" type="button" onClick={onClose}>Listo</button>
  </section></div>;
}
