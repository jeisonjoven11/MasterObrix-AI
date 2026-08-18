export default function ProjectHealth({ project, budgets = [], expenses = [] }) {
  const budget = Math.max(Number(project.budget || 0), budgets.filter(b => b.projectId === project.id).reduce((s, b) => s + Number(b.total || 0), 0));
  const spent = expenses.filter(e => e.projectId === project.id).reduce((s, e) => s + Number(e.amount || 0), 0);
  const percent = budget > 0 ? (spent / budget) * 100 : 0;
  const health = percent >= 100 ? { label: 'SOBRECOSTO', cls: 'danger' } : percent >= 80 ? { label: 'VIGILAR', cls: 'warning' } : { label: 'SALUDABLE', cls: 'good' };
  return <div className="project-health"><div className="health-line"><span className={`health-dot ${health.cls}`}></span><strong>{health.label}</strong><span>{percent.toFixed(0)}% consumido</span></div>{budget > 0 && <div className="health-bar"><i style={{ width: `${Math.min(percent, 100)}%` }} /></div>}<small>{budget > 0 ? `$${spent.toLocaleString()} gastados de $${budget.toLocaleString()}` : 'Define un presupuesto para controlar el consumo.'}</small></div>;
}
