import { getGymProgress, getCrops, getCaughtPokemon, getPreferences } from './db.js';

export const state = {
  gyms: [],
  crops: [],
  caught: [],
  preferences: {}
};

const subscribers = {};

export function subscribe(key, callback) {
  if (!subscribers[key]) subscribers[key] = [];
  subscribers[key].push(callback);
}

export function setState(key, value) {
  state[key] = value;
  if (subscribers[key]) {
    subscribers[key].forEach(cb => cb(value));
  }
}

export async function loadInitialState() {
  try {
    const [gyms, crops, caught, prefs] = await Promise.all([
      getGymProgress(),
      getCrops(),
      getCaughtPokemon(),
      getPreferences()
    ]);
    
    setState('gyms', gyms);
    setState('crops', crops);
    setState('caught', caught);
    setState('preferences', prefs);
  } catch (err) {
    console.error('Failed to load initial state:', err);
  }
}

