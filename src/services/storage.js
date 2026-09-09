const PROJECTS_KEY = 'masterobrix-projects';
const CLIENTS_KEY = 'masterobrix-clients';
const BUDGETS_KEY = 'masterobrix-budgets';
const EXPENSES_KEY = 'masterobrix-expenses';

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    const value = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.isArray(value) ? value : []));
    return true;
  } catch {
    return false;
  }
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
