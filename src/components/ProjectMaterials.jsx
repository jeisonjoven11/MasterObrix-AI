import { useMemo, useState } from 'react';

const CATALOG = [
  ['Cemento gris 50 kg','sacos','Cemento',35000],
  ['Arena de concreto','m³','Agregados',95000],
  ['Grava','m³','Agregados',110000],
  ['Bloque de concreto','unidades','Mampostería',4200],
  ['Varilla corrugada','unidades','Acero',28000],
  ['Pintura','litros','Pintura',18000],
  ['Mortero seco','sacos','Mampostería',22000],
  ['Alambre recocido','kg','Acero',8500],
  ['Ladrillo','unidades','Mampostería',1800],
  ['Tubo PVC 1/2"','metros','Plomería',6500],
];

export default function ProjectMaterials({ projects, materials, onSave, onAddExpense, onClose }) {
  const [projectId,setProjectId]=useState(projects[0]?.id||'');
  const [name,setName]=useState(''); const [unit,setUnit]=useState('sacos');
  const [needed,setNeeded]=useState(''); const [purchased,setPurchased]=useState(''); const [price,setPrice]=useState(''); const [search,setSearch]=useState('');
  const rows=materials.filter(m=>m.projectId===projectId);
  const totals=useMemo(()=>rows.reduce((a,m)=>{const n=Number(m.needed)||0,p=Number(m.purchased)||0,price=Number(m.price)||0;return {...a,needed:a.needed+n,purchased:a.purchased+p,spent:a.spent+p*price,pendingCost:a.pendingCost+Math.max(0,n-p)*price}}, {needed:0,purchased:0,spent:0,pendingCost:0}),[rows]);
  const catalog=CATALOG.filter(p=>`${p[0]} ${p[2]}`.toLowerCase().includes(search.toLowerCase()));
  function add(e){e.preventDefault();if(!projectId||!name.trim()||Number(needed)<=0)return;onSave({id:crypto.randomUUID(),projectId,name:name.trim(),unit,needed:Number(needed),purchased:Number(purchased)||0,price:Number(price)||0});setName('');setNeeded('');setPurchased('');setPrice('');}
  function registerPurchase(m){const quantity=Number(m.purchased)||0,unitPrice=Number(m.price)||0;if(!quantity||!unitPrice||!onAddExpense)return;onAddExpense({id:crypto.randomUUID(),projectId:m.projectId,description:`Compra de ${m.name}`,category:'Materiales',amount:quantity*unitPrice,date:new Date().toISOString().slice(0,10)});}
  function useCatalog(p){setName(p[0]);setUnit(p[1]);setPrice(String(p[3]));setSearch('');}
  return <div className="modal-backdrop"><section className="project-form" aria-label="Materiales de obra">
    <div className="form-heading"><div><span className="eyebrow">CONTROL DE OBRA</span><h2>🧱 Materiales de mi obra</h2></div><button type="button" onClick={onClose}>✕</button></div>
    <label>Obra<select value={projectId} onChange={e=>setProjectId(e.target.value)}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
    <div className="budget-summary"><div><span>Necesario</span><strong>{totals.needed}</strong></div><div><span>Comprado</span><strong>{totals.purchased}</strong></div><div><span>Gastado en materiales</span><strong>${totals.spent.toLocaleString()}</strong></div><div className="total"><span>Falta por comprar (estimado)</span><strong>${totals.pendingCost.toLocaleString()}</strong></div></div>
    <label>🛒 Buscar en catálogo<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cemento, arena, bloque..." /></label>
    {search&&<div className="empty-state">{catalog.map(p=><button className="form-submit" type="button" key={p[0]} onClick={()=>useCatalog(p)}>{p[0]} · {p[2]} · ${p[3].toLocaleString()} / {p[1]}</button>)}{!catalog.length&&<p>No encontramos ese material en el catálogo de referencia.</p>}<small>Precios orientativos: confirmar proveedor, ciudad y precio antes de comprar.</small></div>}
    <form onSubmit={add}><div className="form-row"><label>Material<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Ej. Cemento" /></label><label>Unidad<select value={unit} onChange={e=>setUnit(e.target.value)}><option>sacos</option><option>m³</option><option>unidades</option><option>litros</option><option>kg</option><option>metros</option></select></label></div><div className="form-row"><label>Necesario<input required type="number" min="0" step="0.01" value={needed} onChange={e=>setNeeded(e.target.value)} /></label><label>Comprado<input type="number" min="0" step="0.01" value={purchased} onChange={e=>setPurchased(e.target.value)} /></label></div><label>Precio por unidad<input type="number" min="0" step="100" value={price} onChange={e=>setPrice(e.target.value)} placeholder="0" /></label><button className="primary form-submit">➕ Agregar material</button></form>
    {rows.length>0&&<div className="budget-summary">{rows.map(m=>{const n=Number(m.needed)||0,p=Number(m.purchased)||0,missing=Math.max(0,n-p),purchaseTotal=p*(Number(m.price)||0),progress=n?Math.min(100,Math.round(p/n*100)):0;return <div key={m.id}><span>{m.name}<small> {p}/{n} {m.unit} · {progress}%</small></span><strong>{missing?`Faltan ${missing} ${m.unit}`:'✓ Completo'} · ${purchaseTotal.toLocaleString()} {purchaseTotal>0&&<button type="button" onClick={()=>registerPurchase(m)}>Registrar compra</button>}</strong></div>})}</div>}
    <small>⚠️ Los precios y cantidades son referencias. Verifica disponibilidad, impuestos, transporte y especificaciones con el proveedor y profesional responsable.</small>
    <button className="form-submit" type="button" onClick={onClose}>Listo</button>
  </section></div>;
}
