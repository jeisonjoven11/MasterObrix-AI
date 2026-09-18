import { Capacitor } from '@capacitor/core';
import { SecureStorage } from '@aparajita/capacitor-secure-storage';

const KEYS = {
  projects: 'masterobrix-projects',
  clients: 'masterobrix-clients',
  budgets: 'masterobrix-budgets',
  expenses: 'masterobrix-expenses',
  materials: 'masterobrix-materials'
};

const native = Capacitor.isNativePlatform();

function readWeb(key) {
  try {
    const raw = localStorage.getItem(key);
    const value = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeWeb(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.isArray(value) ? value : []));
    return true;
  } catch {
    return false;
  }
}

async function readNative(key) {
  try {
    const value = await SecureStorage.get(key);
    if (Array.isArray(value)) return value;
    if (value !== null) return [];
  } catch {
    // A secure-storage OS error must never fall back to plaintext data.
    return [];
  }

  // One-time migration from the previous plaintext localStorage format.
  const legacy = readWeb(key);
  if (!legacy.length) return [];
  try {
    await SecureStorage.set(key, legacy);
    localStorage.removeItem(key);
    return legacy;
  } catch {
    // Do not expose or keep using legacy plaintext data if migration fails.
    return [];
  }
}

async function read(key) {
  return native ? readNative(key) : readWeb(key);
}

async function write(key, value) {
  const safeValue = Array.isArray(value) ? value : [];
  if (!native) return writeWeb(key, safeValue);
  try {
    await SecureStorage.set(key, safeValue);
    return true;
  } catch {
    return false;
  }
}

export const storage = {
  getProjects: () => read(KEYS.projects),
  saveProjects: (value) => write(KEYS.projects, value),
  getClients: () => read(KEYS.clients),
  saveClients: (value) => write(KEYS.clients, value),
  getBudgets: () => read(KEYS.budgets),
  saveBudgets: (value) => write(KEYS.budgets, value),
  getExpenses: () => read(KEYS.expenses),
  saveExpenses: (value) => write(KEYS.expenses, value),
  getMaterials: () => read(KEYS.materials),
  saveMaterials: (value) => write(KEYS.materials, value)
};
