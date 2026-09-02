import { state, setState } from './state.js';
import { savePreferences } from './db.js';
import { $, safeHTML } from './utils/dom.js';

const TABS = [
  { id: 'gyms', label: 'Gimnasios', icon: '🏆' },
  { id: 'berries', label: 'Cultivos', icon: '🌱' },
  { id: 'pokedex', label: 'Pokédex', icon: '📱' },
  { id: 'breeding', label: 'Crianza', icon: '🥚' }
];

export async function switchTab(tabId) {
  const prefs = { ...state.preferences, active_tab: tabId };
  setState('preferences', prefs);
  savePreferences({ active_tab: tabId }).catch(console.error);

  TABS.forEach(t => {
    const view = $(`#view-${t.id}`);
    const btn = $(`#nav-${t.id}`);
    
    if (view) {
      if (t.id === tabId) view.classList.remove('hidden');
      else view.classList.add('hidden');
    }
    
    if (btn) {
      if (t.id === tabId) {
        btn.classList.add('tab-active');
      } else {
        btn.classList.remove('tab-active');
      }
    }
  });

  if (tabId === 'breeding') {
    if (typeof window.generateBreedingTree === 'function') {
      setTimeout(() => window.generateBreedingTree(), 80);
    }
  }
}

export function initRouter() {
  const active = state.preferences.active_tab || 'gyms';
  switchTab(active);
  
  // Attach events for navigation
  TABS.forEach(t => {
    const btn = $(`#nav-${t.id}`);
    if (btn) {
      btn.addEventListener('click', () => switchTab(t.id));
    }
  });
}

export function renderNav() {
  return TABS.map(t => `
    <button id="nav-${t.id}" class="px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors text-[var(--os-muted)] hover:text-[var(--os-text)]">
      <span>${t.icon}</span>
      ${t.label}
    </button>
  `).join('');
}

