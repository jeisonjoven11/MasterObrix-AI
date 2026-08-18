import { useMemo, useState } from 'react';

const emptyItem = { description: '', category: 'Materiales', quantity: '', unit: 'unidad', unitPrice: '' };

export default function BudgetEditor({ projects, initialItem, onSave, onClose }) {
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [items, setItems] = useState(() => initialItem ? [{ ...emptyItem, ...initialItem }] : [{ ...emptyItem }]);
  const [margin, setMargin] = useState('10');
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0), [items]);
  const profit = subtotal * ((Number(margin) || 0) / 100);
  const total = subtotal + profit;
  const updateItem = (index, field, value) => setItems((current) => current.map((item, i) => i === index ? { ...item, [field]: value } : item));
  const addItem = () => setItems((current) => [...current, { ...emptyItem }]);
  const removeItem = (index) => setItems((current) => current.length === 1 ? current : current.filter((_, i) => i !== index));
  function submit(event) { event.preventDefault(); if (!projectId || !items.some((item) => item.description.trim())) return; onSave({ id: crypto.randomUUID(), projectId, items, margin: Number(margin) || 0, subtotal, profit, total, createdAt: new Date().toISOString() }); }
  return <div className="modal-backdrop"><form className="budget-form" onSubmit={submit}>
    <div className="form-heading"><div><span className="eyebrow">NUEVO PRESUPUESTO</span><h2>Construir presupuesto</h2></div><button type="button" onClick={onClose}>✕</button></div>
    <label>Proyecto<select required value={projectId} onChange={(e) => setProjectId(e.target.value)}><option value="">Selecciona una obra</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
    <div className="budget-items">{items.map((item, index) => <div className="budget-item" key={index}><input required value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} placeholder="Ej. Cemento" /><select value={item.category} onChange={(e) => updateItem(index, 'category', e.target.value)}><option>Materiales</option><option>Mano de obra</option><option>Otros</option></select><input type="number" min="0" step="any" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} placeholder="Cantidad" /><select value={item.unit} onChange={(e) => updateItem(index, 'unit', e.target.value)}><option>unidad</option><option>m²</option><option>m³</option><option>kg</option><option>hora</option><option>día</option></select><input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(index, 'unitPrice', e.target.value)} placeholder="Precio" /><strong>${((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)).toLocaleString()}</strong><button type="button" onClick={() => removeItem(index)}>×</button></div>)}</div>
    <button className="add-item" type="button" onClick={addItem}>+ Añadir partida</button>
    <div className="budget-summary"><label>Margen de utilidad (%)<input type="number" min="0" step="0.5" value={margin} onChange={(e) => setMargin(e.target.value)} /></label><div><span>Subtotal</span><strong>${subtotal.toLocaleString()}</strong></div><div><span>Utilidad</span><strong>${profit.toLocaleString()}</strong></div><div className="total"><span>Total</span><strong>${total.toLocaleString()}</strong></div></div>
    <button className="primary form-submit" type="submit">Guardar presupuesto</button>
  </form></div>;
}
