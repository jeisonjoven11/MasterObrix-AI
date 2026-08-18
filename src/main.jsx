import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const actions = [
  ['🧮', 'Calcular materiales', 'Calcula cantidades rápidamente'],
  ['💰', 'Nuevo presupuesto', 'Crea una cotización para tu cliente'],
  ['🏗️', 'Nuevo proyecto', 'Organiza una obra'],
  ['👥', 'Clientes', 'Gestiona tus contactos'],
];
const emptyProject = { name: '', client: '', address: '', startDate: '', budget: '' };
const emptyClient = { name: '', phone: '', email: '', company: '' };

function App() {
  const [projects, setProjects] = useState(() => JSON.parse(localStorage.getItem('masterobrix-projects') || '[]'));
  const [clients, setClients] = useState(() => JSON.parse(localStorage.getItem('masterobrix-clients') || '[]'));
  const [showForm, setShowForm] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [clientForm, setClientForm] = useState(emptyClient);
  const [view, setView] = useState('home');

  useEffect(() => localStorage.setItem('masterobrix-projects', JSON.stringify(projects)), [projects]);
  useEffect(() => localStorage.setItem('masterobrix-clients', JSON.stringify(clients)), [clients]);

  function openProjectForm() { setForm(emptyProject); setShowForm('project'); }
  function openClientForm() { setClientForm(emptyClient); setShowForm('client'); }
  function saveProject(event) { event.preventDefault(); if (!form.name.trim()) return; setProjects((current) => [{ ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...current]); setForm(emptyProject); setShowForm(null); }
  function saveClient(event) { event.preventDefault(); if (!clientForm.name.trim()) return; setClients((current) => [{ ...clientForm, id: crypto.randomUUID() }, ...current]); setClientForm(emptyClient); setShowForm(null); }
  function deleteProject(id) { setProjects((current) => current.filter((project) => project.id !== id)); }
  function deleteClient(id) { setClients((current) => current.filter((client) => client.id !== id)); }

  return (
    <main className="app-shell">
      <header className="topbar"><div><span className="eyebrow">MASTEROBRIX AI</span><h1>Tu obra, bajo control.</h1><p>Herramientas simples para trabajar mejor.</p></div><div className="avatar">M</div></header>
      {view === 'home' && <>
        <section className="hero-card"><div><span className="badge">🚧 MVP 0.3</span><h2>¿Qué quieres hacer hoy?</h2><p>Empieza con un cálculo, presupuesto o proyecto nuevo.</p></div><div className="hero-mark">M</div></section>
        <section className="section"><div className="section-heading"><h2>Acciones rápidas</h2><span>4 herramientas</span></div><div className="action-grid">
          {actions.map(([icon, title, text]) => <button className="action-card" key={title} type="button" onClick={() => title === 'Nuevo proyecto' ? openProjectForm() : title === 'Clientes' ? setView('clients') : null}><span className="action-icon">{icon}</span><strong>{title}</strong><small>{text}</small></button>)}
        </div></section>
        <ProjectSection projects={projects} openProjectForm={openProjectForm} deleteProject={deleteProject} />
      </>}
      {view === 'projects' && <ProjectSection projects={projects} openProjectForm={openProjectForm} deleteProject={deleteProject} />}
      {view === 'clients' && <ClientSection clients={clients} openClientForm={openClientForm} deleteClient={deleteClient} />}

      {showForm === 'project' && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowForm(null)}><form className="project-form" onSubmit={saveProject}>
        <FormHeading eyebrow="NUEVA OBRA" title="Crear proyecto" close={() => setShowForm(null)} />
        <label>Nombre de la obra<input autoFocus required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Remodelación Casa García" /></label>
        <label>Cliente<input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Nombre del cliente" /></label>
        <label>Dirección<input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Ciudad o dirección" /></label>
        <div className="form-row"><label>Inicio<input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></label><label>Presupuesto<input type="number" min="0" step="0.01" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="0" /></label></div>
        <button className="primary form-submit" type="submit">Guardar proyecto</button>
      </form></div>}
      {showForm === 'client' && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowForm(null)}><form className="project-form" onSubmit={saveClient}>
        <FormHeading eyebrow="NUEVO CLIENTE" title="Crear cliente" close={() => setShowForm(null)} />
        <label>Nombre<input autoFocus required value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} placeholder="Nombre completo" /></label>
        <label>Empresa<input value={clientForm.company} onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })} placeholder="Empresa (opcional)" /></label>
        <div className="form-row"><label>Teléfono<input value={clientForm.phone} onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })} placeholder="+1..." /></label><label>Email<input type="email" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} placeholder="cliente@email.com" /></label></div>
        <button className="primary form-submit" type="submit">Guardar cliente</button>
      </form></div>}

      <nav className="bottom-nav" aria-label="Navegación principal"><button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>⌂<span>Inicio</span></button><button className={view === 'projects' ? 'active' : ''} onClick={() => setView('projects')}>🏗️<span>Proyectos</span></button><button className={view === 'clients' ? 'active' : ''} onClick={() => setView('clients')}>👥<span>Clientes</span></button><button onClick={() => alert('El asistente MasterObrix AI se conectará en la siguiente fase.')}>🤖<span>MasterObrix</span></button></nav>
    </main>
  );
}

function FormHeading({ eyebrow, title, close }) { return <div className="form-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div><button type="button" onClick={close}>✕</button></div>; }
function ProjectSection({ projects, openProjectForm, deleteProject }) { return <section className="section projects"><div className="section-heading"><h2>Mis proyectos</h2><button onClick={openProjectForm}>+ Nuevo</button></div>{projects.length === 0 ? <div className="empty-state"><span>🏗️</span><strong>Aún no tienes proyectos</strong><p>Crea tu primera obra y empezamos.</p><button className="primary" onClick={openProjectForm}>+ Nuevo proyecto</button></div> : <div className="project-list">{projects.map((project) => <article className="project-card" key={project.id}><div><span className="project-status">ACTIVO</span><h3>{project.name}</h3><p>{project.client || 'Sin cliente'} · {project.address || 'Sin dirección'}</p></div><div className="project-actions"><strong>{project.budget ? `$${Number(project.budget).toLocaleString()}` : 'Sin presupuesto'}</strong><button onClick={() => deleteProject(project.id)}>Eliminar</button></div></article>)}</div>}</section>; }
function ClientSection({ clients, openClientForm, deleteClient }) { return <section className="section"><div className="section-heading"><h2>Mis clientes</h2><button onClick={openClientForm}>+ Nuevo</button></div>{clients.length === 0 ? <div className="empty-state"><span>👥</span><strong>Aún no tienes clientes</strong><p>Guarda tus clientes para reutilizarlos en tus obras.</p><button className="primary" onClick={openClientForm}>+ Nuevo cliente</button></div> : <div className="project-list">{clients.map((client) => <article className="project-card" key={client.id}><div><span className="project-status">CLIENTE</span><h3>{client.name}</h3><p>{client.company || 'Particular'} · {client.phone || client.email || 'Sin contacto'}</p></div><div className="project-actions"><button onClick={() => deleteClient(client.id)}>Eliminar</button></div></article>)}</div>}</section>; }

createRoot(document.getElementById('root')).render(<App />);
