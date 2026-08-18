export default function QuotePreview({ budget, project, client, onClose }) {
  if (!budget) return null;
  return <div className="modal-backdrop"><div className="quote-sheet">
    <div className="quote-header"><div><span className="eyebrow">MASTEROBRIX AI</span><h2>Cotización</h2><p>Propuesta profesional de obra</p></div><strong>#{String(budget.id).slice(0, 8).toUpperCase()}</strong></div>
    <div className="quote-meta"><div><span>Proyecto</span><strong>{project?.name || 'Sin proyecto'}</strong><small>{project?.address || 'Sin dirección'}</small></div><div><span>Cliente</span><strong>{client?.name || project?.client || 'Sin cliente'}</strong><small>{client?.company || ''}</small></div></div>
    <div className="quote-table"><div className="quote-row quote-head"><span>Descripción</span><span>Cant.</span><span>Precio</span><span>Total</span></div>{budget.items.map((item,index)=><div className="quote-row" key={index}><span>{item.description}<small>{item.category} · {item.unit}</small></span><span>{item.quantity}</span><span>${Number(item.unitPrice||0).toLocaleString()}</span><strong>${(Number(item.quantity||0)*Number(item.unitPrice||0)).toLocaleString()}</strong></div>)}</div>
    <div className="quote-total"><div><span>Subtotal</span><strong>${Number(budget.subtotal).toLocaleString()}</strong></div><div><span>Utilidad ({budget.margin}%)</span><strong>${Number(budget.profit).toLocaleString()}</strong></div><div className="grand"><span>TOTAL</span><strong>${Number(budget.total).toLocaleString()}</strong></div></div>
    <div className="quote-actions"><button type="button" onClick={onClose}>Cerrar</button><button type="button" className="primary" onClick={() => window.print()}>🖨️ Imprimir / Guardar PDF</button></div>
  </div></div>;
}
