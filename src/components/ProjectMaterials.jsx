import { useEffect, useMemo, useState } from 'react';

const CATALOGS = {
  CO: [
    ['Cemento gris 50 kg','sacos','Cemento',35000],
    ['Arena de concreto','m³','Agregados',95000],
    ['Grava','m³','Agregados',110000],
    ['Bloque H4','unidades','Mampostería',4200],
    ['Bloque H5','unidades','Mampostería',4800],
    ['Ladrillo','unidades','Mampostería',1800],
    ['Varilla corrugada','unidades','Acero',28000],
    ['Mortero seco','sacos','Mampostería',22000],
    ['Alambre recocido','kg','Acero',8500],
    ['Pintura','litros','Acabados',18000],
    ['Tubo PVC 1/2"','metros','Plomería',6500],
  ],
  ES: [
    ['Cemento CEM II 32,5','sacos 25 kg','Cemento',6.5],
    ['Arena de construcción','m³','Áridos',32],
    ['Grava','m³','Áridos',38],
    ['Ladrillo cerámico hueco','unidades','Fábrica',0.65],
    ['Ladrillo cerámico perforado','unidades','Fábrica',0.75],
    ['Bloque de hormigón','unidades','Fábrica',1.8],
    ['Hormigón celular AAC','unidades','Fábrica',3.2],
    ['Mortero seco','sacos 25 kg','Morteros',5.9],
    ['Acero corrugado B500S','kg','Acero',1.35],
    ['Placa de yeso laminado','m²','Acabados',8.5],
    ['Aislamiento térmico EPS','m²','Aislamiento',7.5],
    ['Tubo PVC 20 mm','metros','Fontanería',2.4],
  ],
  EU: [
    ['Cemento EN 197-1','sacos','Cemento',7],
    ['Arena / árido fino','m³','Áridos',35],
    ['Grava / árido grueso','m³','Áridos',40],
    ['Bloque de hormigón','unidades','Mampostería',1.9],
    ['Ladrillo cerámico','unidades','Mampostería',0.7],
    ['Mortero de albañilería','sacos','Morteros',6],
    ['Acero corrugado','kg','Acero',1.4],
    ['Placa de yeso','m²','Acabados',9],
    ['Aislamiento térmico','m²','Aislamiento',8],
    ['Tubería PVC','metros','Fontanería',2.5],
  ]
};

const MARKET_META = {
  CO: { label: '🇨🇴 Colombia', currency: 'COP', decimals: 0 },
  ES: { label: '🇪🇸 España', currency: 'EUR', decimals: 2 },
  EU: { label: '🇪🇺 Europa · referencia', currency: 'EUR', decimals: 2 },
};

