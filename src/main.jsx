import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const actions = [
  ['🧮', 'Calcular materiales', 'Calcula cantidades rápidamente'],
  ['💰', 'Nuevo presupuesto', 'Crea una cotización para tu cliente'],
  ['🏗️', 'Nuevo proyecto', 'Organiza una obra'],
  ['👥', 'Clientes', 'Gestiona tus contactos'],
];

function App() {
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
          <span className="badge">🚧 MVP 0.1</span>
          <h2>¿Qué quieres hacer hoy?</h2>
          <p>Empieza con un cálculo, presupuesto o proyecto nuevo.</p>
        </div>
        <div className="hero-mark">M</div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Acciones rápidas</h2>
          <span>4 herramientas</span>
        </div>
        <div className="action-grid">
          {actions.map(([icon, title, text]) => (
            <button className="action-card" key={title} type="button">
              <span className="action-icon">{icon}</span>
              <strong>{title}</strong>
              <small>{text}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="section projects">
        <div className="section-heading">
          <h2>Mis proyectos</h2>
          <button type="button">Ver todos</button>
        </div>
        <div className="empty-state">
          <span>🏗️</span>
          <strong>Aún no tienes proyectos</strong>
          <p>Crea tu primera obra y empezamos.</p>
          <button className="primary" type="button">+ Nuevo proyecto</button>
        </div>
      </section>

      <nav className="bottom-nav" aria-label="Navegación principal">
        <button className="active" type="button">⌂<span>Inicio</span></button>
        <button type="button">🏗️<span>Proyectos</span></button>
        <button type="button">👥<span>Clientes</span></button>
        <button type="button">🤖<span>MasterObrix</span></button>
      </nav>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
