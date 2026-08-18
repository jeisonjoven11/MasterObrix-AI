const PROJECTS_KEY = 'masterobrix-projects';
const CLIENTS_KEY = 'masterobrix-clients';
const BUDGETS_KEY = 'masterobrix-budgets';
const EXPENSES_KEY = 'masterobrix-expenses';

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getProjects: () => read(PROJECTS_KEY),
  saveProjects: (value) => write(PROJECTS_KEY, value),
  getClients: () => read(CLIENTS_KEY),
  saveClients: (value) => write(CLIENTS_KEY, value),
  getBudgets: () => read(BUDGETS_KEY),
  saveBudgets: (value) => write(BUDGETS_KEY, value),
  getExpenses: () => read(EXPENSES_KEY),
  saveExpenses: (value) => write(EXPENSES_KEY, value),
};
