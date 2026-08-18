import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const actions = [
  ['🧮', 'Calcular materiales', 'Calcula cantidades rápidamente'],
  ['💰', 'Nuevo presupuesto', 'Crea una cotización para tu cliente'],
  ['🏗️', 'Nuevo proyecto', 'Organiza una obra'],
  ['👥', 'Clientes', 'Gestiona tus contactos'],
];

const emptyForm = { name: '', client: '', address: '', startDate: '', budget: '' };

function App() {
  const [projects, setProjects] = useState(() => JSON.parse(localStorage.getItem('masterobrix-projects') || '[]'));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    localStorage.setItem('masterobrix-projects', JSON.stringify(projects));
  }, [projects]);

  function openProjectForm() {
    setForm(emptyForm);
    setShowForm(true);
  }

  function saveProject(event) {
    event.preventDefault();
    if (!form.name.trim()) return;
    setProjects((current) => [{ ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...current]);
    setForm(emptyForm);
    setShowForm(false);
  }

  function deleteProject(id) {
    setProjects((current) => current.filter((project) => project.id !== id));
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">MASTEROBRIX AI</span>
          <h1>Tu obra, bajo control.</h1>
          <p>Herramientas simples para trabajar mejor.</p>
        </div>
        <div className="avatar">M</div>
      </header>

      <section className="hero-card">
        <div>
          <span className="badge">🚧 MVP 0.2</span>
          <h2>¿Qué quieres hacer hoy?</h2>
          <p>Empieza con un cálculo, presupuesto o proyecto nuevo.</p>
        </div>
        <div className="hero-mark">M</div>
      </section>

      <section className="section">
        <div className="section-heading"><h2>Acciones rápidas</h2><span>4 herramientas</span></div>
        <div className="action-grid">
          {actions.map(([icon, title, text]) => <button className="action-card" key={title} type="button"><span className="action-icon">{icon}</span><strong>{title}</strong><small>{text}</small></button>)}
        </div>
      </section>

      <section className="section projects">
        <div className="section-heading">
          <h2>Mis proyectos</h2>
          <button type="button" onClick={openProjectForm}>+ Nuevo</button>
        </div>
        {projects.length === 0 ? (
          <div className="empty-state">
            <span>🏗️</span><strong>Aún no tienes proyectos</strong><p>Crea tu primera obra y empezamos.</p>
            <button className="primary" type="button" onClick={openProjectForm}>+ Nuevo proyecto</button>
          </div>
        ) : (
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-card" key={project.id}>
                <div><span className="project-status">ACTIVO</span><h3>{project.name}</h3><p>{project.client || 'Sin cliente'} · {project.address || 'Sin dirección'}</p></div>
                <div className="project-actions"><strong>{project.budget ? `$${Number(project.budget).toLocaleString()}` : 'Sin presupuesto'}</strong><button type="button" onClick={() => deleteProject(project.id)} aria-label={`Eliminar ${project.name}`}>Eliminar</button></div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowForm(false)}>
          <form className="project-form" onSubmit={saveProject}>
            <div className="form-heading"><div><span className="eyebrow">NUEVA OBRA</span><h2>Crear proyecto</h2></div><button type="button" onClick={() => setShowForm(false)}>✕</button></div>
            <label>Nombre de la obra<input autoFocus required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Remodelación Casa García" /></label>
            <label>Cliente<input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Nombre del cliente" /></label>
            <label>Dirección<input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Ciudad o dirección" /></label>
            <div className="form-row"><label>Inicio<input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></label><label>Presupuesto<input type="number" min="0" step="0.01" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="0" /></label></div>
            <button className="primary form-submit" type="submit">Guardar proyecto</button>
          </form>
        </div>
      )}

      <nav className="bottom-nav" aria-label="Navegación principal"><button className="active" type="button">⌂<span>Inicio</span></button><button type="button">🏗️<span>Proyectos</span></button><button type="button">👥<span>Clientes</span></button><button type="button">🤖<span>MasterObrix</span></button></nav>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