function makeId(){return globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`}
function supportedMarket(projectMarket){return ['CO','ES','EU'].includes(projectMarket)?projectMarket:'CO'}
function money(value, market){return new Intl.NumberFormat(market==='CO'?'es-CO':'es-ES',{style:'currency',currency:MARKET_META[market].currency,maximumFractionDigits:MARKET_META[market].decimals}).format(value)}

export default function ProjectMaterials({ projects, materials, initialProjectId='', onSave, onAddExpense, onClose }) {
  const [projectId,setProjectId]=useState(initialProjectId || projects[0]?.id||'');
  const initialMarket=supportedMarket(projects.find(p=>p.id===(initialProjectId || projects[0]?.id))?.market);
  const [market,setMarket]=useState(initialMarket);
  const [name,setName]=useState(''); const [unit,setUnit]=useState('sacos');
  const [needed,setNeeded]=useState(''); const [purchased,setPurchased]=useState(''); const [price,setPrice]=useState(''); const [search,setSearch]=useState(''); const [category,setCategory]=useState('Todas');
  useEffect(()=>{
    const project=projects.find(p=>p.id===projectId);
    if(project) changeMarket(supportedMarket(project.market));
  },[projectId]);
  const catalogBase=CATALOGS[market];
  const rows=materials.filter(m=>m.projectId===projectId);
  const totals=useMemo(()=>rows.reduce((a,m)=>{const n=Number(m.needed)||0,p=Number(m.purchased)||0,price=Number(m.price)||0;return {...a,needed:a.needed+n,purchased:a.purchased+p,spent:a.spent+p*price,pendingCost:a.pendingCost+Math.max(0,n-p)*price}}, {needed:0,purchased:0,spent:0,pendingCost:0}),[rows]);
  const categories=['Todas',...new Set(catalogBase.map(p=>p[2]))];
  const catalog=catalogBase.filter(p=>(category==='Todas'||p[2]===category)&&`${p[0]} ${p[2]}`.toLowerCase().includes(search.toLowerCase()));
  function add(e){e.preventDefault();if(!projectId||!name.trim()||Number(needed)<=0)return;onSave({id:makeId(),projectId,name:name.trim(),unit,needed:Number(needed),purchased:Number(purchased)||0,price:Number(price)||0,market,currency:MARKET_META[market].currency});setName('');setNeeded('');setPurchased('');setPrice('');}
  function registerPurchase(m){const quantity=Number(m.purchased)||0,unitPrice=Number(m.price)||0;if(!quantity||!unitPrice||!onAddExpense)return;onAddExpense({id:makeId(),projectId:m.projectId,description:`Compra de ${m.name}`,category:'Materiales',amount:quantity*unitPrice,date:new Date().toISOString().slice(0,10)});}
  function useCatalog(p){setName(p[0]);setUnit(p[1]);setPrice(String(p[3]));setSearch('');setCategory('Todas');}
  function changeMarket(value){setMarket(value);setSearch('');setCategory('Todas');}
  return <div className="modal-backdrop"><section className="project-form" aria-label="Materiales de obra">
    <div className="form-heading"><div><span className="eyebrow">CONTROL DE OBRA</span><h2>🧱 Materiales de mi obra</h2></div><button type="button" onClick={onClose}>✕</button></div>
    <label>Obra<select value={projectId} onChange={e=>setProjectId(e.target.value)}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
    <div className="technical-profile"><div className="technical-heading"><span>🌍 MERCADO DE MATERIALES</span><small>Selecciona el mercado para ver materiales, unidades y precios de referencia adecuados.</small></div><div className="form-row"><label>País / mercado<select value={market} onChange={e=>changeMarket(e.target.value)}>{Object.entries(MARKET_META).map(([key,item])=><option key={key} value={key}>{item.label}</option>)}</select></label><label>Moneda<input readOnly value={MARKET_META[market].currency} /></label></div><small>Los precios son orientativos y no sustituyen una cotización local. En Europa, la disponibilidad, impuestos y especificaciones pueden variar por país.</small></div>
    <div className="budget-summary"><div><span>Materiales controlados</span><strong>{rows.length}</strong></div><div><span>Comprado</span><strong>{totals.purchased}</strong></div><div><span>Gastado en materiales</span><strong>{money(totals.spent,market)}</strong></div><div className="total"><span>Falta por comprar (estimado)</span><strong>{money(totals.pendingCost,market)}</strong></div></div>
    <label>🛒 Buscar en catálogo<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cemento, arena, ladrillo..." /></label>
    <div className="form-row">{categories.map(c=><button key={c} type="button" className={category===c?'primary form-submit':'form-submit'} onClick={()=>setCategory(c)}>{c}</button>)}</div>
    {(search||category!=='Todas')&&<div className="empty-state">{catalog.map(p=><button className="form-submit" type="button" key={p[0]} onClick={()=>useCatalog(p)}>{p[0]} · {p[2]} · {money(p[3],market)} / {p[1]}</button>)}{!catalog.length&&<p>No encontramos ese material en el catálogo de referencia.</p>}<small>Precios orientativos: confirmar proveedor, ciudad, impuestos y precio antes de comprar.</small></div>}
    <form onSubmit={add}><div className="form-row"><label>Material<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Ej. Cemento" /></label><label>Unidad<select value={unit} onChange={e=>setUnit(e.target.value)}><option>sacos</option><option>sacos 25 kg</option><option>m³</option><option>m²</option><option>unidades</option><option>litros</option><option>kg</option><option>metros</option></select></label></div><div className="form-row"><label>Necesario<input required type="number" min="0" step="0.01" value={needed} onChange={e=>setNeeded(e.target.value)} /></label><label>Comprado<input type="number" min="0" step="0.01" value={purchased} onChange={e=>setPurchased(e.target.value)} /></label></div><label>Precio por unidad<input type="number" min="0" step="0.01" value={price} onChange={e=>setPrice(e.target.value)} placeholder="0" /></label><button className="primary form-submit">➕ Agregar material</button></form>
    {rows.length>0&&<div className="budget-summary">{rows.map(m=>{const n=Number(m.needed)||0,p=Number(m.purchased)||0,missing=Math.max(0,n-p),purchaseTotal=p*(Number(m.price)||0),progress=n?Math.min(100,Math.round(p/n*100)):0;return <div key={m.id}><span><strong>{m.name}</strong><small> {p}/{n} {m.unit} · {progress}%</small><progress max="100" value={progress} aria-label={`Progreso de ${m.name}: ${progress}%`}></progress></span><strong>{missing?`Faltan ${missing} ${m.unit}`:'✓ Completo'} · {money(purchaseTotal,m.market||market)}</strong></div>})}</div>}
    <small>⚠️ Las cantidades, precios y especificaciones son referencias. Verifica disponibilidad, transporte, impuestos, normativa y requisitos técnicos con el proveedor y profesional responsable.</small>
    <button className="form-submit" type="button" onClick={onClose}>Listo</button>
  </section></div>;
}
