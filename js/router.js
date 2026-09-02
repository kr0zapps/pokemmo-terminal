import { state, setState } from './state.js';
import { savePreferences } from './db.js';
import { $, safeHTML } from './utils/dom.js';

const TABS = [
  { id: 'gyms', label: 'Gimnasios', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png' },
  { id: 'berries', label: 'Bayas', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/wailmer-pail.png' },
  { id: 'pokedex', label: 'Pokédex', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png' },
  { id: 'breeding', label: 'Crianza', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/egg.png' }
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
    <button id="nav-${t.id}" class="tab-pill flex items-center gap-2">
      <img src="${t.icon}" alt="${t.label}" class="w-4 h-4 pokemon-sprite">
      <span>${t.label}</span>
    </button>
  `).join('');
}

