export default function BottomNav({ view, setView }) {
  return <nav className="bottom-nav" aria-label="Navegación principal">
    <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>⌂<span>Inicio</span></button>
    <button className={view === 'projects' ? 'active' : ''} onClick={() => setView('projects')}>🏗️<span>Proyectos</span></button>
    <button className={view === 'clients' ? 'active' : ''} onClick={() => setView('clients')}>👥<span>Clientes</span></button>
    <button onClick={() => alert('El asistente MasterObrix AI se conectará en la siguiente fase.')}>🤖<span>MasterObrix</span></button>
  </nav>;
}
