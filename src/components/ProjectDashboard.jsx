import { useMemo, useState } from 'react';

const currencyMap = { CO: 'COP', ES: 'EUR', EU: 'EUR', GB: 'GBP', MX: 'MXN', OTHER: 'USD' };
const money = (value, market = 'CO') => new Intl.NumberFormat('es-CO', { style: 'currency', currency: currencyMap[market] || 'USD', maximumFractionDigits: 0 }).format(Number(value) || 0);
const number = (value) => Math.round(Number(value) || 0).toLocaleString('es-CO');

export default function ProjectDashboard({ project, budgets, expenses, materials, onClose, onOpenMaterials, onOpenExpenses, onOpenProfitability, onOpenBudget, onOpenAssistant }) {
  const [showAll, setShowAll] = useState(false);
  const projectBudgets = budgets.filter(b => b.projectId === project.id);
  const projectExpenses = expenses.filter(e => e.projectId === project.id);
  const projectMaterials = materials.filter(m => m.projectId === project.id);
  const market = project.market || 'CO';
  const budgeted = projectBudgets.reduce((s, b) => s + Math.max(0, Number(b.total || 0)), 0);
  const spent = projectExpenses.reduce((s, e) => s + Math.max(0, Number(e.amount || 0)), 0);
  // Use the larger of the project's contract/budget value and linked quote totals so the dashboard remains coherent when the user creates the quote after the project.
  const planned = Math.max(0, Number(project.budget || 0), budgeted);
  const remaining = planned - spent;
  const materialMissing = projectMaterials.reduce((s, m) => s + Math.max(0, Number(m.needed || 0) - Number(m.purchased || 0)), 0);
  const materialSpent = projectMaterials.reduce((s, m) => s + Math.max(0, Number(m.purchased || 0)) * Math.max(0, Number(m.price || 0)), 0);
  const pendingMaterialCost = projectMaterials.reduce((s, m) => s + Math.max(0, Number(m.needed || 0) - Number(m.purchased || 0)) * Math.max(0, Number(m.price || 0)), 0);
  const projectedCost = spent + pendingMaterialCost;
  const projectedBalance = planned - projectedCost;
  const consumed = planned > 0 ? (spent / planned) * 100 : 0;
  const physicalProgress = Math.min(100, Math.max(0, Number(project.progress || 0)));
  const progress = physicalProgress > 0 ? Math.round(physicalProgress) : Math.min(100, Math.max(0, Math.round(consumed)));
  const status = planned <= 0 ? '⚪ Falta presupuesto' : projectedCost > planned ? '🔴 Riesgo de sobrecosto' : consumed >= 80 ? '🟠 Vigilar costos' : '🟢 Bajo control';

  const alerts = useMemo(() => [
    ...(planned > 0 && spent > planned ? ['🔴 Los gastos reales ya superan el presupuesto.'] : []),
    ...(planned > 0 && consumed >= 80 && spent <= planned ? ['🟠 Has consumido el 80% o más del presupuesto.'] : []),
    ...(materialMissing > 0 ? [`🧱 Faltan ${number(materialMissing)} unidades de materiales según los registros.`] : []),
    ...(planned > 0 && projectedCost > planned ? [`⚠️ El costo proyectado (${money(projectedCost, market)}) supera el presupuesto (${money(planned, market)}).`] : []),
  ], [planned, spent, consumed, materialMissing, projectedCost, market]);

  const nextAction = planned <= 0
    ? 'Define el presupuesto de la obra para activar el control financiero.'
    : projectedCost > planned
      ? 'Revisa materiales pendientes y gastos adicionales antes de realizar nuevas compras.'
      : materialMissing > 0
        ? `Revisa las ${number(materialMissing)} unidades pendientes y confirma sus precios antes de comprar.`
        : consumed >= 80
          ? 'Revisa los próximos gastos y evita comprometer compras no esenciales.'
          : 'Continúa registrando compras y gastos para mantener la proyección actualizada.';

  const health = planned <= 0 ? 0 : Math.max(0, Math.min(100, Math.round((projectedBalance / planned) * 100)));
  const healthLabel = planned <= 0 ? 'Sin datos' : health >= 20 ? 'Margen saludable' : health >= 0 ? 'Margen ajustado' : 'Déficit proyectado';
  const technical = [
    ['Tipo', project.projectType || '—'],
    ['Área', project.area ? `${number(project.area)} m²` : '—'],
    ['Pisos', project.floors ? number(project.floors) : '—'],
    ['Habitaciones', project.bedrooms !== '' && project.bedrooms != null ? number(project.bedrooms) : '—'],
    ['Baños', project.bathrooms !== '' && project.bathrooms != null ? number(project.bathrooms) : '—'],
    ['Bloque', project.blockType || '—'],
    ['Altura de muro', project.wallHeight ? `${project.wallHeight} m` : '—'],
  ];

  return <div className="modal-backdrop"><section className="project-form project-dashboard" aria-label="Centro de control de obra">
    <div className="form-heading"><div><span className="eyebrow">CENTRO DE CONTROL</span><h2>🏗️ {project.name}</h2><p>{project.client || 'Sin cliente'} · {project.address || 'Sin dirección'}</p></div><button type="button" onClick={onClose} aria-label="Cerrar">✕</button></div>
    <div className="project-profile"><div className="technical-heading"><span>📐 PERFIL TÉCNICO DE LA OBRA</span><small>Contexto disponible para MasterObrix AI</small></div><div className="profile-grid">{technical.map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="physical-progress"><div><span>Avance físico</span><strong>{progress}%</strong></div><div className="health-bar"><i style={{width:`${progress}%`}} /></div><small>{physicalProgress > 0 ? 'Avance registrado manualmente.' : 'Sin avance físico registrado; se muestra una referencia basada en consumo de presupuesto.'}</small></div></div>
    <div className="stats-grid">
      <div className="stat-card"><span>Presupuesto</span><strong>{money(planned, market)}</strong></div><div className="stat-card"><span>Gastado</span><strong>{money(spent, market)}</strong></div><div className="stat-card"><span>Disponible</span><strong className={remaining < 0 ? 'negative' : ''}>{money(remaining, market)}</strong></div><div className="stat-card"><span>Consumido</span><strong>{Math.round(consumed)}%</strong></div>
    </div>
    <div className="budget-summary"><div><span>Estado financiero</span><strong>{status}</strong></div><div role="progressbar" aria-label="Porcentaje de presupuesto consumido" aria-valuenow={Math.round(consumed)} aria-valuemin="0" aria-valuemax="100" style={{height:10,background:'var(--surface-2)',borderRadius:99,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.min(100,Math.max(0,consumed))}%`,background:'var(--accent)',borderRadius:99,transition:'width .25s ease'}} /></div><small>{budgeted > 0 ? `${money(budgeted, market)} presupuestados en cotizaciones` : 'Todavía no hay presupuestos vinculados a esta obra.'}</small></div>
    <div className="stats-grid">
      <div className="stat-card"><span>Materiales comprados</span><strong>{money(materialSpent, market)}</strong></div><div className="stat-card"><span>Material pendiente</span><strong>{money(pendingMaterialCost, market)}</strong></div><div className="stat-card"><span>Costo proyectado</span><strong>{money(projectedCost, market)}</strong></div><div className="stat-card"><span>Saldo proyectado</span><strong className={projectedBalance < 0 ? 'negative' : ''}>{money(projectedBalance, market)}</strong></div>
    </div>
    <div className="budget-summary"><span>🤖 Recomendación MasterObrix</span><strong>{nextAction}</strong></div>
    <div className="budget-summary"><div><span>Salud financiera proyectada</span><strong>{healthLabel}</strong></div><small>{planned > 0 ? `Margen proyectado: ${health}% del presupuesto.` : 'Agrega un presupuesto para calcular el margen.'}</small></div>
    {alerts.length > 0 ? <div className="empty-state" role="alert"><strong>⚠️ Atención</strong>{alerts.map(a => <p key={a}>{a}</p>)}</div> : <div className="empty-state"><strong>✅ Sin alertas</strong><p>La información registrada no muestra riesgos financieros o de materiales en este momento.</p></div>}
    <div className="section-heading"><h3>Acciones de la obra</h3><span>{number(projectMaterials.length)} materiales</span></div>
    <div className="action-grid">
      <button className="action-card ai-action" type="button" onClick={() => onOpenAssistant(project.id)}><span className="action-icon">🤖</span><strong>Analizar con MasterObrix AI</strong><small>Pregunta por el estado, materiales y riesgos</small></button>
      <button className="action-card" type="button" onClick={() => onOpenMaterials(project.id)}><span className="action-icon">🧱</span><strong>Materiales</strong><small>Necesarios y comprados</small></button>
      <button className="action-card" type="button" onClick={() => onOpenExpenses(project.id)}><span className="action-icon">💸</span><strong>Registrar gasto</strong><small>Compra o gasto real</small></button>
      <button className="action-card" type="button" onClick={() => onOpenBudget(project.id)}><span className="action-icon">💰</span><strong>Presupuesto</strong><small>Crear o revisar</small></button>
      <button className="action-card" type="button" onClick={() => onOpenProfitability(project.id)}><span className="action-icon">📈</span><strong>Rentabilidad</strong><small>Ver margen de la obra</small></button>
    </div>
    <button className="form-submit" type="button" onClick={() => setShowAll(v => !v)}>{showAll ? 'Ocultar resumen' : 'Ver resumen de actividad'}</button>
    {showAll && <div className="budget-summary"><div><span>Presupuestos</span><strong>{number(projectBudgets.length)}</strong></div><div><span>Gastos registrados</span><strong>{number(projectExpenses.length)}</strong></div><div><span>Materiales registrados</span><strong>{number(projectMaterials.length)}</strong></div><div><span>Pendiente de compra</span><strong>{number(materialMissing)} unidades</strong></div></div>}
    <button className="form-submit" type="button" onClick={onClose}>Cerrar</button>
  </section></div>;
}