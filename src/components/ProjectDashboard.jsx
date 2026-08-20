import { useMemo, useState } from 'react';

export default function ProjectDashboard({ project, budgets, expenses, materials, onClose, onOpenMaterials, onOpenExpenses, onOpenProfitability, onOpenBudget }) {
  const [showAll, setShowAll] = useState(false);
  const projectBudgets = budgets.filter(b => b.projectId === project.id);
  const projectExpenses = expenses.filter(e => e.projectId === project.id);
  const projectMaterials = materials.filter(m => m.projectId === project.id);
  const budgeted = projectBudgets.reduce((s, b) => s + Number(b.total || 0), 0);
  const spent = projectExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const planned = Number(project.budget || 0);
  const remaining = Math.max(0, planned - spent);
  const materialMissing = projectMaterials.reduce((s, m) => s + Math.max(0, Number(m.needed || 0) - Number(m.purchased || 0)), 0);
  const materialSpent = projectMaterials.reduce((s, m) => s + Number(m.spent || 0), 0);
  const pendingMaterialCost = projectMaterials.reduce((s, m) => s + Math.max(0, Number(m.needed || 0) - Number(m.purchased || 0)) * Number(m.unitPrice || 0), 0);
  const progress = planned > 0 ? Math.min(100, Math.round((spent / planned) * 100)) : 0;
  const projectedCost = spent + pendingMaterialCost;
  const projectedBalance = planned - projectedCost;
  const status = planned > 0 && projectedCost > planned ? '🔴 Riesgo de sobrecosto' : planned > 0 && projectedCost / planned >= 0.8 ? '🟠 Vigilar costos' : '🟢 Bajo control';
  const alerts = useMemo(() => [
    ...(planned > 0 && spent > planned ? ['🔴 Los gastos superan el presupuesto de la obra'] : []),
    ...(planned > 0 && spent / planned >= 0.8 && spent <= planned ? ['🟠 Ya consumiste más del 80% del presupuesto'] : []),
    ...(materialMissing > 0 ? [`🧱 Tienes ${materialMissing} unidades de materiales pendientes`] : []),
    ...(planned > 0 && projectedCost > planned ? ['⚠️ Con los materiales pendientes, el costo proyectado supera el presupuesto'] : []),
  ], [planned, spent, materialMissing, projectedCost]);

  const nextAction = planned <= 0
    ? '💰 Define el presupuesto de la obra para activar el control financiero.'
    : projectedCost > planned
      ? '🔴 Revisa materiales pendientes y gastos adicionales antes de seguir comprando.'
      : materialMissing > 0
        ? `🧱 Aún faltan ${materialMissing} unidades de materiales. Revisa sus precios antes de comprar.`
        : spent / planned >= 0.8
          ? '🟠 Ya consumiste gran parte del presupuesto. Revisa los próximos gastos.'
          : '🟢 Continúa registrando compras y gastos para mantener la proyección actualizada.';

  return <div className="modal-backdrop"><section className="project-form project-dashboard" aria-label="Centro de control de obra">
    <div className="form-heading"><div><span className="eyebrow">CENTRO DE CONTROL</span><h2>🏗️ {project.name}</h2><p>{project.client || 'Sin cliente'} · {project.address || 'Sin dirección'}</p></div><button type="button" onClick={onClose}>✕</button></div>
    <div className="stats-grid"><div className="stat-card"><span>Presupuesto</span><strong>${planned.toLocaleString()}</strong></div><div className="stat-card"><span>Gastado</span><strong>${spent.toLocaleString()}</strong></div><div className="stat-card"><span>Disponible</span><strong>${remaining.toLocaleString()}</strong></div><div className="stat-card"><span>Consumido</span><strong>{progress}%</strong></div></div>
    <div className="budget-summary"><div><span>Estado de la obra</span><strong>{status}</strong></div><div style={{height:10,background:'var(--surface-2)',borderRadius:99,overflow:'hidden'}}><div style={{height:'100%',width:`${progress}%`,background:'var(--accent)',borderRadius:99}} /></div><small>{budgeted > 0 ? `$${budgeted.toLocaleString()} presupuestados en cotizaciones` : 'Todavía no hay presupuestos vinculados a esta obra.'}</small></div>
    <div className="stats-grid"><div className="stat-card"><span>Materiales comprados</span><strong>${materialSpent.toLocaleString()}</strong></div><div className="stat-card"><span>Costo proyectado</span><strong>${projectedCost.toLocaleString()}</strong></div><div className="stat-card"><span>Saldo proyectado</span><strong>${projectedBalance.toLocaleString()}</strong></div></div>
    <div className="budget-summary"><span>🤖 Recomendación MasterObrix</span><strong>{nextAction}</strong></div>
    {alerts.length > 0 && <div className="empty-state"><strong>⚠️ Atención</strong>{alerts.map(a => <p key={a}>{a}</p>)}</div>}
    {alerts.length === 0 && <div className="empty-state"><strong>✅ Obra bajo control</strong><p>No hay alertas financieras o de materiales en este momento.</p></div>}
    <div className="section-heading"><h3>Acciones de la obra</h3><span>{projectMaterials.length} materiales</span></div>
    <div className="action-grid"><button className="action-card" type="button" onClick={()=>onOpenMaterials(project.id)}><span className="action-icon">🧱</span><strong>Materiales</strong><small>Ver necesarios y comprados</small></button><button className="action-card" type="button" onClick={()=>onOpenExpenses(project.id)}><span className="action-icon">💸</span><strong>Registrar gasto</strong><small>Guardar compra o gasto real</small></button><button className="action-card" type="button" onClick={()=>onOpenBudget(project.id)}><span className="action-icon">💰</span><strong>Presupuesto</strong><small>Crear o revisar cotización</small></button><button className="action-card" type="button" onClick={()=>onOpenProfitability(project.id)}><span className="action-icon">📈</span><strong>Rentabilidad</strong><small>Ver cuánto ganas</small></button></div>
    <button className="form-submit" type="button" onClick={() => setShowAll(v => !v)}>{showAll ? 'Ocultar resumen' : 'Ver resumen de actividad'}</button>
    {showAll && <div className="budget-summary"><div><span>Presupuestos</span><strong>{projectBudgets.length}</strong></div><div><span>Gastos registrados</span><strong>{projectExpenses.length}</strong></div><div><span>Materiales registrados</span><strong>{projectMaterials.length}</strong></div><div><span>Pendiente de compra</span><strong>{materialMissing} unidades</strong></div></div>}
    <button className="form-submit" type="button" onClick={onClose}>Cerrar</button>
  </section></div>;
}
