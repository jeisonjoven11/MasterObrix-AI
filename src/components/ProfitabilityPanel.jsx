import { useMemo } from 'react';

const CURRENCY_BY_MARKET = { CO: 'COP', ES: 'EUR', EU: 'EUR', GB: 'GBP', MX: 'MXN', OTHER: 'USD' };

function formatMoney(value, market) {
  const currency = CURRENCY_BY_MARKET[market] || 'USD';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function belongsToProjectCurrency(item, currency) {
  return !item?.currency || item.currency === currency;
}

export default function ProfitabilityPanel({ projects, budgets, expenses, initialProjectId = '', onClose }) {
  const rows = useMemo(() => projects
    .filter((project) => !initialProjectId || project.id === initialProjectId)
    .map((project) => {
      const currency = CURRENCY_BY_MARKET[project.market] || 'USD';
      const budget = budgets.filter((item) => item.projectId === project.id && belongsToProjectCurrency(item, currency)).reduce((sum, item) => {
        const value = Number(item.total);
        return Number.isFinite(value) && value > 0 ? sum + value : sum;
      }, 0);
      const spent = expenses.filter((item) => item.projectId === project.id && belongsToProjectCurrency(item, currency)).reduce((sum, item) => {
        const value = Number(item.amount);
        return Number.isFinite(value) && value > 0 ? sum + value : sum;
      }, 0);
      const result = budget - spent;
      const margin = budget > 0 ? (result / budget) * 100 : 0;
      const execution = budget > 0 ? (spent / budget) * 100 : 0;
      return { project, budget, spent, result, margin, execution };
    }), [projects, budgets, expenses, initialProjectId]);

  return <div className="modal-backdrop"><div className="budget-form">
    <div className="form-heading"><div><span className="eyebrow">RESULTADO FINANCIERO</span><h2>Resultado bruto estimado por obra</h2><small>Ingresos presupuestados frente a costos reales registrados</small></div><button type="button" onClick={onClose}>✕</button></div>
    {rows.length === 0 ? <div className="empty-state"><span>📈</span><strong>{initialProjectId ? 'Obra no encontrada' : 'Aún no tienes obras'}</strong><p>{initialProjectId ? 'La obra seleccionada ya no está disponible.' : 'Crea un proyecto para empezar a medir su resultado financiero.'}</p></div> : <div className="profit-list">{rows.map(({ project, budget, spent, result, margin, execution }) => <article className="project-card" key={project.id}><div><span className="project-status">{result >= 0 ? 'RESULTADO POSITIVO' : 'SOBRECOSTO'}</span><h3>{project.name}</h3><p>Ingresos presupuestados {formatMoney(budget, project.market)} · Costos reales {formatMoney(spent, project.market)}</p><small>Ejecución sobre ingresos presupuestados: {execution.toFixed(1)}%</small></div><div className="project-actions"><strong>{result >= 0 ? '+' : '-'}{formatMoney(Math.abs(result), project.market)}</strong><small>Margen bruto estimado {margin.toFixed(1)}%</small></div></article>)}</div>}
  </div></div>;
}
