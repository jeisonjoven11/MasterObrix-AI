import { useMemo, useState } from 'react';

const emptyExpense = { description: '', category: 'Materiales', amount: '', date: '' };
const currencyByMarket = { CO: { code: 'COP', locale: 'es-CO' }, ES: { code: 'EUR', locale: 'es-ES' }, EU: { code: 'EUR', locale: 'es-ES' }, GB: { code: 'GBP', locale: 'en-GB' }, MX: { code: 'MXN', locale: 'es-MX' }, OTHER: { code: 'USD', locale: 'en-US' } };
const makeId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function ExpenseTracker({ projects, expenses, initialProjectId = '', onSave, onDelete, onClose }) {
  const [projectId, setProjectId] = useState(initialProjectId || projects[0]?.id || '');
  const [form, setForm] = useState(emptyExpense);
  const project = projects.find((item) => item.id === projectId);
  const currency = currencyByMarket[project?.market || 'CO'] || currencyByMarket.OTHER;
  const money = (value) => new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code, maximumFractionDigits: 2 }).format(Number(value) || 0);
  const projectExpenses = useMemo(() => expenses.filter((expense) => expense.projectId === projectId), [expenses, projectId]);
  const total = projectExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  function submit(event) {
    event.preventDefault();
    if (!projectId || !form.description.trim() || Number(form.amount) <= 0) return;
    onSave({ ...form, id: makeId(), projectId, amount: Number(form.amount), createdAt: new Date().toISOString() });
    setForm(emptyExpense);
  }

  return <div className="modal-backdrop"><div className="budget-form">
    <div className="form-heading"><div><span className="eyebrow">CONTROL DE GASTOS</span><h2>Gastos reales</h2><small>Moneda: {currency.code}</small></div><button type="button" onClick={onClose}>✕</button></div>
    <label>Proyecto<select value={projectId} onChange={(e) => setProjectId(e.target.value)}><option value="">Selecciona una obra</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
    <form onSubmit={submit} className="expense-entry"><input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ej. Compra de cemento" /><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Materiales</option><option>Mano de obra</option><option>Transporte</option><option>Otros</option></select><input required type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder={`Importe (${currency.code})`} /><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /><button className="primary" type="submit">Añadir</button></form>
    <div className="expense-list">{projectExpenses.length === 0 ? <div className="empty-state"><span>💸</span><strong>Sin gastos registrados</strong><p>Añade los primeros gastos reales de la obra.</p></div> : projectExpenses.map((expense) => <article className="project-card" key={expense.id}><div><span className="project-status">{expense.category}</span><h3>{expense.description}</h3><p>{expense.date || 'Sin fecha'}</p></div><div className="project-actions"><strong>{money(expense.amount)}</strong><button type="button" onClick={() => onDelete(expense.id)}>Eliminar</button></div></article>)}</div>
    <div className="budget-summary"><div className="total"><span>Total gastado</span><strong>{money(total)}</strong></div></div>
  </div></div>;
}