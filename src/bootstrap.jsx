import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './main.jsx';

const root = document.getElementById('root');

if (!root) {
  throw new Error('MasterObrix: no se encontró el elemento #root.');
}

createRoot(root).render(<App />);
