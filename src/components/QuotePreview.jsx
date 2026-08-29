export default function QuotePreview({ budget, project, client, onClose }) {
  if (!budget) return null;
  const currencyByMarket = { CO: 'COP', ES: 'EUR', EU: 'EUR', GB: 'GBP', MX: 'MXN', OTHER: 'USD' };
  const currency = budget.currency || currencyByMarket[project?.market || 'CO'] || 'USD';
  const locale = currency === 'GBP' ? 'en-GB' : currency === 'USD' ? 'en-US' : currency === 'EUR' ? 'es-ES' : currency === 'MXN' ? 'es-MX' : 'es-CO';
  const money = (value) => new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(value) || 0);
  const directCost = Number(budget.subtotal || 0);
  const indirectRate = Number(budget.indirectRate || 0);
  const indirectCost = Number(budget.indirectCost ?? directCost * indirectRate / 100);
  const costBase = Number(budget.costBase ?? directCost + indirectCost);
  const profit = Number(budget.profit ?? costBase * (Number(budget.margin || 0) / 100));
  const total = Number(budget.total ?? costBase + profit);
  return <div className="modal-backdrop"><div className="quote-sheet" id="masterobrix-quote">
    <div className="quote-header"><div><span className="eyebrow">MASTEROBRIX AI</span><h2>Cotización</h2><p>Propuesta profesional de obra · {currency}</p></div><strong>#{String(budget.id).slice(0, 8).toUpperCase()}</strong></div>
    <div className="quote-meta"><div><span>Proyecto</span><strong>{project?.name || 'Sin proyecto'}</strong><small>{project?.address || 'Sin dirección'}</small></div><div><span>Cliente</span><strong>{client?.name || project?.client || 'Sin cliente'}</strong><small>{client?.company || ''}</small></div><div><span>Fecha</span><strong>{new Intl.DateTimeFormat(locale).format(new Date(budget.createdAt || Date.now()))}</strong><small>Validez: 15 días</small></div></div>
    <div className="quote-table"><div className="quote-row quote-head"><span>Descripción</span><span>Cant.</span><span>Precio</span><span>Total</span></div>{budget.items.map((item,index)=><div className="quote-row" key={index}><span>{item.description}<small>{item.category} · {item.unit}</small></span><span>{item.quantity}</span><span>{money(item.unitPrice)}</span><strong>{money((Number(item.quantity||0)*Number(item.unitPrice||0)))}</strong></div>)}</div>
    <div className="quote-total"><div><span>Costo directo</span><strong>{money(directCost)}</strong></div><div><span>Costos indirectos ({indirectRate}%)</span><strong>{money(indirectCost)}</strong></div><div><span>Costo base</span><strong>{money(costBase)}</strong></div><div><span>Utilidad ({budget.margin || 0}%)</span><strong>{money(profit)}</strong></div><div className="grand"><span>TOTAL AL CLIENTE</span><strong>{money(total)}</strong></div></div>
    <div className="quote-note"><strong>Condiciones</strong><p>Esta cotización es una estimación comercial basada en los datos introducidos en MasterObrix. Verifique cantidades, precios locales, impuestos y requisitos técnicos antes de contratar.</p></div>
    <div className="quote-actions"><button type="button" onClick={onClose}>Cerrar</button><button type="button" className="primary" onClick={() => window.print()}>🖨️ Imprimir / Guardar PDF</button></div>
  </div></div>;
}