import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages needs the repository path; Android needs relative assets.
  base: process.env.CAPACITOR_BUILD === 'true' ? './' : '/MasterObrix-AI/'
});
