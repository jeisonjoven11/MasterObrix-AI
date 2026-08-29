import { useMemo, useState } from 'react';

const emptyItem = { description: '', category: 'Materiales', quantity: '', unit: 'unidad', unitPrice: '' };
const currencyByMarket = { CO: { code: 'COP', symbol: '$', locale: 'es-CO' }, ES: { code: 'EUR', symbol: '€', locale: 'es-ES' }, EU: { code: 'EUR', symbol: '€', locale: 'es-ES' }, GB: { code: 'GBP', symbol: '£', locale: 'en-GB' }, MX: { code: 'MXN', symbol: '$', locale: 'es-MX' }, OTHER: { code: 'USD', symbol: '$', locale: 'en-US' } };

export default function BudgetEditor({ projects, initialItem, initialProjectId, onSave, onClose }) {
  const [projectId, setProjectId] = useState(initialProjectId || projects[0]?.id || '');
  const [items, setItems] = useState(() => initialItem ? [{ ...emptyItem, ...initialItem }] : [{ ...emptyItem }]);
  const [margin, setMargin] = useState('10');
  const project = projects.find((item) => item.id === projectId);
  const currency = currencyByMarket[project?.market || 'CO'] || currencyByMarket.OTHER;
  const money = (value) => new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code, maximumFractionDigits: 2 }).format(Number(value) || 0);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0), [items]);
  const categoryTotals = useMemo(() => items.reduce((totals, item) => {
    const value = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
    totals[item.category] = (totals[item.category] || 0) + value;
    return totals;
  }, { Materiales: 0, 'Mano de obra': 0, Otros: 0 }), [items]);
  const profit = subtotal * ((Number(margin) || 0) / 100);
  const total = subtotal + profit;
  const updateItem = (index, field, value) => setItems((current) => current.map((item, i) => i === index ? { ...item, [field]: value } : item));
  const addItem = () => setItems((current) => [...current, { ...emptyItem }]);
  const removeItem = (index) => setItems((current) => current.length === 1 ? current : current.filter((_, i) => i !== index));
  function submit(event) {
    event.preventDefault();
    if (!projectId || !items.some((item) => item.description.trim())) return;
    onSave({ id: crypto.randomUUID(), projectId, items, margin: Number(margin) || 0, subtotal, profit, total, categoryTotals, currency: currency.code, createdAt: new Date().toISOString() });
  }
  return <div className="modal-backdrop"><form className="budget-form" onSubmit={submit}>
    <div className="form-heading"><div><span className="eyebrow">NUEVO PRESUPUESTO</span><h2>Construir presupuesto</h2><small>Moneda: {currency.code}</small></div><button type="button" onClick={onClose}>✕</button></div>
    <label>Proyecto<select required value={projectId} onChange={(e) => setProjectId(e.target.value)}><option value="">Selecciona una obra</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
    <div className="budget-items">{items.map((item, index) => <div className="budget-item" key={index}><input required value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} placeholder="Ej. Cemento" /><select value={item.category} onChange={(e) => updateItem(index, 'category', e.target.value)}><option>Materiales</option><option>Mano de obra</option><option>Otros</option></select><input type="number" min="0" step="any" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} placeholder="Cantidad" /><select value={item.unit} onChange={(e) => updateItem(index, 'unit', e.target.value)}><option>unidad</option><option>m</option><option>m²</option><option>m³</option><option>kg</option><option>l</option><option>hora</option><option>día</option></select><input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(index, 'unitPrice', e.target.value)} placeholder={`Precio (${currency.code})`} /><strong>{money((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}</strong><button type="button" onClick={() => removeItem(index)} aria-label="Eliminar partida">×</button></div>)}</div>
    <button className="add-item" type="button" onClick={addItem}>+ Añadir partida</button>
    <div className="budget-summary"><label>Margen de utilidad (%)<input type="number" min="0" step="0.5" value={margin} onChange={(e) => setMargin(e.target.value)} /></label><div><span>Materiales</span><strong>{money(categoryTotals.Materiales)}</strong></div><div><span>Mano de obra</span><strong>{money(categoryTotals['Mano de obra'])}</strong></div><div><span>Otros</span><strong>{money(categoryTotals.Otros)}</strong></div><div><span>Costo base</span><strong>{money(subtotal)}</strong></div><div><span>Utilidad</span><strong>{money(profit)}</strong></div><div className="total"><span>Total al cliente</span><strong>{money(total)}</strong></div></div>
    <button className="primary form-submit" type="submit">Guardar presupuesto</button>
  </form></div>;
}
