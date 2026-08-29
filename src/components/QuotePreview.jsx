export default function QuotePreview({ budget, project, client, onClose }) {
  if (!budget) return null;
  const currencyByMarket = { CO: 'COP', ES: 'EUR', EU: 'EUR', GB: 'GBP', MX: 'MXN', OTHER: 'USD' };
  const currency = budget.currency || currencyByMarket[project?.market || 'CO'] || 'USD';
  const locale = currency === 'GBP' ? 'en-GB' : currency === 'USD' ? 'en-US' : currency === 'EUR' ? 'es-ES' : currency === 'MXN' ? 'es-MX' : 'es-CO';
  const money = (value) => new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(value) || 0);
  return <div className="modal-backdrop"><div className="quote-sheet">
    <div className="quote-header"><div><span className="eyebrow">MASTEROBRIX AI</span><h2>Cotización</h2><p>Propuesta profesional de obra · {currency}</p></div><strong>#{String(budget.id).slice(0, 8).toUpperCase()}</strong></div>
    <div className="quote-meta"><div><span>Proyecto</span><strong>{project?.name || 'Sin proyecto'}</strong><small>{project?.address || 'Sin dirección'}</small></div><div><span>Cliente</span><strong>{client?.name || project?.client || 'Sin cliente'}</strong><small>{client?.company || ''}</small></div></div>
    <div className="quote-table"><div className="quote-row quote-head"><span>Descripción</span><span>Cant.</span><span>Precio</span><span>Total</span></div>{budget.items.map((item,index)=><div className="quote-row" key={index}><span>{item.description}<small>{item.category} · {item.unit}</small></span><span>{item.quantity}</span><span>{money(item.unitPrice)}</span><strong>{money((Number(item.quantity||0)*Number(item.unitPrice||0)))}</strong></div>)}</div>
    <div className="quote-total"><div><span>Subtotal</span><strong>{money(budget.subtotal)}</strong></div><div><span>Utilidad ({budget.margin}%)</span><strong>{money(budget.profit)}</strong></div><div className="grand"><span>TOTAL</span><strong>{money(budget.total)}</strong></div></div>
    <div className="quote-actions"><button type="button" onClick={onClose}>Cerrar</button><button type="button" className="primary" onClick={() => window.print()}>🖨️ Imprimir / Guardar PDF</button></div>
  </div></div>;
}
