import { useMemo } from 'react';

const CURRENCY_BY_MARKET = { CO: 'COP', ES: 'EUR', EU: 'EUR', GB: 'GBP', MX: 'MXN', OTHER: 'USD' };

function formatMoney(value, market) {
  const currency = CURRENCY_BY_MARKET[market] || 'USD';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(value || 0));
}

export default function ProfitabilityPanel({ projects, budgets, expenses, onClose }) {
  const rows = useMemo(() => projects.map((project) => {
    const budget = budgets.filter((item) => item.projectId === project.id).reduce((sum, item) => sum + Number(item.total || 0), 0);
    const spent = expenses.filter((item) => item.projectId === project.id).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const result = budget - spent;
    const margin = budget > 0 ? (result / budget) * 100 : 0;
    return { project, budget, spent, result, margin };
  }), [projects, budgets, expenses]);

  return <div className="modal-backdrop"><div className="budget-form">
    <div className="form-heading"><div><span className="eyebrow">RENTABILIDAD</span><h2>Resultado por obra</h2></div><button type="button" onClick={onClose}>✕</button></div>
    {rows.length === 0 ? <div className="empty-state"><span>📈</span><strong>Aún no tienes obras</strong><p>Crea un proyecto para empezar a medir su rentabilidad.</p></div> : <div className="profit-list">{rows.map(({ project, budget, spent, result, margin }) => <article className="project-card" key={project.id}><div><span className="project-status">{result >= 0 ? 'EN RANGO' : 'SOBRECOSTO'}</span><h3>{project.name}</h3><p>Presupuesto {formatMoney(budget, project.market)} · Gastado {formatMoney(spent, project.market)}</p></div><div className="project-actions"><strong>{result >= 0 ? '+' : '-'}{formatMoney(Math.abs(result), project.market)}</strong><small>Margen {margin.toFixed(1)}%</small></div></article>)}</div>}
  </div></div>;
}