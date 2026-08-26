export default function ProjectHealth({ project, budgets = [], expenses = [], materials = [] }) {
  const budget = Math.max(
    Number(project.budget || 0),
    budgets.filter(b => b.projectId === project.id).reduce((s, b) => s + Number(b.total || 0), 0)
  );
  const spent = expenses
    .filter(e => e.projectId === project.id)
    .reduce((s, e) => s + Number(e.amount || 0), 0);
  const projectMaterials = materials.filter(m => m.projectId === project.id);
  const pendingMaterials = projectMaterials.reduce((s, m) => {
    const needed = Number(m.needed) || 0;
    const purchased = Number(m.purchased) || 0;
    const price = Number(m.price) || 0;
    return s + Math.max(0, needed - purchased) * price;
  }, 0);
  const projected = spent + pendingMaterials;
  const percent = budget > 0 ? (spent / budget) * 100 : 0;
  const projectedPercent = budget > 0 ? (projected / budget) * 100 : 0;
  const health = projectedPercent >= 100
    ? { label: 'SOBRECOSTO', cls: 'danger' }
    : projectedPercent >= 80
      ? { label: 'VIGILAR', cls: 'warning' }
      : { label: 'SALUDABLE', cls: 'good' };
  const remaining = Math.max(0, budget - projected);

  return <div className="project-health">
    <div className="health-line">
      <span className={`health-dot ${health.cls}`}></span>
      <strong>{health.label}</strong>
      <span>{percent.toFixed(0)}% gastado · {projectedPercent.toFixed(0)}% proyectado</span>
    </div>
    {budget > 0 && <div className="health-bar"><i style={{ width: `${Math.min(projectedPercent, 100)}%` }} /></div>}
    <small>
      {budget > 0
        ? `$${spent.toLocaleString()} gastados · $${pendingMaterials.toLocaleString()} pendientes en materiales · $${remaining.toLocaleString()} de margen proyectado`
        : 'Define un presupuesto para controlar el consumo.'}
    </small>
  </div>;
}
